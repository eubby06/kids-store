<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Response;
use App\Models\Product;

class ProductsController extends Controller
{
    public function products(Request $request): Response
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
        
        return inertia('frontend/pages/products', [
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
