import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Index() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const res = await axios.get("/products");
        setProducts(res.data);
    };

    const deleteProduct = async (id) => {
        if (!confirm("Are you sure?")) return;
        await axios.delete(`/products/${id}`);
        fetchProducts();
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
                                                src={`/images/${p.image}`}
                                                width="60"
                                                className="rounded"
                                            />
                                        </td>
                                        <td>{p.name}</td>
                                        <td>₹ {p.price}</td>
                                        <td>{p.size}</td>
                                        <td>{p.color}</td>
                                        <td>{p.category}</td>
                                        <td>
                                            <Link
                                                to={`/edit/${p.id}`}
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
            </div>
        </div>
    );
}
