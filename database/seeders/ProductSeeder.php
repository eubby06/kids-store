<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Variant;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Product::factory()
            ->count(8)
            ->create()
            ->each(function (Product $product): void {
                Variant::factory()
                    ->count(fake()->numberBetween(1, 3))
                    ->create(['product_id' => $product->id]);
            });
    }
}
