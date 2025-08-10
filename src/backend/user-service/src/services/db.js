const {Pool} = require("pg");
require("dotenv").config({path: __dirname + "/../../../../../.env"});

const pool = new Pool({
    user: process.env.DB_USER_URM_SERVICE,
    host: process.env.DB_HOST_URM_SERVICE,
    database: process.env.DB_NAME_URM_SERVICE,
    password: process.env.DB_PASS_URM_SERVICE,
    port: process.env.DB_PORT_URM_SERVICE,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

module.exports = pool;
