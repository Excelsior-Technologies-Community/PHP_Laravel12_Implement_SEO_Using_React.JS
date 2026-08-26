import React from "react";

import {
    Link
} from "react-router-dom";

import {
    useCart
} from "../../context/CartContext";


export default function Cart() {

    const {

        cart,

        cartCount,

        cartTotal,

        increaseQuantity,

        decreaseQuantity,

        removeFromCart,

        clearCart

    } = useCart();


    /*
    |--------------------------------------------------------------------------
    | EMPTY CART
    |--------------------------------------------------------------------------
    */

    if (cart.length === 0) {

        return (

            <div className="container mt-5">

                <div className="text-center py-5">

                    <h2>
                        🛒 Your Cart is Empty
                    </h2>

                    <p className="text-muted">

                        Add some products to your cart.

                    </p>

                    <Link
                        to="/shop"
                        className="btn btn-primary"
                    >

                        Continue Shopping

                    </Link>

                </div>

            </div>
        );
    }


    return (

        <div className="container mt-5">


            <div className="d-flex justify-content-between align-items-center mb-4">

                <h2>
                    Shopping Cart
                </h2>


                <button
                    className="btn btn-outline-danger"
                    onClick={() => {

                        if (
                            window.confirm(
                                "Clear entire cart?"
                            )
                        ) {

                            clearCart();
                        }

                    }}
                >

                    Clear Cart

                </button>

            </div>


            <div className="row">


                {/* CART ITEMS */}

                <div className="col-md-8">


                    {cart.map(item => (

                        <div
                            className="card mb-3 shadow-sm"
                            key={item.id}
                        >

                            <div className="card-body">


                                <div className="row align-items-center">


                                    {/* IMAGE */}

                                    <div className="col-md-2">

                                        <img
                                            src={
                                                `/images/${item.image}`
                                            }
                                            className="img-fluid rounded"
                                            alt={
                                                item.name
                                            }
                                        />

                                    </div>


                                    {/* NAME */}

                                    <div className="col-md-3">

                                        <h5>
                                            {item.name}
                                        </h5>

                                        <small className="text-muted">

                                            {item.category}

                                        </small>

                                        <div className="text-success fw-bold">

                                            ₹ {item.price}

                                        </div>

                                    </div>


                                    {/* QUANTITY */}

                                    <div className="col-md-3">

                                        <label className="small text-muted">

                                            Quantity

                                        </label>


                                        <div className="input-group">

                                            <button
                                                className="btn btn-outline-secondary"
                                                onClick={() =>
                                                    decreaseQuantity(
                                                        item.id
                                                    )
                                                }
                                            >
                                                -
                                            </button>


                                            <input
                                                className="form-control text-center"
                                                value={
                                                    item.quantity
                                                }
                                                readOnly
                                            />


                                            <button
                                                className="btn btn-outline-secondary"
                                                onClick={() =>
                                                    increaseQuantity(
                                                        item.id
                                                    )
                                                }
                                            >
                                                +
                                            </button>

                                        </div>

                                    </div>


                                    {/* SUBTOTAL */}

                                    <div className="col-md-2">

                                        <strong>

                                            ₹{" "}
                                            {(
                                                Number(
                                                    item.price
                                                ) *
                                                Number(
                                                    item.quantity
                                                )
                                            ).toFixed(2)}

                                        </strong>

                                    </div>


                                    {/* REMOVE */}

                                    <div className="col-md-2">

                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() =>
                                                removeFromCart(
                                                    item.id
                                                )
                                            }
                                        >

                                            Remove

                                        </button>

                                    </div>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>


                {/* SUMMARY */}

                <div className="col-md-4">


                    <div className="card shadow-sm">

                        <div className="card-body">


                            <h4>
                                Cart Summary
                            </h4>


                            <hr />


                            <div className="d-flex justify-content-between mb-2">

                                <span>
                                    Total Items
                                </span>

                                <strong>
                                    {cartCount}
                                </strong>

                            </div>


                            <div className="d-flex justify-content-between">

                                <span>
                                    Total
                                </span>

                                <strong className="text-success">

                                    ₹{" "}
                                    {cartTotal.toFixed(2)}

                                </strong>

                            </div>


                            <hr />


                            <button
                                className="btn btn-success w-100"
                                onClick={() =>
                                    alert(
                                        "Checkout functionality can be added next."
                                    )
                                }
                            >

                                Proceed to Checkout

                            </button>


                            <Link
                                to="/shop"
                                className="btn btn-outline-secondary w-100 mt-2"
                            >

                                Continue Shopping

                            </Link>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}