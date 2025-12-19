import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

export default function ProductShow() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        axios.get(`/products/${id}/edit`).then(res => {
            setProduct(res.data);
        });
    }, [id]);

    if (!product) {
        return <div className="container mt-5">Loading...</div>;
    }

    return (
        <div className="container mt-5">
            <Link to="/shop" className="btn btn-secondary mb-3">
                ← Back to Products
            </Link>

            <div className="row">
                <div className="col-md-6">
                    <img
                        src={`/images/${product.image}`}
                        className="img-fluid rounded shadow"
                        alt={product.name}
                    />
                </div>

                <div className="col-md-6">
                    <h2>{product.name}</h2>
                    <h4 className="text-success">₹ {product.price}</h4>

                    <p className="mt-3">{product.details}</p>

                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">
                            <strong>Category:</strong> {product.category}
                        </li>
                        <li className="list-group-item">
                            <strong>Size:</strong> {product.size}
                        </li>
                        <li className="list-group-item">
                            <strong>Color:</strong> {product.color}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
