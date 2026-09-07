import { Head, useForm, Link } from '@inertiajs/react';

export default function Welcome() {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 sm:px-6 lg:px-8">
            <Head title="Sign In" />

            <div className="w-full max-w-md space-y-8 rounded-2xl border border-neutral-800 bg-neutral-900 p-8 shadow-sm">
                {/* Header */}
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold tracking-tight text-white uppercase">
                        Welcome back
                    </h2>
                    <p className="mt-2 text-sm text-neutral-400">
                        Don't have an account?{' '}
                        <Link
                            href="/register"
                            className="font-medium text-lime-400 transition hover:text-lime-300"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>

                {/* Session Status Flash Message */}
                {status && (
                    <div className="rounded-lg bg-lime-400/10 p-4 text-sm font-medium text-lime-400">
                        {status}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={submit} className="space-y-5">
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
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-neutral-300"
                            >
                                Password
                            </label>
                            <Link
                                href="/forgot-password"
                                className="text-xs font-medium text-lime-400 transition hover:text-lime-300"
                            >
                                Forgot password?
                            </Link>
                        </div>
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

                    <div className="flex items-center">
                        <input
                            id="remember"
                            type="checkbox"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                            className="h-4 w-4 rounded border-neutral-700 bg-neutral-800 text-lime-400 focus:ring-lime-400"
                        />
                        <label
                            htmlFor="remember"
                            className="ml-2 block text-sm text-neutral-400 select-none"
                        >
                            Remember me
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full rounded-lg bg-lime-400 px-4 py-2.5 text-sm font-bold text-black uppercase shadow-sm transition hover:bg-lime-300 disabled:opacity-50"
                    >
                        {processing ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
}
