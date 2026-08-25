<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->unsignedInteger('stock_quantity')
                ->default(0)
                ->after('category');

            $table->unsignedInteger('minimum_stock')
                ->default(5)
                ->after('stock_quantity');

            $table->string('status')
                ->default('active')
                ->after('minimum_stock');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'stock_quantity',
                'minimum_stock',
                'status',
            ]);
        });
    }
};