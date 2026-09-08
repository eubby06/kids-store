import { Link } from '@inertiajs/react';
import { ProductListProps } from '@/types/product';
import { useCart } from '../pages/Frontend/Pages/CartContext';
import { formatCurrency } from '@/services/currency';

export default function ProductList({ products = [] }: ProductListProps) {
    const { addToCart } = useCart();

    return (
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between border-b border-neutral-800 pb-4">
                <div>
                    <h2 className="text-2xl font-extrabold tracking-tight text-white uppercase">
                        Available Pieces
                    </h2>
                    <p className="text-xs font-semibold tracking-widest text-neutral-500 uppercase">
                        Catalog
                    </p>
                </div>
                <div className="hidden gap-4 text-xs font-bold tracking-wide text-neutral-400 uppercase sm:flex">
                    <span className="text-lime-400 underline underline-offset-4">
                        All
                    </span>
                    <span className="transition hover:text-white">Tees</span>
                    <span className="transition hover:text-white">Hoodies</span>
                </div>
            </div>

            {products?.length === 0 ? (
                <p className="my-30 text-center text-neutral-500">
                    No products found.
                </p>
            ) : (
                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 p-3 shadow-sm transition hover:border-neutral-700 hover:shadow-md"
                        >
                            {/* Image Wrapper */}
                            <div className="aspect-h-1 aspect-w-1 lg:aspect-none relative h-56 w-full overflow-hidden rounded-xl bg-neutral-800 transition group-hover:opacity-90">
                                <span className="absolute top-2 left-2 z-10 rounded-full bg-lime-400 px-2 py-1 text-[10px] font-bold tracking-wide text-black uppercase">
                                    {product.category}
                                </span>
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
                                    <h3 className="mt-1 text-sm font-bold tracking-wide text-white uppercase">
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
                                    <p className="text-sm font-bold text-neutral-300">
                                        {formatCurrency(product.price)}
                                    </p>
                                </div>
                                <button
                                    onClick={() => addToCart(product)}
                                    type="button"
                                    className="relative z-20 mt-3 w-full rounded-lg border border-lime-400 px-3 py-1.5 text-xs font-bold tracking-wide text-lime-400 uppercase shadow-sm transition hover:bg-lime-400 hover:text-black"
                                >
                                    Quick Add
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}
