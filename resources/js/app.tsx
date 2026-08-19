import React from 'react';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { CartProvider } from './pages/Frontend/Pages/CartContext';
import { Toaster } from 'react-hot-toast';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    progress: {
        color: '#4B5563',
    },
    setup({ el, App, props }) {
        const container =
            el instanceof Element ? el : document.getElementById('app');

        if (!container) {
            // Provide a helpful message instead of crashing silently
            console.error(
                'Inertia mount element not found. Expected `el` or an element with id="app"',
            );
            return;
        }

        const root = createRoot(container);
        root.render(
            <CartProvider>
                <App {...props} />
                <Toaster position="top-right" />
            </CartProvider>,
        );
    },
});
