<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductEmbedding;
use OpenAI\Laravel\Facades\OpenAI;

class VectorStoreService
{
    /**
     * Build text chunk and generate embedding vector for a product.
     */
    public function embedProduct(Product $product): void
    {
        // 1. Build a descriptive context text including relations if applicable
        $chunkText = "Product Name: {$product->name}\n" .
                     "Price: \${$product->price}\n" .
                     "Description: {$product->description}\n" .
                     "Stock: {$product->stock_count} units remaining.";

        // 2. Query OpenAI text-embedding-3-small (1536 dimensions)
        $response = OpenAI::embeddings()->create([
            'model' => 'text-embedding-3-small',
            'input' => $chunkText,
        ]);

        $embedding = $response->embeddings[0]->embedding; // Array of floats

        // 3. Upsert into your newly verified PostgreSQL table
        // We convert the PHP float array into a bracketed Postgres string array format
        ProductEmbedding::updateOrCreate(
            ['product_id' => $product->id],
            [
                'chunk_text' => $chunkText,
                'embedding' => '[' . implode(',', $embedding) . ']'
            ]
        );
    }
}
