<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;

class PaymentController extends Controller
{
    public function createPaymentIntent(Request $request)
    {
        // Set your secret key
        Stripe::setApiKey(config('services.stripe.secret'));

        try {
            // 1. Retrieve or Create your Stripe Customer ID
            // (Crucial: You MUST assign a customer ID to save the payment method to their profile)
            $customerId = $request->input('stripe_customer_id'); // e.g., cus_R8x...

            // Create a PaymentIntent with the order amount and currency
            $paymentIntent = PaymentIntent::create([
                'amount' => 43300, // Amount in cents ($50.00)
                'currency' => 'usd',
                'customer' => $customerId, // Links the transaction to the specific user
                
                // 2. Instruct Stripe to save this payment intent's card details
                'setup_future_usage' => 'off_session', // Options: 'off_session' or 'on_session'

                'automatic_payment_methods' => [
                    'enabled' => true,
                ],
            ]);

            // Send the client secret back to React
            return response()->json([
                'clientSecret' => $paymentIntent->client_secret,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Save a confirmed Stripe Payment Method to the authenticated user.
     */
    public function saveCard(Request $request)
    {
        // 1. Validate the incoming request from your React app
        $request->validate([
            'payment_method_id' => 'required|string|starts_with:pm_',
        ]);

        $user = Auth::user(); // Or use auth()->user()
        $paymentMethodId = $request->input('payment_method_id');

        // 2. Initialize the Stripe Client
        $stripe = new StripeClient(config('services.stripe.secret'));

        try {
            // 3. Ensure the user has a Stripe Customer profile
            if (!$user->stripe_id) {
                $customer = $stripe->customers->create([
                    'email' => $user->email,
                    'name' => $user->name,
                ]);

                // Update user with the new Stripe Customer ID
                $user->update(['stripe_id' => $customer->id]);
            }

            // 4. Retrieve the card details from Stripe to verify and get metadata
            $stripePaymentMethod = $stripe->paymentMethods->retrieve($paymentMethodId);

            // 5. Ensure the PaymentMethod is attached to this Stripe Customer profile
            // (If setup_future_usage was handled natively, it might already be attached, but this acts as a safe fallback)
            if ($stripePaymentMethod->customer !== $user->stripe_id) {
                $stripe->paymentMethods->attach($paymentMethodId, [
                    'customer' => $user->stripe_id,
                ]);
            }

            // 6. Check if this card already exists in your database to prevent duplicates
            $localPaymentMethod = PaymentMethod::where('stripe_payment_method_id', $paymentMethodId)->first();

            if (!$localPaymentMethod) {
                // If this is the user's first card, make it the default
                $isFirstCard = !$user->paymentMethods()->exists();

                if ($isFirstCard) {
                    // Also update Stripe's default invoice setting for this customer
                    $stripe->customers->update($user->stripe_id, [
                        'invoice_settings' => ['default_payment_method' => $paymentMethodId],
                    ]);
                }

                // 7. Save the clean metadata into your database using the relationship
                $user->paymentMethods()->create([
                    'stripe_payment_method_id' => $paymentMethodId,
                    'card_brand'               => $stripePaymentMethod->card->brand,       // e.g., 'visa'
                    'card_last_four'           => $stripePaymentMethod->card->last4,       // e.g., '4242'
                    'exp_month'                => $stripePaymentMethod->card->exp_month,
                    'exp_year'                 => $stripePaymentMethod->card->exp_year,
                    'is_default'               => $isFirstCard,
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Payment method securely saved to your account.',
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}
