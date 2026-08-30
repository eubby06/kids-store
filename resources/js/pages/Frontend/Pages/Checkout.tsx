import React, { useEffect, useMemo, useState } from 'react';
import { useCart } from './CartContext';
import Wrapper from './Wrapper';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import { router } from '@inertiajs/react';

interface CheckoutPageProps {
    clientSecret: string;
    stripePublicKey: string;
    amount: number;
}

export default function CheckoutPageWrapper(props: CheckoutPageProps) {
    return (
        <Wrapper>
            <CheckoutPage {...props} />
        </Wrapper>
    );
}

function CheckoutPage({
    clientSecret,
    stripePublicKey,
    amount,
}: CheckoutPageProps) {
    const [isMounted, setIsMounted] = useState(false);
    const { cart, cartTotal } = useCart();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Refresh Guard: Restores the clientSecret if missing on F5
    useEffect(() => {
        if (isMounted && !clientSecret) {
            if (cart.length === 0) {
                router.visit('/cart');
                return;
            }

            const formattedCartPayload = cart.map((item) => ({
                id: item.id,
                quantity: item.quantity,
            }));

            router.post(
                '/checkout/initialize',
                {
                    cart: formattedCartPayload,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                },
            );
        }
    }, [clientSecret, isMounted, cart]);

    const stripePromise = useMemo(
        () =>
            isMounted && stripePublicKey ? loadStripe(stripePublicKey) : null,
        [isMounted, stripePublicKey],
    );

    const [shippingData, setShippingData] = useState({
        name: '',
        address: '',
        city: '',
        zip: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShippingData({ ...shippingData, [e.target.name]: e.target.value });
    };

    const stripeOptions = {
        clientSecret,
        appearance: { theme: 'stripe' as const },
    };

    // --- CRITICAL FIX: VALIDATION GUARD ---
    // If the cart total is 0 or the secret hasn't loaded yet, block Elements from mounting.
    // This prevents sending 0-value charges to Stripe's API.
    const isReadyForPayment = stripePromise && clientSecret && cartTotal > 0;

    return (
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 bg-white p-6 md:grid-cols-3 dark:bg-slate-950">
            <div className="space-y-6 md:col-span-2">
                {/* Shipping Form Panel */}
                <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                        1. Shipping Information
                    </h2>
                    <div className="grid grid-cols-1 gap-4">
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            onChange={handleInputChange}
                            className="rounded border border-slate-300 bg-white p-2 text-gray-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                        <input
                            type="text"
                            name="address"
                            placeholder="Street Address"
                            onChange={handleInputChange}
                            className="rounded border border-slate-300 bg-white p-2 text-gray-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="city"
                                placeholder="City"
                                onChange={handleInputChange}
                                className="rounded border border-slate-300 bg-white p-2 text-gray-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            />
                            <input
                                type="text"
                                name="zip"
                                placeholder="ZIP / Postal Code"
                                onChange={handleInputChange}
                                className="rounded border border-slate-300 bg-white p-2 text-gray-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            />
                        </div>
                    </div>
                </div>

                {/* Secure Payment Panel */}
                <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                        2. Payment Details
                    </h2>
                    {isReadyForPayment ? (
                        <Elements
                            stripe={stripePromise}
                            options={stripeOptions}
                        >
                            <CheckoutForm shippingData={shippingData} />
                        </Elements>
                    ) : (
                        <div className="flex items-center gap-2 py-4 text-gray-500 dark:text-gray-400">
                            <svg
                                className="h-5 w-5 animate-spin text-indigo-500"
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
                            {cartTotal === 0
                                ? 'Calculating order totals...'
                                : 'Securing payment configuration...'}
                        </div>
                    )}
                </div>
            </div>

            {/* Sidebar Summary Panel */}
            <div className="h-fit rounded-lg border border-slate-200 bg-gray-50 p-6 dark:border-slate-800 dark:bg-slate-900">
                <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
                    Order Summary
                </h2>
                <div className="mb-4 divide-y divide-slate-200 dark:divide-slate-800">
                    {cart.map((item) => (
                        <div
                            key={item.id}
                            className="flex justify-between py-2 text-sm text-gray-700 dark:text-slate-300"
                        >
                            <span>
                                {item.name} (x{item.quantity})
                            </span>
                            <span className="font-semibold text-gray-900 dark:text-white">
                                ${(item.price * item.quantity).toFixed(2)}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-4 text-lg font-bold text-gray-900 dark:border-slate-800 dark:text-white">
                    <span>Total:</span>
                    <span>${cartTotal.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
}
