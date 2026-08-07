import { Head, Link } from '@inertiajs/react';
import { storefrontProps } from '@/types';
import Header from '@/components/Header';
import Categories from '@/components/Categories';
import ProductList from '@/components/ProductList';
import Wrapper from './Wrapper';
export default function Storefront({ status, products = [], categories = [], filters }: storefrontProps) {
    return (
        <Wrapper>
            <Head title="Premium Storefront" />

            {/* 2. HERO PROMO SECTION */}
            <Header />

            {/* 3. CATEGORIES TAXONOMY SECTOR */}
            <Categories categories={categories} />

            {/* 4. PRODUCT EXHIBITION EXHIBIT (GRID) */}
            <ProductList products={products} categories={categories} />

            <Link href="/products" className="block text-center mt-8 text-lg font-semibold text-slate-900 hover:text-indigo-600 transition">
                View All Products
            </Link>
        </Wrapper>
    )
}