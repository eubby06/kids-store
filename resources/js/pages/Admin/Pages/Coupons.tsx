import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { toast } from 'react-hot-toast';
import Layout from './Layout';
import CouponForm from './Components/CouponForm';
import CouponTable from './Components/CouponTable';

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

interface Props {
    coupons: Coupon[];
}

export default function Index({ coupons }: Props) {
    // Orchestrated state for structural mode tracking
    const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

    // Setup centralized form management context loop
    const { data, setData, post, put, processing, errors, reset } = useForm({
        code: '',
        type: 'fixed' as 'fixed' | 'percentage',
        value: '',
        min_order_amount: '',
        usage_limit: '',
        starts_at: '',
        expires_at: '',
        is_active: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingCoupon) {
            put(`/admin/coupons/${editingCoupon.id}`, {
                onSuccess: () => {
                    toast.success('Coupon updated successfully!');
                    handleCancelEdit();
                },
            });
        } else {
            post('/admin/coupons', {
                onSuccess: () => {
                    toast.success('Coupon created successfully!');
                    reset();
                },
            });
        }
    };

    const handleEditClick = (coupon: Coupon) => {
        setEditingCoupon(coupon);

        // Formats timestamps cleanly into native HTML5 elements (YYYY-MM-DDTHH:MM)
        const formatDateTime = (dateStr: string | null) => {
            if (!dateStr) return '';
            return dateStr.substring(0, 16);
        };

        setData({
            code: coupon.code,
            type: coupon.type,
            value: coupon.value,
            min_order_amount: coupon.min_order_amount ?? '',
            usage_limit: coupon.usage_limit?.toString() ?? '',
            starts_at: formatDateTime(coupon.starts_at),
            expires_at: formatDateTime(coupon.expires_at),
            is_active: coupon.is_active,
        });
    };

    const handleCancelEdit = () => {
        setEditingCoupon(null);
        reset();
    };

    const handleToggleActive = (id: number) => {
        router.patch(
            `/admin/coupons/${id}/toggle`,
            {},
            { preserveScroll: true },
        );
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this coupon?')) {
            router.delete(`/admin/coupons/${id}`, {
                onSuccess: () => toast.success('Coupon removed'),
            });
        }
    };

    return (
        <Layout title="Coupons">
            <div className="mx-auto min-h-screen max-w-7xl space-y-6 bg-gray-950 p-6 text-gray-100">
                <h1 className="text-2xl font-bold text-white">
                    Manage Checkout Coupons
                </h1>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Render separate input controller panel */}
                    <CouponForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        onSubmit={handleSubmit}
                        editingCoupon={editingCoupon}
                        onCancelEdit={handleCancelEdit}
                    />

                    {/* Render separate tabular inventory element grid */}
                    <CouponTable
                        coupons={coupons}
                        editingCoupon={editingCoupon}
                        onEdit={handleEditClick}
                        onDelete={handleDelete}
                        onToggleActive={handleToggleActive}
                    />
                </div>
            </div>
        </Layout>
    );
}
