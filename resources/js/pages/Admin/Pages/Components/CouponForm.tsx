import React from 'react';
import { InertiaFormProps } from '@inertiajs/react';

// 1. Define the exact shape of your form fields
interface CouponFormFields {
    code: string;
    type: 'fixed' | 'percentage';
    value: string;
    min_order_amount: string;
    usage_limit: string;
    starts_at: string;
    expires_at: string;
    is_active: boolean;
}

// 2. Define the structural metadata signature of your Domain Object
interface Coupon {
    id: number;
    code: string;
    type: 'fixed' | 'percentage';
    value: string;
    min_order_amount: string | null;
    usage_limit: number | null;
    used_count: number;
    starts_at: string | null;
    expires_at: string | null;
    is_active: boolean;
}

// 3. Apply type configurations cleanly
interface FormProps {
    data: CouponFormFields;
    // Uses Inertia's unique key-based state updater type mapping
    setData: InertiaFormProps<CouponFormFields>['setData'];
    errors: Partial<Record<keyof CouponFormFields, string>>;
    processing: boolean;
    onSubmit: (e: React.FormEvent) => void;
    editingCoupon: Coupon | null;
    onCancelEdit: () => void;
}

export default function CouponForm({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    editingCoupon,
    onCancelEdit,
}: FormProps) {
    return (
        <div
            className={`h-fit rounded-xl border p-6 shadow-xl shadow-black/40 transition-colors duration-200 ${
                editingCoupon
                    ? 'border-amber-500/50 bg-amber-950/10'
                    : 'border-gray-800 bg-gray-900'
            }`}
        >
            {/* ⚠️ PROMINENT EDIT MODE NOTIFICATION BANNER */}
            {editingCoupon && (
                <div className="mb-4 flex items-center justify-between rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-400">
                    <span className="font-medium">
                        Editing Coupon:{' '}
                        <span className="font-bold text-amber-300 underline">
                            {editingCoupon.code}
                        </span>
                    </span>
                    <button
                        type="button"
                        onClick={onCancelEdit}
                        className="rounded bg-amber-500/20 px-2 py-1 text-xs font-semibold text-amber-300 transition hover:bg-amber-500/30"
                    >
                        Reset Form
                    </button>
                </div>
            )}

            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-200">
                    {editingCoupon
                        ? 'Modify Coupon Properties'
                        : 'Create Coupon'}
                </h2>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300">
                        Coupon Code
                    </label>
                    <input
                        type="text"
                        value={data.code}
                        onChange={(e) =>
                            setData('code', e.target.value.toUpperCase())
                        }
                        className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="SUMMER50"
                    />
                    {errors.code && (
                        <p className="mt-1 text-xs text-red-400">
                            {errors.code}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">
                            Type
                        </label>
                        <select
                            value={data.type}
                            onChange={(
                                e: React.ChangeEvent<HTMLSelectElement>,
                            ) =>
                                setData(
                                    'type',
                                    e.target.value as 'fixed' | 'percentage',
                                )
                            }
                            className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            <option value="fixed">Fixed ($)</option>
                            <option value="percentage">Percentage (%)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">
                            Discount Value
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={data.value}
                            onChange={(e) => setData('value', e.target.value)}
                            className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        {errors.value && (
                            <p className="mt-1 text-xs text-red-400">
                                {errors.value}
                            </p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">
                            Min Order ($)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={data.min_order_amount}
                            onChange={(e) =>
                                setData('min_order_amount', e.target.value)
                            }
                            className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">
                            Usage Limit
                        </label>
                        <input
                            type="number"
                            value={data.usage_limit}
                            onChange={(e) =>
                                setData('usage_limit', e.target.value)
                            }
                            className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">
                            Starts At
                        </label>
                        <input
                            type="datetime-local"
                            value={data.starts_at}
                            onChange={(e) =>
                                setData('starts_at', e.target.value)
                            }
                            className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">
                            Expires At
                        </label>
                        <input
                            type="datetime-local"
                            value={data.expires_at}
                            onChange={(e) =>
                                setData('expires_at', e.target.value)
                            }
                            className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                </div>

                {/* 🚨 DYNAMIC ACTION GROUP BUTTONS */}
                <div className="flex flex-col gap-2 pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className={`w-full justify-center rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 ${
                            editingCoupon
                                ? 'bg-amber-600 hover:bg-amber-500 focus-visible:outline-amber-600'
                                : 'bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600'
                        }`}
                    >
                        {processing
                            ? editingCoupon
                                ? 'Saving Changes...'
                                : 'Creating...'
                            : editingCoupon
                              ? 'Save Changes'
                              : 'Create Coupon'}
                    </button>

                    {editingCoupon && (
                        <button
                            type="button"
                            onClick={onCancelEdit}
                            className="w-full justify-center rounded-lg border border-red-800 bg-red-950/40 px-4 py-2.5 text-sm font-semibold text-red-400 shadow-sm transition duration-150 hover:bg-red-900/60 hover:text-red-300"
                        >
                            Cancel Editing
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
