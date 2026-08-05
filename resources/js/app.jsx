import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CustomerHome from "./pages/customer/Home";
import "./pages/customer/products.css";
import ProductShow from "./pages/customer/ProductShow";
import { CompareProvider } from "./context/CompareContext";

import ProductIndex from "./pages/products/index";
import ProductCreate from "./pages/products/create";
import ProductEdit from "./pages/products/edit";
import CategoryProducts from "./pages/shop/CategoryProducts";
import ProductComparison from "./pages/shop/ProductComparison";

import "./pages/products/products.css";

function App() {
    return (
        <CompareProvider>
            <BrowserRouter>
                <Routes>
                    {/* Admin Product Routes */}
                    <Route path="/" element={<ProductIndex />} />
                    <Route path="/create" element={<ProductCreate />} />
                    <Route path="/edit/:id" element={<ProductEdit />} />

                    {/* Customer / Shop Routes */}
                    <Route path="/shop" element={<CustomerHome />} />
                    <Route path="/shop/category/:category" element={<CategoryProducts />} />
                    <Route path="/shop/product/:id" element={<ProductShow />} />
                    <Route path="/compare" element={<ProductComparison />} />

                    {/* Fallback route */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </CompareProvider>
    );
}

createRoot(document.getElementById("app")).render(<App />);
