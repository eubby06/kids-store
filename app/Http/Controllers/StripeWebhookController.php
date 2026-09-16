<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Order;
use App\Models\PaymentMethod;
use App\Enums\OrderStatus;
use Illuminate\Http\Request;
use Stripe\StripeClient;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Webhook;

class StripeWebhookController extends Controller
{
    public function handleWebhook(Request $request)
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $endpointSecret = config('services.stripe.webhook_secret');

        try {
            // 1. Verify that the request actually came from Stripe
            $event = Webhook::constructEvent(
                $payload, $sigHeader, $endpointSecret
            );
        } catch (\UnexpectedValueException $e) {
            return response()->json(['error' => 'Invalid payload'], 400);
        } catch (SignatureVerificationException $e) {
            \Log::error('Stripe Webhook Signature Verification Failed: Check your STRIPE_WEBHOOK_SECRET in .env');
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        // 2. Handle the specific payment_intent.succeeded event
        if ($event->type === 'payment_intent.succeeded') {
            $paymentIntent = $event->data->object; 

            // Find the pending guest order using the Stripe Payment Intent ID
            $order = Order::where('stripe_payment_intent_id', $paymentIntent->id)->first();

            if ($order) {
                // Extract customer info captured during checkout processing
                // Note: billing_details usually houses the email if entered in the Stripe field
                $guestEmail = $paymentIntent->receipt_email ?? $paymentIntent->charges->data[0]->billing_details->email ?? null;
                $shipping = $paymentIntent->shipping;

                // Prepare update array for guest checkout fields
                $updateData = [
                    'status' => OrderStatus::PAID,
                ];

                if ($guestEmail) {
                    $updateData['guest_email'] = $guestEmail;
                }

                // If shipping details were collected via Stripe Elements, save them natively
                if ($shipping) {
                    $updateData['shipping_name'] = $shipping->name;
                    $updateData['shipping_address'] = $shipping->address->line1;
                    $updateData['shipping_city'] = $shipping->address->city;
                    $updateData['shipping_zip'] = $shipping->address->postal_code;
                }

                // Update the order status and information in one single database write
                $order->update($updateData);
            }
        }

        // 3. Always return a 200 OK status to Stripe to acknowledge receipt
        return response()->json(['status' => 'success'], 200);
    }

}
