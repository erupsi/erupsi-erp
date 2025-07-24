const {Pool} = require('pg');

const pool = new Pool({
    user: 'ecomuser',
    host: 'localhost',
    database: "ecom_db",
    password: 'ecompass',
    port: 5437
});

module.exports = pool;