const express = require("express");
const cookieParser = require("cookie-parser")
const authRoutes = require("./routes/auth.routes")
require('dotenv').config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT;

app.use(express.json())
app.use(cookieParser())
app.use("/auth", authRoutes)

app.get('/', (req, res) => {
  res.send('Welcome to the Auth Service');
});

app.listen(PORT, () => {
    console.log(`auth app listening on port ${PORT}`);
});
