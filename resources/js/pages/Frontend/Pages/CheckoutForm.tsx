import React, { useState } from 'react';
import {
    PaymentElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';

interface ShippingData {
    name: string;
    address: string;
    city: string;
    zip: string;
}

interface CheckoutFormProps {
    shippingData: ShippingData;
}

export default function CheckoutForm({ shippingData }: CheckoutFormProps) {
    const stripe = useStripe();
    const elements = useElements();

    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Guard against uninitialized Stripe SDK instances
        if (!stripe || !elements) {
            return;
        }

        // 2. Simple validation check for custom frontend inputs before processing payment
        if (
            !shippingData.name ||
            !shippingData.address ||
            !shippingData.city ||
            !shippingData.zip
        ) {
            setErrorMessage(
                'Please fill out all shipping fields before completing payment.',
            );
            return;
        }

        setIsProcessing(true);
        setErrorMessage(null);

        // 3. Trigger the official Stripe redirect sequence
        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Stripe appends ?payment_intent=pi_xxx to this route on redirect
                return_url: `${window.location.origin}/checkout/success`,
                payment_method_data: {
                    billing_details: {
                        name: shippingData.name,
                        address: {
                            line1: shippingData.address,
                            city: shippingData.city,
                            postal_code: shippingData.zip,
                        },
                    },
                },
            },
        });

        // 4. This block runs ONLY if payment execution fails immediately (e.g., card declined)
        if (error) {
            setErrorMessage(
                error.message ?? 'An unexpected payment error occurred.',
            );
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Inject pre-styled Stripe secure credit card iframe fields */}
            <PaymentElement />

            {/* Error Message Box */}
            {errorMessage && (
                <div className="rounded bg-red-50 p-3 text-sm font-medium text-red-600 dark:bg-red-950/30 dark:text-red-400">
                    {errorMessage}
                </div>
            )}

            {/* Complete Payment Button */}
            <button
                type="submit"
                disabled={isProcessing || !stripe || !elements}
                className="w-full rounded bg-indigo-600 py-3 text-base font-semibold text-white transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
                {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg
                            className="h-5 w-5 animate-spin text-white"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                        Processing Payment...
                    </span>
                ) : (
                    'Pay Now'
                )}
            </button>
        </form>
    );
}
