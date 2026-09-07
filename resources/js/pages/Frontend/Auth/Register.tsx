import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/register', {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 sm:px-6 lg:px-8">
            <Head title="Create Account" />

            <div className="w-full max-w-md space-y-8 rounded-2xl border border-neutral-800 bg-neutral-900 p-8 shadow-sm">
                {/* Header */}
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold tracking-tight text-white uppercase">
                        Create an account
                    </h2>
                    <p className="mt-2 text-sm text-neutral-400">
                        Already have an account?{' '}
                        <Link
                            href="/login"
                            className="font-medium text-lime-400 transition hover:text-lime-300"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-neutral-300"
                        >
                            Full Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className={`mt-1 block w-full rounded-lg border bg-neutral-800 px-3 py-2 text-white placeholder-neutral-500 transition focus:ring-2 focus:outline-none sm:text-sm ${
                                errors.name
                                    ? 'border-red-400 focus:ring-red-500/20'
                                    : 'border-neutral-700 focus:ring-lime-400/30'
                            }`}
                            placeholder="John Doe"
                            required
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-red-400">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-neutral-300"
                        >
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className={`mt-1 block w-full rounded-lg border bg-neutral-800 px-3 py-2 text-white placeholder-neutral-500 transition focus:ring-2 focus:outline-none sm:text-sm ${
                                errors.email
                                    ? 'border-red-400 focus:ring-red-500/20'
                                    : 'border-neutral-700 focus:ring-lime-400/30'
                            }`}
                            placeholder="you@example.com"
                            required
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-400">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-neutral-300"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className={`mt-1 block w-full rounded-lg border bg-neutral-800 px-3 py-2 text-white placeholder-neutral-500 transition focus:ring-2 focus:outline-none sm:text-sm ${
                                errors.password
                                    ? 'border-red-400 focus:ring-red-500/20'
                                    : 'border-neutral-700 focus:ring-lime-400/30'
                            }`}
                            placeholder="••••••••"
                            required
                        />
                        {errors.password && (
                            <p className="mt-1 text-xs text-red-400">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="password_confirmation"
                            className="block text-sm font-medium text-neutral-300"
                        >
                            Confirm Password
                        </label>
                        <input
                            id="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            className={`mt-1 block w-full rounded-lg border bg-neutral-800 px-3 py-2 text-white placeholder-neutral-500 transition focus:ring-2 focus:outline-none sm:text-sm ${
                                errors.password_confirmation
                                    ? 'border-red-400 focus:ring-red-500/20'
                                    : 'border-neutral-700 focus:ring-lime-400/30'
                            }`}
                            placeholder="••••••••"
                            required
                        />
                        {errors.password_confirmation && (
                            <p className="mt-1 text-xs text-red-400">
                                {errors.password_confirmation}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full rounded-lg bg-lime-400 px-4 py-2.5 text-sm font-bold text-black uppercase shadow-sm transition hover:bg-lime-300 disabled:opacity-50"
                    >
                        {processing ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>
            </div>
        </div>
    );
}
