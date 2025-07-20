const Pool = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});
// const pool = new Pool({
//   user: "urmuser",
//   host: "localhost",
//   database: "urm_db",
//   password: "urmpass",
//   port: 5437,
// });


module.exports = pool;