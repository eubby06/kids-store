import { Link } from '@inertiajs/react';
import React from 'react';

export default function Footer() {
    return (
        <footer className="mt-12 border-t border-slate-200 bg-white py-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <p className="text-sm text-slate-600">
                        © {new Date().getFullYear()} PEBBLE & PINE. All rights
                        reserved.
                    </p>
                    <nav className="flex gap-4">
                        <Link
                            href="/privacy-policy"
                            className="text-sm text-slate-600 hover:text-indigo-600"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="/refund-policy"
                            className="text-sm text-slate-600 hover:text-indigo-600"
                        >
                            Refund Policy
                        </Link>
                        <Link
                            href="/terms-of-service"
                            className="text-sm text-slate-600 hover:text-indigo-600"
                        >
                            Terms of Service
                        </Link>
                    </nav>
                </div>
            </div>
        </footer>
    );
}
