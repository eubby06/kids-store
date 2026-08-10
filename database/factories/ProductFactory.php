<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $words = [fake()->word(), fake()->word(), fake()->word()];
        $name = ucwords($words[0] . ' ' . $words[1] . ' ' . $words[2]);

        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'category_id' => fake()->numberBetween(1, 4),

            // Generates prices between $20.00 (2000 cents) and $350.00 (35000 cents)
            'price' => fake()->numberBetween(2000, 35000),

            'description' => fake()->text(120),
            'is_featured' => fake()->boolean(40), // 40% chance of being featured
            'is_new_arrival' => fake()->boolean(25),
            'is_exclusive' => fake()->boolean(15),
        ];
    }
}