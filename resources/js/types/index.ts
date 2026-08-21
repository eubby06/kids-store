export type * from './auth';

export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    image: string;
    products_count: number;
    status: 'Active' | 'Draft' | 'Archived';
}

export interface CategoriesProps {
    categories: Category[];
}

export interface Product {
    id: number;
    name: string;
    slug: string;
    category: string;
    description: string;
    price: number;
    images: string;
    stock: number;
    status: 'Published' | 'Draft';
}

export interface Variant {
    id: number;
    product_id: number;
    sku: string;
    color: string;
    size: string;
    stock_count: number;
    price_override?: number | null;
    is_on_sale: boolean;
}

export interface ProductListProps {
    products: Product[];
    categories?: Category[];
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
