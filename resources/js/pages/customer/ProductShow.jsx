import React, {
    useEffect,
    useState
} from "react";

import axios from "axios";

import {
    useParams,
    Link
} from "react-router-dom";

import {
    useCompare
} from "../../context/CompareContext";

import {
    useCart
} from "../../context/CartContext";

import {
    useWishlist
} from "../../context/WishlistContext";


export default function ProductShow() {

    const { id } = useParams();

    const [product, setProduct] =
        useState(null);

    const [quantity, setQuantity] =
        useState(1);


    const {
        isInCompare,
        addToCompare,
        compareCount
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
    | LOAD PRODUCT
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        axios
            .get(`/products/${id}/edit`)
            .then(res => {

                setProduct(res.data);

                /*
                |------------------------------------------------------------------
                | RECENTLY VIEWED
                |------------------------------------------------------------------
                */

                const saved =
                    JSON.parse(
                        localStorage.getItem(
                            "recentlyViewed"
                        ) || "[]"
                    );

                const filtered =
                    saved.filter(
                        item =>
                            item.id !==
                            res.data.id
                    );

                const updated = [
                    res.data,
                    ...filtered
                ].slice(0, 6);

                localStorage.setItem(
                    "recentlyViewed",
                    JSON.stringify(updated)
                );

            })
            .catch(error => {

                console.error(
                    "Product loading failed:",
                    error
                );

            });

    }, [id]);


    if (!product) {

        return (

            <div className="container mt-5">

                Loading...

            </div>
        );
    }


    const stock =
        Number(product.stock_quantity);

    const minimumStock =
        Number(product.minimum_stock);


    const isOutOfStock =
        stock <= 0;

    const isLowStock =
        stock > 0 &&
        stock <= minimumStock;


    /*
    |--------------------------------------------------------------------------
    | QUANTITY
    |--------------------------------------------------------------------------
    */

    const decreaseQuantity = () => {

        setQuantity(
            Math.max(
                1,
                quantity - 1
            )
        );
    };


    const increaseQuantity = () => {

        if (quantity >= stock) {

            alert(
                `Only ${stock} items are available.`
            );

            return;
        }

        setQuantity(
            quantity + 1
        );
    };


    /*
    |--------------------------------------------------------------------------
    | ADD CART
    |--------------------------------------------------------------------------
    */

    const handleAddToCart = () => {

        if (isOutOfStock) {

            alert(
                "This product is out of stock."
            );

            return;
        }

        addToCart(
            product,
            quantity
        );

        alert(
            `${quantity} ${product.name} added to cart.`
        );
    };


    /*
    |--------------------------------------------------------------------------
    | SHARE
    |--------------------------------------------------------------------------
    */

    const handleShare = async () => {

        const shareData = {

            title:
                product.seo_meta_title ||
                product.name,

            text:
                product.seo_meta_description ||
                product.details,

            url:
                window.location.href
        };


        try {

            if (
                navigator.share
            ) {

                await navigator.share(
                    shareData
                );

            } else {

                await navigator.clipboard.writeText(
                    window.location.href
                );

                alert(
                    "Product link copied!"
                );
            }

        } catch (error) {

            console.log(
                "Share cancelled."
            );
        }
    };


    return (

        <div className="container mt-5">


            <div className="row">


                {/* IMAGE */}

                <div className="col-md-6">

                    <img
                        src={
                            `/images/${product.image}`
                        }
                        className="img-fluid rounded shadow"
                        alt={product.name}
                    />

                </div>


                {/* DETAILS */}

                <div className="col-md-6">


                    <div className="d-flex justify-content-between align-items-start">

                        <h2>
                            {product.name}
                        </h2>


                        <button
                            onClick={() =>
                                toggleWishlist(product)
                            }
                            className={
                                `btn ${
                                    isInWishlist(product.id)
                                        ? "btn-danger"
                                        : "btn-outline-danger"
                                }`
                            }
                        >

                            {isInWishlist(product.id)
                                ? "♥ Saved"
                                : "♡ Wishlist"}

                        </button>

                    </div>


                    <h4 className="text-success">

                        ₹ {product.price}

                    </h4>


                    <p className="mt-3">

                        {product.details}

                    </p>


                    <ul className="list-group list-group-flush">


                        <li className="list-group-item">

                            <strong>
                                Category:
                            </strong>{" "}

                            {product.category}

                        </li>


                        <li className="list-group-item">

                            <strong>
                                Size:
                            </strong>{" "}

                            {product.size}

                        </li>


                        <li className="list-group-item">

                            <strong>
                                Color:
                            </strong>{" "}

                            {product.color}

                        </li>


                        <li className="list-group-item">

                            <strong>
                                Stock:
                            </strong>{" "}


                            {isOutOfStock ? (

                                <span className="badge bg-danger">

                                    Out of Stock

                                </span>

                            ) : isLowStock ? (

                                <span className="badge bg-warning text-dark">

                                    Only {stock} left

                                </span>

                            ) : (

                                <span className="badge bg-success">

                                    Available

                                </span>

                            )}

                        </li>

                    </ul>


                    {/* QUANTITY */}

                    {!isOutOfStock && (

                        <div className="mt-4">

                            <label className="form-label fw-bold">

                                Quantity

                            </label>


                            <div
                                className="input-group"
                                style={{
                                    maxWidth: "180px"
                                }}
                            >

                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={
                                        decreaseQuantity
                                    }
                                >
                                    -
                                </button>


                                <input
                                    type="number"
                                    className="form-control text-center"
                                    value={quantity}
                                    min="1"
                                    max={stock}
                                    onChange={e => {

                                        const value =
                                            Number(
                                                e.target.value
                                            );

                                        if (
                                            value >= 1 &&
                                            value <= stock
                                        ) {

                                            setQuantity(
                                                value
                                            );
                                        }

                                    }}
                                />


                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={
                                        increaseQuantity
                                    }
                                >
                                    +
                                </button>

                            </div>


                            {isLowStock && (

                                <small className="text-danger d-block mt-2">

                                    Hurry! Only {stock} items left.

                                </small>

                            )}

                        </div>

                    )}


                    {/* ACTIONS */}

                    <div className="d-flex gap-2 mt-4 flex-wrap">


                        <button
                            onClick={
                                handleAddToCart
                            }
                            disabled={isOutOfStock}
                            className={
                                `btn ${
                                    isOutOfStock
                                        ? "btn-secondary"
                                        : isInCart(product.id)
                                            ? "btn-success"
                                            : "btn-primary"
                                }`
                            }
                        >

                            {isOutOfStock
                                ? "Out of Stock"
                                : "🛒 Add to Cart"}

                        </button>


                        <button
                            onClick={
                                handleShare
                            }
                            className="btn btn-outline-dark"
                        >

                            📤 Share

                        </button>


                        <button
                            onClick={() =>
                                addToCompare(product)
                            }
                            className={
                                `btn ${
                                    isInCompare(product.id)
                                        ? "btn-success"
                                        : "btn-outline-primary"
                                }`
                            }
                            disabled={
                                compareCount >= 4 &&
                                !isInCompare(
                                    product.id
                                )
                            }
                        >

                            {isInCompare(product.id)
                                ? "✓ Compared"
                                : "Compare"}

                        </button>


                        <Link
                            to="/cart"
                            className="btn btn-outline-success"
                        >

                            View Cart

                        </Link>


                        <Link
                            to="/shop"
                            className="btn btn-secondary"
                        >

                            Back

                        </Link>

                    </div>

                </div>

            </div>


            {/* RECENTLY VIEWED */}

            <RecentlyViewed
                currentProductId={
                    product.id
                }
            />

        </div>
    );
}


