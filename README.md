# PHP_Laravel12_Implement_SEO_Using_React.JS



---

## STEP 1: Create & Install Laravel 12 Project

```bash
composer create-project laravel/laravel PHP_Laravel12_Implement_SEO_Using_React.JS
```

Explanation:
- Downloads Laravel 12
- Creates project folder
- Installs all core files

---

## STEP 2: Go to Project Directory

```bash
cd PHP_Laravel12_Implement_SEO_Using_React.JS
```

---

## STEP 3: Database Configuration (.env)

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your database
DB_USERNAME=root
DB_PASSWORD=
```

Explanation:
- Connects Laravel to MySQL
- Database must exist

---

## STEP 4: Install Node & React Packages

```bash
npm install react react-dom
npm install react-router-dom
npm install axios
npm install @vitejs/plugin-react --save-dev
```

---

## STEP 5: Configure Vite for React

```js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
    ],
});
```

---

## STEP 6: React Entry File

### resources/js/app.jsx

```jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* Admin Pages */
import ProductIndex from "./pages/products/index";
import ProductCreate from "./pages/products/create";
import ProductEdit from "./pages/products/edit";

/* Customer Pages */
import CustomerHome from "./pages/customer/Home";
import Cart from "./pages/customer/Cart";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* ADMIN PRODUCT CRUD */}
                <Route path="/admin/products" element={<ProductIndex />} />
                <Route path="/admin/products/create" element={<ProductCreate />} />
                <Route path="/admin/products/edit/:id" element={<ProductEdit />} />

                {/* CUSTOMER PAGES */}
                <Route path="/" element={<CustomerHome />} />
                <Route path="/cart" element={<Cart />} />

                {/* FALLBACK */}
                <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
        </BrowserRouter>
    );
}

createRoot(document.getElementById("app")).render(<App />);
```

---

## STEP 7: Welcome Blade

### resources/views/welcome.blade.php

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Laravel 12 React</title>
    @viteReactRefresh
    @vite('resources/js/app.jsx')
</head>
<body>
    <div id="app"></div>
</body>
</html>
```

---

## STEP 8: Product Migration

```bash
php artisan make:migration create_products_table
```

```php
Schema::create('products', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->text('details');
    $table->decimal('price', 10, 2);
    $table->string('image');
    $table->string('size');
    $table->string('color');
    $table->string('category');
    $table->timestamps();
});
```

```bash
php artisan migrate
```

---

## STEP 9: Product Model

```php
protected $fillable = [
    'name',
    'details',
    'price',
    'image',
    'size',
    'color',
    'category'
];
```

---

## STEP 10: Product Controller

```php
<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        return Product::latest()->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'details' => 'required',
            'price' => 'required|numeric',
            'image' => 'required|image',
            'size' => 'required',
            'color' => 'required',
            'category' => 'required'
        ]);

        $imageName = time().'.'.$request->image->extension();
        $request->image->move(public_path('images'), $imageName);

        Product::create([
            'name' => $request->name,
            'details' => $request->details,
            'price' => $request->price,
            'image' => $imageName,
            'size' => $request->size,
            'color' => $request->color,
            'category' => $request->category,
        ]);
    }

    public function edit($id)
    {
        return Product::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        if ($request->hasFile('image')) {
            $imageName = time().'.'.$request->image->extension();
            $request->image->move(public_path('images'), $imageName);
            $product->image = $imageName;
        }

        $product->update($request->except('image'));
    }

    public function destroy($id)
    {
        Product::findOrFail($id)->delete();
    }
}
```

---

## STEP 11: Routes

```php
Route::get('/products', [ProductController::class, 'index']);
Route::post('/products', [ProductController::class, 'store']);
Route::get('/products/{id}/edit', [ProductController::class, 'edit']);
Route::post('/products/{id}', [ProductController::class, 'update']);
Route::delete('/products/{id}', [ProductController::class, 'destroy']);

Route::view('/', 'welcome');
Route::view('/{any}', 'welcome')->where('any', '.*');
```

---

## STEP 12: React Product Pages

### index.jsx, create.jsx, edit.jsx  
(All code exactly as provided in the document)
<img width="1535" height="329" alt="image" src="https://github.com/user-attachments/assets/421e2d27-1e84-46f7-9b5b-49420e26668c" />


