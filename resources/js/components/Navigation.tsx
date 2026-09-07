import { Link } from '@inertiajs/react';
import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '../pages/Frontend/Pages/CartContext';
import HybridSearchBar from '@/components/HybridSearchBar';

interface SearchInputProps {
    onSearch: (term: string) => void;
    placeholder?: string;
}

export default function Navigation({
    onSearch,
    placeholder = 'Search products...',
}: SearchInputProps) {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const isInitialMount = useRef<boolean>(true);
    const { cartCount } = useCart();
    const [isMounted, setIsMounted] = useState<boolean>(false);

    useEffect(() => {
        // mark mounted after client hydration to avoid SSR/CSR text mismatch
        setIsMounted(true);

        if (isInitialMount.current) {
            isInitialMount.current = false;

            return;
        }

        const delayDebounceFn: ReturnType<typeof setTimeout> = setTimeout(
            () => {
                onSearch(searchTerm);
            },
            300,
        );

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, onSearch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setSearchTerm(e.target.value);
    };

    const handleClear = (): void => {
        setSearchTerm('');
    };

    return (
        <nav className="sticky top-0 z-50 border-b border-neutral-800 bg-neutral-950/95 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Branding Logo */}
                    <div className="flex items-center gap-8">
                        <Link
                            href="/"
                            className="text-xl font-extrabold tracking-tight text-white uppercase"
                        >
                            Pebble<span className="text-lime-400">&.</span>
                            Pine
                        </Link>
                        <div className="hidden items-center gap-6 text-xs font-semibold tracking-wide text-neutral-400 uppercase md:flex">
                            <Link
                                href="/products"
                                className="transition hover:text-lime-400"
                            >
                                Shop
                            </Link>
                            <Link
                                href="/products?is_new_arrival=1"
                                className="transition hover:text-lime-400"
                            >
                                New Arrivals
                            </Link>
                            <Link
                                href="/products?is_exclusive=1"
                                className="transition hover:text-lime-400"
                            >
                                Exclusives
                            </Link>
                        </div>
                    </div>

                    {/* Search & Actions */}
                    <div className="flex items-center gap-4">
                        <div className="hidden max-w-lg flex-1 sm:block">
                            <HybridSearchBar />
                        </div>
                        {/* Shopping Cart Icon (Simplified) */}
                        <Link
                            href="/cart"
                            className="relative p-2 text-neutral-300 transition hover:text-lime-400"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                />
                            </svg>
                            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-lime-400 text-[10px] font-bold text-black">
                                {isMounted ? cartCount : null}
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
