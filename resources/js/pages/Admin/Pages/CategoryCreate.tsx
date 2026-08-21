import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

const slugify = (value: string): string =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

export default function AdminCategoryCreatePage({
    category,
    isUpdating,
}: {
    category: any;
    isUpdating: boolean;
}) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: category.name || '',
        slug: category.slug || '',
        description: category.description || '',
    });

    const [slugEdited, setSlugEdited] = useState(false);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setData((current) => ({
            ...current,
            name,
            slug: slugEdited ? current.slug : slugify(name),
        }));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isUpdating) {
            put(`/admin/categories/${category.id}`);
        } else {
            post('/admin/categories');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Head title="Add Category" />

            <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium tracking-wide text-indigo-600 uppercase">
                            Admin
                        </p>
                        <h1 className="mt-1 text-3xl font-bold text-slate-900">
                            Add Category
                        </h1>
                    </div>

                    <Link
                        href="/admin/categories"
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                        Back to categories
                    </Link>
                </div>

                <form
                    onSubmit={submit}
                    className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-slate-700"
                        >
                            Category Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={handleNameChange}
                            className={`mt-1 block w-full rounded-lg border px-3 py-2 text-slate-900 placeholder-slate-400 transition focus:ring-2 focus:outline-none sm:text-sm ${
                                errors.name
                                    ? 'border-red-300 focus:ring-red-500/20'
                                    : 'border-slate-200 focus:ring-indigo-500/20'
                            }`}
                            placeholder="e.g. Apparel"
                            required
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="slug"
                            className="block text-sm font-medium text-slate-700"
                        >
                            Slug
                        </label>
                        <input
                            id="slug"
                            type="text"
                            value={data.slug}
                            onChange={(e) => {
                                setSlugEdited(true);
                                setData('slug', e.target.value);
                            }}
                            className={`mt-1 block w-full rounded-lg border px-3 py-2 text-slate-900 placeholder-slate-400 transition focus:ring-2 focus:outline-none sm:text-sm ${
                                errors.slug
                                    ? 'border-red-300 focus:ring-red-500/20'
                                    : 'border-slate-200 focus:ring-indigo-500/20'
                            }`}
                            placeholder="e.g. apparel"
                            required
                        />
                        <p className="mt-1 text-xs text-slate-400">
                            Auto-generated from the name, editable if needed.
                        </p>
                        {errors.slug && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.slug}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-slate-700"
                        >
                            Description
                        </label>
                        <textarea
                            id="description"
                            rows={4}
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            className={`mt-1 block w-full rounded-lg border px-3 py-2 text-slate-900 placeholder-slate-400 transition focus:ring-2 focus:outline-none sm:text-sm ${
                                errors.description
                                    ? 'border-red-300 focus:ring-red-500/20'
                                    : 'border-slate-200 focus:ring-indigo-500/20'
                            }`}
                            placeholder="Short category description"
                        />
                        {errors.description && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-5">
                        <Link
                            href="/admin/categories"
                            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-50"
                        >
                            {processing ? 'Saving...' : 'Save Category'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
