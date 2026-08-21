# Pebble & Pine AI Project Guide

## Overview

This project is a Laravel + Inertia + React storefront application for a small ecommerce shop. The frontend is built with React and TypeScript while the backend is Laravel.

## Tech Stack

- Backend: Laravel PHP
- Frontend: React + TypeScript + Vite
- Routing: Inertia.js
- Styling: Tailwind CSS
- Testing: Pest PHP
- Package manager: pnpm (workspace config exists) and npm for frontend dependencies

## Main Project Structure

- `app/` — Laravel app logic, models, controllers, middleware
- `bootstrap/` — Laravel bootstrap files
- `config/` — Laravel configuration files
- `database/` — migrations, factories, seeders
- `public/` — public assets and built frontend output
- `resources/js/` — React + Inertia frontend code
- `resources/css/` — CSS entry styles
- `resources/views/` — Blade view templates
- `routes/` — Laravel routes
- `tests/` — Pest test suite

## Frontend Entry Points

- `resources/js/app.tsx` — app bootstrap for Inertia
- `resources/js/pages/` — Inertia page components
- `resources/js/pages/Frontend/` — storefront/customer-facing pages and components
- `resources/js/pages/Admin/` — admin dashboard or management pages
- `resources/js/components/` — reusable UI components
- `resources/js/types/` — shared TypeScript types

## Inertia Page Structure

- `resources/js/pages/Frontend/Pages/` — app pages such as storefront home, products, product details, cart, auth, and policy pages
- `resources/js/pages/Admin/` — admin pages such as login, dashboard, and management screens
- When creating a new page, match the correct section: `Frontend` for customer-facing pages, `Admin` for staff/admin pages
- Keep shared UI in `resources/js/components`, and page-specific logic/layout in the matching `Pages` folder

## Core App Behavior

- Product browsing and filtering is handled by frontend pages and Inertia routes.
- Cart state is managed in `resources/js/pages/Frontend/Pages/CartContext.tsx` via React context.
- Global layout shell is provided by `Wrapper.tsx` and includes navigation and footer.
- `Navigation.tsx` contains search and cart badge behavior.

## Important Rules for AI/Developers

- Keep context providers at the app root when the app uses shared state.
- The cart provider should wrap the entire Inertia app to keep `useCart()` available across pages.
- Avoid rendering components that call `useCart()` outside the provider tree.
- When working on SSR/hydration issues, avoid reading browser-only globals during server render.
- If adding new frontend pages, keep them aligned with the existing Inertia page structure under `resources/js/pages/...`.

## Setup

From the project root:

```bash
composer install
npm install
```

Run the app:

```bash
php artisan serve
npm run dev
```

## Build / Verification

```bash
npm run build
npm run types:check
php artisan test
```

## Notes

- `vite.config.ts` is the frontend bundler config.
- `routes/web.php` is where Laravel routes are declared for page rendering.
- Existing pages use a mix of Blade + Inertia; follow the current naming and folder conventions when creating new pages.

## Suggested Conventions

- Use `Wrapper` for storefront shell pages.
- Use page components in `resources/js/pages/Frontend/Pages` for route-level UI.
- Reuse shared UI in `resources/js/components`.
- Keep the cart logic centralized in `CartContext.tsx` instead of duplicating local state across pages.

## Quick Troubleshooting

- If `useCart` throws, confirm the component is inside the `CartProvider` tree.
- If a page shows a hydration mismatch, avoid server/client differences such as `Date.now()`, `Math.random()`, or `window` access during render.
- If a new page is missing from routes, add it to the Laravel route file and ensure the Inertia page component exists at the matching path.
