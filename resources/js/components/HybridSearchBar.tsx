import React, { useState, useEffect, useRef, ChangeEvent } from 'react';

interface Product {
    id: number;
    name: string;
    price: number;
    slug: string;
    image_url?: string;
    description: string;
}

export default function HybridSearchBar(): React.JSX.Element {
    const [query, setQuery] = useState<string>('');
    const [results, setResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const dropdownRef = useRef<HTMLDivElement | null>(null);

    // Close autocomplete menu when clicking outside the boundary layout
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle debouncing and raw fetch request loops
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        setLoading(true);
        const delayDebounceFn = setTimeout(async () => {
            try {
                // Construct query parameters using URLSearchParams for the fetch request
                const urlParams = new URLSearchParams({ q: query });
                const response = await fetch(
                    `/api/search/autocomplete?${urlParams.toString()}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                        },
                    },
                );

                if (!response.ok) {
                    throw new Error(
                        `HTTP error status received: ${response.status}`,
                    );
                }

                // Explicitly map the typed JSON data stream output
                const data: Product[] = await response.json();
                setResults(data);
                setIsOpen(true);
            } catch (error) {
                console.error('Hybrid search fetch request failed:', error);
            } finally {
                setLoading(false);
            }
        }, 300); // 300ms pause fallback window

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setQuery(e.target.value);
    };

    return (
        <div
            ref={dropdownRef}
            className="relative mx-auto w-full max-w-xl font-sans text-white"
        >
            {/* Input Box Wrapper */}
            <div className="relative flex items-center">
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onFocus={() => query.trim() && setIsOpen(true)}
                    placeholder="Search products semantically (e.g., 'warm clothing for rain')..."
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-900 py-2.5 pr-10 pl-4 text-sm text-white placeholder-neutral-500 shadow-sm transition focus:border-transparent focus:ring-2 focus:ring-lime-400 focus:outline-none"
                />

                {/* Status Indicator */}
                <div className="absolute right-3 flex items-center">
                    {loading ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-lime-400 border-t-transparent"></div>
                    ) : (
                        <span className="text-sm text-neutral-500">🔍</span>
                    )}
                </div>
            </div>

            {/* Absolute Dropdown Panel */}
            {isOpen && results.length > 0 && (
                <div className="absolute top-full left-0 z-50 mt-2 max-h-96 w-full overflow-hidden overflow-y-auto rounded-xl border border-neutral-800 bg-neutral-900 shadow-2xl">
                    <div className="border-b border-neutral-800 bg-neutral-950 px-4 py-2 text-xs font-semibold tracking-wider text-neutral-500">
                        🤖 AI Hybrid Search Results
                    </div>

                    <div className="divide-y divide-neutral-800">
                        {results.map((product) => (
                            <a
                                key={product.id}
                                href={`/products/${product.slug || product.id}`}
                                className="group block flex items-center gap-4 p-3 transition-colors hover:bg-neutral-800"
                            >
                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-neutral-700 bg-neutral-800">
                                    {product.image_url ? (
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-xs text-neutral-500">
                                            📦
                                        </span>
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <h4 className="truncate text-sm font-semibold text-white transition-colors group-hover:text-lime-400">
                                        {product.name}
                                    </h4>
                                    <p className="mt-0.5 truncate text-xs text-neutral-500">
                                        {product.description}
                                    </p>
                                </div>

                                <div className="flex-shrink-0 text-right">
                                    <span className="text-sm font-bold text-white">
                                        ${Number(product.price).toFixed(2)}
                                    </span>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* Zero State Alert */}
            {isOpen && query.trim() && results.length === 0 && !loading && (
                <div className="absolute top-full left-0 z-50 mt-2 w-full rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-center text-sm text-neutral-500 shadow-2xl">
                    No items found matching your description. Try an alternative
                    query keyword!
                </div>
            )}
        </div>
    );
}
