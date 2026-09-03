<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Product;
use App\Services\VectorStoreService;

class SyncProductEmbeddings extends Command
{
    protected $signature = 'products:embed-sync';
    protected $description = 'Generate OpenAI vector embeddings for all existing products';

    public function handle(VectorStoreService $vectorService)
    {
        $products = Product::all();
        $this->info("Found {$products->count()} products to embed...");

        $bar = $this->output->createProgressBar($products->count());
        $bar->start();

        foreach ($products as $product) {
            try {
                $vectorService->embedProduct($product);
            } catch (\Exception $e) {
                $this->error("\nFailed to embed product ID {$product->id}: " . $e->getMessage());
            }
            $bar->advance();
        }

        $bar->finish();
        $this->info("\nAll products successfully embedded into PostgreSQL!");
    }
}