/*
|--------------------------------------------------------------------------
| RECENTLY VIEWED COMPONENT
|--------------------------------------------------------------------------
*/

function RecentlyViewed({
    currentProductId
}) {

    const [
        recentlyViewed,
        setRecentlyViewed
    ] = useState([]);


    useEffect(() => {

        const saved =
            JSON.parse(
                localStorage.getItem(
                    "recentlyViewed"
                ) || "[]"
            );

        setRecentlyViewed(
            saved.filter(
                item =>
                    item.id !==
                    currentProductId
            )
        );

    }, [currentProductId]);


    if (
        recentlyViewed.length === 0
    ) {

        return null;
    }


    return (

        <div className="mt-5">

            <h4 className="mb-3">

                Recently Viewed

            </h4>


            <div className="row">

                {recentlyViewed.map(product => (

                    <div
                        className="col-md-2 mb-3"
                        key={product.id}
                    >

                        <Link
                            to={
                                `/shop/product/${product.id}`
                            }
                            className="text-decoration-none"
                        >

                            <div className="card h-100">

                                <img
                                    src={
                                        `/images/${product.image}`
                                    }
                                    className="card-img-top"
                                    style={{
                                        height: "120px",
                                        objectFit: "cover"
                                    }}
                                    alt={
                                        product.name
                                    }
                                />

                                <div className="card-body p-2">

                                    <small className="fw-bold">

                                        {product.name}

                                    </small>

                                    <div className="text-success">

                                        Rs. {product.price}

                                    </div>

                                </div>

                            </div>

                        </Link>

                    </div>

                ))}

            </div>

        </div>
    );
}