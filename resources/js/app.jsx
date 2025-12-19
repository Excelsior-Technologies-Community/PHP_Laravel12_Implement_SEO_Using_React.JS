import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CustomerHome from "./pages/customer/Home";
import "./pages/customer/products.css";
import ProductShow from "./pages/customer/ProductShow";


/* ✅ GLOBAL CSS IMPORT */
import "./pages/products/products.css";

import ProductIndex from "./pages/products/index";
import ProductCreate from "./pages/products/create";
import ProductEdit from "./pages/products/edit";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Product List */}
                <Route path="/" element={<ProductIndex />} />

                {/* Create Product */}
                <Route path="/create" element={<ProductCreate />} />

                {/* Edit Product */}
                <Route path="/edit/:id" element={<ProductEdit />} />

                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" replace />} />
                <Route path="/shop" element={<CustomerHome />} />
                <Route path="/shop/product/:id" element={<ProductShow />} />
                
            </Routes>
        </BrowserRouter>
    );
}

createRoot(document.getElementById("app")).render(<App />);
