/**
 * @fileoverview Main Express application for Authentication Service
 * @description This is the entry point for the authentication microservice
 * that handles employee login, registration, password management, and token
 * operations. It provides JWT-based authentication with refresh tokens.
 * @module app
 * @version 1.0.0
 */
require("dotenv").config({path: "../.env"});
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const cors = require("cors");

const {
    handlerErrorCsrf,
} = require("./middlewares/csrfProtect.js");

const authRoutes = require("./routes/auth.routes");

const app = express();
const PORT = process.env.PORT;
const SECRET_KEY_CSURF = process.env.SECRET_KEY_CSURF;
const CORS_ORIGIN = process.env.CORS_ORIGIN;
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
        sameSite: "Lax",
    },
};

// CORS configuration for cross-origin requests
app.use(cors({
    origin: CORS_ORIGIN, // Ganti dengan URL frontend Anda
    credentials: true, // Memungkinkan pengiriman cookie antar domain
}));

// Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(session(sessionOption)); // TOBE DETERMINED

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
app.listen(PORT, () => {});
