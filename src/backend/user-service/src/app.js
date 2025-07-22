const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const urmRoutes = require("./routes/urm.routes")
require('dotenv').config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT;
const JWT_SECRET = process.env.PORT;

app.use(bodyParser.json())
app.use("/urm", urmRoutes)

app.get('/', (req, res) => {
  res.send('Welcome to the URM Service');
});

app.listen(PORT, () => {
    console.log(`urm app listening on port ${PORT}`);
});
