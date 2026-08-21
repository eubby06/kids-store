import { Head, Link } from '@inertiajs/react';

const stats = [
    { label: 'Total Products', value: 128, accent: 'text-slate-900' },
    { label: 'Total Orders', value: 512, accent: 'text-slate-900' },
    { label: 'New Orders', value: 24, accent: 'text-emerald-600' },
    { label: 'New Messages', value: 9, accent: 'text-sky-600' },
    { label: 'Canceled Orders', value: 7, accent: 'text-red-600' },
    { label: 'Out of Stock Products', value: 5, accent: 'text-amber-600' },
];

export default function AdminDashboard() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Head title="Admin Dashboard" />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <p className="text-sm font-medium tracking-wide text-indigo-600 uppercase">
                        Admin
                    </p>
                    <h1 className="mt-1 text-3xl font-bold text-slate-900">
                        Dashboard
                    </h1>
                </div>

                <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                        >
                            <p className="text-sm text-slate-500">
                                {stat.label}
                            </p>
                            <p
                                className={`mt-2 text-3xl font-bold ${stat.accent}`}
                            >
                                {stat.value}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    <Link
                        href="/admin/products"
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
                    >
                        <p className="font-semibold text-slate-900">
                            Manage Products
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                            View, add, and edit product inventory
                        </p>
                    </Link>

                    <Link
                        href="/admin/categories"
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
                    >
                        <p className="font-semibold text-slate-900">
                            Manage Categories
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                            Organize products into categories
                        </p>
                    </Link>

                    <Link
                        href="/admin/orders"
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
                    >
                        <p className="font-semibold text-slate-900">
                            Manage Orders
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                            Track and update order statuses
                        </p>
                    </Link>
                </div>
            </div>
        </div>
    );
}
