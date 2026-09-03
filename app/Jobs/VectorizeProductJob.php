<?php

namespace App\Jobs;

use App\Models\Product;
use App\Services\VectorStoreService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class VectorizeProductJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Delete the job if the model no longer exists.
     */
    public $deleteWhenMissingModels = true;

    /**
     * Create a new job instance.
     */
    public function __construct(protected Product $product) {}

    /**
     * Execute the job.
     */
    public function handle(VectorStoreService $vectorService): void
    {
        // Re-use your verified embedding generation service logic
        $vectorService->embedProduct($this->product);
    }
}
