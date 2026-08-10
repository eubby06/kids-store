<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Variant;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Variant>
 */
class VariantFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     */
    protected $model = Variant::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'sku' => 'SKU-' . Str::upper(Str::random(6)),
            'color' => fake()->randomElement(['Red', 'Blue', 'Black', 'White', 'Green']),
            'size' => fake()->randomElement(['S', 'M', 'L', 'XL']),
            'stock_count' => fake()->numberBetween(0, 100),
            'price_override' => fake()->optional()->randomFloat(2, 1000, 25000),
            'is_on_sale' => fake()->boolean(30),
        ];
    }
}
