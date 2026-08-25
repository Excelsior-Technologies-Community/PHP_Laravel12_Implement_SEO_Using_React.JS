import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ProductCard from "../../components/ProductCard";
import SearchBar from "../../components/SearchBar";
import ProductFilters from "../../components/ProductFilters";
import SortSelect from "../../components/SortSelect";
import PaginationControls from "../../components/PaginationControls";
import { useCompare } from "../../context/CompareContext";

export default function Home() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [meta, setMeta] = useState(null);
    const [sort, setSort] = useState({ sort_by: "created_at", sort_dir: "desc", page: 1 });
    const [filters, setFilters] = useState({});
    const [showFilters, setShowFilters] = useState(false);
    const { compareCount } = useCompare();

    const fetchProducts = async (page = 1) => {
const params = new URLSearchParams({
    page,
    sort_by: sort.sort_by,
    sort_dir: sort.sort_dir,
    customer: "1",
});
        if (search) params.set("search", search);
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.set(key, value);
        });

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
    }, [sort, filters]);

    const handleSearch = () => {
        fetchProducts(1);
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Our Products</h2>
                {compareCount > 0 && (
                    <Link to="/compare" className="btn btn-outline-primary">
                        Compare ({compareCount})
                    </Link>
                )}
            </div>

            <SearchBar value={search} onChange={setSearch} onSearch={handleSearch} />

            <div className="d-flex mb-3">
                <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setShowFilters(!showFilters)}
                >
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
            </div>

            <div className="row">
                {showFilters && (
                    <div className="col-md-3 mb-3">
                        <ProductFilters
                            filters={filters}
                            onChange={setFilters}
                            onApply={() => fetchProducts(1)}
                        />
                    </div>
                )}

                <div className={showFilters ? "col-md-9" : "col-12"}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="text-muted">
                            {meta?.total || 0} products found
                        </span>
                        <SortSelect value={sort} onChange={setSort} />
                    </div>

                    <div className="row">
                        {products.length === 0 ? (
                            <div className="col-12 text-center py-4">
                                <p className="text-muted">No products found.</p>
                            </div>
                        ) : (
                            products.map(product => (
                                <div className="col-md-4 mb-4" key={product.id}>
                                    <Link to={`/shop/product/${product.id}`} className="text-decoration-none">
                                        <ProductCard product={product} showCompare={true} />
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>

                    <PaginationControls meta={meta} onPageChange={fetchProducts} />
                </div>
            </div>
        </div>
    );
}
