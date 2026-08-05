import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import ProductCard from "../../components/ProductCard";
import SearchBar from "../../components/SearchBar";
import SortSelect from "../../components/SortSelect";
import PaginationControls from "../../components/PaginationControls";
import { useCompare } from "../../context/CompareContext";

export default function CategoryProducts() {
    const { category } = useParams();
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [meta, setMeta] = useState(null);
    const [sort, setSort] = useState({ sort_by: "created_at", sort_dir: "desc" });
    const { compareCount } = useCompare();

    const fetchProducts = async (page = 1) => {
        const params = new URLSearchParams({
            category,
            page,
            sort_by: sort.sort_by,
            sort_dir: sort.sort_dir,
        });
        if (search) params.set("search", search);

        const res = await axios.get("/products?" + params.toString());
        const data = res.data;
        setProducts(data.data || []);
        setMeta({
            current_page: data.current_page,
            last_page: data.last_page,
            total: data.total,
        });
    };

    useEffect(() => {
        fetchProducts();
    }, [category, sort]);

    const handleSearch = () => {
        fetchProducts(1);
    };

    return (
        <div className="container mt-5">
            <Link to="/shop" className="btn btn-secondary mb-3">
                Back to Shop
            </Link>

            <h2 className="mb-4">{category} Products</h2>

            <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-muted">
                    Showing {meta ? meta.total : 0} products in "{category}"
                </span>
                {compareCount > 0 && (
                    <Link to="/compare" className="btn btn-outline-primary btn-sm">
                        Compare ({compareCount})
                    </Link>
                )}
            </div>

            <SearchBar value={search} onChange={setSearch} onSearch={handleSearch} />
            <SortSelect value={sort} onChange={setSort} />

            <div className="row">
                {products.length === 0 ? (
                    <div className="col-12 text-center py-4">
                        <p className="text-muted">No products found in this category.</p>
                    </div>
                ) : (
                    products.map(product => (
                        <div className="col-md-4 mb-4" key={product.id}>
                            <Link to={"/shop/product/" + product.id} className="text-decoration-none">
                                <ProductCard product={product} showCompare={true} />
                            </Link>
                        </div>
                    ))
                )}
            </div>

            <PaginationControls meta={meta} onPageChange={fetchProducts} />
        </div>
    );
}
