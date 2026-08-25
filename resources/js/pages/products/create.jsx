import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Create() {
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
    });

    const [image, setImage] = useState(null);
    const [seoImage, setSeoImage] = useState(null);
    const [ogImage, setOgImage] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (key, value) => {
        setForm(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const submit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            const data = new FormData();

            Object.keys(form).forEach(key => {
                data.append(key, form[key]);
            });

            if (image) {
                data.append("image", image);
            }

            if (seoImage) {
                data.append("seo_image", seoImage);
            }

            if (ogImage) {
                data.append("og_image", ogImage);
            }

            await axios.post("/products", data, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            navigate("/");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to create product."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">

            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Add Product</h3>

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

                    <form onSubmit={submit}>

                        {/* BASIC DETAILS */}

                        <h5 className="mb-3">
                            Product Information
                        </h5>

                        <div className="row mb-3">

                            <div className="col-md-6">
                                <label className="form-label">
                                    Name
                                </label>

                                <input
                                    className="form-control"
                                    value={form.name}
                                    required
                                    onChange={e =>
                                        handleChange(
                                            "name",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">
                                    Price
                                </label>

                                <input
                                    type="number"
                                    className="form-control"
                                    min="0"
                                    step="0.01"
                                    value={form.price}
                                    required
                                    onChange={e =>
                                        handleChange(
                                            "price",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>

                        </div>

                        <div className="mb-3">

                            <label className="form-label">
                                Details
                            </label>

                            <textarea
                                className="form-control"
                                rows="4"
                                value={form.details}
                                required
                                onChange={e =>
                                    handleChange(
                                        "details",
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        <div className="row mb-3">

                            <div className="col-md-4">
                                <label className="form-label">
                                    Size
                                </label>

                                <input
                                    className="form-control"
                                    value={form.size}
                                    required
                                    onChange={e =>
                                        handleChange(
                                            "size",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>

                            <div className="col-md-4">
                                <label className="form-label">
                                    Color
                                </label>

                                <input
                                    className="form-control"
                                    value={form.color}
                                    required
                                    onChange={e =>
                                        handleChange(
                                            "color",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>

                            <div className="col-md-4">
                                <label className="form-label">
                                    Category
                                </label>

                                <input
                                    className="form-control"
                                    value={form.category}
                                    required
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

                        <h5 className="mb-3">
                            Inventory
                        </h5>

                        <div className="row mb-3">

                            <div className="col-md-4">

                                <label className="form-label">
                                    Stock Quantity
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    className="form-control"
                                    value={form.stock_quantity}
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
                                    value={form.minimum_stock}
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
                                    Product Status
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

                        <h5 className="mb-3">
                            Images
                        </h5>

                        <div className="mb-3">

                            <label className="form-label">
                                Main Image
                            </label>

                            <input
                                type="file"
                                className="form-control"
                                accept="image/*"
                                required
                                onChange={e =>
                                    setImage(
                                        e.target.files[0]
                                    )
                                }
                            />

                        </div>

                        <div className="mb-3">

                            <label className="form-label">
                                SEO Image
                            </label>

                            <input
                                type="file"
                                className="form-control"
                                accept="image/*"
                                onChange={e =>
                                    setSeoImage(
                                        e.target.files[0]
                                    )
                                }
                            />

                        </div>

                        <div className="mb-3">

                            <label className="form-label">
                                OG Image
                            </label>

                            <input
                                type="file"
                                className="form-control"
                                accept="image/*"
                                onChange={e =>
                                    setOgImage(
                                        e.target.files[0]
                                    )
                                }
                            />

                        </div>

                        {/* SEO */}

                        <hr />

                        <h5>
                            SEO & OG Meta Information
                        </h5>

                        <div className="mb-3 mt-3">

                            <input
                                className="form-control"
                                placeholder="SEO Meta Title"
                                value={form.seo_meta_title}
                                onChange={e =>
                                    handleChange(
                                        "seo_meta_title",
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        <div className="mb-3">

                            <input
                                className="form-control"
                                placeholder="OG Meta Title"
                                value={form.og_meta_title}
                                onChange={e =>
                                    handleChange(
                                        "og_meta_title",
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        <div className="mb-3">

                            <textarea
                                className="form-control"
                                placeholder="SEO Meta Keywords"
                                value={form.seo_meta_keywords}
                                onChange={e =>
                                    handleChange(
                                        "seo_meta_keywords",
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        <div className="mb-3">

                            <textarea
                                className="form-control"
                                placeholder="OG Meta Keywords"
                                value={form.og_meta_keywords}
                                onChange={e =>
                                    handleChange(
                                        "og_meta_keywords",
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        <div className="mb-3">

                            <textarea
                                className="form-control"
                                placeholder="SEO Meta Description"
                                value={form.seo_meta_description}
                                onChange={e =>
                                    handleChange(
                                        "seo_meta_description",
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        <div className="mb-3">

                            <textarea
                                className="form-control"
                                placeholder="OG Meta Description"
                                value={form.og_meta_description}
                                onChange={e =>
                                    handleChange(
                                        "og_meta_description",
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        <div className="mb-3">

                            <input
                                className="form-control"
                                placeholder="SEO Canonical URL"
                                value={form.seo_canonical}
                                onChange={e =>
                                    handleChange(
                                        "seo_canonical",
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        <button
                            type="submit"
                            className="btn btn-success"
                            disabled={loading}
                        >
                            {loading
                                ? "Saving..."
                                : "Save Product"}
                        </button>

                    </form>

                </div>
            </div>
        </div>
    );
}