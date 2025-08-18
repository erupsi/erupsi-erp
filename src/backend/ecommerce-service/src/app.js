// src/app.js
import express from "express";
import cors from "cors"; // 1. Impor paket cors
import productRoutes from "./modules/product/product.routes.js";

// --- Inisialisasi Aplikasi ---
const app = express();
const PORT = 4000;

// --- Middleware ---
app.use(cors()); // 2. Gunakan middleware cors SEBELUM rute Anda
app.use(express.json());

// --- Rute Dasar ---
app.get("/", (req, res) => {
    res.send("🎉 API E-commerce Internal Berjalan!");
});

// --- Rute Fitur ---
app.use("/internal/products", productRoutes);

// --- Menjalankan Server ---
app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
