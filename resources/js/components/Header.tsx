import { Link } from '@inertiajs/react';

export default function Header() {
    return (
        <header className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-lg">
                {/* Background Design Accents */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/40 to-slate-900/90 z-10" />
                <img 
                    src="https://unsplash.com" 
                    alt="Storefront Hero" 
                    className="absolute inset-0 h-full w-full object-cover object-center transform scale-105"
                />

                {/* Content Overlays */}
                <div className="relative z-20 flex max-w-2xl flex-col items-start gap-4 px-6 py-16 sm:py-24 sm:px-12 lg:px-16">
                    <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold tracking-wide text-indigo-300 uppercase">
                        New Season Launch
                    </span>
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                        Refine Your Everyday Setup.
                    </h1>
                    <p className="text-base text-slate-300 max-w-md mt-2">
                        Explore carefully structured workspace assets designed to enhance speed, clarity, and daily comfort.
                    </p>
                    <div className="mt-4">
                        <Link href="/products" className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-100 transition">
                            Browse Collection
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    )
}