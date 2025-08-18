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
// src/lib/db.js
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

// Gunakan 'export default' untuk menjadikannya ekspor utama
export default prisma;
