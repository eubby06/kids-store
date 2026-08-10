<?php

use App\Models\Variant;

describe('Variant factory', function () {
    it('creates a valid variant instance', function () {
        $variant = Variant::factory()->make();

        expect($variant)->toBeInstanceOf(Variant::class)
            ->and($variant->sku)->toBeString()
            ->and($variant->product_id)->toBeInt()
            ->and($variant->stock_count)->toBeInt();
    });
});
