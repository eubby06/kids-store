<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use DB;

class AdminCategoriesController extends Controller
{
    public function getAll()
    {
        $categories = Category::leftJoin('products', 'categories.id', '=', 'products.category_id')
            ->select('categories.*', DB::raw('count(products.id) as products_count'))
            ->groupBy('categories.id')
            ->get( );

        return inertia('Admin/Pages/Categories', [
            'status' => session('status'),
            'categories' => $categories
        ]);
    }

    public function create()
    {
        $category = new Category();
        
        return inertia('Admin/Pages/CategoryCreate', [
            'status' => session('status'),
            'category' => $category,
            'isUpdating' => false
        ]);
    }

    public function store()
    {
        $data = request()->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'slug' => 'required|string|max:255|unique:categories,slug'
        ]);

        Category::create($data);

        return redirect()->route('admin.categories')->with('status', 'Category created successfully!');
    }

    public function edit($id)
    {
        $category = Category::findOrFail($id);

        return inertia('Admin/Pages/CategoryCreate', [
            'status' => session('status'),
            'category' => $category,
            'isUpdating' => true
        ]);
    }

    public function update($id)
    {
        $category = Category::findOrFail($id);

        $data = request()->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'slug' => 'required|string|max:255|unique:categories,slug,' . $category->id
        ]);

        $category->update($data);

        return redirect()->route('admin.categories')->with('status', 'Category updated successfully!');
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return redirect()->route('admin.categories')->with('status', 'Category deleted successfully!');
    }
}
