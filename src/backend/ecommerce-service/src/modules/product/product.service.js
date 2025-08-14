// src/modules/product/product.service.js
import {findProducts, findProductById} from "./product.repository.js";

/**
 * Service untuk mengambil semua produk.
 * @param {object} params - Parameter filter.
 * @return {Promise<Array>} List produk.
 */
const getAllProducts = async (params) => {
    const products = await findProducts(params);
    return products;
};

/**
 * Service untuk mengambil detail produk berdasarkan ID.
 * @param {string} id - ID produk.
 * @return {Promise<object>} Objek produk.
 * @throws {Error} Jika produk tidak ditemukan.
 */
const getProductById = async (id) => {
    const product = await findProductById(id);

    if (!product) {
        throw new Error("Product not found");
    }

    return product;
};

export {
    getAllProducts,
    getProductById,
};
