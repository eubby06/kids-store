// components/ProductCard.tsx
import React from 'react';
import { useCart } from '../pages/Frontend/Pages/CartContext';
import { Product } from '@/types';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart();

    return (
        <div className="rounded border bg-white p-4 shadow-sm">
            <h3 className="text-lg font-bold">{product.name}</h3>
            <p className="text-gray-600">${product.price.toFixed(2)}</p>
            <button
                onClick={() => addToCart(product)}
                className="mt-3 w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
                Add to Cart
            </button>
        </div>
    );
}
