<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;

class StoreFrontController extends Controller
{
    public function index()
    {
        $products = Product::where('is_featured', true)->get();
        $categories = Category::all();

        return inertia('frontend/pages/storefront', [
            'status' => session('status'),
            'products' => $products,
            'categories' => $categories,
        ]);
    }
}