---

## STEP 13: Customer Home Page

### resources/js/pages/customer/Home.jsx

```jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get("/products").then(res => {
            setProducts(res.data);
        });
    }, []);

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Our Products</h2>

            <div className="row">
                {products.map(product => (
                    <div className="col-md-4 mb-4" key={product.id}>
                        <div className="card shadow-sm">

                            <img
                                src={`/images/${product.image}`}
                                className="card-img-top"
                                style={{
                                    height: "180px",
                                    objectFit: "contain",
                                    background: "#f8f9fa"
                                }}
                            />

                            <div className="card-body">
                                <h5>{product.name}</h5>
                                <h6 className="text-success">₹ {product.price}</h6>
                                <p className="small text-muted">{product.details}</p>

                                <button className="btn btn-primary w-100">
                                    Add to Cart
                                </button>
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
```
<img width="549" height="767" alt="image" src="https://github.com/user-attachments/assets/579de042-e727-43c4-a6a3-2e96251a5a93" />


# Now Adding SEO and OG details in Products table followed all step





---

## STEP 41: Create Migration for SEO & OG Fields

Create a new migration to add SEO and OG columns to the `products` table.

```bash
php artisan make:migration add_seo_fields_to_products_table --table=products
```

### Migration File
`database/migrations/xxxx_xx_xx_add_seo_fields_to_products_table.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {

            // 🔹 SEO Image
            $table->string('seo_image')->nullable()->after('image');

            // 🔹 OG Tag Image
            $table->string('og_image')->nullable()->after('seo_image');

            // 🔹 SEO Meta Title
            $table->string('seo_meta_title')->nullable();

            // 🔹 OG Meta Title
            $table->string('og_meta_title')->nullable();

            // 🔹 SEO Meta Keywords
            $table->text('seo_meta_keywords')->nullable();

            // 🔹 OG Meta Keywords
            $table->text('og_meta_keywords')->nullable();

            // 🔹 SEO Meta Description
            $table->text('seo_meta_description')->nullable();

            // 🔹 OG Meta Description
            $table->text('og_meta_description')->nullable();

            // 🔹 SEO Canonical URL
            $table->string('seo_canonical')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'seo_image',
                'og_image',
                'seo_meta_title',
                'og_meta_title',
                'seo_meta_keywords',
                'og_meta_keywords',
                'seo_meta_description',
                'og_meta_description',
                'seo_canonical',
            ]);
        });
    }
};
```

### Run Migration
```bash
php artisan migrate
```

Explanation:  
This migration adds SEO and Open Graph related columns to the existing `products` table.

---

## STEP 15: Update Product Model

`app/Models/Product.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'details',
        'price',
        'image',
        'size',
        'color',
        'category',

        // 🔹 SEO & OG
        'seo_image',
        'og_image',
        'seo_meta_title',
        'og_meta_title',
        'seo_meta_keywords',
        'og_meta_keywords',
        'seo_meta_description',
        'og_meta_description',
        'seo_canonical',
    ];
}
```

Explanation:  
The `$fillable` array allows mass assignment of SEO and OG fields.

---

## STEP 16: Update ProductController (SEO + OG Support)

