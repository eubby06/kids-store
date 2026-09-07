// components/MiniCart.tsx
import React from 'react';
import { useCart } from '../pages/Frontend/Pages/CartContext';

export default function MiniCart() {
    const { cart, updateQuantity, cartTotal, clearCart } = useCart();

    if (cart.length === 0)
        return <p className="text-neutral-500">Your cart is empty.</p>;

    return (
        <div className="max-w-sm rounded border border-neutral-800 bg-neutral-900 p-4 shadow">
            <h2 className="mb-4 text-xl font-bold text-white uppercase">
                Your Cart
            </h2>
            {cart.map((item) => (
                <div
                    key={`${item.id}-${item.variantId ?? 'default'}`}
                    className="mb-3 flex items-center justify-between"
                >
                    <div>
                        <p className="font-medium text-white">{item.name}</p>
                        <p className="text-sm text-neutral-500">
                            ${(item.price * item.quantity).toFixed(2)}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() =>
                                updateQuantity(item.id, -1, item.variantId)
                            }
                            className="rounded bg-neutral-800 px-2 text-white"
                        >
                            -
                        </button>
                        <span className="text-white">{item.quantity}</span>
                        <button
                            onClick={() =>
                                updateQuantity(item.id, 1, item.variantId)
                            }
                            className="rounded bg-neutral-800 px-2 text-white"
                        >
                            +
                        </button>
                    </div>
                </div>
            ))}
            <div className="mt-3 flex justify-between border-t border-neutral-800 pt-3 font-bold text-white">
                <span>Total:</span>
                <span>${cartTotal.toFixed(2)}</span>
            </div>
        </div>
    );
}
