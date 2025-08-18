// src/modules/cart/cart.service.js
import {upsertItemInCart as upsertItemInCartRepo} from "./cart.repository.js";
// Kita perlu service dari produk untuk mengecek ketersediaan & stok
import {getProductById as getProductByIdService} from "../product/product.service.js";

/**
 * Service untuk menambahkan produk ke keranjang.
 * @param {string} userId - ID user.
 * @param {string} productId - ID produk yang ditambahkan.
 * @param {number} quantity - Jumlah yang ditambahkan.
 * @return {Promise<object>} Item keranjang yang berhasil ditambahkan/diupdate.
 */
const addProductToCart = async (userId, productId, quantity) => {
    // 1. Validasi: Cek apakah produk ada, tersedia, dan stoknya cukup
    const product = await getProductByIdService(productId); // Memanggil service produk

    if (!product.isAvailable) {
        throw new Error("Product is not available for sale.");
    }

    if (product.quantity < quantity) {
        throw new Error("Insufficient stock.");
    }

    // 2. Jika validasi lolos, panggil repository untuk menyimpan ke keranjang
    const cartItemData = {userId, productId, quantity};
    const cartItem = await upsertItemInCartRepo(cartItemData);

    return cartItem;
};

export {
    addProductToCart,
};
