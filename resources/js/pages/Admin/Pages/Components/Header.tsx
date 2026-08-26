import React from 'react';
import { Link } from '@inertiajs/react';

export default function Header(): React.JSX.Element {
    return (
        <header className="w-full border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Left Side: Logo */}
                    <div className="flex flex-shrink-0 items-center">
                        <Link
                            href="/admin/dashboard"
                            className="flex items-center gap-2"
                        >
                            {/* Replace with your actual SVG or Image */}
                            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-xl font-bold text-transparent">
                                PEEBLE & PINE
                            </span>
                        </Link>
                    </div>

                    {/* Right Side: Logout Action */}
                    <div className="flex items-center">
                        {/* Laravel requires a POST request to log out securely */}
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            type="button"
                            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors duration-200 hover:bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                        >
                            {/* Clean Sign-Out Icon */}
                            <svg
                                className="mr-2 h-4 w-4 text-slate-500 dark:text-slate-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                            </svg>
                            Logout
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
