import React, { createContext, useContext, ReactNode } from 'react';
import { PageProps as InertiaPageProps } from '@inertiajs/core'; // or '@inertiajs/react'
import { router, usePage } from '@inertiajs/react';
import { CartItem, CartContextType } from '@/types';
import { Product, Variant } from '@/types/product';
import { toast } from 'react-hot-toast';

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
    children: ReactNode;
}

// 1. Define the internal shape of your cart data
interface CartData {
    items: CartItem[];
    subtotal: number;
    discount: number;
    total: number;
    coupon: { code: string } | null;
}

// 2. Extend Inertia's base PageProps constraint
interface PageProps extends InertiaPageProps {
    cart: CartData;
    errors: any; // Included for convenience with standard forms
}

export function CartProvider({ children }: CartProviderProps) {
    // Pull the real-time server-calculated cart directly from Inertia props
    const { props } = usePage<PageProps>();

    // Provide safe fallbacks if the route doesn't share cart data yet
    const serverCart = props.cart?.items || [];
    const cartTotal = props.cart?.total || 0;

    // Count items from server data
    const cartCount = serverCart.reduce((sum, item) => sum + item.quantity, 0);

    const addToCart = (product: Product, variant?: Variant) => {
        router.post(
            '/cart/items',
            {
                product_id: product.id,
                variant_id: variant?.id,
                quantity: 1,
                price: product.price, // Server should ideally resolve this, but matches your service signatures
            },
            {
                preserveScroll: true,
                onSuccess: () => toast.success(`${product.name} added to cart`),
            },
        );
    };

    const updateQuantity = (id: number, delta: number, variantId?: number) => {
        router.put(
            `/cart/items/update`,
            {
                id,
                variant_id: variantId,
                delta: delta, // Send -1 or +1 to the backend
            },
            {
                preserveScroll: true,
            },
        );
    };

    const removeFromCart = (id: number, variantId?: number) => {
        router.delete(`/cart/items`, {
            data: { id, variant_id: variantId },
            preserveScroll: true,
            onSuccess: () => toast.success('Item removed from cart'),
        });
    };

    const clearCart = () => {
        router.delete('/cart', {
            preserveScroll: true,
        });
    };

    return (
        <CartContext.Provider
            value={{
                cart: serverCart,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
                cartTotal,
                cartCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (context === undefined) {
        console.warn(
            'useCart used outside of CartProvider — returning fallback API.',
        );
        return {
            cart: [],
            addToCart: () => {},
            removeFromCart: () => {},
            updateQuantity: () => {},
            clearCart: () => {},
            cartTotal: 0,
            cartCount: 0,
        };
    }
    return context;
};
