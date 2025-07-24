const pool = require("./db.js");

/**
 *
 *
 */
async function test() {
    const query = "SELECT * FROM products";
    const result = await pool.query(query);
    console.log(result);
}

test();
