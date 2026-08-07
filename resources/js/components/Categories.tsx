import { Link } from '@inertiajs/react';
import { CategoriesProps } from '@/types';

export default function Categories({ categories = [] }: CategoriesProps) {
    return (
        <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <h2 className="text-xl font-bold tracking-tight text-slate-900">Shop by Workspace Category</h2>
                <Link href="#" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">View all →</Link>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {categories.map((cat, idx) => (
                    <div key={idx} className="group relative flex h-24 cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-indigo-500/40 hover:shadow-md transition">
                        <span className="font-semibold text-slate-800 group-hover:text-indigo-600 transition text-sm sm:text-base">{cat.name}</span>
                    </div>
                ))}
            </div>
        </section>
    )
}