`app/Http/Controllers/ProductController.php`
```php
<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // 🔹 Get all products
    public function index()
    {
        return response()->json(
            Product::latest()->get(),
            200
        );
    }

    // 🔹 Store product
    public function store(Request $request)
    {
        $request->validate([
            // BASIC
            'name'     => 'required|string|max:255',
            'details'  => 'required|string',
            'price'    => 'required|numeric',
            'image'    => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
            'size'     => 'required|string|max:100',
            'color'    => 'required|string|max:100',
            'category' => 'required|string|max:100',

            // SEO + OG
            'seo_image'           => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'og_image'            => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'seo_meta_title'      => 'nullable|string|max:255',
            'og_meta_title'       => 'nullable|string|max:255',
            'seo_meta_keywords'   => 'nullable|string',
            'og_meta_keywords'    => 'nullable|string',
            'seo_meta_description'=> 'nullable|string',
            'og_meta_description' => 'nullable|string',
            'seo_canonical'       => 'nullable|string',
        ]);

        // 🔹 MAIN IMAGE UPLOAD
        $imageName = time() . '_main.' . $request->image->extension();
        $request->image->move(public_path('images'), $imageName);

        // 🔹 SEO IMAGE UPLOAD
        $seoImageName = null;
        if ($request->hasFile('seo_image')) {
            $seoImageName = time() . '_seo.' . $request->seo_image->extension();
            $request->seo_image->move(public_path('images'), $seoImageName);
        }

        // 🔹 OG IMAGE UPLOAD
        $ogImageName = null;
        if ($request->hasFile('og_image')) {
            $ogImageName = time() . '_og.' . $request->og_image->extension();
            $request->og_image->move(public_path('images'), $ogImageName);
        }

        Product::create([
            // BASIC
            'name'     => $request->name,
            'details'  => $request->details,
            'price'    => $request->price,
            'image'    => $imageName,
            'size'     => $request->size,
            'color'    => $request->color,
            'category' => $request->category,

            // SEO + OG
            'seo_image'            => $seoImageName,
            'og_image'             => $ogImageName,
            'seo_meta_title'       => $request->seo_meta_title,
            'og_meta_title'        => $request->og_meta_title,
            'seo_meta_keywords'    => $request->seo_meta_keywords,
            'og_meta_keywords'     => $request->og_meta_keywords,
            'seo_meta_description' => $request->seo_meta_description,
            'og_meta_description'  => $request->og_meta_description,
            'seo_canonical'        => $request->seo_canonical,
        ]);

        return response()->json([
            'message' => 'Product created successfully'
        ], 201);
    }

    // 🔹 Edit product
    public function edit($id)
    {
        return response()->json(
            Product::findOrFail($id),
            200
        );
    }

    // 🔹 Update product
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $request->validate([
            'name'     => 'required|string|max:255',
            'details'  => 'required|string',
            'price'    => 'required|numeric',
            'size'     => 'required|string|max:100',
            'color'    => 'required|string|max:100',
            'category' => 'required|string|max:100',

            'image'     => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'seo_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'og_image'  => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        // 🔹 MAIN IMAGE
        if ($request->hasFile('image')) {
            $imageName = time() . '_main.' . $request->image->extension();
            $request->image->move(public_path('images'), $imageName);
            $product->image = $imageName;
        }

        // 🔹 SEO IMAGE
        if ($request->hasFile('seo_image')) {
            $seoImageName = time() . '_seo.' . $request->seo_image->extension();
            $request->seo_image->move(public_path('images'), $seoImageName);
            $product->seo_image = $seoImageName;
        }

        // 🔹 OG IMAGE
        if ($request->hasFile('og_image')) {
            $ogImageName = time() . '_og.' . $request->og_image->extension();
            $request->og_image->move(public_path('images'), $ogImageName);
            $product->og_image = $ogImageName;
        }

        $product->update([
            'name'     => $request->name,
            'details'  => $request->details,
            'price'    => $request->price,
            'size'     => $request->size,
            'color'    => $request->color,
            'category' => $request->category,

            'seo_meta_title'       => $request->seo_meta_title,
            'og_meta_title'        => $request->og_meta_title,
            'seo_meta_keywords'    => $request->seo_meta_keywords,
            'og_meta_keywords'     => $request->og_meta_keywords,
            'seo_meta_description' => $request->seo_meta_description,
            'og_meta_description'  => $request->og_meta_description,
            'seo_canonical'        => $request->seo_canonical,
        ]);

        return response()->json([
            'message' => 'Product updated successfully'
        ], 200);
    }

    // 🔹 Delete product
    public function destroy($id)
    {
        Product::findOrFail($id)->delete();

        return response()->json([
            'message' => 'Product deleted successfully'
        ], 200);
    }
}
```

Explanation:  
- Handles upload of main, SEO, and OG images  
- Stores SEO meta fields  
- Returns JSON responses for React  

---

## STEP 17: Update Create.jsx (Add SEO & OG Fields)
```php
`resources/js/pages/products/Create.jsx`
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
```

Explanation:  
- Added input fields for SEO and OG meta data  
- Added file inputs for SEO Image and OG Image  
- Uses FormData for multipart submission  

---

