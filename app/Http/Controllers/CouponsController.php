<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\CartService;
use App\Models\Coupon;

class CouponsController extends Controller
{
    public function apply(Request $request, CartService $cartService)
    {
        $request->validate(['code' => 'required|string']);
        
        $coupon = Coupon::where('code', $request->code)->first();

        if (!$coupon || !$coupon->isValid()) {
            return back()->withErrors(['code' => 'Invalid or expired promo code.']);
        }

        $cartService->applyCoupon($coupon);

        return back();
    }
}
