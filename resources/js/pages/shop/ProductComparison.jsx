import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCompare } from "../../context/CompareContext";

export default function ProductComparison() {
    const navigate = useNavigate();
    const { compareList, removeFromCompare, clearCompare } = useCompare();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            if (compareList.length === 0) return;

            const ids = compareList.map(p => p.id).join(",");
            setLoading(true);
            try {
                const res = await axios.get("/products/compare?ids=" + ids);
                setProducts(res.data);
            } catch (err) {
                setProducts(compareList);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [compareList]);

    const compareFields = [
        { label: "Image", key: "image", render: (p) => p.image ? (
            <img src={"/images/" + p.image} width="80" className="rounded" alt={p.name} />
        ) : <span className="text-muted">N/A</span> },
        { label: "Name", key: "name", render: (p) => p.name },
        { label: "Price", key: "price", render: (p) => "Rs. " + p.price },
        { label: "Category", key: "category", render: (p) => p.category },
        { label: "Size", key: "size", render: (p) => p.size },
        { label: "Color", key: "color", render: (p) => p.color },
        { label: "Details", key: "details", render: (p) => p.details },
        { label: "SEO Title", key: "seo_meta_title", render: (p) => p.seo_meta_title || "-" },
        { label: "OG Title", key: "og_meta_title", render: (p) => p.og_meta_title || "-" },
        { label: "SEO Description", key: "seo_meta_description", render: (p) => p.seo_meta_description || "-" },
    ];

    if (compareList.length < 2) {
        return (
            <div className="container mt-5">
                <div className="text-center py-5">
                    <h3>No products to compare</h3>
                    <p className="text-muted">Add at least 2 products to compare them side by side.</p>
                    <Link to="/shop" className="btn btn-primary">
                        Browse Products
                    </Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="container mt-5">
                <p>Loading comparison...</p>
            </div>
        );
    }

    const displayProducts = products.slice(0, 4);

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Product Comparison</h3>
                <div>
                    <button onClick={clearCompare} className="btn btn-outline-danger btn-sm me-2">
                        Clear All
                    </button>
                    <Link to="/shop" className="btn btn-secondary btn-sm">
                        Back to Shop
                    </Link>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-bordered align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Feature</th>
                            {displayProducts.map(product => (
                                <th key={product.id} className="text-center">
                                    <div className="mb-2">{product.name}</div>
                                    <button
                                        onClick={() => removeFromCompare(product.id)}
                                        className="btn btn-sm btn-outline-danger"
                                    >
                                        Remove
                                    </button>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {compareFields.map(field => (
                            <tr key={field.key}>
                                <th className="table-light">{field.label}</th>
                                {displayProducts.map(product => (
                                    <td key={product.id} className="text-center">
                                        {field.render(product)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {displayProducts.length > 0 && (
                <div className="d-flex justify-content-center gap-2 mt-4">
                    {displayProducts.map(product => (
                        <Link
                            key={product.id}
                            to={"/shop/product/" + product.id}
                            className="btn btn-primary"
                        >
                            View {product.name}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
