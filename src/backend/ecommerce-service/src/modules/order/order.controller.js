// src/modules/order/order.controller.js
import {
    getOrderHistory as getOrderHistoryService,
    checkout as checkoutService,
} from "./order.service.js";

/**
 * Controller untuk mengambil riwayat pesanan user.
 * @param {object} req - Objek request Express.
 * @param {object} res - Objek response Express.
 */
const getOrderHistory = async (req, res) => {
    try {
    // Diasumsikan userId didapat dari middleware autentikasi
        const userId = req.user.id;
        const orders = await getOrderHistoryService(userId);

        res.status(200).json({
            message: "Success: Fetched order history",
            data: orders,
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

/**
 * Controller untuk membuat pesanan baru dari keranjang (checkout).
 * @param {object} req - Objek request Express.
 * @param {object} res - Objek response Express.
 */
const createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const checkoutData = req.body;

        const newOrder = await checkoutService(userId, checkoutData);

        res.status(201).json({
            message: "Success: Order created successfully",
            data: newOrder,
        });
    } catch (error) {
        if (error.message === "Cart is empty") {
            return res.status(400).json({message: error.message});
        }
        res.status(500).json({message: error.message});
    }
};

export {
    getOrderHistory,
    createOrder,
};
