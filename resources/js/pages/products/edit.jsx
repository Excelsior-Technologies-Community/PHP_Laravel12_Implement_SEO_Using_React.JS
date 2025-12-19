import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";

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

    useEffect(() => {
        axios.get(`/products/${id}/edit`).then(res => {
            setForm(res.data);

            // 🔹 EXISTING IMAGE PREVIEWS
            if (res.data.image) {
                setPreview(`/images/${res.data.image}`);
            }
            if (res.data.seo_image) {
                setSeoPreview(`/images/${res.data.seo_image}`);
            }
            if (res.data.og_image) {
                setOgPreview(`/images/${res.data.og_image}`);
            }
        });
    }, [id]);

    const update = async (e) => {
        e.preventDefault();

        const data = new FormData();

        // BASIC
        data.append("name", form.name);
        data.append("details", form.details);
        data.append("price", form.price);
        data.append("size", form.size);
        data.append("color", form.color);
        data.append("category", form.category);

        // SEO META
        data.append("seo_meta_title", form.seo_meta_title || "");
        data.append("og_meta_title", form.og_meta_title || "");
        data.append("seo_meta_keywords", form.seo_meta_keywords || "");
        data.append("og_meta_keywords", form.og_meta_keywords || "");
        data.append("seo_meta_description", form.seo_meta_description || "");
        data.append("og_meta_description", form.og_meta_description || "");
        data.append("seo_canonical", form.seo_canonical || "");

        // IMAGES
        if (newImage) data.append("image", newImage);
        if (newSeoImage) data.append("seo_image", newSeoImage);
        if (newOgImage) data.append("og_image", newOgImage);

        await axios.post(`/products/${id}`, data, {
            headers: { "Content-Type": "multipart/form-data" }
        });

        navigate("/");
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Edit Product</h3>
                <Link to="/" className="btn btn-secondary">Back</Link>
            </div>

            <div className="card shadow-sm">
                <div className="card-body">
                    <form onSubmit={update}>

                        {/* NAME & PRICE */}
                        <div className="row mb-3">
                            <div className="col">
                                <input className="form-control" placeholder="Name"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })} />
                            </div>
                            <div className="col">
                                <input type="number" className="form-control" placeholder="Price"
                                    value={form.price}
                                    onChange={e => setForm({ ...form, price: e.target.value })} />
                            </div>
                        </div>

                        {/* DETAILS */}
                        <textarea className="form-control mb-3" placeholder="Details"
                            value={form.details}
                            onChange={e => setForm({ ...form, details: e.target.value })}></textarea>

                        {/* SIZE / COLOR / CATEGORY */}
                        <div className="row mb-3">
                            <div className="col">
                                <input className="form-control" placeholder="Size"
                                    value={form.size}
                                    onChange={e => setForm({ ...form, size: e.target.value })} />
                            </div>
                            <div className="col">
                                <input className="form-control" placeholder="Color"
                                    value={form.color}
                                    onChange={e => setForm({ ...form, color: e.target.value })} />
                            </div>
                            <div className="col">
                                <input className="form-control" placeholder="Category"
                                    value={form.category}
                                    onChange={e => setForm({ ...form, category: e.target.value })} />
                            </div>
                        </div>

                        {/* MAIN IMAGE */}
                        <div className="mb-3">
                            <label>Main Image</label><br />
                            {preview && <img src={preview} width="120" className="mb-2 rounded" />}
                            <input type="file" className="form-control"
                                onChange={e => {
                                    setNewImage(e.target.files[0]);
                                    setPreview(URL.createObjectURL(e.target.files[0]));
                                }} />
                        </div>

                        {/* SEO IMAGE */}
                        <div className="mb-3">
                            <label>SEO Image</label><br />
                            {seoPreview && <img src={seoPreview} width="120" className="mb-2 rounded" />}
                            <input type="file" className="form-control"
                                onChange={e => {
                                    setNewSeoImage(e.target.files[0]);
                                    setSeoPreview(URL.createObjectURL(e.target.files[0]));
                                }} />
                        </div>

                        {/* OG IMAGE */}
                        <div className="mb-3">
                            <label>OG Image</label><br />
                            {ogPreview && <img src={ogPreview} width="120" className="mb-2 rounded" />}
                            <input type="file" className="form-control"
                                onChange={e => {
                                    setNewOgImage(e.target.files[0]);
                                    setOgPreview(URL.createObjectURL(e.target.files[0]));
                                }} />
                        </div>

                        <hr />

                        {/* SEO META */}
                        <h5>SEO & OG Meta</h5>

                        <input className="form-control mb-2" placeholder="SEO Meta Title"
                            value={form.seo_meta_title || ""}
                            onChange={e => setForm({ ...form, seo_meta_title: e.target.value })} />

                        <input className="form-control mb-2" placeholder="OG Meta Title"
                            value={form.og_meta_title || ""}
                            onChange={e => setForm({ ...form, og_meta_title: e.target.value })} />

                        <textarea className="form-control mb-2" placeholder="SEO Meta Keywords"
                            value={form.seo_meta_keywords || ""}
                            onChange={e => setForm({ ...form, seo_meta_keywords: e.target.value })}></textarea>

                        <textarea className="form-control mb-2" placeholder="OG Meta Keywords"
                            value={form.og_meta_keywords || ""}
                            onChange={e => setForm({ ...form, og_meta_keywords: e.target.value })}></textarea>

                        <textarea className="form-control mb-2" placeholder="SEO Meta Description"
                            value={form.seo_meta_description || ""}
                            onChange={e => setForm({ ...form, seo_meta_description: e.target.value })}></textarea>

                        <textarea className="form-control mb-3" placeholder="OG Meta Description"
                            value={form.og_meta_description || ""}
                            onChange={e => setForm({ ...form, og_meta_description: e.target.value })}></textarea>

                        <input className="form-control mb-3" placeholder="SEO Canonical URL"
                            value={form.seo_canonical || ""}
                            onChange={e => setForm({ ...form, seo_canonical: e.target.value })} />

                        <button className="btn btn-success">Update Product</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
