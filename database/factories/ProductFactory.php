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
        $name = $this->faker->unique()->words(3, true);

        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'category' => $this->faker->randomElement(['Audio', 'Tech', 'Office', 'Travel']),
            
            // Generates prices between $20.00 (2000 cents) and $350.00 (35000 cents)
            'price' => $this->faker->numberBetween(2000, 35000), 
            
            'description' => $this->faker->paragraph(3),
            
            // Pulls realistic, clean images from Unsplash placeholder source
            'image' => $this->faker->randomElement([
                'https://picsum.photos/200/300'
            ]),
            
            'stock' => $this->faker->numberBetween(5, 50),
            'is_featured' => $this->faker->boolean(40), // 40% chance of being featured
        ];
    }
}
