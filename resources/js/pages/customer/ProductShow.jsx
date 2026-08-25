import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { useCompare } from "../../context/CompareContext";

export default function ProductShow() {

    const { id } = useParams();

    const [product, setProduct] =
        useState(null);

    const {
        isInCompare,
        addToCompare,
        compareCount
    } = useCompare();

    useEffect(() => {

        axios
            .get(`/products/${id}/edit`)
            .then(res => {
                setProduct(res.data);
            });

    }, [id]);

    if (!product) {

        return (
            <div className="container mt-5">
                Loading...
            </div>
        );
    }

    const isOutOfStock =
        product.stock_quantity <= 0;

    const isLowStock =
        product.stock_quantity > 0 &&
        product.stock_quantity <=
            product.minimum_stock;

    return (

        <div className="container mt-5">

            <div className="row">

                <div className="col-md-6">

                    <img
                        src={
                            `/images/${product.image}`
                        }
                        className="img-fluid rounded shadow"
                        alt={product.name}
                    />

                </div>

                <div className="col-md-6">

                    <h2>
                        {product.name}
                    </h2>

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
                                    Only{" "}
                                    {
                                        product.stock_quantity
                                    }{" "}
                                    left
                                </span>

                            ) : (

                                <span className="badge bg-success">
                                    Available
                                </span>

                            )}

                        </li>

                    </ul>

                    <div className="d-flex gap-2 mt-3">

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
                                ? "Added"
                                : "Add to Compare"}
                        </button>

                        <Link
                            to="/shop"
                            className="btn btn-secondary"
                        >
                            Back to Products
                        </Link>

                        {compareCount > 0 && (

                            <Link
                                to="/compare"
                                className="btn btn-outline-info"
                            >
                                Compare (
                                {compareCount}
                                )
                            </Link>

                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}