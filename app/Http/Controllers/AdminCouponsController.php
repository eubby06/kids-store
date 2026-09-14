<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Coupon;

class AdminCouponsController extends Controller
{
    /**
     * Display a listing of the coupons.
     */
    public function index()
    {
        return inertia('Admin/Pages/Coupons', [
            'coupons' => Coupon::orderBy('created_at', 'desc')->get()
        ]);
    }

    /**
     * Store a newly created coupon in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:coupons,code|max:50',
            'type' => 'required|in:fixed,percentage',
            'value' => 'required|numeric|min:0.01',
            'min_order_amount' => 'nullable|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
            'starts_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after_or_equal:starts_at',
            'is_active' => 'required|boolean',
        ]);

        Coupon::create($validated);

        return back()->with('success', 'Coupon created successfully!');
    }

    /**
     * Update the active state toggle quickly.
     */
    public function toggleActive(Coupon $coupon)
    {
        $coupon->update(['is_active' => !$coupon->is_active]);
        return back();
    }

    /**
     * Remove the specified coupon from storage.
     */
    public function destroy(Coupon $coupon)
    {
        $coupon->delete();
        return back()->with('success', 'Coupon deleted successfully!');
    }
}