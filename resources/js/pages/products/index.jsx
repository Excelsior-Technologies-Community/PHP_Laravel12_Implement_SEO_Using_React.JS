import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Index() {

    const [products, setProducts] = useState([]);
    const [meta, setMeta] = useState(null);

    const [status, setStatus] = useState("");
    const [stockStatus, setStockStatus] = useState("");

    useEffect(() => {
        fetchProducts();
    }, [status, stockStatus]);

    const fetchProducts = async (page = 1) => {

        const params = new URLSearchParams();

        params.set("page", page);
        params.set("per_page", 10);

        if (status) {
            params.set(
                "status",
                status
            );
        }

        if (stockStatus) {
            params.set(
                "stock_status",
                stockStatus
            );
        }

        const res = await axios.get(
            "/products?" + params.toString()
        );

        const data = res.data;

        setProducts(
            data.data || []
        );

        setMeta(
            data.current_page
                ? {
                    current_page:
                        data.current_page,

                    last_page:
                        data.last_page,

                    total:
                        data.total
                }
                : null
        );
    };

    const deleteProduct = async (id) => {

        if (
            !window.confirm(
                "Are you sure you want to delete this product?"
            )
        ) {
            return;
        }

        await axios.delete(
            "/products/" + id
        );

        fetchProducts(
            meta?.current_page || 1
        );
    };

    const renderPageNumbers = () => {

        if (!meta) {
            return null;
        }

        const pages = [];

        const start = Math.max(
            1,
            meta.current_page - 2
        );

        const end = Math.min(
            meta.last_page,
            meta.current_page + 2
        );

        for (
            let i = start;
            i <= end;
            i++
        ) {
            pages.push(i);
        }

        return pages.map(page => (

            <li
                key={page}
                className={
                    `page-item ${
                        page === meta.current_page
                            ? "active"
                            : ""
                    }`
                }
            >

                <button
                    className="page-link"
                    onClick={() =>
                        fetchProducts(page)
                    }
                >
                    {page}
                </button>

            </li>

        ));
    };

    const getStockBadge = (product) => {

        if (product.stock_quantity <= 0) {
            return (
                <span className="badge bg-danger">
                    Out of Stock
                </span>
            );
        }

        if (
            product.stock_quantity <=
            product.minimum_stock
        ) {
            return (
                <span className="badge bg-warning text-dark">
                    Low Stock
                </span>
            );
        }

        return (
            <span className="badge bg-success">
                Available
            </span>
        );
    };

    return (
        <div className="container mt-4">

            <div className="d-flex justify-content-between align-items-center mb-3">

                <h3>
                    Products
                </h3>

                <Link
                    to="/create"
                    className="btn btn-success"
                >
                    + Add Product
                </Link>

            </div>

            {/* FILTERS */}

            <div className="card shadow-sm mb-3">

                <div className="card-body">

                    <div className="row">

                        <div className="col-md-4">

                            <label className="form-label">
                                Product Status
                            </label>

                            <select
                                className="form-select"
                                value={status}
                                onChange={e =>
                                    setStatus(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="">
                                    All Status
                                </option>

                                <option value="active">
                                    Active
                                </option>

                                <option value="inactive">
                                    Inactive
                                </option>

                            </select>

                        </div>

                        <div className="col-md-4">

                            <label className="form-label">
                                Stock Status
                            </label>

                            <select
                                className="form-select"
                                value={stockStatus}
                                onChange={e =>
                                    setStockStatus(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="">
                                    All Stock
                                </option>

                                <option value="available">
                                    Available
                                </option>

                                <option value="low">
                                    Low Stock
                                </option>

                                <option value="out">
                                    Out of Stock
                                </option>

                            </select>

                        </div>

                    </div>

                </div>

            </div>

            <div className="card shadow-sm">

                <div className="card-body">

                    <div className="table-responsive">

                        <table className="table table-bordered table-hover align-middle">

                            <thead className="table-dark">

                                <tr>

                                    <th>
                                        Image
                                    </th>

                                    <th>
                                        Name
                                    </th>

                                    <th>
                                        Price
                                    </th>

                                    <th>
                                        Stock
                                    </th>

                                    <th>
                                        Stock Status
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Size
                                    </th>

                                    <th>
                                        Color
                                    </th>

                                    <th>
                                        Category
                                    </th>

                                    <th>
                                        Action
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {products.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="10"
                                            className="text-center"
                                        >
                                            No products found
                                        </td>

                                    </tr>

                                ) : (

                                    products.map(p => (

                                        <tr key={p.id}>

                                            <td>

                                                <img
                                                    src={
                                                        "/images/" +
                                                        p.image
                                                    }
                                                    width="60"
                                                    height="60"
                                                    className="rounded"
                                                    style={{
                                                        objectFit:
                                                            "cover"
                                                    }}
                                                />

                                            </td>

                                            <td>
                                                {p.name}
                                            </td>

                                            <td>
                                                Rs. {p.price}
                                            </td>

                                            <td>

                                                <strong>
                                                    {
                                                        p.stock_quantity
                                                    }
                                                </strong>

                                                <br />

                                                <small className="text-muted">
                                                    Min:{" "}
                                                    {
                                                        p.minimum_stock
                                                    }
                                                </small>

                                            </td>

                                            <td>
                                                {getStockBadge(p)}
                                            </td>

                                            <td>

                                                {p.status === "active"
                                                    ? (
                                                        <span className="badge bg-success">
                                                            Active
                                                        </span>
                                                    )
                                                    : (
                                                        <span className="badge bg-secondary">
                                                            Inactive
                                                        </span>
                                                    )}

                                            </td>

                                            <td>
                                                {p.size}
                                            </td>

                                            <td>
                                                {p.color}
                                            </td>

                                            <td>
                                                {p.category}
                                            </td>

                                            <td>

                                                <Link
                                                    to={
                                                        "/edit/" +
                                                        p.id
                                                    }
                                                    className="btn btn-sm btn-primary"
                                                >
                                                    Edit
                                                </Link>

                                                <button
                                                    onClick={() =>
                                                        deleteProduct(
                                                            p.id
                                                        )
                                                    }
                                                    className="btn btn-sm btn-danger ms-2"
                                                >
                                                    Delete
                                                </button>

                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

                {meta && (

                    <div className="card-footer">

                        <nav>

                            <ul className="pagination justify-content-center mb-0">

                                <li
                                    className={
                                        `page-item ${
                                            meta.current_page === 1
                                                ? "disabled"
                                                : ""
                                        }`
                                    }
                                >

                                    <button
                                        className="page-link"
                                        onClick={() =>
                                            fetchProducts(
                                                meta.current_page - 1
                                            )
                                        }
                                    >
                                        Previous
                                    </button>

                                </li>

                                {renderPageNumbers()}

                                <li
                                    className={
                                        `page-item ${
                                            meta.current_page ===
                                            meta.last_page
                                                ? "disabled"
                                                : ""
                                        }`
                                    }
                                >

                                    <button
                                        className="page-link"
                                        onClick={() =>
                                            fetchProducts(
                                                meta.current_page + 1
                                            )
                                        }
                                    >
                                        Next
                                    </button>

                                </li>

                            </ul>

                        </nav>

                    </div>

                )}

            </div>

        </div>
    );
}