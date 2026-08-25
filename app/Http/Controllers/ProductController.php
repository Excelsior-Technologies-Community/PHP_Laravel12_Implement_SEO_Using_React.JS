<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    /**
     * Get products.
     */
    public function index(Request $request)
    {
        $perPage = min(
            max((int) $request->query('per_page', 9), 1),
            100
        );

        $sortBy = $request->query('sort_by', 'created_at');
        $sortDir = $request->query('sort_dir', 'desc');

        $query = Product::query();

        /*
        |--------------------------------------------------------------------------
        | CUSTOMER SHOP
        |--------------------------------------------------------------------------
        |
        | Customer requests should only receive active products.
        |
        */
        $isCustomerRequest = $request->boolean('customer');

        if ($isCustomerRequest) {
            $query->where('status', 'active');
        }

        /*
        |--------------------------------------------------------------------------
        | SEARCH
        |--------------------------------------------------------------------------
        */

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('details', 'like', "%{$search}%")
                    ->orWhere('category', 'like', "%{$search}%");
            });
        }

        /*
        |--------------------------------------------------------------------------
        | CATEGORY
        |--------------------------------------------------------------------------
        */

        if ($category = $request->query('category')) {
            $query->where('category', $category);
        }

        /*
        |--------------------------------------------------------------------------
        | COLOR
        |--------------------------------------------------------------------------
        */

        if ($color = $request->query('color')) {
            $query->where('color', $color);
        }

        /*
        |--------------------------------------------------------------------------
        | SIZE
        |--------------------------------------------------------------------------
        */

        if ($size = $request->query('size')) {
            $query->where('size', $size);
        }

        /*
        |--------------------------------------------------------------------------
        | STATUS
        |--------------------------------------------------------------------------
        */

        if ($status = $request->query('status')) {
            if (in_array($status, ['active', 'inactive'])) {
                $query->where('status', $status);
            }
        }

        /*
        |--------------------------------------------------------------------------
        | STOCK STATUS
        |--------------------------------------------------------------------------
        */

        if ($stockStatus = $request->query('stock_status')) {
            if ($stockStatus === 'available') {
                $query->whereColumn(
                    'stock_quantity',
                    '>',
                    'minimum_stock'
                );
            }

            if ($stockStatus === 'low') {
                $query->where('stock_quantity', '>', 0)
                    ->whereColumn(
                        'stock_quantity',
                        '<=',
                        'minimum_stock'
                    );
            }

            if ($stockStatus === 'out') {
                $query->where('stock_quantity', '<=', 0);
            }
        }

        /*
        |--------------------------------------------------------------------------
        | PRICE
        |--------------------------------------------------------------------------
        */

        if (
            $request->filled('min_price')
        ) {
            $query->where(
                'price',
                '>=',
                $request->query('min_price')
            );
        }

        if (
            $request->filled('max_price')
        ) {
            $query->where(
                'price',
                '<=',
                $request->query('max_price')
            );
        }

        /*
        |--------------------------------------------------------------------------
        | SORT
        |--------------------------------------------------------------------------
        */

        if (!in_array(
            $sortBy,
            [
                'price',
                'name',
                'created_at',
                'updated_at',
                'stock_quantity',
            ]
        )) {
            $sortBy = 'created_at';
        }

        $sortDir = $sortDir === 'asc'
            ? 'asc'
            : 'desc';

        $query->orderBy($sortBy, $sortDir);

        /*
        |--------------------------------------------------------------------------
        | PAGINATION
        |--------------------------------------------------------------------------
        */

        $products = $query->paginate($perPage);

        return response()->json($products, 200);
    }

    /**
     * Store product.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'details' => 'required|string',
            'price' => 'required|numeric|min:0',

            'image' => [
                'required',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
            ],

            'size' => 'required|string|max:100',
            'color' => 'required|string|max:100',
            'category' => 'required|string|max:100',

            'stock_quantity' => 'required|integer|min:0',
            'minimum_stock' => 'required|integer|min:0',

            'status' => [
                'required',
                Rule::in(['active', 'inactive']),
            ],

            'seo_image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
            ],

            'og_image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
            ],

            'seo_meta_title' => 'nullable|string|max:255',
            'og_meta_title' => 'nullable|string|max:255',

            'seo_meta_keywords' => 'nullable|string',
            'og_meta_keywords' => 'nullable|string',

            'seo_meta_description' => 'nullable|string',
            'og_meta_description' => 'nullable|string',

            'seo_canonical' => 'nullable|string',
        ]);

        $imagesDir = public_path('images');

        if (!File::exists($imagesDir)) {
            File::makeDirectory(
                $imagesDir,
                0755,
                true
            );
        }

        /*
        |--------------------------------------------------------------------------
        | MAIN IMAGE
        |--------------------------------------------------------------------------
        */

        $imageName = time()
            . '_main.'
            . $request->image->extension();

        $request->image->move(
            $imagesDir,
            $imageName
        );

        /*
        |--------------------------------------------------------------------------
        | SEO IMAGE
        |--------------------------------------------------------------------------
        */

        $seoImageName = null;

        if ($request->hasFile('seo_image')) {
            $seoImageName = time()
                . '_seo.'
                . $request->seo_image->extension();

            $request->seo_image->move(
                $imagesDir,
                $seoImageName
            );
        }

        /*
        |--------------------------------------------------------------------------
        | OG IMAGE
        |--------------------------------------------------------------------------
        */

        $ogImageName = null;

        if ($request->hasFile('og_image')) {
            $ogImageName = time()
                . '_og.'
                . $request->og_image->extension();

            $request->og_image->move(
                $imagesDir,
                $ogImageName
            );
        }

        $product = Product::create([
            'name' => $request->name,
            'details' => $request->details,
            'price' => $request->price,

            'image' => $imageName,

            'size' => $request->size,
            'color' => $request->color,
            'category' => $request->category,

            'stock_quantity' => $request->stock_quantity,
            'minimum_stock' => $request->minimum_stock,
            'status' => $request->status,

            'seo_image' => $seoImageName,
            'og_image' => $ogImageName,

            'seo_meta_title' => $request->seo_meta_title,
            'og_meta_title' => $request->og_meta_title,

            'seo_meta_keywords' => $request->seo_meta_keywords,
            'og_meta_keywords' => $request->og_meta_keywords,

            'seo_meta_description' => $request->seo_meta_description,
            'og_meta_description' => $request->og_meta_description,

            'seo_canonical' => $request->seo_canonical,
        ]);

        /*
        |--------------------------------------------------------------------------
        | INITIAL STOCK HISTORY
        |--------------------------------------------------------------------------
        */

        if ($product->stock_quantity > 0) {
            $product->stockMovements()->create([
                'type' => 'stock_in',
                'previous_stock' => 0,
                'changed_quantity' => $product->stock_quantity,
                'new_stock' => $product->stock_quantity,
                'reason' => 'Initial product stock',
                'user_id' => auth()->id(),
            ]);
        }

        return response()->json([
            'message' => 'Product created successfully',
            'product' => $product,
        ], 201);
    }

    /**
     * Compare products.
     */
    public function compare(Request $request)
    {
        $ids = $request->query('ids');

        if (!$ids) {
            return response()->json([
                'data' => [],
                'message' => 'No product IDs provided',
            ], 200);
        }

        $idsArray = array_values(
            array_filter(
                explode(',', $ids),
                fn ($id) => is_numeric($id)
            )
        );

        if (count($idsArray) < 2) {
            return response()->json([
                'data' => [],
                'message' => 'Select at least 2 products to compare',
            ], 400);
        }

        $products = Product::whereIn(
            'id',
            $idsArray
        )->get();

        return response()->json(
            $products,
            200
        );
    }

    /**
     * Get single product.
     */
    public function edit($id)
    {
        return response()->json(
            Product::findOrFail($id),
            200
        );
    }

    /**
     * Update product.
     */
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'details' => 'required|string',
            'price' => 'required|numeric|min:0',

            'size' => 'required|string|max:100',
            'color' => 'required|string|max:100',
            'category' => 'required|string|max:100',

            'stock_quantity' => 'required|integer|min:0',
            'minimum_stock' => 'required|integer|min:0',

            'status' => [
                'required',
                Rule::in(['active', 'inactive']),
            ],

            'image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
            ],

            'seo_image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
            ],

            'og_image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
            ],

            'seo_meta_title' => 'nullable|string|max:255',
            'og_meta_title' => 'nullable|string|max:255',

            'seo_meta_keywords' => 'nullable|string',
            'og_meta_keywords' => 'nullable|string',

            'seo_meta_description' => 'nullable|string',
            'og_meta_description' => 'nullable|string',

            'seo_canonical' => 'nullable|string',
        ]);

        $imagesDir = public_path('images');

        if (!File::exists($imagesDir)) {
            File::makeDirectory(
                $imagesDir,
                0755,
                true
            );
        }

        /*
        |--------------------------------------------------------------------------
        | MAIN IMAGE
        |--------------------------------------------------------------------------
        */

        if ($request->hasFile('image')) {
            $oldImage = $product->image;

            $imageName = time()
                . '_main.'
                . $request->image->extension();

            $request->image->move(
                $imagesDir,
                $imageName
            );

            $product->image = $imageName;

            if (
                $oldImage &&
                File::exists($imagesDir . '/' . $oldImage)
            ) {
                File::delete(
                    $imagesDir . '/' . $oldImage
                );
            }
        }

        /*
        |--------------------------------------------------------------------------
        | SEO IMAGE
        |--------------------------------------------------------------------------
        */

        if ($request->hasFile('seo_image')) {
            $oldImage = $product->seo_image;

            $seoImageName = time()
                . '_seo.'
                . $request->seo_image->extension();

            $request->seo_image->move(
                $imagesDir,
                $seoImageName
            );

            $product->seo_image = $seoImageName;

            if (
                $oldImage &&
                File::exists($imagesDir . '/' . $oldImage)
            ) {
                File::delete(
                    $imagesDir . '/' . $oldImage
                );
            }
        }

        /*
        |--------------------------------------------------------------------------
        | OG IMAGE
        |--------------------------------------------------------------------------
        */

        if ($request->hasFile('og_image')) {
            $oldImage = $product->og_image;

            $ogImageName = time()
                . '_og.'
                . $request->og_image->extension();

            $request->og_image->move(
                $imagesDir,
                $ogImageName
            );

            $product->og_image = $ogImageName;

            if (
                $oldImage &&
                File::exists($imagesDir . '/' . $oldImage)
            ) {
                File::delete(
                    $imagesDir . '/' . $oldImage
                );
            }
        }

        /*
        |--------------------------------------------------------------------------
        | PRODUCT DATA
        |--------------------------------------------------------------------------
        */

        $oldStock = $product->stock_quantity;
        $newStock = (int) $request->stock_quantity;

        $product->name = $request->name;
        $product->details = $request->details;
        $product->price = $request->price;

        $product->size = $request->size;
        $product->color = $request->color;
        $product->category = $request->category;

        $product->stock_quantity = $newStock;
        $product->minimum_stock = $request->minimum_stock;
        $product->status = $request->status;

        $product->seo_meta_title = $request->seo_meta_title;
        $product->og_meta_title = $request->og_meta_title;

        $product->seo_meta_keywords = $request->seo_meta_keywords;
        $product->og_meta_keywords = $request->og_meta_keywords;

        $product->seo_meta_description =
            $request->seo_meta_description;

        $product->og_meta_description =
            $request->og_meta_description;

        $product->seo_canonical =
            $request->seo_canonical;

        DB::transaction(function () use (
            $product,
            $oldStock,
            $newStock
        ) {
            $product->save();

            if ($oldStock !== $newStock) {
                $product->stockMovements()->create([
                    'type' => 'adjustment',
                    'previous_stock' => $oldStock,
                    'changed_quantity' => $newStock - $oldStock,
                    'new_stock' => $newStock,
                    'reason' => 'Stock updated while editing product',
                    'user_id' => auth()->id(),
                ]);
            }
        });

        return response()->json([
            'message' => 'Product updated successfully',
            'product' => $product->fresh(),
        ], 200);
    }

    /**
     * Delete product.
     */
    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        $imagesDir = public_path('images');

        foreach ([
            $product->image,
            $product->seo_image,
            $product->og_image,
        ] as $image) {
            if (
                $image &&
                File::exists($imagesDir . '/' . $image)
            ) {
                File::delete(
                    $imagesDir . '/' . $image
                );
            }
        }

        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully',
        ], 200);
    }
}