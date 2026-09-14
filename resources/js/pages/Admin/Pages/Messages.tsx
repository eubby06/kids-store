import { Head, Link } from '@inertiajs/react';
import Layout from './Layout';
import { MessageItem } from '@/types/message';

export default function AdminMessagePage({
    messages,
}: {
    messages: MessageItem[];
}) {
    return (
        <Layout title="Orders">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium tracking-wide text-indigo-600 uppercase">
                            Admin
                        </p>
                        <h1 className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
                            Messages
                        </h1>
                    </div>

                    <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500">
                        Export CSV
                    </button>
                </div>

                <div className="mb-6 grid gap-4 md:grid-cols-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Total Messages
                        </p>
                        <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                            {messages.length}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Replied
                        </p>
                        <p className="mt-2 text-3xl font-bold text-emerald-600">
                            4
                        </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            New
                        </p>
                        <p className="mt-2 text-3xl font-bold text-amber-600">
                            4
                        </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Important
                        </p>
                        <p className="mt-2 text-3xl font-bold text-red-600">
                            4
                        </p>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                            Recent Messages
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
                                <th className="px-5 py-3 font-medium">From</th>
                                <th className="px-5 py-3 font-medium">
                                    Subject
                                </th>
                                <th className="px-5 py-3 font-medium">Date</th>
                                <th className="px-5 py-3 font-medium">
                                    Status
                                </th>
                                <th className="px-5 py-3 font-medium">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 text-slate-700 dark:divide-slate-800 dark:text-slate-300">
                            {messages.map((message) => (
                                <tr
                                    key={message.id}
                                    className="hover:bg-slate-50 dark:hover:bg-slate-800/60"
                                >
                                    <td className="px-5 py-4 font-medium text-slate-900 dark:text-white">
                                        {message.name} {message.email}
                                    </td>
                                    <td className="px-5 py-4">
                                        {message.subject}
                                    </td>
                                    <td className="px-5 py-4">
                                        {message.sent}
                                    </td>
                                    <td className="px-5 py-4">
                                        <span
                                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                message.status === 'NEW'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : message.status ===
                                                        'REPLIED'
                                                      ? 'bg-amber-100 text-amber-700'
                                                      : 'bg-sky-100 text-sky-700'
                                            }`}
                                        >
                                            {message.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <button className="font-medium text-indigo-600 hover:text-indigo-500">
                                            View Now
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
