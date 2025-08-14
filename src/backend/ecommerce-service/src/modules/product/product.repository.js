// src/modules/product/product.repository.js
import prisma from "../../lib/db.js";

/**
 * Mengambil semua data produk dari database.
 * @param {object} params - Parameter untuk filter & paginasi.
 * @return {Promise<Array>} List produk.
 */
const findProducts = async (params) => {
    // TODO: Tambahkan logika filter dan paginasi di sini
    const products = await prisma.product.findMany();
    return products;
};

/**
 * Mengambil satu produk berdasarkan ID uniknya.
 * @param {string} id - ID dari produk.
 * @return {Promise<object|null>} Objek produk atau null jika tidak ditemukan.
 */
const findProductById = async (id) => {
    const product = await prisma.product.findUnique({
        where: {
            id,
        },
        include: {
            variants: true,
            category: true,
            brand: true,
        },
    });
    return product;
};

export {
    findProducts,
    findProductById,
};
