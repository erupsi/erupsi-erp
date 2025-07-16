const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/auth/login", (req, res) => {
    res.send("this is a login endpoint");
});

app.get("/auth/refresh-token", (req, res) => {
    res.send("This is a refresh token endpoint");
});

app.get("/auth/change-password", (req, res) => {
    res.send("This is a change-password endpoint");
});

app.get("/auth/register", (req, res) => {
    res.send("This is a register endpoint");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
