<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Models\Product;

Route::get('/shop/product/{id}', function ($id) {

    $product = Product::findOrFail($id);

    return view('welcome', [
        // 🔹 SEO
        'seo_title'       => $product->seo_meta_title,
        'seo_description' => $product->seo_meta_description,
        'seo_keywords'    => $product->seo_meta_keywords,
        'seo_canonical'   => $product->seo_canonical,

        // 🔹 OG
        'og_title'        => $product->og_meta_title,
        'og_description'  => $product->og_meta_description,
        'og_keywords'     => $product->og_meta_keywords,
        'og_image'        => $product->og_image
            ? asset('images/' . $product->og_image)
            : asset('images/default-og.png'),
    ]);
});

// 🔹 Category SEO Route
Route::get('/shop/category/{category}', function ($category) {
    $categoryName = ucfirst($category);

    return view('welcome', [
        'seo_title'       => $categoryName . ' Products | Laravel 12 React',
        'seo_description' => 'Browse our ' . $categoryName . ' products. Best quality and prices.',
        'seo_keywords'    => $categoryName . ', products, shop',
        'seo_canonical'   => url()->current(),

        'og_title'        => $categoryName . ' Products',
        'og_description'  => 'Browse our ' . $categoryName . ' products.',
        'og_keywords'     => $categoryName . ', products, shop',
        'og_image'        => asset('images/default-og.png'),
    ]);
});

// 🔹 Compare SEO Route
Route::get('/compare', function () {
    return view('welcome', [
        'seo_title'       => 'Product Comparison | Laravel 12 React',
        'seo_description' => 'Compare products side by side. Find the best option for you.',
        'seo_keywords'    => 'product comparison, compare, shop',
        'seo_canonical'   => url()->current(),

        'og_title'        => 'Product Comparison',
        'og_description'  => 'Compare products side by side.',
        'og_keywords'     => 'product comparison, compare, shop',
        'og_image'        => asset('images/default-og.png'),
    ]);
});




/*
|--------------------------------------------------------------------------
| Product API Routes (React ke liye)
|--------------------------------------------------------------------------
*/

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/compare', [ProductController::class, 'compare']);
Route::post('/products', [ProductController::class, 'store']);
Route::get('/products/{id}/edit', [ProductController::class, 'edit']);
Route::post('/products/{id}', [ProductController::class, 'update']);
Route::delete('/products/{id}', [ProductController::class, 'destroy']);

/*
|--------------------------------------------------------------------------
| React SPA Routes (ALWAYS LAST)
|--------------------------------------------------------------------------
*/

Route::view('/', 'welcome');
Route::view('/{any}', 'welcome')->where('any', '.*');
