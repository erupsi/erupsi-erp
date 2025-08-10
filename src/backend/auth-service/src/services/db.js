const {Pool} = require("pg");
require("dotenv").config({path: __dirname + "/../../../../../.env"});

const pool = new Pool({
    user: process.env.DB_USER_AUTH_SERVICE,
    host: process.env.DB_HOST_AUTH_SERVICE,
    database: process.env.DB_NAME_AUTH_SERVICE,
    password: process.env.DB_PASS_AUTH_SERVICE,
    port: process.env.DB_PORT_AUTH_SERVICE,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

module.exports = pool;
