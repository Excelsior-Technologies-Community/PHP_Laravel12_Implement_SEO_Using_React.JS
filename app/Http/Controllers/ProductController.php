<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // 🔹 Get all products (with search, filter, sort, pagination)
    public function index(Request $request)
    {
        $perPage   = $request->query('per_page', 9);
        $sortBy    = $request->query('sort_by', 'created_at');
        $sortDir   = $request->query('sort_dir', 'desc');

        $query = Product::query();

        // 🔹 Search
        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('details', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%");
            });
        }

        // 🔹 Filter by category
        if ($category = $request->query('category')) {
            $query->where('category', $category);
        }

        // 🔹 Filter by color
        if ($color = $request->query('color')) {
            $query->where('color', $color);
        }

        // 🔹 Filter by size
        if ($size = $request->query('size')) {
            $query->where('size', $size);
        }

        // 🔹 Filter by price range
        if ($minPrice = $request->query('min_price')) {
            $query->where('price', '>=', $minPrice);
        }
        if ($maxPrice = $request->query('max_price')) {
            $query->where('price', '<=', $maxPrice);
        }

        // 🔹 Sort
        if (!in_array($sortBy, ['price', 'name', 'created_at', 'updated_at'])) {
            $sortBy = 'created_at';
        }
        $sortDir = $sortDir === 'asc' ? 'asc' : 'desc';
        $query->orderBy($sortBy, $sortDir);

        // 🔹 Paginate
        $products = $query->paginate($perPage);

        return response()->json($products, 200);
    }

    // 🔹 Store product
    public function store(Request $request)
    {
        $request->validate([
            // BASIC
            'name'     => 'required|string|max:255',
            'details'  => 'required|string',
            'price'    => 'required|numeric',
            'image'    => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
            'size'     => 'required|string|max:100',
            'color'    => 'required|string|max:100',
            'category' => 'required|string|max:100',

            // SEO + OG
            'seo_image'           => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'og_image'            => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'seo_meta_title'      => 'nullable|string|max:255',
            'og_meta_title'       => 'nullable|string|max:255',
            'seo_meta_keywords'   => 'nullable|string',
            'og_meta_keywords'    => 'nullable|string',
            'seo_meta_description'=> 'nullable|string',
            'og_meta_description' => 'nullable|string',
            'seo_canonical'       => 'nullable|string',
        ]);

        // 🔹 MAIN IMAGE UPLOAD
        $imageName = time() . '_main.' . $request->image->extension();
        $request->image->move(public_path('images'), $imageName);

        // 🔹 SEO IMAGE UPLOAD
        $seoImageName = null;
        if ($request->hasFile('seo_image')) {
            $seoImageName = time() . '_seo.' . $request->seo_image->extension();
            $request->seo_image->move(public_path('images'), $seoImageName);
        }

        // 🔹 OG IMAGE UPLOAD
        $ogImageName = null;
        if ($request->hasFile('og_image')) {
            $ogImageName = time() . '_og.' . $request->og_image->extension();
            $request->og_image->move(public_path('images'), $ogImageName);
        }

        Product::create([
            // BASIC
            'name'     => $request->name,
            'details'  => $request->details,
            'price'    => $request->price,
            'image'    => $imageName,
            'size'     => $request->size,
            'color'    => $request->color,
            'category' => $request->category,

            // SEO + OG
            'seo_image'            => $seoImageName,
            'og_image'             => $ogImageName,
            'seo_meta_title'       => $request->seo_meta_title,
            'og_meta_title'        => $request->og_meta_title,
            'seo_meta_keywords'    => $request->seo_meta_keywords,
            'og_meta_keywords'     => $request->og_meta_keywords,
            'seo_meta_description' => $request->seo_meta_description,
            'og_meta_description'  => $request->og_meta_description,
            'seo_canonical'        => $request->seo_canonical,
        ]);

        return response()->json([
            'message' => 'Product created successfully'
        ], 201);
    }

    // 🔹 Get specific products for comparison
    public function compare(Request $request)
    {
        $ids = $request->query('ids');

        if (!$ids) {
            return response()->json(['data' => [], 'message' => 'No product IDs provided'], 200);
        }

        $idsArray = array_filter(explode(',', $ids));

        if (count($idsArray) < 2) {
            return response()->json(['data' => [], 'message' => 'Select at least 2 products to compare'], 400);
        }

        $products = Product::whereIn('id', $idsArray)->get();

        return response()->json($products, 200);
    }

    // 🔹 Edit product
    public function edit($id)
    {
        return response()->json(
            Product::findOrFail($id),
            200
        );
    }

    // 🔹 Update product
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $request->validate([
            'name'     => 'required|string|max:255',
            'details'  => 'required|string',
            'price'    => 'required|numeric',
            'size'     => 'required|string|max:100',
            'color'    => 'required|string|max:100',
            'category' => 'required|string|max:100',

            'image'     => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'seo_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'og_image'  => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        // 🔹 MAIN IMAGE
        if ($request->hasFile('image')) {
            $imageName = time() . '_main.' . $request->image->extension();
            $request->image->move(public_path('images'), $imageName);
            $product->image = $imageName;
        }

        // 🔹 SEO IMAGE
        if ($request->hasFile('seo_image')) {
            $seoImageName = time() . '_seo.' . $request->seo_image->extension();
            $request->seo_image->move(public_path('images'), $seoImageName);
            $product->seo_image = $seoImageName;
        }

        // 🔹 OG IMAGE
        if ($request->hasFile('og_image')) {
            $ogImageName = time() . '_og.' . $request->og_image->extension();
            $request->og_image->move(public_path('images'), $ogImageName);
            $product->og_image = $ogImageName;
        }

        $product->update([
            'name'     => $request->name,
            'details'  => $request->details,
            'price'    => $request->price,
            'size'     => $request->size,
            'color'    => $request->color,
            'category' => $request->category,

            'seo_meta_title'       => $request->seo_meta_title,
            'og_meta_title'        => $request->og_meta_title,
            'seo_meta_keywords'    => $request->seo_meta_keywords,
            'og_meta_keywords'     => $request->og_meta_keywords,
            'seo_meta_description' => $request->seo_meta_description,
            'og_meta_description'  => $request->og_meta_description,
            'seo_canonical'        => $request->seo_canonical,
        ]);

        return response()->json([
            'message' => 'Product updated successfully'
        ], 200);
    }

    // 🔹 Delete product
    public function destroy($id)
    {
        Product::findOrFail($id)->delete();

        return response()->json([
            'message' => 'Product deleted successfully'
        ], 200);
    }
}
