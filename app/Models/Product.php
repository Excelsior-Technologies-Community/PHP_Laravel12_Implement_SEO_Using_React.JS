<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [

        // 🔹 BASIC PRODUCT DETAILS
        'name',
        'details',
        'price',
        'image',
        'size',
        'color',
        'category',

        // 🔹 SEO & OG DETAILS
        'seo_image',
        'og_image',

        'seo_meta_title',
        'og_meta_title',

        'seo_meta_keywords',
        'og_meta_keywords',

        'seo_meta_description',
        'og_meta_description',

        'seo_canonical',
    ];
}
