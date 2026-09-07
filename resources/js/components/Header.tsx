import { Link } from '@inertiajs/react';

export default function Header() {
    return (
        <header className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl bg-black text-white shadow-lg">
                {/* Background Design Accents */}
                <div className="absolute inset-0 z-10 bg-linear-to-r from-black/90 to-black/40" />
                <img
                    src="https://unsplash.com"
                    alt="Storefront Hero"
                    className="absolute inset-0 h-full w-full scale-105 transform object-cover object-center grayscale"
                />

                {/* Content Overlays */}
                <div className="relative z-20 flex max-w-2xl flex-col items-start gap-4 px-6 py-16 sm:px-12 sm:py-24 lg:px-16">
                    <span className="rounded-full bg-lime-400/20 px-3 py-1 text-xs font-semibold tracking-wide text-lime-300 uppercase">
                        Hand-Finished Batch #04
                    </span>
                    <h1 className="text-4xl font-black tracking-tight uppercase sm:text-5xl lg:text-6xl">
                        Faded. Distressed.
                        <br />
                        Unapologetic.{' '}
                        <span className="text-neutral-500">Neutral-600</span>
                    </h1>
                    <p className="mt-2 max-w-md text-base text-neutral-300">
                        Explore carefully structured workspace assets designed
                        to enhance speed, clarity, and daily comfort.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                        <Link
                            href="/products"
                            className="inline-flex items-center justify-center rounded-xl bg-lime-400 px-5 py-3 text-sm font-bold text-black uppercase shadow-sm transition hover:bg-lime-300"
                        >
                            Shop Latest Drop
                        </Link>
                        <Link
                            href="/products"
                            className="inline-flex items-center justify-center rounded-xl border border-white/30 px-5 py-3 text-sm font-bold text-white uppercase transition hover:bg-white/10"
                        >
                            Explore Craft
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
