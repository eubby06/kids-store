<?php

namespace Tests\Feature;

use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_route_returns_products_payload()
    {
        Product::factory()->create(['name' => 'Sample Product']);

        $response = $this->get(route('home'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('frontend/pages/products')
            ->has('products', 1)
        );
    }
}
