<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\File;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        $imagesDir = public_path('images');

        if (!File::exists($imagesDir)) {
            File::makeDirectory(
                $imagesDir,
                0755,
                true
            );
        }

        $placeholder = base64_decode(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='
        );

        $mainImage =
            'factory_' .
            time() .
            '_' .
            fake()->unique()->randomNumber() .
            '.png';

        $seoImage =
            'factory_seo_' .
            time() .
            '_' .
            fake()->unique()->randomNumber() .
            '.png';

        $ogImage =
            'factory_og_' .
            time() .
            '_' .
            fake()->unique()->randomNumber() .
            '.png';

        File::put(
            $imagesDir . '/' . $mainImage,
            $placeholder
        );

        File::put(
            $imagesDir . '/' . $seoImage,
            $placeholder
        );

        File::put(
            $imagesDir . '/' . $ogImage,
            $placeholder
        );

        $category = fake()->randomElement([
            'Electronics',
            'Fashion',
            'Books',
            'Home',
            'Sports',
        ]);

        $color = fake()->randomElement([
            'Red',
            'Blue',
            'Green',
            'Black',
            'White',
        ]);

        $size = fake()->randomElement([
            'S',
            'M',
            'L',
            'XL',
        ]);

        $stock = fake()->numberBetween(0, 100);

        return [
            'name' =>
                fake()->words(3, true),

            'details' =>
                fake()->sentence(20),

            'price' =>
                fake()->randomFloat(
                    2,
                    10,
                    500
                ),

            'image' =>
                $mainImage,

            'size' =>
                $size,

            'color' =>
                $color,

            'category' =>
                $category,

            /*
            |--------------------------------------------------------------------------
            | INVENTORY
            |--------------------------------------------------------------------------
            */

            'stock_quantity' =>
                $stock,

            'minimum_stock' =>
                fake()->numberBetween(5, 20),

            'status' =>
                fake()->randomElement([
                    'active',
                    'active',
                    'active',
                    'inactive',
                ]),

            /*
            |--------------------------------------------------------------------------
            | SEO
            |--------------------------------------------------------------------------
            */

            'seo_image' =>
                $seoImage,

            'og_image' =>
                $ogImage,

            'seo_meta_title' =>
                fake()->sentence(5),

            'og_meta_title' =>
                fake()->sentence(5),

            'seo_meta_keywords' =>
                fake()->words(5, true),

            'og_meta_keywords' =>
                fake()->words(5, true),

            'seo_meta_description' =>
                fake()->sentence(15),

            'og_meta_description' =>
                fake()->sentence(15),

            'seo_canonical' =>
                'https://example.com/shop/product/' .
                fake()->randomNumber(),
        ];
    }
}