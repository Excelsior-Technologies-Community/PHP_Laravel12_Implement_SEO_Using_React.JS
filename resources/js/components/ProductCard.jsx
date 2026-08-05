import React from 'react';
import { useCompare } from '../context/CompareContext';

export default function ProductCard({ product, showCompare = false }) {
    const { isInCompare, addToCompare } = useCompare();

    const handleCompare = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCompare(product);
    };

    return (
        <div className="card h-100 shadow-sm product-card position-relative">
            {showCompare && (
                <button
                    onClick={handleCompare}
                    className={`position-absolute top-0 end-0 m-2 btn btn-sm ${
                        isInCompare(product.id)
                            ? "btn-success"
                            : "btn-outline-secondary"
                    }`}
                    title={isInCompare(product.id) ? "Added to compare" : "Add to compare"}
                >
                    {isInCompare(product.id) ? "+" : "C"}
                </button>
            )}

            <img
                src={"/images/" + product.image}
                className="card-img-top product-image"
                alt={product.name}
            />

            <div className="card-body d-flex flex-column">
                <h5 className="card-title">{product.name}</h5>

                <h6 className="text-success fw-bold">
                    Rs. {product.price}
                </h6>

                <p className="text-muted small">
                    {product.details && product.details.length > 100
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
            </div>
        </div>
    );
}
