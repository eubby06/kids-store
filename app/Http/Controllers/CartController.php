<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\CartService;
use App\Models\Coupon;

class CartController extends Controller
{
    private $cartService;

    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
    }

    public function removeCoupon(Request $request, CartService $cartService)
    {
        $cartService->removeCoupon();

        return back();
    }

    public function applyCoupon(Request $request, CartService $cartService)
    {
        $request->validate(['code' => 'required|string']);
        
        $coupon = Coupon::where('code', $request->code)->first();

        if (!$coupon || !$coupon->isValid()) {
            return back()->withErrors(['code' => 'Invalid or expired promo code.']);
        }

        $cartService->applyCoupon($coupon);

        return back();
    }

    public function index(Request $request)
    {
        return inertia('Frontend/Pages/Cart', [
            'status' => session('status')
        ]);
    }

    public function items(Request $request)
    {
        $productId = $request->get('product_id');
        $price = $request->get('price');
        $quantity = $request->get('quantity');

        $this->cartService->addItem($productId, $quantity, $price);

        return back();
    }

    public function update(Request $request)
    {
        $productId = $request->get('id');
        $variantId = $request->get('variant_id');
        $delta = $request->get('delta');
        
        $this->cartService->updateQuantity($productId, $delta, $variantId);

        return back();
    }

    public function remove(Request $request)
    {
        $productId = $request->get('id');
        $variantId = $request->get('variant_id');
        
        $this->cartService->removeItem($productId, $variantId);

        return back();
    }
}
