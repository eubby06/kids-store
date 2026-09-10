export type * from './auth';
export type * from './product';
import { Product } from './product';
import { Variant } from './product';
import { Category } from './category';
import { PageProps as InertiaPageProps } from '@inertiajs/core';

export interface PageProps extends InertiaPageProps {
    auth: {
        user: any; // Replace with your User type if available
    };
    flash: {
        success: string | null;
        error: string | null;
    };
}

export interface storefrontProps {
    status?: string;
    products: Product[];
    categories: Category[];
    filters?: {
        search?: string;
    };
}

export interface CartItem extends Product {
    quantity: number;
    variantId?: number;
    variantImage?: string;
    variantColor?: string;
    variantSize?: string;
}

export interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product, variant?: Variant) => void;
    removeFromCart: (id: number, variantId?: number) => void;
    updateQuantity: (id: number, delta: number, variantId?: number) => void;
    clearCart: () => void;
    cartTotal: number;
    cartCount: number;
}
