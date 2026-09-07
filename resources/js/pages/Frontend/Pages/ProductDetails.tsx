import { Link } from '@inertiajs/react';
import React, { useState } from 'react';
import Wrapper from './Wrapper';
import { Product, Variant } from '@/types';
import { useCart } from './CartContext';

interface Props {
    product: Product;
    variants: Variant[];
    images: String[];
}

export default function ProductDetails({ product, variants, images }: Props) {
    const { addToCart } = useCart();

    const colors = Array.from(
        new Map(
            variants.map((variant) => [
                variant.color.toLowerCase(),
                { name: variant.color, value: variant.color.toLowerCase() },
            ]),
        ).values(),
    );

    const [selectedColor, setSelectedColor] = useState(colors[0]);
    const [selectedSize, setSelectedSize] = useState('L');
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    // Sizes are scoped to the selected color so unavailable size/color combos aren't shown at all
    const sizes = Array.from(
        variants
            .filter(
                (variant) =>
                    variant.color.toLowerCase() === selectedColor?.value,
            )
            .reduce((sizeMap, variant) => {
                const inStock = variant.stock_count !== 0;
                const existing = sizeMap.get(variant.size);
                // Prefer marking a size as available if any matching variant has stock
                if (!existing || (existing.disabled && inStock)) {
                    sizeMap.set(variant.size, {
                        value: variant.size,
                        disabled: !inStock,
                    });
                }
                return sizeMap;
            }, new Map<string, { value: string; disabled: boolean }>())
            .values(),
    );

    const handleColorSelect = (color: (typeof colors)[number]) => {
        setSelectedColor(color);

        const availableSizes = variants
            .filter((variant) => variant.color.toLowerCase() === color.value)
            .map((variant) => variant.size);

        if (!availableSizes.includes(selectedSize)) {
            setSelectedSize(availableSizes[0] ?? '');
        }
    };

    // Prefer the exact color+size match, falling back to any variant sharing the selected color
    const selectedVariant =
        variants.find(
            (variant) =>
                variant.color.toLowerCase() === selectedColor?.value &&
                variant.size === selectedSize,
        ) ??
        variants.find(
            (variant) => variant.color.toLowerCase() === selectedColor?.value,
        );

    const mainImage = selectedVariant?.image
        ? selectedVariant.image
        : product.images[0];

    return (
        <Wrapper>
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="mb-6 flex space-x-2 text-sm text-neutral-500">
                    <Link
                        href="/"
                        className="transition-colors hover:text-white"
                    >
                        Home
                    </Link>
                    <span>/</span>
                    <Link
                        href="/products?category=apparel"
                        className="transition-colors hover:text-white"
                    >
                        Apparel
                    </Link>
                    <span>/</span>
                    <span className="font-medium text-white">T-Shirts</span>
                </nav>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
                    {/* Left Column: Image Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-square w-full overflow-hidden rounded-2xl bg-neutral-900">
                            <img
                                src={`/storage/${mainImage}`}
                                alt={`${product.name} view`}
                                className="h-full w-full object-cover object-center transition-all duration-500"
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {images.length &&
                                images.map((imgUrl, index) => (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            setActiveImageIndex(index)
                                        }
                                        className={`aspect-square overflow-hidden rounded-lg bg-neutral-900 transition-all ${
                                            activeImageIndex === index
                                                ? 'opacity-100 ring-2 ring-lime-400'
                                                : 'opacity-60 hover:opacity-100'
                                        }`}
                                    >
                                        <img
                                            src="#"
                                            alt={`Thumbnail ${index + 1}`}
                                            className="h-full w-full object-cover"
                                        />
                                    </button>
                                ))}
                        </div>
                    </div>

                    {/* Right Column: Product Details Form */}
                    <div className="flex flex-col justify-between">
                        <div>
                            {/* Header Details */}
                            <div className="mb-4">
                                <h1 className="text-3xl font-extrabold tracking-tight text-white uppercase sm:text-4xl">
                                    {product.name}
                                </h1>
                                <div className="mt-3 flex items-center justify-between">
                                    <p className="text-2xl font-semibold text-white">
                                        ${product.price.toFixed(2)}
                                    </p>
                                    <div className="flex items-center space-x-1">
                                        <span className="flex text-lime-400">
                                            <svg
                                                className="h-5 w-5"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        </span>
                                        <span className="text-sm font-medium text-neutral-400">
                                            3.2 ( 3622 reviews)
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <hr className="my-6 border-neutral-800" />

                            {/* Description */}
                            <p className="text-base leading-relaxed text-neutral-400">
                                {product.description}
                            </p>

                            {/* Color Picker */}
                            <div className="mt-6">
                                <h3 className="text-sm font-medium text-white">
                                    Color:{' '}
                                    <span className="font-normal text-neutral-400">
                                        {selectedColor.name}
                                    </span>
                                </h3>
                                <div className="mt-2 flex items-center space-x-3">
                                    {colors.map((color) => (
                                        <button
                                            key={color.value}
                                            onClick={() =>
                                                handleColorSelect(color)
                                            }
                                            style={{
                                                backgroundColor: color.value,
                                            }}
                                            className={`h-8 w-8 rounded-full border border-neutral-700 transition-all focus:outline-none ${
                                                selectedColor.value ===
                                                color.value
                                                    ? 'scale-105 ring-2 ring-lime-400 ring-offset-2 ring-offset-neutral-950'
                                                    : 'hover:scale-105'
                                            }`}
                                            aria-label={`Select ${color.name}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Size Picker */}
                            <div className="mt-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-medium text-white">
                                        Size
                                    </h3>
                                    <a
                                        href="#size-guide"
                                        className="text-sm font-medium text-neutral-400 underline transition-colors hover:text-lime-400"
                                    >
                                        Size guide
                                    </a>
                                </div>
                                <div className="mt-2 grid grid-cols-5 gap-2">
                                    {sizes.map((size) => (
                                        <button
                                            key={size.value}
                                            disabled={size.disabled}
                                            onClick={() =>
                                                setSelectedSize(size.value)
                                            }
                                            className={`rounded-lg py-3 text-center text-sm font-medium transition-colors ${
                                                size.disabled
                                                    ? 'cursor-not-allowed border border-neutral-800 bg-neutral-900 text-neutral-600'
                                                    : selectedSize ===
                                                        size.value
                                                      ? 'border-2 border-lime-400 bg-neutral-900 text-white'
                                                      : 'border border-neutral-700 bg-neutral-900 text-white hover:border-lime-400'
                                            }`}
                                        >
                                            {size.value}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-8 space-y-3">
                            <button
                                onClick={() =>
                                    addToCart(product, selectedVariant)
                                }
                                className="flex w-full items-center justify-center rounded-xl bg-lime-400 px-8 py-4 text-center text-sm font-bold text-black uppercase transition-colors hover:bg-lime-300 focus:outline-none"
                            >
                                Add to Cart
                            </button>
                            <button className="flex w-full items-center justify-center rounded-xl border border-neutral-700 bg-transparent px-8 py-4 text-center text-sm font-medium text-neutral-300 uppercase transition-colors hover:bg-neutral-900 focus:outline-none">
                                <svg
                                    className="mr-2 h-5 w-5 text-neutral-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    />
                                </svg>
                                Add to Wishlist
                            </button>
                        </div>

                        {/* Shipping Info */}
                        <div className="mt-8 border-t border-neutral-800 pt-6">
                            <ul className="space-y-2 text-sm text-neutral-400">
                                <li className="flex items-center">
                                    <svg
                                        className="mr-2 h-4 w-4 text-lime-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    Free shipping on orders over $75
                                </li>
                                <li className="flex items-center">
                                    <svg
                                        className="mr-2 h-4 w-4 text-lime-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    30-day hassle-free return policy
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </Wrapper>
    );
}
