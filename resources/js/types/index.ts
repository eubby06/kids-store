export type * from './auth';

export interface Category {
    id: number;
    name: string;
    description: string;
    image: string;
}

export interface CategoriesProps {
    categories: Category[];
}

export interface Product {
    id: number;
    name: string;
    category: string;
    description: string;
    price: number;
    image: string;
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