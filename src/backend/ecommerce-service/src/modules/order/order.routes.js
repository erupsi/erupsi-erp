// src/modules/order/order.routes.js
import express from "express";
import {
    getOrderHistory,
    createOrder,
} from "./order.controller.js";

// Diasumsikan ada middleware untuk verifikasi token JWT
// import { checkAuth } from '../../lib/auth.middleware.js';

const router = express.Router(); // eslint-disable-line new-cap

// Semua rute di bawah ini seharusnya diproteksi oleh middleware autentikasi
// router.use(checkAuth);

// GET /api/v1/orders
router.get("/", getOrderHistory);

// POST /api/v1/orders/checkout
router.post("/checkout", createOrder);

export default router;
