// src/modules/product/product.controller.js
import { getAllProducts, getProductById } from './product.service.js';

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
      message: 'Success: Fetched all products',
      data: products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Controller untuk menangani request GET produk berdasarkan ID.
 * @param {object} req - Objek request Express.
 * @param {object} res - Objek response Express.
 */
const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await getProductById(productId);

    res.status(200).json({
      message: 'Success: Fetched product details',
      data: product,
    });
  } catch (error) {
    if (error.message === 'Product not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export {
  getProducts,
  getProductById,
};