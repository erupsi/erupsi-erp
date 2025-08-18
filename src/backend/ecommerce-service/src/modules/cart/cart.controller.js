// src/modules/cart/cart.controller.js
import {addProductToCart as addProductToCartService} from "./cart.service.js";

/**
 * Controller untuk menambahkan item ke keranjang.
 * @param {object} req - Objek request Express.
 * @param {object} res - Objek response Express.
 */
const addItemToCart = async (req, res) => {
    try {
        const {productId, quantity} = req.body;
        const userId = req.user.id; // Diasumsikan didapat dari middleware auth

        if (!productId || !quantity || quantity < 1) {
            return res.status(400).json({message: "Invalid product ID or quantity"});
        }

        const cartItem = await addProductToCartService(userId, productId, quantity);

        res.status(200).json({
            message: "Success: Item added to cart",
            data: cartItem,
        });
    } catch (error) {
    // Tangani error spesifik dari service
        if (error.message.includes("not found")) {
            return res.status(404).json({message: error.message});
        }
        if (error.message.includes("not available") || error.message.includes("Insufficient stock")) {
            return res.status(400).json({message: error.message});
        }
        res.status(500).json({message: error.message});
    }
};

export {
    addItemToCart,
};
