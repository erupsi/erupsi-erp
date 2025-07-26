const express = require("express");
const router = express.Router(); // eslint-disable-line new-cap
const pool = require("../db");

// GET all consumers
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM consumers");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// GET a specific consumer by ID
router.get("/:id", async (req, res) => {
    const {id} = req.params;
    try {
        const result = await pool.query(
            "SELECT * FROM consumers WHERE id_buyers = $1",
            [id],
        );
        if (result.rows.length === 0) {
            return res.status(404).json({message: "Consumer not found"});
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// POST (create) a new consumer
router.post("/", async (req, res) => {
    const {fullName, email, password} = req.body;
    try {
        const result = await pool.query(
            `
      INSERT INTO consumers (full_name, email, password)
      VALUES ($1, $2, $3)
      RETURNING *;
      `,
            [fullName, email, password],
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        if (err.code === "23505") {
            return res.status(400).json({message: "Email already exists"});
        }
        res.status(500).send("Server Error");
    }
});

// PUT (update) an existing consumer
router.put("/:id", async (req, res) => {
    const {id} = req.params;
    const {fullName, email, password} = req.body;
    try {
        const result = await pool.query(
            `
      UPDATE consumers
      SET full_name = $1, email = $2, password = $3
      WHERE id_buyers = $4
      RETURNING *;
      `,
            [fullName, email, password, id],
        );
        if (result.rows.length === 0) {
            return res.status(404).json({message: "Consumer not found"});
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// DELETE a consumer
router.delete("/:id", async (req, res) => {
    const {id} = req.params;
    try {
        const result = await pool.query(
            "DELETE FROM consumers WHERE id_buyers = $1 RETURNING *",
            [id],
        );
        if (result.rows.length === 0) {
            return res.status(404).json({message: "Consumer not found"});
        }
        res.json({
            message: "Consumer deleted",
            deleted: result.rows[0],
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
