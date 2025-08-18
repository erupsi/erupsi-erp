// src/modules/order/order.repository.js
import prisma from "../../lib/db.js";

/**
 * Mengambil riwayat pesanan untuk user tertentu.
 * @param {string} userId - ID dari user.
 * @return {Promise<Array>} List pesanan.
 */
const findOrdersByUserId = async (userId) => {
    const orders = await prisma.order.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return orders;
};

/**
 * Membuat pesanan baru dalam satu transaksi database.
 * Ini akan membuat data di tabel Order dan OrderItem sekaligus.
 * @param {object} orderData - Data master pesanan.
 * @param {Array<object>} orderItemsData - Array item dalam pesanan.
 * @return {Promise<object>} Objek pesanan yang baru dibuat.
 */
const createOrder = async (orderData, orderItemsData) => {
    const newOrder = await prisma.$transaction(async (tx) => {
    // 1. Buat data pesanan utama
        const createdOrder = await tx.order.create({
            data: orderData,
        });

        // 2. Siapkan dan buat semua item pesanan
        const itemsToCreate = orderItemsData.map((item) => ({
            ...item,
            orderId: createdOrder.id,
        }));

        await tx.orderItem.createMany({
            data: itemsToCreate,
        });

        // (Opsional) Di sini Anda bisa menambahkan logika untuk mengurangi stok produk
        // for (const item of orderItemsData) {
        //   await tx.productOnSale.update({ ... });
        // }

        return createdOrder;
    });

    return newOrder;
};

export {
    findOrdersByUserId,
    createOrder,
};
