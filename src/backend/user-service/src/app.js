/**
 * @file Main server entry point for the URM (User & Role Management) Service.
 * @description This file initializes and configures the Express application, sets up middleware, mounts the application routes, and starts the server.
 * @author perhanjay
 */

const express = require("express");
const urmRoutes = require("./routes/urm.routes")
require('dotenv').config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT;

app.use(express.json())
app.use("/urm", urmRoutes)

app.get('/', (req, res) => {
  res.send('Welcome to the URM Service');
});

app.listen(PORT, () => {
    console.log(`urm app listening on port ${PORT}`);
});
