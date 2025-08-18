// src/modules/product/product.repository.js
import prisma from "../../lib/db.js";

/**
 * Mengambil semua data produk dari database.
 * @param {object} params - Parameter untuk filter & paginasi.
 * @return {Promise<Array>} List produk.
 */
const findProducts = async (params) => {
    const products = await prisma.$queryRaw`
    SELECT
        pos.*,
        COALESCE(ROUND(AVG(r.rating), 1), 0) AS avg_rating,
        CAST(
            COALESCE(
                COUNT(DISTINCT coi.id_coi) FILTER (WHERE co.isCancelled = false),
                0
            )
        AS INTEGER) AS total_sold
    FROM productonsale AS pos
    LEFT JOIN review r
        ON r.id_pos = pos.id_pos
    LEFT JOIN checkoutitem AS coi
        ON coi.id_product = pos.id_pos
    LEFT JOIN checkout AS co
        ON co.id_checkout = coi.id_checkout
    GROUP BY pos.id_pos;
  `;
    return products;
};

/**
 * Mengambil satu produk berdasarkan ID uniknya.
 * @param {string} id - ID dari produk.
 * @return {Promise<object|null>} Objek produk atau null jika tidak ditemukan.
 */
const findProductById = async (id) => {
    // BENAR: Gunakan nama model versi camelCase: productonsale
    const product = await prisma.productonsale.findUnique({
        where: {
            id_pos: id,
        },
    });
    return product;
};

/**
 * Menyimpan satu atau lebih produk baru ke database.
 * @param {Array<object>} productData - Array berisi objek data produk.
 * @return {Promise<object>} Hasil operasi batch.
 */
const createProducts = async (productData) => {
    // BENAR: Gunakan nama model versi camelCase: productonsale
    const newProducts = await prisma.productonsale.createMany({
        data: productData,
    });
    return newProducts;
};

/**
 * Memperbarui data produk berdasarkan ID.
 * @param {string} variantId - ID dari produk yang akan diupdate.
 * @param {object} productData - Objek berisi data yang akan diupdate.
 * @return {Promise<object>} Objek produk yang telah diperbarui.
 */
const updateProduct = async (variantId, productData) => {
    // BENAR: Gunakan nama model versi camelCase: productonsale
    const updatedProduct = await prisma.productonsale.update({
        where: {
            id_pos: variantId, // BENAR: Gunakan nama kolom asli dari database: id_pos
        },
        data: {
            price: productData.price,
            isAvailable: productData.isAvailable,
        },
    });
    return updatedProduct;
};

export {
    findProducts,
    findProductById,
    createProducts,
    updateProduct,
};
