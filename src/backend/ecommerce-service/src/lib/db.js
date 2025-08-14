// const {Pool} = require("pg");

// const pool = new Pool({
//     user: "ecomuser",
//     host: "localhost",
//     database: "ecomdb",
//     password: "ecompass",
//     port: 5432,
// });

// module.exports = pool;
// src/lib/db.js (Versi Baru dengan Prisma)
const {PrismaClient} = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = prisma;
