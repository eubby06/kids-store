<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;

class StoreFrontController extends Controller
{
    public function index()
    {
        $categories = Category::all();
        $featuredProducts = Product::where('is_featured', true)->get();

        return inertia('Frontend/Pages/StoreFront', [
            'status' => session('status'),
            'products' => $featuredProducts,
            'categories' => $categories,
        ]);
    }
}
