// src/modules/product/product.controller.js
import {
    getAllProducts,
    getProductById as productIdService,
    listProductsForSale,
    updateProductById,
} from "./product.service.js";

/**
 * Controller untuk menangani request GET semua produk.
 * @param {object} req - Objek request Express.
 * @param {object} res - Objek response Express.
 */
const getProducts = async (req, res) => {
    try {
        const params = req.query;
        const products = await getAllProducts(params);

        res.status(200).json({
            message: "Success: Fetched all products",
            data: products,
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

/**
 * Controller untuk menangani request GET produk berdasarkan ID.
 * @param {object} req - Objek request Express.
 * @param {object} res - Objek response Express.
 */
const getProductById = async (req, res) => {
    try {
        const {productId} = req.params;
        const product = await productIdService(productId);

        res.status(200).json({
            message: "Success: Fetched product details",
            data: product,
        });
    } catch (error) {
        if (error.message === "Product not found") {
            return res.status(404).json({message: error.message});
        }
        res.status(500).json({message: error.message});
    }
};

/**
 * Controller untuk menangani request POST untuk mendaftarkan produk.
 * @param {object} req - Objek request Express.
 * @param {object} res - Objek response Express.
 */
const listNewProducts = async (req, res) => {
    try {
        const newProductsData = req.body.items;
        if (!newProductsData || !Array.isArray(newProductsData)) {
            return res.status(400).json({message: "Invalid request body"});
        }

        await listProductsForSale(newProductsData);

        res.status(201).json({
            message: "Success: Products listed for sale",
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

/**
 * Controller untuk menangani request PUT untuk memperbarui produk.
 * @param {object} req - Objek request Express.
 * @param {object} res - Objek response Express.
 */
const updateExistingProduct = async (req, res) => {
    try {
        const {variantId} = req.params;
        const productData = req.body;

        const updatedProduct = await updateProductById(variantId, productData);

        res.status(200).json({
            message: "Success: Product updated",
            data: updatedProduct,
        });
    } catch (error) {
        if (error.message === "Product not found") {
            return res.status(404).json({message: error.message});
        }
        res.status(500).json({message: error.message});
    }
};

export {
    getProducts,
    getProductById,
    listNewProducts,
    updateExistingProduct,
};