## STEP 18: Update Edit.jsx (SEO + OG Fully Editable)
```php
`resources/js/pages/ptoducts/Edit.jsx`
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
```
Explanation:  
- Loads existing product SEO & OG data  
- Shows image previews  
- Allows replacing images  

---

## STEP 19: Customer Home Page (Product Listing)

`resources/js/pages/customer/Home.jsx`
```php
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get("/products").then(res => {
            setProducts(res.data);
        });
    }, []);

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Our Products</h2>

            <div className="row">
                {products.map(product => (
                    <div className="col-md-4 mb-4" key={product.id}>
                        <div className="card h-100 shadow-sm product-card">

                            {/* IMAGE */}
                            <img
                                src={`/images/${product.image}`}
                                className="card-img-top product-image"
                                alt={product.name}
                            />

                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">{product.name}</h5>

                                <h6 className="text-success fw-bold">
                                    ₹ {product.price}
                                </h6>

                                <p className="text-muted small">
                                    {product.details.length > 100
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

                                {/* VIEW MORE BUTTON */}
                                <button
                                    className="btn btn-outline-primary mt-auto"
                                   onClick={() => navigate(`/shop/product/${product.id}`)}

                                >
                                    View More
                                </button>
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
```
Explanation:  
- Displays products  
- “View More” button redirects to SEO-friendly route  

```js
onClick={() => navigate(`/shop/product/${product.id}`)}
```

---

## STEP 20: ProductShow.jsx (Customer Product Detail Page)

`resources/js/pages/customer/ProductShow.jsx`
```php
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

export default function ProductShow() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        axios.get(`/products/${id}/edit`).then(res => {
            setProduct(res.data);
        });
    }, [id]);

    if (!product) {
        return <div className="container mt-5">Loading...</div>;
    }

    return (
        <div className="container mt-5">
            <Link to="/shop" className="btn btn-secondary mb-3">
                ← Back to Products
            </Link>

            <div className="row">
                <div className="col-md-6">
                    <img
                        src={`/images/${product.image}`}
                        className="img-fluid rounded shadow"
                        alt={product.name}
                    />
                </div>

                <div className="col-md-6">
                    <h2>{product.name}</h2>
                    <h4 className="text-success">₹ {product.price}</h4>

                    <p className="mt-3">{product.details}</p>

                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">
                            <strong>Category:</strong> {product.category}
                        </li>
                        <li className="list-group-item">
                            <strong>Size:</strong> {product.size}
                        </li>
                        <li className="list-group-item">
                            <strong>Color:</strong> {product.color}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
```
Explanation:  
- Fetches product by ID  
- Displays full product details  
- Used only for UI (React side)  

---

## STEP 21: SEO Product Route (Laravel)

`routes/web.php`

```php
Route::get('/shop/product/{id}', function ($id) {

    $product = Product::findOrFail($id);

    return view('welcome', [
        'seo_title'       => $product->seo_meta_title,
        'seo_description' => $product->seo_meta_description,
        'seo_keywords'    => $product->seo_meta_keywords,
        'canonical'       => url()->current(),

        'og_title'        => $product->og_meta_title,
        'og_description'  => $product->og_meta_description,
        'og_image'        => $product->og_image
            ? asset('images/' . $product->og_image)
            : asset('images/default-og.png'),
    ]);
});
```

Explanation:  
This route injects SEO & OG meta data dynamically into the Blade file.

---

## STEP 22: Update welcome.blade.php

`resources/views/welcome.blade.php`

Explanation:  
- Dynamically sets SEO title, description, keywords  
- Injects OG meta tags  
- Loads React using Vite  

---

## STEP 23: Test SEO Output

1. Open product page in browser  
2. Right click → **View Page Source**  
3. Verify `<title>`, `<meta>` and OG tags  

---
<img width="549" height="767" alt="image" src="https://github.com/user-attachments/assets/7373867f-8571-43a6-8c6c-ab48004d9f65" />
<img width="1432" height="949" alt="image" src="https://github.com/user-attachments/assets/7518cc40-47e5-411c-b162-75f04e3101ad" />
<img width="928" height="205" alt="image" src="https://github.com/user-attachments/assets/99e72649-b720-4987-a825-e5a77b6c7c06" />



