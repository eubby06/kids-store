<?php

namespace App\Services;

use App\Models\Coupon;
use Illuminate\Support\Facades\Session;
use App\Models\Product;

class CartService
{
    protected string $sessionKey = 'cart';
    protected string $couponKey = 'applied_coupon';

    /**
     * Get raw cart items from the session.
     */
    public function getItems(): array
    {
        return Session::get($this->sessionKey, []);
    }

    /**
     * Add an item to the cart or increment its quantity.
     */
    public function addItem(int $productId, int $quantity = 1, float $price): void
    {
        $cart = $this->getItems();

        if (isset($cart[$productId])) {
            $cart[$productId]['quantity'] += $quantity;
        } else {
            $cart[$productId] = [
                'id' => $productId,
                'quantity' => $quantity,
                'price' => $price,
            ];
        }

        Session::put($this->sessionKey, $cart);
        $this->validateCouponOnCartChange();
    }

    /**
     * Remove an item completely from the cart using its unique key.
     */
    public function removeItem(int $productId, ?int $variantId = null): void
    {
        $cart = $this->getItems();
        
        // Generate the unique key that matches how the item is stored
        $cartKey = $variantId ? "{$productId}_{$variantId}" : (string)$productId;

        if (isset($cart[$cartKey])) {
            unset($cart[$cartKey]);
            
            Session::put($this->sessionKey, $cart);
            
            // Re-validate coupon in case the remaining total drops below the minimum limit
            $this->validateCouponOnCartChange();
        }
    }

    /**
     * Update an item's quantity by a positive or negative delta value.
     */
    public function updateQuantity(int $productId, int $delta, ?int $variantId = null): void
    {
        $cart = $this->getItems();
        
        // Create a unique array key for tracking simple items or variant combinations
        $cartKey = $variantId ? "{$productId}_{$variantId}" : (string)$productId;

        if (isset($cart[$cartKey])) {
            // Apply the delta change (e.g. +1 or -1)
            $cart[$cartKey]['quantity'] += $delta;

            // If the quantity drops to zero or below, remove it entirely from the cart
            if ($cart[$cartKey]['quantity'] <= 0) {
                unset($cart[$cartKey]);
            }

            Session::put($this->sessionKey, $cart);
            $this->validateCouponOnCartChange();
        }
    }

    /**
     * Store the validated coupon array data in the session.
     */
    public function applyCoupon(Coupon $coupon): void
    {
        Session::put($this->couponKey, [
            'id' => $coupon->id,
            'code' => $coupon->code,
            'type' => $coupon->type,
            'value' => $coupon->value,
            'min_order_amount' => $coupon->min_order_amount,
        ]);
    }

    /**
     * Drop the active coupon from the session.
     */
    public function removeCoupon(): void
    {
        Session::forget($this->couponKey);
    }

    /**
     * Get the currently applied coupon array data.
     */
    public function getAppliedCoupon(): ?array
    {
        return Session::get($this->couponKey);
    }

    public function getDetails(): array
    {
        $cartItems = $this->getItems();
        $processedItems = [];
        $subtotal = 0;

        if (!empty($cartItems)) {
            // 1. Extract all product IDs from your session cart array
            $productIds = array_column($cartItems, 'id');

            // 2. Fetch all matching products from the database in one single query
            // Eager load variants if your system uses them (e.g., ->with('variants'))
            $products = Product::with('variants')->whereIn('id', $productIds)->get()->keyBy('id');

            // 3. Loop through your session items and attach fresh database information
            foreach ($cartItems as $key => $item) {
                $product = $products->get($item['id']);

                if (!$product) {
                    // Handle edge case where a product was deleted from admin while in user cart
                    continue;
                }

                // Always use the real database price to prevent tampering
                $currentPrice = (float) $product->price; 
                $itemTotal = $currentPrice * $item['quantity'];
                $subtotal += $itemTotal;
                $variant = $product->variants->first();

                $processedItems[] = [
                    'id' => $item['id'],
                    'variant_id' => $item['variant_id'] ?? null,
                    'quantity' => $item['quantity'],
                    'price' => $currentPrice,
                    'name' => $product->name,
                    'description' => $product->description,
                    'variantImage' => $variant->image, // Direct DB path mapping
                    'sku' => $product->sku,
                    // Add any chosen variant configuration details here if applicable
                ];
            }
        }

        // 4. Calculate dynamic discounts
        $discount = 0;
        $coupon = $this->getAppliedCoupon();

        if ($coupon) {
            if ($coupon['type'] === 'percentage') {
                $discount = $subtotal * ($coupon['value'] / 100);
            } elseif ($coupon['type'] === 'fixed') {
                $discount = $coupon['value'];
            }

            if ($discount > $subtotal) {
                $discount = $subtotal;
            }
        }

        return [
            'items' => $processedItems, // Now fully enriched with images, titles, and accurate prices
            'subtotal' => round($subtotal, 2),
            'discount' => round($discount, 2),
            'total' => round($subtotal - $discount, 2),
            'coupon' => $coupon ? ['code' => $coupon['code']] : null,
        ];
    }

    /**
     * Drop the coupon automatically if items removal drops subtotal below min limit.
     */
    protected function validateCouponOnCartChange(): void
    {
        $coupon = $this->getAppliedCoupon();
        if (!$coupon) {
            return;
        }

        $subtotal = 0;
        foreach ($this->getItems() as $item) {
            $subtotal += $item['price'] * $item['quantity'];
        }

        if ($coupon['min_order_amount'] && $subtotal < $coupon['min_order_amount']) {
            $this->removeCoupon();
        }
    }
}
