// src/modules/cart/cart.routes.js
import express from "express";
import {addItemToCart} from "./cart.controller.js";

// Diasumsikan ada middleware untuk verifikasi token JWT
// import { checkAuth } from '../../lib/auth.middleware.js';

const router = express.Router(); // eslint-disable-line new-cap

// Endpoint ini seharusnya diproteksi
// router.use(checkAuth);

// POST /api/v1/cart/items
router.post("/items", addItemToCart);

export default router;
