import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import StockAdjustment from "../../components/StockAdjustment";
import StockHistory from "../../components/StockHistory";

export default function Edit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        details: "",
        price: "",
        size: "",
        color: "",
        category: "",

        stock_quantity: 0,
        minimum_stock: 5,
        status: "active",

        seo_meta_title: "",
        og_meta_title: "",
        seo_meta_keywords: "",
        og_meta_keywords: "",
        seo_meta_description: "",
        og_meta_description: "",
        seo_canonical: "",

        image: "",
        seo_image: "",
        og_image: ""
    });

    const [newImage, setNewImage] = useState(null);
    const [newSeoImage, setNewSeoImage] = useState(null);
    const [newOgImage, setNewOgImage] = useState(null);

    const [preview, setPreview] = useState(null);
    const [seoPreview, setSeoPreview] = useState(null);
    const [ogPreview, setOgPreview] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [historyRefresh, setHistoryRefresh] = useState(0);

    useEffect(() => {
        axios
            .get(`/products/${id}/edit`)
            .then(res => {

                setForm(res.data);

                if (res.data.image) {
                    setPreview(
                        `/images/${res.data.image}`
                    );
                }

                if (res.data.seo_image) {
                    setSeoPreview(
                        `/images/${res.data.seo_image}`
                    );
                }

                if (res.data.og_image) {
                    setOgPreview(
                        `/images/${res.data.og_image}`
                    );
                }

            })
            .catch(err => {
                setError(
                    "Unable to load product."
                );
            });
    }, [id]);

    const handleChange = (key, value) => {
        setForm(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const update = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {

            const data = new FormData();

            data.append(
                "name",
                form.name
            );

            data.append(
                "details",
                form.details
            );

            data.append(
                "price",
                form.price
            );

            data.append(
                "size",
                form.size
            );

            data.append(
                "color",
                form.color
            );

            data.append(
                "category",
                form.category
            );

            data.append(
                "stock_quantity",
                form.stock_quantity
            );

            data.append(
                "minimum_stock",
                form.minimum_stock
            );

            data.append(
                "status",
                form.status
            );

            data.append(
                "seo_meta_title",
                form.seo_meta_title || ""
            );

            data.append(
                "og_meta_title",
                form.og_meta_title || ""
            );

            data.append(
                "seo_meta_keywords",
                form.seo_meta_keywords || ""
            );

            data.append(
                "og_meta_keywords",
                form.og_meta_keywords || ""
            );

            data.append(
                "seo_meta_description",
                form.seo_meta_description || ""
            );

            data.append(
                "og_meta_description",
                form.og_meta_description || ""
            );

            data.append(
                "seo_canonical",
                form.seo_canonical || ""
            );

            if (newImage) {
                data.append(
                    "image",
                    newImage
                );
            }

            if (newSeoImage) {
                data.append(
                    "seo_image",
                    newSeoImage
                );
            }

            if (newOgImage) {
                data.append(
                    "og_image",
                    newOgImage
                );
            }

            const res = await axios.post(
                `/products/${id}`,
                data,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data"
                    }
                }
            );

            setForm(res.data.product);

            setHistoryRefresh(
                value => value + 1
            );

            alert(
                "Product updated successfully."
            );

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Unable to update product."
            );

        } finally {
            setLoading(false);
        }
    };

    const handleStockUpdated = (product) => {
        setForm(prev => ({
            ...prev,
            stock_quantity:
                product.stock_quantity
        }));

        setHistoryRefresh(
            value => value + 1
        );
    };

    return (
        <div className="container mt-4">

            <div className="d-flex justify-content-between align-items-center mb-3">

                <h3>
                    Edit Product
                </h3>

                <Link
                    to="/"
                    className="btn btn-secondary"
                >
                    Back
                </Link>

            </div>

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            <div className="card shadow-sm">

                <div className="card-body">

                    <form onSubmit={update}>

                        <h5>
                            Product Information
                        </h5>

                        <div className="row mb-3 mt-3">

                            <div className="col-md-6">

                                <input
                                    className="form-control"
                                    placeholder="Name"
                                    value={form.name}
                                    onChange={e =>
                                        handleChange(
                                            "name",
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                            <div className="col-md-6">

                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    className="form-control"
                                    placeholder="Price"
                                    value={form.price}
                                    onChange={e =>
                                        handleChange(
                                            "price",
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                        </div>

                        <textarea
                            className="form-control mb-3"
                            placeholder="Details"
                            rows="4"
                            value={form.details}
                            onChange={e =>
                                handleChange(
                                    "details",
                                    e.target.value
                                )
                            }
                        />

                        <div className="row mb-3">

                            <div className="col-md-4">

                                <input
                                    className="form-control"
                                    placeholder="Size"
                                    value={form.size}
                                    onChange={e =>
                                        handleChange(
                                            "size",
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                            <div className="col-md-4">

                                <input
                                    className="form-control"
                                    placeholder="Color"
                                    value={form.color}
                                    onChange={e =>
                                        handleChange(
                                            "color",
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                            <div className="col-md-4">

                                <input
                                    className="form-control"
                                    placeholder="Category"
                                    value={form.category}
                                    onChange={e =>
                                        handleChange(
                                            "category",
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                        </div>

                        {/* INVENTORY */}

                        <hr />

                        <h5>
                            Inventory
                        </h5>

                        <div className="row mt-3 mb-3">

                            <div className="col-md-4">

                                <label className="form-label">
                                    Current Stock
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    className="form-control"
                                    value={
                                        form.stock_quantity
                                    }
                                    onChange={e =>
                                        handleChange(
                                            "stock_quantity",
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                            <div className="col-md-4">

                                <label className="form-label">
                                    Minimum Stock
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    className="form-control"
                                    value={
                                        form.minimum_stock
                                    }
                                    onChange={e =>
                                        handleChange(
                                            "minimum_stock",
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                            <div className="col-md-4">

                                <label className="form-label">
                                    Status
                                </label>

                                <select
                                    className="form-select"
                                    value={form.status}
                                    onChange={e =>
                                        handleChange(
                                            "status",
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="active">
                                        Active
                                    </option>

                                    <option value="inactive">
                                        Inactive
                                    </option>

                                </select>

                            </div>

                        </div>

                        {/* IMAGES */}

                        <hr />

                        <h5>
                            Images
                        </h5>

                        <div className="mb-3 mt-3">

                            <label>
                                Main Image
                            </label>

                            <br />

                            {preview && (
                                <img
                                    src={preview}
                                    width="120"
                                    className="mb-2 rounded"
                                />
                            )}

                            <input
                                type="file"
                                className="form-control"
                                accept="image/*"
                                onChange={e => {

                                    const file =
                                        e.target.files[0];

                                    setNewImage(file);

                                    if (file) {
                                        setPreview(
                                            URL.createObjectURL(
                                                file
                                            )
                                        );
                                    }

                                }}
                            />

                        </div>

                        <div className="mb-3">

                            <label>
                                SEO Image
                            </label>

                            <br />

                            {seoPreview && (
                                <img
                                    src={seoPreview}
                                    width="120"
                                    className="mb-2 rounded"
                                />
                            )}

                            <input
                                type="file"
                                className="form-control"
                                accept="image/*"
                                onChange={e => {

                                    const file =
                                        e.target.files[0];

                                    setNewSeoImage(file);

                                    if (file) {
                                        setSeoPreview(
                                            URL.createObjectURL(
                                                file
                                            )
                                        );
                                    }

                                }}
                            />

                        </div>

                        <div className="mb-3">

                            <label>
                                OG Image
                            </label>

                            <br />

                            {ogPreview && (
                                <img
                                    src={ogPreview}
                                    width="120"
                                    className="mb-2 rounded"
                                />
                            )}

                            <input
                                type="file"
                                className="form-control"
                                accept="image/*"
                                onChange={e => {

                                    const file =
                                        e.target.files[0];

                                    setNewOgImage(file);

                                    if (file) {
                                        setOgPreview(
                                            URL.createObjectURL(
                                                file
                                            )
                                        );
                                    }

                                }}
                            />

                        </div>

                        {/* SEO */}

                        <hr />

                        <h5>
                            SEO & OG Meta
                        </h5>

                        <input
                            className="form-control mb-2"
                            placeholder="SEO Meta Title"
                            value={
                                form.seo_meta_title || ""
                            }
                            onChange={e =>
                                handleChange(
                                    "seo_meta_title",
                                    e.target.value
                                )
                            }
                        />

                        <input
                            className="form-control mb-2"
                            placeholder="OG Meta Title"
                            value={
                                form.og_meta_title || ""
                            }
                            onChange={e =>
                                handleChange(
                                    "og_meta_title",
                                    e.target.value
                                )
                            }
                        />

                        <textarea
                            className="form-control mb-2"
                            placeholder="SEO Meta Keywords"
                            value={
                                form.seo_meta_keywords || ""
                            }
                            onChange={e =>
                                handleChange(
                                    "seo_meta_keywords",
                                    e.target.value
                                )
                            }
                        />

                        <textarea
                            className="form-control mb-2"
                            placeholder="OG Meta Keywords"
                            value={
                                form.og_meta_keywords || ""
                            }
                            onChange={e =>
                                handleChange(
                                    "og_meta_keywords",
                                    e.target.value
                                )
                            }
                        />

                        <textarea
                            className="form-control mb-2"
                            placeholder="SEO Meta Description"
                            value={
                                form.seo_meta_description || ""
                            }
                            onChange={e =>
                                handleChange(
                                    "seo_meta_description",
                                    e.target.value
                                )
                            }
                        />

                        <textarea
                            className="form-control mb-3"
                            placeholder="OG Meta Description"
                            value={
                                form.og_meta_description || ""
                            }
                            onChange={e =>
                                handleChange(
                                    "og_meta_description",
                                    e.target.value
                                )
                            }
                        />

                        <input
                            className="form-control mb-3"
                            placeholder="SEO Canonical URL"
                            value={
                                form.seo_canonical || ""
                            }
                            onChange={e =>
                                handleChange(
                                    "seo_canonical",
                                    e.target.value
                                )
                            }
                        />

                        <button
                            className="btn btn-success"
                            disabled={loading}
                        >
                            {loading
                                ? "Updating..."
                                : "Update Product"}
                        </button>

                    </form>

                </div>
            </div>

            {/* STOCK ADJUSTMENT */}

            <StockAdjustment
                product={form}
                onUpdated={handleStockUpdated}
            />

            {/* STOCK HISTORY */}

            <StockHistory
                productId={id}
                refreshKey={historyRefresh}
            />

        </div>
    );
}