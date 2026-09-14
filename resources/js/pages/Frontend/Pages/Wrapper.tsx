import { useState, lazy } from 'react';
import Navigation from '@/components/Navigation';
import { router } from '@inertiajs/react';
import AiChatBot from '@/components/AiChatBot';
import { CartProvider } from './CartContext';

const Footer = lazy(() => import('@/components/Footer'));

export default function Wrapper({ children }: { children: React.ReactNode }) {
    const [searchTerm, setSearchTerm] = useState<string>('');

    const handleSearchSubmit = (query: string): void => {
        // Implement search functionality here
        console.log('Search query:', query);

        router.get('/products', { search: query }, { preserveState: true });
    };

    return (
        <CartProvider>
            <div className="min-h-screen bg-neutral-950 font-sans text-white">
                {/* Announcement Bar */}
                <div className="bg-lime-400 py-2 text-center text-xs font-bold tracking-wider text-black uppercase">
                    Free shipping on domestic orders over $75 — Drop #04 live
                    now
                </div>
                {/* Navigation */}
                <Navigation
                    onSearch={handleSearchSubmit}
                    placeholder="Search products..."
                />
                {children}
                <AiChatBot />
                <div className="mt-8">
                    <Footer />
                </div>
            </div>
        </CartProvider>
    );
}
