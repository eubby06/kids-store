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

        return inertia('Frontend/Pages/StoreFront', [
            'status' => session('status'),
            'products' => $products,
            'categories' => $categories,
        ]);
    }
}
