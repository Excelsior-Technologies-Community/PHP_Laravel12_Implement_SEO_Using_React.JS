import React, { useEffect, useState } from "react";
import axios from "axios";

export default function StockHistory({
    productId,
    refreshKey = 0
}) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchHistory = async () => {
        try {
            setLoading(true);

            const res = await axios.get(
                `/products/${productId}/stock-history`
            );

            setHistory(
                res.data.movements?.data || []
            );

        } catch (error) {

            console.error(
                "Stock history error:",
                error
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [productId, refreshKey]);

    const getTypeBadge = (type) => {

        if (type === "stock_in") {
            return (
                <span className="badge bg-success">
                    Stock In
                </span>
            );
        }

        if (type === "stock_out") {
            return (
                <span className="badge bg-danger">
                    Stock Out
                </span>
            );
        }

        return (
            <span className="badge bg-warning text-dark">
                Adjustment
            </span>
        );
    };

    if (loading) {
        return (
            <div className="card mt-4">
                <div className="card-body">
                    Loading stock history...
                </div>
            </div>
        );
    }

    return (
        <div className="card shadow-sm mt-4">

            <div className="card-header">
                <h5 className="mb-0">
                    Stock History
                </h5>
            </div>

            <div className="card-body">

                <div className="table-responsive">

                    <table className="table table-bordered table-hover align-middle">

                        <thead className="table-light">

                            <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Previous Stock</th>
                                <th>Changed Quantity</th>
                                <th>New Stock</th>
                                <th>Reason</th>
                                <th>Updated By</th>
                            </tr>

                        </thead>

                        <tbody>

                            {history.length === 0 ? (

                                <tr>
                                    <td
                                        colSpan="7"
                                        className="text-center text-muted"
                                    >
                                        No stock history found.
                                    </td>
                                </tr>

                            ) : (

                                history.map(item => (

                                    <tr key={item.id}>

                                        <td>
                                            {new Date(
                                                item.created_at
                                            ).toLocaleString()}
                                        </td>

                                        <td>
                                            {getTypeBadge(
                                                item.type
                                            )}
                                        </td>

                                        <td>
                                            {item.previous_stock}
                                        </td>

                                        <td>

                                            {item.changed_quantity > 0
                                                ? `+${item.changed_quantity}`
                                                : item.changed_quantity}

                                        </td>

                                        <td>
                                            <strong>
                                                {item.new_stock}
                                            </strong>
                                        </td>

                                        <td>
                                            {item.reason || "-"}
                                        </td>

                                        <td>
                                            {item.user?.name || "System"}
                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>
        </div>
    );
}