<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class StockMovementController extends Controller
{
    /**
     * Get product stock history.
     */
    public function index(Request $request, $productId)
    {
        $product = Product::findOrFail($productId);

        $movements = StockMovement::with('user:id,name')
            ->where('product_id', $product->id)
            ->latest()
            ->paginate(
                min(
                    max(
                        (int) $request->query('per_page', 10),
                        1
                    ),
                    100
                )
            );

        return response()->json([
            'product' => $product,
            'movements' => $movements,
        ]);
    }

    /**
     * Update product stock.
     */
    public function store(Request $request, $productId)
    {
        $validated = $request->validate([
            'type' => [
                'required',
                Rule::in([
                    'stock_in',
                    'stock_out',
                    'adjustment',
                ]),
            ],

            'quantity' => [
                'required',
                'integer',
                'min:1',
            ],

            'reason' => [
                'required',
                'string',
                'max:1000',
            ],
        ]);

        $result = DB::transaction(function () use (
            $validated,
            $productId
        ) {
            $product = Product::whereKey($productId)
                ->lockForUpdate()
                ->firstOrFail();

            $previousStock = (int) $product->stock_quantity;
            $quantity = (int) $validated['quantity'];

            /*
            |--------------------------------------------------------------------------
            | STOCK IN
            |--------------------------------------------------------------------------
            */

            if ($validated['type'] === 'stock_in') {

                $newStock = $previousStock + $quantity;

                $changedQuantity = $quantity;
            }

            /*
            |--------------------------------------------------------------------------
            | STOCK OUT
            |--------------------------------------------------------------------------
            */

            elseif ($validated['type'] === 'stock_out') {

                if ($quantity > $previousStock) {
                    abort(
                        response()->json([
                            'message' =>
                                'Stock out quantity cannot be greater than available stock.',
                        ], 422)
                    );
                }

                $newStock = $previousStock - $quantity;

                $changedQuantity = -$quantity;
            }

            /*
            |--------------------------------------------------------------------------
            | MANUAL ADJUSTMENT
            |--------------------------------------------------------------------------
            */

            else {

                $newStock = $quantity;

                $changedQuantity =
                    $newStock - $previousStock;
            }

            /*
            |--------------------------------------------------------------------------
            | Update Product
            |--------------------------------------------------------------------------
            */

            $product->stock_quantity = $newStock;
            $product->save();

            /*
            |--------------------------------------------------------------------------
            | Create Stock History
            |--------------------------------------------------------------------------
            */

            $movement = StockMovement::create([
                'product_id' => $product->id,

                'type' => $validated['type'],

                'previous_stock' => $previousStock,

                'changed_quantity' => $changedQuantity,

                'new_stock' => $newStock,

                'reason' => $validated['reason'],

                'user_id' => auth()->id(),
            ]);

            return [
                'product' => $product->fresh(),

                'movement' =>
                    $movement->load('user:id,name'),
            ];
        });

        return response()->json([
            'success' => true,

            'message' =>
                'Stock updated successfully.',

            'data' => $result,
        ], 201);
    }
}