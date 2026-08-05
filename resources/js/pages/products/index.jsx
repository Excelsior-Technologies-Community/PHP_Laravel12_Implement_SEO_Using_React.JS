import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Index() {
    const [products, setProducts] = useState([]);
    const [meta, setMeta] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async (page = 1) => {
        const res = await axios.get("/products?page=" + page + "&per_page=10");
        const data = res.data;
        setProducts(data.data || []);
        setMeta(data.current_page ? {
            current_page: data.current_page,
            last_page: data.last_page,
            total: data.total,
        } : null);
    };

    const deleteProduct = async (id) => {
        if (!confirm("Are you sure?")) return;
        await axios.delete("/products/" + id);
        fetchProducts();
    };

    const renderPageNumbers = () => {
        if (!meta) return null;
        const pages = [];
        const start = Math.max(1, meta.current_page - 2);
        const end = Math.min(meta.last_page, meta.current_page + 2);
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages.map(page => (
            <li key={page} className={`page-item ${page === meta.current_page ? "active" : ""}`}>
                <button className="page-link" onClick={() => fetchProducts(page)}>
                    {page}
                </button>
            </li>
        ));
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Products</h3>
                <Link to="/create" className="btn btn-success">
                    + Add Product
                </Link>
            </div>

            <div className="card shadow-sm">
                <div className="card-body">
                    <table className="table table-bordered table-hover align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Size</th>
                                <th>Color</th>
                                <th>Category</th>
                                <th width="160">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center">
                                        No products found
                                    </td>
                                </tr>
                            ) : (
                                products.map(p => (
                                    <tr key={p.id}>
                                        <td>
                                            <img
                                                src={"/images/" + p.image}
                                                width="60"
                                                className="rounded"
                                            />
                                        </td>
                                        <td>{p.name}</td>
                                        <td>Rs. {p.price}</td>
                                        <td>{p.size}</td>
                                        <td>{p.color}</td>
                                        <td>{p.category}</td>
                                        <td>
                                            <Link
                                                to={"/edit/" + p.id}
                                                className="btn btn-sm btn-primary me-2"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => deleteProduct(p.id)}
                                                className="btn btn-sm btn-danger"
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

                {meta && (
                    <div className="card-footer">
                        <nav>
                            <ul className="pagination justify-content-center mb-0">
                                <li className={`page-item ${meta.current_page === 1 ? "disabled" : ""}`}>
                                    <button className="page-link" onClick={() => fetchProducts(meta.current_page - 1)}>
                                        Previous
                                    </button>
                                </li>
                                {renderPageNumbers()}
                                <li className={`page-item ${meta.current_page === meta.last_page ? "disabled" : ""}`}>
                                    <button className="page-link" onClick={() => fetchProducts(meta.current_page + 1)}>
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
