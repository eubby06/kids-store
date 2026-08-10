// components/MiniCart.tsx
import React from 'react';
import { useCart } from '../pages/Frontend/Pages/CartContext';

export default function MiniCart() {
    const { cart, updateQuantity, cartTotal, clearCart } = useCart();

    if (cart.length === 0)
        return <p className="text-gray-500">Your cart is empty.</p>;

    return (
        <div className="max-w-sm rounded bg-white p-4 shadow">
            <h2 className="mb-4 text-xl font-bold">Your Cart</h2>
            {cart.map((item) => (
                <div
                    key={item.id}
                    className="mb-3 flex items-center justify-between"
                >
                    <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                            ${(item.price * item.quantity).toFixed(2)}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="rounded bg-gray-200 px-2"
                        >
                            -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="rounded bg-gray-200 px-2"
                        >
                            +
                        </button>
                    </div>
                </div>
            ))}
            <div className="mt-3 flex justify-between border-t pt-3 font-bold">
                <span>Total:</span>
                <span>${cartTotal.toFixed(2)}</span>
            </div>
        </div>
    );
}
