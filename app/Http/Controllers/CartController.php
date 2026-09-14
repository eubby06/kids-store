<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\CartService;

class CartController extends Controller
{
    private $cartService;

    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
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
