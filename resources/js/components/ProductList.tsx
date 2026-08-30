import { Link } from '@inertiajs/react';
import { ProductListProps } from '@/types/product';
import { useCart } from '../pages/Frontend/Pages/CartContext';

export default function ProductList({ products = [] }: ProductListProps) {
    const { addToCart } = useCart();

    return (
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="border-b border-slate-200 pb-4 text-xl font-bold tracking-tight text-slate-900">
                Products
            </h2>

            {products?.length === 0 ? (
                <p className="my-30 text-center text-slate-500">
                    No products found.
                </p>
            ) : (
                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 bg-white p-3 shadow-sm transition hover:shadow-md"
                        >
                            {/* Image Wrapper */}
                            <div className="aspect-h-1 aspect-w-1 lg:aspect-none h-56 w-full overflow-hidden rounded-xl bg-slate-100 transition group-hover:opacity-90">
                                <Link href={`/products/${product.slug}`}>
                                    <img
                                        src={`/storage/${product.images[0]}`}
                                        alt={product.name}
                                        className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                                    />
                                </Link>
                            </div>

                            {/* Info & Call Action */}
                            <div className="mt-4 flex flex-1 flex-col justify-between">
                                <div>
                                    <p className="text-xs font-medium tracking-wide text-slate-400 uppercase">
                                        {product.category}
                                    </p>
                                    <h3 className="mt-1 text-sm font-semibold text-slate-700">
                                        <Link
                                            href={`/products/${product.id}`}
                                            className="relative z-10"
                                        >
                                            <span
                                                aria-hidden="true"
                                                className="absolute inset-0"
                                            />
                                            {product.name}
                                        </Link>
                                    </h3>
                                </div>
                                <div className="z-20 mt-3 flex items-center justify-between">
                                    <p className="text-sm font-bold text-slate-900">
                                        {product.price}
                                    </p>
                                    <button
                                        onClick={() => addToCart(product)}
                                        type="button"
                                        className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-600"
                                    >
                                        Add +
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}
