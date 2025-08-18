// src/modules/product/product.routes.js
import express from "express";
import {
    getProducts,
    getProductById,
    listNewProducts,
    updateExistingProduct,
} from "./product.controller.js";

const router = express.Router(); // eslint-disable-line new-cap

// GET /api/v1/products
router.get("/", getProducts);

// GET /api/v1/products/:productId
router.get("/:productId", getProductById);

// POST /api/v1/products/list-for-sale
router.post("/list-for-sale", listNewProducts);

// PUT /api/v1/products/:variantId
router.put("/:variantId", updateExistingProduct);

export default router;
