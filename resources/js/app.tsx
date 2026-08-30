import React from 'react';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import { CartProvider } from './pages/Frontend/Pages/CartContext';
import { Toaster } from 'react-hot-toast';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    progress: {
        color: '#4B5563',
    },
    setup({ el, App, props }) {
        // --- 1. SSR SERVER-SIDE SAFETY GUARD ---
        // If executing on the Laravel server background process, stop here
        if (typeof window === 'undefined') {
            return;
        }

        // --- 2. SAFE BROWSER DOM EXECUTION ---
        // These calls are now guaranteed to run only inside a real browser engine
        const container =
            el instanceof window.Element ? el : document.getElementById('app');

        if (!container) {
            console.error(
                'Inertia mount element not found. Expected `el` or an element with id="app"',
            );
            return;
        }

        const app = (
            <CartProvider>
                <App {...props} />
                <Toaster position="top-right" />
            </CartProvider>
        );

        // --- 3. HYDRATE ONLY WHEN SERVER-RENDERED MARKUP EXISTS ---
        // SSR is not always running (e.g. no built SSR bundle), so the container
        // may be empty; hydrating an empty container causes a hydration mismatch.
        if (container.hasChildNodes()) {
            hydrateRoot(container, app);
        } else {
            createRoot(container).render(app);
        }

        initializeTheme();
    },
});
