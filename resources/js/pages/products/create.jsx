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

        // 🔹 SEO + OG
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

    const submit = async (e) => {
        e.preventDefault();

        const data = new FormData();

        Object.keys(form).forEach(key => {
            data.append(key, form[key]);
        });

        data.append("image", image);

        if (seoImage) data.append("seo_image", seoImage);
        if (ogImage) data.append("og_image", ogImage);

        await axios.post("/products", data, {
            headers: { "Content-Type": "multipart/form-data" }
        });

        navigate("/");
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Add Product</h3>
                <Link to="/" className="btn btn-secondary">Back</Link>
            </div>

            <div className="card shadow-sm">
                <div className="card-body">
                    <form onSubmit={submit}>

                        {/* BASIC DETAILS */}
                        <div className="row mb-3">
                            <div className="col">
                                <input className="form-control" placeholder="Name"
                                    onChange={e => setForm({ ...form, name: e.target.value })} />
                            </div>
                            <div className="col">
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Price"
                                    min="0"
                                    step="0.01"
                                    onChange={e => setForm({ ...form, price: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <textarea className="form-control" placeholder="Details"
                                onChange={e => setForm({ ...form, details: e.target.value })}></textarea>
                        </div>

                        <div className="row mb-3">
                            <div className="col">
                                <input className="form-control" placeholder="Size"
                                    onChange={e => setForm({ ...form, size: e.target.value })} />
                            </div>
                            <div className="col">
                                <input className="form-control" placeholder="Color"
                                    onChange={e => setForm({ ...form, color: e.target.value })} />
                            </div>
                            <div className="col">
                                <input className="form-control" placeholder="Category"
                                    onChange={e => setForm({ ...form, category: e.target.value })} />
                            </div>
                        </div>

                        {/* IMAGES */}
                        <div className="mb-3">
                            <label>Main Image</label>
                            <input type="file" className="form-control"
                                onChange={e => setImage(e.target.files[0])} />
                        </div>

                        <div className="mb-3">
                            <label>SEO Image</label>
                            <input type="file" className="form-control"
                                onChange={e => setSeoImage(e.target.files[0])} />
                        </div>

                        <div className="mb-3">
                            <label>OG Image</label>
                            <input type="file" className="form-control"
                                onChange={e => setOgImage(e.target.files[0])} />
                        </div>

                        <hr />

                        {/* SEO META */}
                        <h5>SEO & OG Meta Information</h5>

                        <div className="mb-3">
                            <input className="form-control" placeholder="SEO Meta Title"
                                onChange={e => setForm({ ...form, seo_meta_title: e.target.value })} />
                        </div>

                        <div className="mb-3">
                            <input className="form-control" placeholder="OG Meta Title"
                                onChange={e => setForm({ ...form, og_meta_title: e.target.value })} />
                        </div>

                        <div className="mb-3">
                            <textarea className="form-control" placeholder="SEO Meta Keywords"
                                onChange={e => setForm({ ...form, seo_meta_keywords: e.target.value })}></textarea>
                        </div>

                        <div className="mb-3">
                            <textarea className="form-control" placeholder="OG Meta Keywords"
                                onChange={e => setForm({ ...form, og_meta_keywords: e.target.value })}></textarea>
                        </div>

                        <div className="mb-3">
                            <textarea className="form-control" placeholder="SEO Meta Description"
                                onChange={e => setForm({ ...form, seo_meta_description: e.target.value })}></textarea>
                        </div>

                        <div className="mb-3">
                            <textarea className="form-control" placeholder="OG Meta Description"
                                onChange={e => setForm({ ...form, og_meta_description: e.target.value })}></textarea>
                        </div>

                        <div className="mb-3">
                            <input className="form-control" placeholder="SEO Canonical URL"
                                onChange={e => setForm({ ...form, seo_canonical: e.target.value })} />
                        </div>

                        <button className="btn btn-success">Save Product</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
