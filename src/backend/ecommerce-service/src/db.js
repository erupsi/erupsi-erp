const {Pool} = require('pg');

const pool = new Pool({
    user: 'ecomuser',
    host: 'localhost',
    database: "ecomdb",
    password: 'ecompass',
    port: 5436
});

module.exports = pool;