<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Response;
use App\Models\Product;

class ProductsController extends Controller
{
    public function getId($productId, Request $request): Response
    {
        $product = Product::with('variants')->find($productId);

        if (!$product) {
            return inertia('Frontend/Pages/ProductNotFound', [
                'status' => 'Product not found',
            ]);
        }

        return inertia('Frontend/Pages/ProductDetails', [
            'status' => session('status'),
            'product' => $product,
            'variants' => $product->variants,
            'images' => []
        ]);
    }

    public function getAll(Request $request): Response
    {
        $searchQuery = $request->input('search');
        $isExclusive = $request->input('is_exclusive');
        $isNewArrival = $request->input('is_new_arrival');

        if ($searchQuery) {
            $products = Product::query()
                ->when($searchQuery, function ($query, $search) {
                    // $search automatically contains the value of $searchQuery
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                })
                ->latest()
                ->get();
        } elseif ($isExclusive) {
            $products = Product::where('is_exclusive', true)->get();
        } elseif ($isNewArrival) {
            $products = Product::where('is_new_arrival', true)->get();
        } else {
            $products = Product::all();
        }
        
        return inertia('Frontend/Pages/Products', [
            'status' => session('status'),
            'products' => $products,
            'filters' => [
                'search' => $searchQuery ?? null,
                'is_exclusive' => $isExclusive ?? null,
                'is_new_arrival' => $isNewArrival ?? null,
            ]
        ]);
    }
}
