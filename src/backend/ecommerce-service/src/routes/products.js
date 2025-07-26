const express = require("express");
const router = express.Router(); // eslint-disable-line new-cap
const pool = require("../db");

// GET all products
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM products ORDER BY created_at DESC",
        );
        res.json(result.rows);
    } catch (err) {
        console.error(
            "Error fetching products:", err,
        );
        res.status(500).send("Server Error");
    }
});

// GET a single product by id
router.get("/:id", async (req, res) => {
    const {id} = req.params;
    try {
        const result = await pool.query(
            "SELECT * FROM products WHERE id_products = $1", [id],
        );
        if (result.rows.length === 0) {
            return res.status(404).send(
                "Product not found",
            );
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Error fetching product:", err);
        res.status(500).send("Server Error");
    }
});

// CREATE a new product
router.post("/", async (req, res) => {
    const {name, description, price, stock, isActive} = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO products (name, description, price, stock, is_active)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [name, description, price, stock, isActive ?? true],
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Error creating product:", err);
        res.status(500).send("Server Error");
    }
});

// UPDATE a product
router.put("/:id", async (req, res) => {
    const {id} = req.params;
    const {name, description, price, stock, isActive} = req.body;
    try {
        const result = await pool.query(
            `UPDATE products 
             SET 
             name = $1, 
             description = $2, 
             price = $3, 
             stock = $4, 
             is_active = $5
             WHERE id_products = $6 RETURNING *`,
            [
                name, description, price,
                stock, isActive, id,
            ],
        );
        if (result.rows.length === 0) {
            return res.status(404).send(
                "Product not found",
            );
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Error updating product:", err);
        res.status(500).send("Server Error: ", err);
    }
});

// DELETE a product
router.delete("/:id", async (req, res) => {
    const {id} = req.params;
    try {
        const result = await pool.query(
            "DELETE FROM products WHERE id_products = $1 RETURNING *"
            , [id],
        );
        if (result.rows.length === 0) {
            return res.status(404).send(
                "Product not found",
            );
        }
        res.send("Product deleted successfully");
    } catch (err) {
        console.error(
            "Error deleting product:", err,
        );
        res.status(500).send("Server Error");
    }
});

// INSERT PICKED ORDERS
router.post("/make-order", async (req, res)=> {
    const {buyerId, products} = req.body;

    try {
        const productCount = products.length;
        console.log(`Received ${productCount} products for order`);
        const orderTotal = 0;

        if (productCount === 0) {
            return res.status(400).json(
                {message: "No product provided in the order cart"},
            );
        }

        // INSERT ORDER
        const orderResult = await pool.query(
            `
            INSERT INTO orders (id_buyers, order_date, status, total_amount)
            VALUES ($1, NOW(), "pending", $4) RETURNING id_orders; 
            `,
            [buyerId, orderTotal],
        );

        const orderId = orderResult.rows[0].id_orders;
        for (const product of products) {
            await pool.query(
                `
                INSERT INTO order_items 
                (id_orders, id_products, quantity, price_at_order)
                VALUES 
                ($1, $2, $3, $4)
                `,
                [orderId, product.id, product.quantity, product.price],
            );
        }
        res.status(201).json(
            {
                messahe: "Order placed successfully",
                orderId,
                productCount,
            },
        );
    } catch (err) {
        console.error("Error placing order:", err);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
