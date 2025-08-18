// src/modules/cart/cart.repository.js
import prisma from "../../lib/db.js";

/**
 * Menambahkan atau memperbarui item di keranjang user.
 * @param {object} cartItemData - Data item keranjang.
 * @return {Promise<object>} Item keranjang yang baru dibuat atau diupdate.
 */
const upsertItemInCart = async (cartItemData) => {
    const {userId, productId, quantity} = cartItemData;

    const cartItem = await prisma.cart.upsert({
        where: {
            // Kunci unik untuk menemukan item: kombinasi userId dan productId
            userId_productId: {
                userId,
                productId,
            },
        },
        // Jika item ditemukan, perbarui jumlahnya
        update: {
            quantity: {
                increment: quantity,
            },
        },
        // Jika tidak ditemukan, buat item baru
        create: {
            userId,
            productId,
            quantity,
        },
    });
    return cartItem;
};

export {
    upsertItemInCart,
};
