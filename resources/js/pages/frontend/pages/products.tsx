import { Head } from '@inertiajs/react';
import ProductList from '@/components/ProductList';
import { storefrontProps } from '@/types';
import Wrapper from './wrapper';

export default function Products({ products, filters }: storefrontProps) {
    return (
        <Wrapper>
            <Head title="Premium Storefront" />

            {/* 4. PRODUCT EXHIBITION EXHIBIT (GRID) */}
            <ProductList products={products} />
        </Wrapper>
    );
}