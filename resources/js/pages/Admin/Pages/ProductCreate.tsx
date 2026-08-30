import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { Category } from '@/types/category';
import toast from 'react-hot-toast';
import Layout from './Layout';

interface VariantForm {
    key: string;
    id?: number;
    size: string;
    color: string;
    is_exclusive: boolean;
    is_new_arrival: boolean;
    parent_image_index: number | null;
}

interface AdminProductCreatePageProps {
    product?: {
        id: number;
        name: string;
        category_id: string;
        description: string;
        price: string;
        status: string;
        images: string[];
        variants: VariantForm[];
    };
    categories: Category[];
}

const createVariantKey = (): string =>
    typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);

const createEmptyVariant = (): VariantForm => ({
    key: createVariantKey(),
    size: '',
    color: '',
    is_exclusive: false,
    is_new_arrival: false,
    parent_image_index: null,
});

interface ProductForm {
    name: string;
    category_id: string;
    description: string;
    price: string;
    status: string;
    images: File[];
    existing_images: string[];
    variants: VariantForm[];
}

export default function AdminProductCreatePage({
    product,
    categories,
}: AdminProductCreatePageProps) {
    const { data, setData, transform, post, processing, errors } =
        useForm<ProductForm>({
            name: product?.name || '',
            category_id: product?.category_id || '',
            description: product?.description || '',
            price: product?.price || '',
            status: product?.status || 'Draft',
            images: [],
            existing_images: product?.images ?? [],
            variants: (product?.variants ?? []).map((variant) => ({
                key: createVariantKey(),
                id: variant.id,
                size: variant.size,
                color: variant.color,
                is_exclusive: variant.is_exclusive,
                is_new_arrival: variant.is_new_arrival,
                parent_image_index: variant.parent_image_index,
            })),
        });

    // New file uploads get a blob preview; existing images are already-saved
    // storage paths, so the two are combined into one list for display/selection
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const imagePreviewsRef = useRef<string[]>([]);

    const allImagePreviews = [
        ...data.existing_images.map((path) => `/storage/${path}`),
        ...imagePreviews,
    ];

    useEffect(() => {
        imagePreviewsRef.current = imagePreviews;
    }, [imagePreviews]);

    // Revoke any remaining object URLs when the component unmounts
    useEffect(() => {
        return () => {
            imagePreviewsRef.current.forEach((url) => URL.revokeObjectURL(url));
        };
    }, []);

    const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (files.length === 0) {
            return;
        }

        setData('images', [...data.images, ...files]);
        setImagePreviews((previews) => [
            ...previews,
            ...files.map((file) => URL.createObjectURL(file)),
        ]);
        e.target.value = '';
    };

    const removeImage = (index: number) => {
        const existingCount = data.existing_images.length;

        if (index < existingCount) {
            setData(
                'existing_images',
                data.existing_images.filter((_, i) => i !== index),
            );
        } else {
            const newIndex = index - existingCount;
            URL.revokeObjectURL(imagePreviews[newIndex]);
            setData(
                'images',
                data.images.filter((_, i) => i !== newIndex),
            );
            setImagePreviews((previews) =>
                previews.filter((_, i) => i !== newIndex),
            );
        }

        // Keep variant image selections in sync with the removed index
        setData(
            'variants',
            data.variants.map((variant) => {
                if (variant.parent_image_index === index) {
                    return { ...variant, parent_image_index: null };
                }
                if (
                    variant.parent_image_index !== null &&
                    variant.parent_image_index > index
                ) {
                    return {
                        ...variant,
                        parent_image_index: variant.parent_image_index - 1,
                    };
                }
                return variant;
            }),
        );
    };

    const addVariant = () => {
        setData('variants', [...data.variants, createEmptyVariant()]);
    };

    const removeVariant = (key: string) => {
        setData(
            'variants',
            data.variants.filter((variant) => variant.key !== key),
        );
    };

    const updateVariant = <K extends keyof VariantForm>(
        key: string,
        field: K,
        value: VariantForm[K],
    ) => {
        setData(
            'variants',
            data.variants.map((variant) =>
                variant.key === key ? { ...variant, [field]: value } : variant,
            ),
        );
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        transform((formData) => ({
            ...formData,
            variants: formData.variants.map(({ key, ...variant }) => variant),
            ...(product ? { _method: 'put' } : {}),
        }));

        post(product ? `/admin/products/${product.id}` : '/admin/products', {
            forceFormData: true,
        });

        toast.success(`Product id: ${product?.id} has been saved.`);
    };

    return (
        <Layout title={product ? 'Edit Product' : 'Add Product'}>
            <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-center justify-between">
                    <Link
                        href="/admin/products"
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                        Back to products
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
                            Product Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className={`mt-1 block w-full rounded-lg border px-3 py-2 text-slate-900 placeholder-slate-400 transition focus:ring-2 focus:outline-none sm:text-sm ${
                                errors.name
                                    ? 'border-red-300 focus:ring-red-500/20'
                                    : 'border-slate-200 focus:ring-indigo-500/20'
                            }`}
                            placeholder="e.g. Pebble Cotton Tee"
                            required
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="category_id"
                                className="block text-sm font-medium text-slate-700"
                            >
                                Category
                            </label>
                            <select
                                id="category_id"
                                value={data.category_id}
                                onChange={(e) =>
                                    setData('category_id', e.target.value)
                                }
                                className={`mt-1 block w-full rounded-lg border px-3 py-2 text-slate-900 transition focus:ring-2 focus:outline-none sm:text-sm ${
                                    errors.category_id
                                        ? 'border-red-300 focus:ring-red-500/20'
                                        : 'border-slate-200 focus:ring-indigo-500/20'
                                }`}
                                required
                            >
                                <option value="">Select a category</option>
                                {categories?.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            {errors.category_id && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.category_id}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="status"
                                className="block text-sm font-medium text-slate-700"
                            >
                                Status
                            </label>
                            <select
                                id="status"
                                value={data.status}
                                onChange={(e) =>
                                    setData('status', e.target.value)
                                }
                                className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 transition focus:ring-2 focus:ring-indigo-500/20 focus:outline-none sm:text-sm"
                            >
                                <option value="Draft">Draft</option>
                                <option value="Published">Published</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="price"
                                className="block text-sm font-medium text-slate-700"
                            >
                                Price
                            </label>
                            <input
                                id="price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.price}
                                onChange={(e) =>
                                    setData('price', e.target.value)
                                }
                                className={`mt-1 block w-full rounded-lg border px-3 py-2 text-slate-900 placeholder-slate-400 transition focus:ring-2 focus:outline-none sm:text-sm ${
                                    errors.price
                                        ? 'border-red-300 focus:ring-red-500/20'
                                        : 'border-slate-200 focus:ring-indigo-500/20'
                                }`}
                                placeholder="0.00"
                                required
                            />
                            {errors.price && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.price}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="images"
                            className="block text-sm font-medium text-slate-700"
                        >
                            Product Images
                        </label>
                        <input
                            id="images"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImagesChange}
                            className={`mt-1 block w-full rounded-lg border px-3 py-2 text-slate-900 file:mr-3 file:rounded-md file:border-0 file:bg-indigo-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-indigo-600 hover:file:bg-indigo-100 focus:ring-2 focus:outline-none sm:text-sm ${
                                errors.images
                                    ? 'border-red-300 focus:ring-red-500/20'
                                    : 'border-slate-200 focus:ring-indigo-500/20'
                            }`}
                        />
                        {allImagePreviews.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-3">
                                {allImagePreviews.map((preview, index) => (
                                    <div key={preview} className="relative">
                                        <img
                                            src={preview}
                                            alt={`Product image ${index + 1}`}
                                            className="h-24 w-24 rounded-lg border border-slate-200 object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white shadow-sm transition hover:bg-red-500"
                                            aria-label={`Remove image ${index + 1}`}
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        {errors.images && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.images}
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
                            placeholder="Short product description"
                        />
                        {errors.description && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <div className="border-t border-slate-200 pt-5">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                    Product Variants
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Add size/color variations and tag them as
                                    exclusive or new arrival.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={addVariant}
                                className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-100"
                            >
                                + Add Variant
                            </button>
                        </div>

                        {data.variants.length === 0 && (
                            <p className="rounded-lg border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-500">
                                No variants added yet.
                            </p>
                        )}

                        <div className="space-y-4">
                            {data.variants.map((variant, index) => (
                                <div
                                    key={variant.key}
                                    className="rounded-xl border border-slate-200 p-4"
                                >
                                    <div className="mb-4 flex items-center justify-between">
                                        <p className="text-sm font-semibold text-slate-700">
                                            Variant {index + 1}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeVariant(variant.key)
                                            }
                                            className="text-sm font-medium text-red-600 hover:text-red-500"
                                        >
                                            Remove
                                        </button>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700">
                                                Size
                                            </label>
                                            <input
                                                type="text"
                                                value={variant.size}
                                                onChange={(e) =>
                                                    updateVariant(
                                                        variant.key,
                                                        'size',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="e.g. M, L, XL"
                                                className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 placeholder-slate-400 transition focus:ring-2 focus:ring-indigo-500/20 focus:outline-none sm:text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700">
                                                Color
                                            </label>
                                            <input
                                                type="text"
                                                value={variant.color}
                                                onChange={(e) =>
                                                    updateVariant(
                                                        variant.key,
                                                        'color',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="e.g. Black, Olive"
                                                className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 placeholder-slate-400 transition focus:ring-2 focus:ring-indigo-500/20 focus:outline-none sm:text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-6">
                                        <label className="flex items-center gap-2 text-sm text-slate-700">
                                            <input
                                                type="checkbox"
                                                checked={variant.is_exclusive}
                                                onChange={(e) =>
                                                    updateVariant(
                                                        variant.key,
                                                        'is_exclusive',
                                                        e.target.checked,
                                                    )
                                                }
                                                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            Exclusive
                                        </label>

                                        <label className="flex items-center gap-2 text-sm text-slate-700">
                                            <input
                                                type="checkbox"
                                                checked={variant.is_new_arrival}
                                                onChange={(e) =>
                                                    updateVariant(
                                                        variant.key,
                                                        'is_new_arrival',
                                                        e.target.checked,
                                                    )
                                                }
                                                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            New Arrival
                                        </label>
                                    </div>

                                    <div className="mt-4">
                                        <p className="block text-sm font-medium text-slate-700">
                                            Variant Image
                                        </p>
                                        <p className="mt-1 text-xs text-slate-500">
                                            Select one of the product images
                                            above for this variant.
                                        </p>

                                        {allImagePreviews.length === 0 ? (
                                            <p className="mt-2 text-xs text-slate-400">
                                                Upload product images above to
                                                assign one here.
                                            </p>
                                        ) : (
                                            <div className="mt-2 flex flex-wrap gap-3">
                                                {allImagePreviews.map(
                                                    (preview, index) => (
                                                        <button
                                                            key={preview}
                                                            type="button"
                                                            onClick={() =>
                                                                updateVariant(
                                                                    variant.key,
                                                                    'parent_image_index',
                                                                    index,
                                                                )
                                                            }
                                                            className={`relative rounded-lg border-2 transition ${
                                                                variant.parent_image_index ===
                                                                index
                                                                    ? 'border-indigo-600'
                                                                    : 'border-transparent hover:border-slate-300'
                                                            }`}
                                                        >
                                                            <img
                                                                src={preview}
                                                                alt={`Product image ${index + 1}`}
                                                                className="h-20 w-20 rounded-md object-cover"
                                                            />
                                                            {variant.parent_image_index ===
                                                                index && (
                                                                <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                                                                    &#10003;
                                                                </span>
                                                            )}
                                                        </button>
                                                    ),
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-5">
                        <Link
                            href="/admin/products"
                            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-50"
                        >
                            {processing
                                ? 'Saving...'
                                : product
                                  ? 'Save Changes'
                                  : 'Save Product'}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}
