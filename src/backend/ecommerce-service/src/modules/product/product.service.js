// src/modules/product/product.service.js
import {
    findProducts,
    findProductById,
    createProducts,
    updateProduct,
} from "./product.repository.js";

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

/**
 * Service untuk mendaftarkan produk baru untuk dijual.
 * @param {Array<object>} productData - Array berisi data produk dari request body.
 * @return {Promise<object>} Hasil operasi batch dari repository.
 */
const listProductsForSale = async (productData) => {
    // Di sini Anda bisa menambahkan validasi, misalnya:
    // - Cek apakah variantId sudah ada di database
    // - Pastikan harga tidak negatif
    const products = await createProducts(productData);
    return products;
};

/**
 * Service untuk memperbarui data produk.
 * @param {string} variantId - ID varian produk.
 * @param {object} productData - Data baru untuk produk.
 * @return {Promise<object>} Objek produk yang telah diperbarui.
 */
const updateProductById = async (variantId, productData) => {
    // Pertama, cek apakah produknya ada
    await getProductById(variantId);

    const updatedProduct = await updateProduct(variantId, productData);
    return updatedProduct;
};

export {
    getAllProducts,
    getProductById,
    listProductsForSale,
    updateProductById,
};
