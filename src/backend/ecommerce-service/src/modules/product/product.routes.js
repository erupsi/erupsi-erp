// src/modules/product/product.routes.js
import express from "express";
import {getProducts, getProductById} from "./product.controller.js";

const router = express.Router();

// GET /api/v1/products
router.get("/", getProducts);

// GET /api/v1/products/:productId
router.get("/:productId", getProductById);

export default router;
