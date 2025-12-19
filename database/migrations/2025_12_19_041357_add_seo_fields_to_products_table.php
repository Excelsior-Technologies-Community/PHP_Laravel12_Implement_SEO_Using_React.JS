<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {

            // 🔹 SEO Image
            $table->string('seo_image')->nullable()->after('image');

            // 🔹 OG Tag Image
            $table->string('og_image')->nullable()->after('seo_image');

            // 🔹 SEO Meta Title
            $table->string('seo_meta_title')->nullable();

            // 🔹 OG Meta Title
            $table->string('og_meta_title')->nullable();

            // 🔹 SEO Meta Keywords
            $table->text('seo_meta_keywords')->nullable();

            // 🔹 OG Meta Keywords
            $table->text('og_meta_keywords')->nullable();

            // 🔹 SEO Meta Description
            $table->text('seo_meta_description')->nullable();

            // 🔹 OG Meta Description
            $table->text('og_meta_description')->nullable();

            // 🔹 SEO Canonical URL
            $table->string('seo_canonical')->nullable();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {

            $table->dropColumn([
                'seo_image',
                'og_image',
                'seo_meta_title',
                'og_meta_title',
                'seo_meta_keywords',
                'og_meta_keywords',
                'seo_meta_description',
                'og_meta_description',
                'seo_canonical',
            ]);

        });
    }
};
