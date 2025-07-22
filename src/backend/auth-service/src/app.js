const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const authRoutes = require("./routes/auth.routes")
require('dotenv').config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(express.json())
app.use("/auth", authRoutes)

app.get('/', (req, res) => {
  res.send('Welcome to the Auth Service');
});

app.listen(PORT, () => {
    console.log(`auth app listening on port ${PORT}`);
});
