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
            className="relative mx-auto w-full max-w-xl font-sans text-gray-800"
        >
            {/* Input Box Wrapper */}
            <div className="relative flex items-center">
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onFocus={() => query.trim() && setIsOpen(true)}
                    placeholder="Search products semantically (e.g., 'warm clothing for rain')..."
                    className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pr-10 pl-4 text-sm shadow-sm transition focus:border-transparent focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />

                {/* Status Indicator */}
                <div className="absolute right-3 flex items-center">
                    {loading ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"></div>
                    ) : (
                        <span className="text-sm text-gray-400">🔍</span>
                    )}
                </div>
            </div>

            {/* Absolute Dropdown Panel */}
            {isOpen && results.length > 0 && (
                <div className="absolute top-full left-0 z-50 mt-2 max-h-96 w-full overflow-hidden overflow-y-auto rounded-xl border border-gray-100 bg-white shadow-2xl">
                    <div className="border-b border-gray-100 bg-gray-50 px-4 py-2 text-xs font-semibold tracking-wider text-gray-400">
                        🤖 AI Hybrid Search Results
                    </div>

                    <div className="divide-y divide-gray-100">
                        {results.map((product) => (
                            <a
                                key={product.id}
                                href={`/products/${product.slug || product.id}`}
                                className="group block flex items-center gap-4 p-3 transition-colors hover:bg-indigo-50/50"
                            >
                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                                    {product.image_url ? (
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-xs text-gray-400">
                                            📦
                                        </span>
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <h4 className="truncate text-sm font-semibold text-gray-900 transition-colors group-hover:text-indigo-600">
                                        {product.name}
                                    </h4>
                                    <p className="mt-0.5 truncate text-xs text-gray-500">
                                        {product.description}
                                    </p>
                                </div>

                                <div className="flex-shrink-0 text-right">
                                    <span className="text-sm font-bold text-gray-900">
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
                <div className="absolute top-full left-0 z-50 mt-2 w-full rounded-xl border border-gray-100 bg-white p-4 text-center text-sm text-gray-500 shadow-2xl">
                    No items found matching your description. Try an alternative
                    query keyword!
                </div>
            )}
        </div>
    );
}
