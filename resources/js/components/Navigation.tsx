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
        <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Branding Logo */}
                    <div className="flex items-center gap-8">
                        <Link
                            href="/"
                            className="text-xl font-bold tracking-tight text-indigo-600"
                        >
                            PEBBLE &{' '}
                            <span className="text-slate-900">PINE</span>
                        </Link>
                        <div className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
                            <Link
                                href="/products"
                                className="transition hover:text-indigo-600"
                            >
                                Shop All
                            </Link>
                            <Link
                                href="/products?is_new_arrival=1"
                                className="transition hover:text-indigo-600"
                            >
                                New Arrivals
                            </Link>
                            <Link
                                href="/products?is_exclusive=1"
                                className="transition hover:text-indigo-600"
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
                            className="relative p-2 text-slate-600 transition hover:text-indigo-600"
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
                            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                                {isMounted ? cartCount : null}
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
