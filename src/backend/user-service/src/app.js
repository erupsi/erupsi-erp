/**
 * @file Main server entry point for the URM (User & Role Management) Service.
 * @description
 * This file initializes and configures the Express application,
 * sets up middleware, mounts the application routes, and starts the server.
 * @author perhanjay
 */

const express = require("express");
const urmRoutes = require("./routes/urm.routes");
require("dotenv").config({path: "../.env"});
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT_URM_SERVICE;

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 100, // Maksimal 100 permintaan per IP dalam 15 menit
    message: {
        error: "Too many requests, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(limiter);
app.use(express.json());
app.use("/urm", urmRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to the URM Service");
});

app.listen(PORT, () => {
});
