import { Link } from '@inertiajs/react';
import React from 'react';

export default function Footer() {
    return (
        <footer className="mt-12 border-t border-neutral-800 bg-neutral-950 py-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <p className="text-sm text-neutral-500">
                        © {new Date().getFullYear()} PEBBLE & PINE. All rights
                        reserved.
                    </p>
                    <nav className="flex gap-4">
                        <Link
                            href="/privacy-policy"
                            className="text-sm text-neutral-500 hover:text-lime-400"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="/refund-policy"
                            className="text-sm text-neutral-500 hover:text-lime-400"
                        >
                            Refund Policy
                        </Link>
                        <Link
                            href="/terms-of-service"
                            className="text-sm text-neutral-500 hover:text-lime-400"
                        >
                            Terms of Service
                        </Link>
                    </nav>
                </div>
            </div>
        </footer>
    );
}
