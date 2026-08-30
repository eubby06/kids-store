<?php
namespace App\Http\Controllers;

use Inertia\Inertia;
use Stripe\StripeClient;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class CheckoutController extends Controller
{
    public function initialize(Request $request)
    {
        $request->validate(['cart' => 'required|array']);
        $cart = $request->input('cart');
        $stripe = new StripeClient(config('services.stripe.secret'));

        // 1. Calculate price from DB values to prevent tampering
        // Stripe expects integers in cents. If $product->price is a decimal like 19.99, multiply by 100.
        $totalAmountInCents = 0;
        $compactMetadata = [];
        foreach ($cart as $item) {
            $product = Product::find($item['id']);
            if ($product) {
                $totalAmountInCents += (int) (round($product->price * 100) * $item['quantity']);
                $compactMetadata[$product->id] = $item['quantity'];
            }
        }

        // 2. REFRESH GUARD: Reuse open intents to avoid duplicate entries
        if ($request->session()->has('stripe_payment_intent_id')) {
            try {
                $existingIntentId = $request->session()->get('stripe_payment_intent_id');
                $existingIntent = $stripe->paymentIntents->retrieve($existingIntentId);

                if ($existingIntent->status === 'requires_payment_method') {
                    $stripe->paymentIntents->update($existingIntentId, [
                        'amount' => $totalAmountInCents,
                        'metadata' => ['cart_items' => json_encode($compactMetadata)]
                    ]);

                    return redirect()->route('checkout.show')->with([
                        'clientSecret' => $existingIntent->client_secret,
                        'amount' => $totalAmountInCents / 100
                    ]);
                }
            } catch (\Exception $e) {
                $request->session()->forget('stripe_payment_intent_id');
            }
        }

        // 3. Create a brand new intent if none exists
        $paymentIntent = $stripe->paymentIntents->create([
            'amount' => $totalAmountInCents,
            'currency' => 'usd',
            'automatic_payment_methods' => ['enabled' => true],
            'metadata' => [
                'user_id' => auth()->id() ?? 'guest',
                'cart_items' => json_encode($compactMetadata)
            ]
        ]);

        $request->session()->put('stripe_payment_intent_id', $paymentIntent->id);

        return redirect()->route('checkout.show')->with([
            'clientSecret' => $paymentIntent->client_secret,
            'amount' => $totalAmountInCents / 100 // Convert cents back to raw dollars
        ]);
    }

    public function show()
    {
        return Inertia::render('Frontend/Pages/Checkout', [
            'clientSecret' => session('clientSecret'), 
            'stripePublicKey' => config('services.stripe.key'),
            'amount' => (float) session('amount', 0), 
        ]);
    }

    public function success(Request $request)
    {
        $paymentIntentId = $request->query('payment_intent');

        if (!$paymentIntentId) {
            return redirect()->route('home')->with('error', 'Invalid payment session.');
        }

        $stripe = new StripeClient(config('services.stripe.secret'));
        
        try {
            $intent = $stripe->paymentIntents->retrieve($paymentIntentId);

            if ($intent->status === 'succeeded') {
                
                // 1. DUPLICATION GUARD: Check if we already processed this Stripe transaction
                // ✨ FIX 1: Use renamed relation string 'purchasedProducts'
                $existingOrder = Order::with('purchasedProducts')->where('stripe_payment_intent_id', $paymentIntentId)->first();
                
                if ($existingOrder) {
                    $formattedItems = $existingOrder->purchasedProducts->map(function ($product) {
                        return [
                            'id' => $product->id,
                            'name' => $product->name ?? 'Unknown Product',
                            'quantity' => $product->pivot->quantity, 
                            'price' => $product->pivot->price,
                        ];
                    });

                    return Inertia::render('Checkout/Success', [
                        'orderId' => $existingOrder->id,
                        'amount' => $intent->amount / 100,
                        'items' => $formattedItems
                    ]);
                }

                // Pull cart data out of Stripe server metadata
                $stripeCart = isset($intent->metadata->cart_items) 
                    ? json_decode($intent->metadata->cart_items, true) 
                    : [];

                if (empty($stripeCart)) {
                    throw new \Exception("Cart metadata is missing from Stripe intent tracking record.");
                }

                // 2. DATABASE TRANSACTION: Safe execution block
                $order = DB::transaction(function () use ($intent, $paymentIntentId, $stripeCart) {
                    
                    $products = Product::whereIn('id', array_keys($stripeCart))->get();
                    
                    // ✨ SECURE ROOT FIX: Safely parse from the modern charge/payment method structures 
                    // without using the deprecated or un-expanded charges array collection loop.
                    $customerEmail = $intent->latest_charge?->billing_details?->email 
                        ?? $intent->receipt_email 
                        ?? auth()->user()?->email 
                        ?? 'guest@example.com';

                    // Collect custom billing details safely for address tracking using the same safe syntax layout
                    $shippingName    = $intent->latest_charge?->billing_details?->name ?? null;
                    $shippingAddress = $intent->latest_charge?->billing_details?->address?->line1 ?? null;
                    $shippingCity    = $intent->latest_charge?->billing_details?->address?->city ?? null;
                    $shippingZip     = $intent->latest_charge?->billing_details?->address?->postal_code ?? null;

                    // A. Create the root Order record
                    $newOrder = Order::create([
                        'user_id' => auth()->id(), 
                        'stripe_payment_intent_id' => $paymentIntentId,
                        'total_amount' => $intent->amount / 100,
                        'status' => 'Paid',
                        'customer_email' => $customerEmail,
                        // 'shipping_name' => $shippingName,
                        // 'shipping_address' => $shippingAddress,
                        // 'shipping_city' => $shippingCity,
                        // 'shipping_zip' => $shippingZip,
                    ]);

                    // B. Attach items directly to the pivot table using attach()
                    foreach ($products as $product) {
                        $quantity = $stripeCart[$product->id];
                        
                        $newOrder->purchasedProducts()->attach($product->id, [
                            'quantity' => $quantity,
                            'price' => $product->price, 
                        ]);

                        // // C. INVENTORY STOCK REDUCTION
                        // $lockedProduct = Product::where('id', $product->id)->lockForUpdate()->first();
                        // if ($lockedProduct) {
                        //     $lockedProduct->decrement('quantity', $quantity);
                        // }
                    }

                    return $newOrder;
                });


                // Clear the server-side Stripe Intent placeholder token now that processing concluded
                $request->session()->forget('stripe_payment_intent_id');

                // ✨ FIX 3: Rehydrate products array mapping using the unique relation name
                $formattedItems = $order->purchasedProducts->map(function ($product) {
                    return [
                        'id' => $product->id,
                        'name' => $product->name ?? 'Unknown Item',
                        'quantity' => $product->pivot->quantity, 
                        'price' => $product->pivot->price,
                    ];
                });

                // return Inertia::render('Checkout/Success', [
                //     'orderId' => $order->id,
                //     'amount' => $intent->amount / 100,
                //     'items' => $formattedItems
                // ]);
                return redirect()->route('checkout.show');
            }

            return redirect()->route('checkout.show')->with('error', 'Payment was not successful.');

        } catch (\Exception $e) {
            Log::error('Stripe Success Verification Crash: ' . $e->getMessage());
            return redirect()->route('checkout.show')->with('error', 'Error verifying payment details.');
        }
    }

}
