<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [

        // BASIC PRODUCT DETAILS
        'name',
        'details',
        'price',
        'image',
        'size',
        'color',
        'category',

        // INVENTORY
        'stock_quantity',
        'minimum_stock',
        'status',

        // SEO & OG DETAILS
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

    protected $casts = [
        'price' => 'decimal:2',
        'stock_quantity' => 'integer',
        'minimum_stock' => 'integer',
    ];

    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class);
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function isLowStock(): bool
    {
        return $this->stock_quantity > 0
            && $this->stock_quantity <= $this->minimum_stock;
    }

    public function isOutOfStock(): bool
    {
        return $this->stock_quantity <= 0;
    }

    public function getStockStatusAttribute(): string
    {
        if ($this->stock_quantity <= 0) {
            return 'Out of Stock';
        }

        if ($this->stock_quantity <= $this->minimum_stock) {
            return 'Low Stock';
        }

        return 'Available';
    }
}