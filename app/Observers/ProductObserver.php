<?php

namespace App\Observers;

use App\Models\Product;
use App\Jobs\VectorizeProductJob;
use App\Models\ProductEmbedding;

class ProductObserver
{
    /**
     * Handle the Product "saved" event (Triggers on both Create and Update).
     */
    public function saved(Product $product): void
    {
        // Dispatch the job to run safely in the background
        VectorizeProductJob::dispatch($product);
    }

    /**
     * Handle the Product "deleted" event.
     */
    public function deleted(Product $product): void
    {
        // Automatically clean up stale vector references if a product is removed
        ProductEmbedding::where('product_id', $product->id)->delete();
    }
}
