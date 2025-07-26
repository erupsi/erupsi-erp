const express = require("express");
const router = express.Router(); // eslint-disable-line new-cap
const pool = require("../db");

router.get("/", async (req, res) => {
    try {
        const query = `
      SELECT 
        o.id_orders,
        o.order_date,
        o.status,
        o.total_amount,

        c.id_buyers,
        c.full_name AS buyer_name,
        c.email AS buyer_email,

        pmt.payment_method,
        pmt.paid_amount,
        pmt.paid_at,

        json_agg(
          DISTINCT jsonb_build_object(
            'productName', pr.name,
            'quantity', oi.quantity,
            'priceAtOrder', oi.price_at_order
          )
        ) AS items,

        (
          SELECT json_agg(
            jsonb_build_object(
              'action', al.action,
              'details', al.details,
              'createdAt', al.created_at
            )
            ORDER BY al.created_at DESC
          )
          FROM activity_logs al
          WHERE al.id_buyers = c.id_buyers
        ) AS activities

      FROM orders o
      LEFT JOIN consumers c ON o.id_buyers = c.id_buyers
      LEFT JOIN payments pmt ON o.id_orders = pmt.id_orders
      LEFT JOIN order_items oi ON o.id_orders = oi.id_orders
      LEFT JOIN products pr ON oi.id_products = pr.id_products

      GROUP BY 
        o.id_orders, o.order_date, o.status, o.total_amount,
        c.id_buyers, c.full_name, c.email,
        pmt.payment_method, pmt.paid_amount, pmt.paid_at

      ORDER BY o.order_date DESC;
    `;

        const result = await pool.query(query);

        // Convert keys to camelCase
        const camelCaseRows = result.rows.map((row) => ({
            orderId: row.id_orders,
            orderDate: row.order_date,
            status: row.status,
            totalAmount: row.total_amount,
            buyer: {
                buyerId: row.id_buyers,
                fullName: row.buyer_name,
                email: row.buyer_email,
            },
            payment: {
                method: row.payment_method,
                paidAmount: row.paid_amount,
                paidAt: row.paid_at,
            },
            items: row.items,
            activities: row.activities,
        }));

        res.json(camelCaseRows);
    } catch (err) {
        console.error("Error fetching statistics with activity logs:", err);
        res.status(500).send("Server Error");
    }
});

router.put("/cancel/:id", async (req, res) => {
    const {id} = req.params;

    try {
        const updateResult = await pool.query(
            `
        UPDATE orders
        SET status = 'cancelled'
        WHERE id_orders = $1
        RETURNING id_orders, id_buyers, status
      `,
            [id],
        );

        if (updateResult.rows.length === 0) {
            return res.status(404).json({message: "Order not found"});
        }

        const {id_buyers: buyerId} = updateResult.rows[0];

        await pool.query(
            `
        INSERT INTO activity_logs (id_buyers, action, details)
        VALUES ($1, $2, $3)
      `,
            [
                buyerId,
                "Cancel Order",
                `Order ${id} was cancelled by admin`,
            ],
        );

        res.json({message: `Order ${id} cancelled successfully`});
    } catch (err) {
        console.error("Error cancelling order:", err);
        res.status(500).json({
            message: "Server error while cancelling order",
        });
    }
});

module.exports = router;
