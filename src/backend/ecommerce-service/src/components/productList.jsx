// src/components/ProductList.jsx
import React, { useEffect, useState } from "react";

const ProductList = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3000/products")
        .then((res) => res.json())
        .then((data) => setProducts(data))
        .catch((err) => console.error("Failed to fetch products:", err));
    }, []);

    return (
        <div>
            <h2>Product List</h2>
            <ul>
                {products.map((p) => (
                    <li key={p.id}>{p.name} - {p.price}</li>
                ))}
            </ul>
        </div>
    );
};

export default ProductList;
