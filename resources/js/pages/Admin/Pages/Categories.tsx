import { Category } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { toast } from 'react-hot-toast';

interface AdminCategoriesPageProps {
    categories: Category[];
}

export default function AdminCategoriesPage({
    categories,
}: AdminCategoriesPageProps) {
    const handleDelete = (categoryId: number) => {
        if (confirm('Are you sure you want to delete this category?')) {
            router.delete(`/admin/categories/${categoryId}`, {
                onSuccess: () => {
                    toast.success(
                        `Category ${categoryId} deleted successfully`,
                    );
                },
                onError: (error) => {
                    toast.error(`Failed to delete category ${categoryId}`);
                },
            });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Head title="Categories" />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium tracking-wide text-indigo-600 uppercase">
                            Admin
                        </p>
                        <h1 className="mt-1 text-3xl font-bold text-slate-900">
                            Categories
                        </h1>
                    </div>

                    <Link
                        href="/admin/categories/create"
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
                    >
                        + New Category
                    </Link>
                </div>

                <div className="mb-6 grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Total Categories
                        </p>
                        <p className="mt-2 text-3xl font-bold text-slate-900">
                            {categories.length}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">Active</p>
                        <p className="mt-2 text-3xl font-bold text-emerald-600">
                            {
                                categories.filter(
                                    (category) => category.status === 'Active',
                                ).length
                            }
                        </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">Draft</p>
                        <p className="mt-2 text-3xl font-bold text-amber-600">
                            {
                                categories.filter(
                                    (category) => category.status === 'Draft',
                                ).length
                            }
                        </p>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Category List
                        </h2>
                        <Link
                            href="/admin"
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Back to dashboard
                        </Link>
                    </div>

                    <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                        <thead className="bg-slate-50 text-slate-600">
                            <tr>
                                <th className="px-5 py-3 font-medium">Name</th>
                                <th className="px-5 py-3 font-medium">
                                    Products
                                </th>
                                <th className="px-5 py-3 font-medium">
                                    Status
                                </th>
                                <th className="px-5 py-3 font-medium">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 text-slate-700">
                            {categories.map((category) => (
                                <tr
                                    key={category.id}
                                    className="hover:bg-slate-50"
                                >
                                    <td className="px-5 py-4 font-medium text-slate-900">
                                        {category.name}
                                    </td>
                                    <td className="px-5 py-4">
                                        {category.products_count}
                                    </td>
                                    <td className="px-5 py-4">
                                        <span
                                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                category.status === 'Active'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : category.status ===
                                                        'Draft'
                                                      ? 'bg-amber-100 text-amber-700'
                                                      : 'bg-slate-200 text-slate-600'
                                            }`}
                                        >
                                            {category.status}
                                        </span>
                                    </td>
                                    <td className="space-x-3 px-5 py-4">
                                        <button
                                            onClick={() =>
                                                (window.location.href = `/admin/categories/${category.id}/edit`)
                                            }
                                            className="font-medium text-indigo-600 hover:text-indigo-500"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(category.id)
                                            }
                                            className="font-medium text-red-600 hover:text-red-500"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
