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
