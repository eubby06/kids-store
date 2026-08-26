import { Category } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { toast } from 'react-hot-toast';
import Layout from './Layout';

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
        <Layout title="Categories">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-center justify-between">
                    <Link
                        href="/admin/categories/create"
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
                    >
                        + New Category
                    </Link>
                </div>

                <div className="mb-6 grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Total Categories
                        </p>
                        <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                            {categories.length}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Active
                        </p>
                        <p className="mt-2 text-3xl font-bold text-emerald-600">
                            {
                                categories.filter(
                                    (category) => category.status === 'Active',
                                ).length
                            }
                        </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Draft
                        </p>
                        <p className="mt-2 text-3xl font-bold text-amber-600">
                            {
                                categories.filter(
                                    (category) => category.status === 'Draft',
                                ).length
                            }
                        </p>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                            Category List
                        </h2>
                        <Link
                            href="/admin"
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Back to dashboard
                        </Link>
                    </div>

                    <table className="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-800">
                        <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800/60 dark:text-slate-400">
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
                        <tbody className="divide-y divide-slate-200 text-slate-700 dark:divide-slate-800 dark:text-slate-300">
                            {categories.map((category) => (
                                <tr
                                    key={category.id}
                                    className="hover:bg-slate-50 dark:hover:bg-slate-800/60"
                                >
                                    <td className="px-5 py-4 font-medium text-slate-900 dark:text-white">
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
                                                      : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
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
        </Layout>
    );
}
