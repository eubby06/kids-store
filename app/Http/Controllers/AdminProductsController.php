<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Variant;
use App\Models\Category;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use DB;

class AdminProductsController extends Controller
{
    public function getAll()
    {
        $products = Product::leftJoin('categories', 'products.category_id', '=', 'categories.id')
            ->leftJoin('variants', 'products.id', '=', 'variants.product_id')
            ->select('products.*', 'categories.name as category', DB::raw('count(variants.id) as stock'))
            ->groupBy('products.id', 'categories.name')
            ->get();
            
        return inertia('Admin/Pages/Products', [
            'status' => session('status'),
            'products' => $products
        ]);
    }

    public function create()
    {
        $categories = Category::all();

        return inertia('Admin/Pages/ProductCreate', [
            'status' => session('status'),
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string|max:1000',
            'price' => 'required|numeric|min:0',
            'status' => 'required|in:Draft,Published',
            'images' => 'nullable|array',
            'images.*' => 'image|max:4096',
            'is_featured' => 'nullable|boolean',
            'is_exclusive' => 'nullable|boolean',
            'is_new_arrival' => 'nullable|boolean',
            'variants' => ['nullable', 'array', $this->uniqueVariantComboRule()],
            'variants.*.size' => 'nullable|string|max:50',
            'variants.*.color' => 'nullable|string|max:50',
            'variants.*.parent_image_index' => 'nullable|integer|min:0',
        ]);

        // Store each uploaded image once and reuse its path for variant assignment
        $imagePaths = collect($request->file('images', []))
            ->map(fn ($file) => $file->store('products', 'public'))
            ->all();

        $slug = Str::slug($validated['name']);
        $uniqueSlug = $slug;
        $suffix = 1;
        while (Product::where('slug', $uniqueSlug)->exists()) {
            $uniqueSlug = "{$slug}-{$suffix}";
            $suffix++;
        }

        DB::transaction(function () use ($validated, $imagePaths, $uniqueSlug, $request) {
            $product = Product::create([
                'name' => $validated['name'],
                'slug' => $uniqueSlug,
                'category_id' => $validated['category_id'],
                'price' => (int) round($validated['price'] * 100),
                'description' => $validated['description'] ?? null,
                'images' => $imagePaths,
                'is_featured' => (bool) ($validated['is_featured'] ?? false),
                'is_exclusive' => (bool) ($validated['is_exclusive'] ?? false),
                'is_new_arrival' => (bool) ($validated['is_new_arrival'] ?? false),
            ]);

            foreach ($request->input('variants', []) as $variant) {
                $parentImageIndex = $variant['parent_image_index'] ?? null;
                $variantImage = $parentImageIndex !== null && isset($imagePaths[$parentImageIndex])
                    ? $imagePaths[$parentImageIndex]
                    : null;

                Variant::create([
                    'product_id' => $product->id,
                    'sku' => Str::upper($uniqueSlug . '-' . Str::random(6)),
                    'size' => $variant['size'] ?? null,
                    'color' => $variant['color'] ?? null,
                    'image' => $variantImage
                ]);
            }
        });

        return redirect()->route('admin.products')->with('status', 'Product created successfully!');
    }

