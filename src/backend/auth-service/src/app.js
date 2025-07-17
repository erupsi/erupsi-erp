const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const authRoutes = require("./routes/auth.routes")
require('dotenv').config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT;
const JWT_SECRET = process.env.PORT;

app.use(bodyParser.json())
app.use("/auth", authRoutes)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
