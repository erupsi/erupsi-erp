/**
 * @fileoverview Main Express application for Authentication Service
 * @description This is the entry point for the authentication microservice
 * that handles employee login, registration, password management, and token
 * operations. It provides JWT-based authentication with refresh tokens.
 * @module app
 * @version 1.0.0
 */
require("dotenv").config({path: __dirname + "../../../../.env"});
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const fs = require("fs"); // DELETE LATER
const https = require("https");

const {
    handlerErrorCsrf,
} = require("./middlewares/csrfProtect.js");

const authRoutes = require("./routes/auth.routes");

const app = express();
const PORT = process.env.PORT_AUTH_SERVICE;
const SECRET_KEY_CSURF = process.env.SECRET_KEY_CSURF_AUTH_SERVICE;
// const CORS_ORIGIN = process.env.CORS_ORIGIN;
/**
 * Session configuration options
 * @type {Object}
 * @property {string} secret - Session secret key
 * @property {boolean} resave - Whether to save session if unmodified
 * @property {boolean} saveUninitialized - Whether to save new sessions
 * @property {Object} cookie - Cookie configuration
 */
const sessionOption = {
    secret: SECRET_KEY_CSURF,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
    },
};

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 100, // Maksimal 100 permintaan per IP dalam 15 menit
    message: {
        error: "Too many requests, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const corsOptions = {
    origin: (origin, callback) => {
        // 1. Ambil string dari .env dan ubah menjadi array. Beri nilai default array kosong jika tidak ada.
        const allowedOrigins = process.env.CORS_ORIGINS_AUTH_SERVICE ? process.env.CORS_ORIGINS_AUTH_SERVICE
            .split(",") : [];

        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            // Izinkan permintaan, tidak ada error
            callback(null, true);
        } else {
            // Tolak permintaan dengan error CORS
            callback(new Error("This origin is not allowed by CORS"));
        }
    },
    credentials: true, // Memungkinkan pengiriman cookie antar domain
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Secara eksplisit izinkan metode
};

app.set("trust proxy", 1);
// Satu masalah, kemungkinan API Gateway harus mencari cara mengubah header originnya agar bisa diteruskan
app.use(cors(corsOptions));

// CORS configuration for cross-origin requests
app.use(express.json());
app.use(cookieParser());
app.use(limiter);

app.use(session(sessionOption)); // TOBE DETERMINED
const fsOptions = {
    key: fs.readFileSync("../../../../certs/localhost+1-key.pem"),
    cert: fs.readFileSync("../../../../certs/localhost+1.pem"),
};

// Middleware setup


// Routes
app.use("/auth", authRoutes);

/**
 * Health check endpoint
 * @route GET /
 * @returns {string} Welcome message
 */
app.get("/", (req, res) => {
    res.send("Welcome to the Auth Service");
});

app.use(handlerErrorCsrf);

/**
 * Start the Express server
 * @listens {number} PORT - The port number from environment variables
 */
// app.listen(PORT, () => {}); // DELETE LATER
https.createServer(fsOptions, app).listen(PORT, () => {
    console.log("Running on " + PORT);
});
