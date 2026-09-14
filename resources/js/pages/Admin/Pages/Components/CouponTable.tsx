import React from 'react';

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

interface TableProps {
    coupons: Coupon[];
    editingCoupon: Coupon | null;
    onEdit: (coupon: Coupon) => void;
    onDelete: (id: number) => void;
    onToggleActive: (id: number) => void;
}

export default function CouponTable({
    coupons,
    editingCoupon,
    onEdit,
    onDelete,
    onToggleActive,
}: TableProps) {
    return (
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-xl shadow-black/40 lg:col-span-2">
            <h2 className="mb-4 text-lg font-medium text-gray-200">
                Active Coupons ({coupons.length})
            </h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-800">
                    <thead>
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider text-gray-400 uppercase">
                                Code
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider text-gray-400 uppercase">
                                Discount
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider text-gray-400 uppercase">
                                Usage
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider text-gray-400 uppercase">
                                Status
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-semibold tracking-wider text-gray-400 uppercase">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 bg-transparent">
                        {coupons.map((coupon) => (
                            <tr
                                key={coupon.id}
                                className={
                                    editingCoupon?.id === coupon.id
                                        ? 'bg-indigo-950/20'
                                        : ''
                                }
                            >
                                <td className="px-4 py-4 text-sm font-medium whitespace-nowrap text-white">
                                    {coupon.code}
                                </td>
                                <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-300">
                                    {coupon.type === 'fixed'
                                        ? `$${coupon.value}`
                                        : `${coupon.value}%`}
                                </td>
                                <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-400">
                                    {coupon.used_count} /{' '}
                                    {coupon.usage_limit ?? '∞'}
                                </td>
                                <td className="px-4 py-4 text-sm whitespace-nowrap">
                                    <button
                                        onClick={() =>
                                            onToggleActive(coupon.id)
                                        }
                                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs leading-5 font-semibold ${
                                            coupon.is_active
                                                ? 'border border-green-800 bg-green-950 text-green-400'
                                                : 'border border-red-800 bg-red-950 text-red-400'
                                        }`}
                                    >
                                        {coupon.is_active
                                            ? 'Active'
                                            : 'Inactive'}
                                    </button>
                                </td>
                                <td className="space-x-3 px-4 py-4 text-right text-sm font-medium whitespace-nowrap">
                                    <button
                                        onClick={() => onEdit(coupon)}
                                        className="text-indigo-400 transition-colors hover:text-indigo-300"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => onDelete(coupon.id)}
                                        className="text-red-400 transition-colors hover:text-red-300"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {coupons.length === 0 && (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-4 py-8 text-center text-sm text-gray-500"
                                >
                                    No coupons found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
