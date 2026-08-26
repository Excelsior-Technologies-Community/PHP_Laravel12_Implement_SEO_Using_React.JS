import React from "react";

import {
    useCompare
} from "../context/CompareContext";

import {
    useCart
} from "../context/CartContext";

import {
    useWishlist
} from "../context/WishlistContext";


export default function ProductCard({
    product,
    showCompare = false
}) {

    const {
        isInCompare,
        addToCompare
    } = useCompare();

    const {
        addToCart,
        isInCart
    } = useCart();

    const {
        isInWishlist,
        toggleWishlist
    } = useWishlist();


    /*
    |--------------------------------------------------------------------------
    | STOCK
    |--------------------------------------------------------------------------
    */

    const stock =
        Number(product.stock_quantity);

    const minimumStock =
        Number(product.minimum_stock);


    const getStockStatus = () => {

        if (stock <= 0) {

            return {
                text: "Out of Stock",
                className: "bg-danger"
            };
        }

        if (stock <= minimumStock) {

            return {
                text: `Only ${stock} left`,
                className:
                    "bg-warning text-dark"
            };
        }

        return {
            text: "Available",
            className: "bg-success"
        };
    };


    const stockStatus =
        getStockStatus();


    /*
    |--------------------------------------------------------------------------
    | COMPARE
    |--------------------------------------------------------------------------
    */

    const handleCompare = (e) => {

        e.preventDefault();
        e.stopPropagation();

        addToCompare(product);
    };


    /*
    |--------------------------------------------------------------------------
    | WISHLIST
    |--------------------------------------------------------------------------
    */

    const handleWishlist = (e) => {

        e.preventDefault();
        e.stopPropagation();

        toggleWishlist(product);
    };


    /*
    |--------------------------------------------------------------------------
    | CART
    |--------------------------------------------------------------------------
    */

    const handleAddToCart = (e) => {

        e.preventDefault();
        e.stopPropagation();

        if (stock <= 0) {

            alert(
                "This product is out of stock."
            );

            return;
        }

        addToCart(product, 1);

        alert(
            `${product.name} added to cart.`
        );
    };


    return (

        <div className="card h-100 shadow-sm product-card position-relative">


            {/* WISHLIST */}

            <button
                onClick={handleWishlist}
                className={
                    `position-absolute top-0 start-0 m-2 btn btn-sm ${
                        isInWishlist(product.id)
                            ? "btn-danger"
                            : "btn-outline-danger"
                    }`
                }
                title={
                    isInWishlist(product.id)
                        ? "Remove from wishlist"
                        : "Add to wishlist"
                }
            >
                {isInWishlist(product.id)
                    ? "♥"
                    : "♡"}
            </button>


            {/* COMPARE */}

            {showCompare && (

                <button
                    onClick={handleCompare}
                    className={
                        `position-absolute top-0 end-0 m-2 btn btn-sm ${
                            isInCompare(product.id)
                                ? "btn-success"
                                : "btn-outline-secondary"
                        }`
                    }
                    title={
                        isInCompare(product.id)
                            ? "Added to compare"
                            : "Add to compare"
                    }
                >
                    {isInCompare(product.id)
                        ? "✓"
                        : "C"}
                </button>

            )}


            {/* IMAGE */}

            <img
                src={
                    "/images/" +
                    product.image
                }
                className="card-img-top product-image"
                alt={product.name}
            />


            <div className="card-body d-flex flex-column">


                <h5 className="card-title">

                    {product.name}

                </h5>


                <h6 className="text-success fw-bold">

                    Rs. {product.price}

                </h6>


                <p className="text-muted small">

                    {product.details &&
                    product.details.length > 100

                        ? product.details.substring(
                            0,
                            100
                        ) + "..."

                        : product.details}

                </p>


                {/* STOCK */}

                <div className="mb-2">

                    <span
                        className={
                            `badge ${stockStatus.className}`
                        }
                    >

                        {stockStatus.text}

                    </span>

                </div>


                <ul className="list-group list-group-flush mb-3">

                    <li className="list-group-item p-1">

                        <strong>
                            Category:
                        </strong>{" "}

                        {product.category}

                    </li>


                    <li className="list-group-item p-1">

                        <strong>
                            Size:
                        </strong>{" "}

                        {product.size}

                    </li>


                    <li className="list-group-item p-1">

                        <strong>
                            Color:
                        </strong>{" "}

                        {product.color}

                    </li>


                    <li className="list-group-item p-1">

                        <strong>
                            Stock:
                        </strong>{" "}

                        {product.stock_quantity}

                    </li>

                </ul>


                {/* ADD CART */}

                <button
                    className={
                        `btn w-100 mt-auto ${
                            stock <= 0
                                ? "btn-secondary"
                                : isInCart(product.id)
                                    ? "btn-success"
                                    : "btn-primary"
                        }`
                    }
                    disabled={stock <= 0}
                    onClick={handleAddToCart}
                >

                    {stock <= 0
                        ? "Out of Stock"
                        : isInCart(product.id)
                            ? "Add More to Cart"
                            : "Add to Cart"}

                </button>

            </div>

        </div>
    );
}