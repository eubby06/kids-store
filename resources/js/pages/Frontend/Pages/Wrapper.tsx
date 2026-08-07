import { useState } from 'react';
import Navigation from '@/components/Navigation';
import { router } from '@inertiajs/react';

export default function Wrapper({ children }: { children: React.ReactNode }) {
    const [searchTerm, setSearchTerm] = useState<string>('');

    const handleSearchSubmit = (query: string): void => {
        // Implement search functionality here
        console.log('Search query:', query);

        router.get('/products', { search: query }, { preserveState: true });
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <Navigation onSearch={handleSearchSubmit} placeholder="Search products..." />
            {children}
        </div>
    );
}