import React from "react";
import { createRoot } from "react-dom/client";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import CustomerHome
    from "./pages/customer/Home";

import ProductShow
    from "./pages/customer/ProductShow";

import Cart
    from "./pages/customer/Cart";

import ProductIndex
    from "./pages/products/index";

import ProductCreate
    from "./pages/products/create";

import ProductEdit
    from "./pages/products/edit";

import CategoryProducts
    from "./pages/shop/CategoryProducts";

import ProductComparison
    from "./pages/shop/ProductComparison";

import {
    CompareProvider
} from "./context/CompareContext";

import {
    CartProvider
} from "./context/CartContext";

import {
    WishlistProvider
} from "./context/WishlistContext";

import "./pages/customer/products.css";
import "./pages/products/products.css";


function App() {

    return (

        <CompareProvider>

            <CartProvider>

                <WishlistProvider>

                    <BrowserRouter>

                        <Routes>

                            {/* ADMIN */}

                            <Route
                                path="/"
                                element={<ProductIndex />}
                            />

                            <Route
                                path="/create"
                                element={<ProductCreate />}
                            />

                            <Route
                                path="/edit/:id"
                                element={<ProductEdit />}
                            />


                            {/* CUSTOMER */}

                            <Route
                                path="/shop"
                                element={<CustomerHome />}
                            />

                            <Route
                                path="/shop/category/:category"
                                element={
                                    <CategoryProducts />
                                }
                            />

                            <Route
                                path="/shop/product/:id"
                                element={
                                    <ProductShow />
                                }
                            />


                            {/* CART */}

                            <Route
                                path="/cart"
                                element={<Cart />}
                            />


                            {/* COMPARE */}

                            <Route
                                path="/compare"
                                element={
                                    <ProductComparison />
                                }
                            />


                            {/* FALLBACK */}

                            <Route
                                path="*"
                                element={
                                    <Navigate
                                        to="/"
                                        replace
                                    />
                                }
                            />

                        </Routes>

                    </BrowserRouter>

                </WishlistProvider>

            </CartProvider>

        </CompareProvider>
    );
}

createRoot(
    document.getElementById("app")
).render(<App />);