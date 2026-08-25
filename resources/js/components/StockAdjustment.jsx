import React, { useState } from "react";
import axios from "axios";

export default function StockAdjustment({
    product,
    onUpdated
}) {
    const [type, setType] = useState("stock_in");
    const [quantity, setQuantity] = useState("");
    const [reason, setReason] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const submit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setMessage("");
        setError("");

        try {
            const response = await axios.post(
                `/products/${product.id}/stock`,
                {
                    type: type,
                    quantity: Number(quantity),
                    reason: reason.trim(),
                }
            );

            setMessage(
                response.data.message ||
                "Stock updated successfully."
            );

            setQuantity("");
            setReason("");

            /*
            |--------------------------------------------------------------------------
            | Update parent product
            |--------------------------------------------------------------------------
            */

            if (
                response.data?.data?.product &&
                onUpdated
            ) {
                onUpdated(
                    response.data.data.product
                );
            }

        } catch (err) {

            console.error(
                "Stock update error:",
                err.response?.data || err
            );

            /*
            |--------------------------------------------------------------------------
            | Validation errors
            |--------------------------------------------------------------------------
            */

            if (err.response?.status === 422) {

                const validationErrors =
                    err.response?.data?.errors;

                if (validationErrors) {

                    const firstError =
                        Object.values(
                            validationErrors
                        )[0]?.[0];

                    setError(
                        firstError ||
                        "Please check the entered values."
                    );

                } else {

                    setError(
                        err.response?.data?.message ||
                        "Unable to update stock."
                    );
                }

            } else {

                setError(
                    err.response?.data?.message ||
                    "Unable to update stock."
                );
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card shadow-sm mt-4">

            <div className="card-header">
                <h5 className="mb-0">
                    Stock Adjustment
                </h5>
            </div>

            <div className="card-body">

                {message && (
                    <div className="alert alert-success">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                <form onSubmit={submit}>

                    <div className="row mb-3">

                        {/* Current Stock */}

                        <div className="col-md-4">

                            <label className="form-label">
                                Current Stock
                            </label>

                            <input
                                type="number"
                                className="form-control"
                                value={
                                    product.stock_quantity ?? 0
                                }
                                disabled
                            />

                        </div>

                        {/* Stock Type */}

                        <div className="col-md-4">

                            <label className="form-label">
                                Stock Type
                            </label>

                            <select
                                className="form-select"
                                value={type}
                                onChange={(e) =>
                                    setType(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="stock_in">
                                    Stock In
                                </option>

                                <option value="stock_out">
                                    Stock Out
                                </option>

                                <option value="adjustment">
                                    Manual Adjustment
                                </option>

                            </select>

                        </div>

                        {/* Quantity */}

                        <div className="col-md-4">

                            <label className="form-label">
                                Quantity
                            </label>

                            <input
                                type="number"
                                min="1"
                                className="form-control"
                                value={quantity}
                                onChange={(e) =>
                                    setQuantity(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter quantity"
                                required
                            />

                        </div>

                    </div>

                    {/* Reason */}

                    <div className="mb-3">

                        <label className="form-label">
                            Reason
                        </label>

                        <textarea
                            className="form-control"
                            rows="3"
                            placeholder="Enter reason for stock change..."
                            value={reason}
                            onChange={(e) =>
                                setReason(
                                    e.target.value
                                )
                            }
                            required
                        />

                    </div>

                    {/* Submit */}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={
                            loading ||
                            !quantity ||
                            !reason.trim()
                        }
                    >

                        {loading
                            ? "Updating..."
                            : "Update Stock"}

                    </button>

                </form>

            </div>

        </div>
    );
}