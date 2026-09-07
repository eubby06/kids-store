import { Link } from '@inertiajs/react';
import { CategoriesProps } from '@/types/category';

export default function Categories({ categories = [] }: CategoriesProps) {
    return (
        <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <h2 className="text-xl font-bold tracking-tight text-white uppercase">
                    Shop by Category
                </h2>
                <Link
                    href="#"
                    className="text-sm font-semibold text-lime-400 hover:text-lime-300"
                >
                    View all →
                </Link>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {categories.map((cat, idx) => (
                    <Link
                        key={idx}
                        href={`/products?category=${cat.slug}`}
                        className="group relative flex h-24 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 shadow-sm transition hover:border-lime-400/50 hover:shadow-md"
                    >
                        <span className="text-sm font-semibold tracking-wide text-neutral-300 uppercase transition group-hover:text-lime-400 sm:text-base">
                            {cat.name}
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