    public function edit($id)
    {
        $product = Product::with(['variants'])->findOrFail($id);
        $categories = Category::all();
        $images = $product->images ?? [];

        return inertia('Admin/Pages/ProductCreate', [
            'status' => session('status'),
            'categories' => $categories,
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'category_id' => (string) $product->category_id,
                'description' => $product->description,
                'price' => number_format($product->price / 100, 2, '.', ''),
                // there is no persisted status column yet, default to Draft
                'status' => 'Draft',
                'images' => $images,
                'is_featured' => $product->is_featured,
                'is_exclusive' => $product->is_exclusive,
                'is_new_arrival' => $product->is_new_arrival,
                'variants' => $product->variants->map(function ($variant) use ($images) {
                    $imageIndex = $variant->image ? array_search($variant->image, $images) : false;

                    return [
                        'id' => $variant->id,
                        'size' => $variant->size,
                        'color' => $variant->color,
                        'parent_image_index' => $imageIndex !== false ? $imageIndex : null,
                    ];
                })->values(),
            ],
        ]);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string|max:1000',
            'price' => 'required|numeric|min:0',
            'status' => 'required|in:Draft,Published',
            'images' => 'nullable|array',
            'images.*' => 'image|max:4096',
            'existing_images' => 'nullable|array',
            'existing_images.*' => 'string',
            'is_featured' => 'nullable|boolean',
            'is_exclusive' => 'nullable|boolean',
            'is_new_arrival' => 'nullable|boolean',
            'variants' => ['nullable', 'array', $this->uniqueVariantComboRule()],
            'variants.*.id' => 'nullable|exists:variants,id',
            'variants.*.size' => 'nullable|string|max:50',
            'variants.*.color' => 'nullable|string|max:50',
            'variants.*.parent_image_index' => 'nullable|integer|min:0',
        ]);

        // Store each uploaded image once and reuse its path for variant assignment
        $imagePaths = collect($request->file('images', []))
            ->map(fn ($file) => $file->store('products', 'public'))
            ->all();

        // Only the images the user kept are retained; anything removed on the
        // frontend is dropped here (and its file removed from storage)
        $retainedImages = $validated['existing_images'] ?? [];
        $removedImages = array_diff($product->images ?? [], $retainedImages);
        foreach ($removedImages as $removedImage) {
            Storage::disk('public')->delete($removedImage);
        }

        DB::transaction(function () use ($validated, $imagePaths, $retainedImages, $product, $request) {
            $product->update([
                'name' => $validated['name'],
                'category_id' => $validated['category_id'],
                'price' => (int) round($validated['price'] * 100),
                'description' => $validated['description'] ?? null,
                'images' => array_merge($retainedImages, $imagePaths),
                'is_featured' => (bool) ($validated['is_featured'] ?? false),
                'is_exclusive' => (bool) ($validated['is_exclusive'] ?? false),
                'is_new_arrival' => (bool) ($validated['is_new_arrival'] ?? false)
            ]);

            // parent_image_index refers to the combined retained + newly
            // uploaded image list, matching the order shown on the frontend
            $combinedImages = array_merge($retainedImages, $imagePaths);

            // Update or create variants, tracking each row's actual id (new variants
            // won't have one in the request payload until after they're created)
            $persistedVariantIds = [];
            foreach ($request->input('variants', []) as $variantData) {
                $parentImageIndex = $variantData['parent_image_index'] ?? null;
                $variantImage = $parentImageIndex !== null && isset($combinedImages[$parentImageIndex])
                    ? $combinedImages[$parentImageIndex]
                    : null;

                $variant = Variant::updateOrCreate(
                    ['id' => $variantData['id'] ?? null, 'product_id' => $product->id],
                    [
                        'sku' => Str::upper($product->slug . '-' . Str::random(6)),
                        'size' => $variantData['size'] ?? null,
                        'color' => $variantData['color'] ?? null,
                        'image' => $variantImage
                    ]
                );

                $persistedVariantIds[] = $variant->id;
            }

            // Remove variants that were dropped on the frontend (not present in the payload)
            Variant::where('product_id', $product->id)
                ->whereNotIn('id', $persistedVariantIds)
                ->delete();
        });

        return redirect()->route('admin.products')->with('status', 'Product updated successfully!');
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return redirect()->route('admin.products')->with('status', 'Product deleted successfully!');
    }

    /**
     * Rejects variants sharing the same color+size combination (color/size alone need not be unique).
     */
    protected function uniqueVariantComboRule(): \Closure
    {
        return function ($attribute, $value, $fail) {
            $seen = [];
            foreach ($value as $variant) {
                $combo = mb_strtolower(trim($variant['color'] ?? '')) . '|' . mb_strtolower(trim($variant['size'] ?? ''));
                if (isset($seen[$combo])) {
                    $fail('Each variant must have a unique color and size combination.');
                    return;
                }
                $seen[$combo] = true;
            }
        };
    }
}