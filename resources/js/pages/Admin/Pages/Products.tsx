import { Head, Link, router } from '@inertiajs/react';
import { Product } from '@/types';
import toast from 'react-hot-toast';

interface AdminProductsPageProps {
    products: Product[];
}

export default function AdminProductsPage({
    products,
}: AdminProductsPageProps) {
    const handleEdit = (productId: number) => {
        // Navigate to the edit page for the product
        window.location.href = `/admin/products/${productId}/edit`;
    };

    const handleDelete = (productId: number) => {
        if (confirm('Are you sure you want to delete this product?')) {
            toast.success(`Product ${productId} deleted successfully`);
            router.delete(`/admin/products/${productId}`);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Head title="Products" />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium tracking-wide text-indigo-600 uppercase">
                            Admin
                        </p>
                        <h1 className="mt-1 text-3xl font-bold text-slate-900">
                            Products
                        </h1>
                    </div>

                    <Link
                        href="/admin/products/create"
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
                    >
                        + Add Product
                    </Link>
                </div>

                <div className="mb-6 grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">Total Products</p>
                        <p className="mt-2 text-3xl font-bold text-slate-900">
                            128
                        </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">Published</p>
                        <p className="mt-2 text-3xl font-bold text-emerald-600">
                            96
                        </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">Low Stock</p>
                        <p className="mt-2 text-3xl font-bold text-amber-600">
                            14
                        </p>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Product Inventory
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
                                <th className="px-5 py-3 font-medium">
                                    Product
                                </th>
                                <th className="px-5 py-3 font-medium">
                                    Category
                                </th>
                                <th className="px-5 py-3 font-medium">Price</th>
                                <th className="px-5 py-3 font-medium">Stock</th>
                                <th className="px-5 py-3 font-medium">
                                    Status
                                </th>
                                <th className="px-5 py-3 font-medium">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 text-slate-700">
                            {products.map((product) => (
                                <tr
                                    key={product.id}
                                    className="hover:bg-slate-50"
                                >
                                    <td className="px-5 py-4 font-medium text-slate-900">
                                        {product.name}
                                    </td>
                                    <td className="px-5 py-4">
                                        {product.category}
                                    </td>
                                    <td className="px-5 py-4">
                                        ${product.price.toFixed(2)}
                                    </td>
                                    <td className="px-5 py-4">
                                        {product.stock}
                                    </td>
                                    <td className="px-5 py-4">
                                        <span
                                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                product.status === 'Published'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-amber-100 text-amber-700'
                                            }`}
                                        >
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="space-x-3 px-5 py-4">
                                        <button
                                            onClick={() =>
                                                handleEdit(product.id)
                                            }
                                            className="font-medium text-indigo-600 hover:text-indigo-500"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(product.id)
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
