import { Link } from '@inertiajs/react';
import React, { useState, useRef, useEffect } from 'react';

interface SearchInputProps {
    onSearch: (term: string) => void;
    placeholder?: string;
}

export default function Navigation({ onSearch, placeholder = "Search products..." }: SearchInputProps) {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const isInitialMount = useRef<boolean>(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;

            return;
        } 
        
        const delayDebounceFn: ReturnType<typeof setTimeout> = setTimeout(() => {
            onSearch(searchTerm);
        }, 300);

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
                            <Link href="/" className="text-xl font-bold tracking-tight text-indigo-600">
                                NEXUS<span className="text-slate-900">STORE</span>
                            </Link>
                            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
                                <Link href="/products" className="hover:text-indigo-600 transition">Shop All</Link>
                                <Link href="/products?is_new_arrival=1" className="hover:text-indigo-600 transition">New Arrivals</Link>
                                <Link href="/products?is_exclusive=1" className="hover:text-indigo-600 transition">Exclusives</Link>
                            </div>
                        </div>

                        {/* Search & Actions */}
                        <div className="flex items-center gap-4">
                            <div className="relative hidden sm:block">
                                <input 
                                    value={searchTerm}
                                    onChange={handleChange}
                                    placeholder={placeholder}
                                    type="text"
                                    className="w-60 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={handleClear}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                            {/* Shopping Cart Icon (Simplified) */}
                            <button className="relative p-2 text-slate-600 hover:text-indigo-600 transition">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">0</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        );
}