const express = require("express");
const cookieParser = require("cookie-parser")
const session = require('express-session'); //TOBE DETERMINED
const cors = require('cors'); //TOBE DETERMINED

const authRoutes = require("./routes/auth.routes")
require('dotenv').config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT;

const sessionOption = {
    secret: 'secret-key-anda-123@#$#32', // Ganti dengan secret key yang kuat
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax' // Penting untuk penanganan CSRF antar domain
    }
} //TOBE DETERMINED

app.use(cors({
    origin: 'http://yamym.com', // Ganti dengan URL frontend Anda
    credentials: true // Memungkinkan pengiriman cookie antar domain
}));

app.use(express.json())
app.use(cookieParser())
app.use(session(sessionOption)); //TOBE DETERMINED

app.use("/auth", authRoutes)

app.get('/', (req, res) => {
  res.send('Welcome to the Auth Service');
});

app.listen(PORT, () => {
    console.log(`auth app listening on port ${PORT}`);
});
