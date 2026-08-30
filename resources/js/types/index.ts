export type * from './auth';
import { Product } from './product';
import { Category } from './category';

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
}

export interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (id: number) => void;
    updateQuantity: (id: number, delta: number) => void;
    clearCart: () => void;
    cartTotal: number;
    cartCount: number;
}
