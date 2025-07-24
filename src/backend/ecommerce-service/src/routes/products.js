const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
    try{
        const result = await pool.query('SELECT * FROM products');
        res.json(result.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
})

module.exports = router;