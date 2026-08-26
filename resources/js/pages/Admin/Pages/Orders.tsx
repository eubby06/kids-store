import { Head, Link } from '@inertiajs/react';
import Layout from './Layout';

const orders = [
    {
        id: '#1001',
        customer: 'Alicia Brown',
        total: 128.9,
        status: 'Paid',
        date: '2026-08-18',
    },
    {
        id: '#1002',
        customer: 'Marcus Lee',
        total: 72.4,
        status: 'Processing',
        date: '2026-08-19',
    },
    {
        id: '#1003',
        customer: 'Jasmine Patel',
        total: 210.15,
        status: 'Shipped',
        date: '2026-08-20',
    },
];

export default function AdminOrdersPage() {
    return (
        <Layout title="Orders">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium tracking-wide text-indigo-600 uppercase">
                            Admin
                        </p>
                        <h1 className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
                            Orders
                        </h1>
                    </div>

                    <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500">
                        Export CSV
                    </button>
                </div>

                <div className="mb-6 grid gap-4 md:grid-cols-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Total Orders
                        </p>
                        <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                            512
                        </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Paid
                        </p>
                        <p className="mt-2 text-3xl font-bold text-emerald-600">
                            341
                        </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Processing
                        </p>
                        <p className="mt-2 text-3xl font-bold text-amber-600">
                            88
                        </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Shipped
                        </p>
                        <p className="mt-2 text-3xl font-bold text-sky-600">
                            83
                        </p>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                            Recent Orders
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
                                <th className="px-5 py-3 font-medium">Order</th>
                                <th className="px-5 py-3 font-medium">
                                    Customer
                                </th>
                                <th className="px-5 py-3 font-medium">Date</th>
                                <th className="px-5 py-3 font-medium">Total</th>
                                <th className="px-5 py-3 font-medium">
                                    Status
                                </th>
                                <th className="px-5 py-3 font-medium">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 text-slate-700 dark:divide-slate-800 dark:text-slate-300">
                            {orders.map((order) => (
                                <tr
                                    key={order.id}
                                    className="hover:bg-slate-50 dark:hover:bg-slate-800/60"
                                >
                                    <td className="px-5 py-4 font-medium text-slate-900 dark:text-white">
                                        {order.id}
                                    </td>
                                    <td className="px-5 py-4">
                                        {order.customer}
                                    </td>
                                    <td className="px-5 py-4">{order.date}</td>
                                    <td className="px-5 py-4">
                                        ${order.total.toFixed(2)}
                                    </td>
                                    <td className="px-5 py-4">
                                        <span
                                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                order.status === 'Paid'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : order.status ===
                                                        'Processing'
                                                      ? 'bg-amber-100 text-amber-700'
                                                      : 'bg-sky-100 text-sky-700'
                                            }`}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <button className="font-medium text-indigo-600 hover:text-indigo-500">
                                            View
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
