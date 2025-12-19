import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get("/products").then(res => {
            setProducts(res.data);
        });
    }, []);

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Our Products</h2>

            <div className="row">
                {products.map(product => (
                    <div className="col-md-4 mb-4" key={product.id}>
                        <div className="card h-100 shadow-sm product-card">

                            {/* IMAGE */}
                            <img
                                src={`/images/${product.image}`}
                                className="card-img-top product-image"
                                alt={product.name}
                            />

                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">{product.name}</h5>

                                <h6 className="text-success fw-bold">
                                    ₹ {product.price}
                                </h6>

                                <p className="text-muted small">
                                    {product.details.length > 100
                                        ? product.details.substring(0, 100) + "..."
                                        : product.details}
                                </p>

                                <ul className="list-group list-group-flush mb-3">
                                    <li className="list-group-item p-1">
                                        <strong>Category:</strong> {product.category}
                                    </li>
                                    <li className="list-group-item p-1">
                                        <strong>Size:</strong> {product.size}
                                    </li>
                                    <li className="list-group-item p-1">
                                        <strong>Color:</strong> {product.color}
                                    </li>
                                </ul>

                                {/* VIEW MORE BUTTON */}
                                <button
                                    className="btn btn-outline-primary mt-auto"
                                   onClick={() => navigate(`/shop/product/${product.id}`)}

                                >
                                    View More
                                </button>
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
