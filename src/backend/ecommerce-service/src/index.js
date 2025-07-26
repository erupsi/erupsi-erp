const express = require("express");
const app = express();
const productsRouter = require("./routes/products");
const consumersRouter = require("./routes/consumers");
const statisticRouter = require("./routes/statistic");

// Middleware
app.use(express.json());

// Routes
// app.use("/", (req, res) => {
//     res.send("Welcome to the E-commerce Service API");
// });
app.use("/products", productsRouter);
app.use("/consumers", consumersRouter);
app.use("/statistic", statisticRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
