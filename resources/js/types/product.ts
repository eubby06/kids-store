import { Category } from './category';

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
