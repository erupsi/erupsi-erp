const express = require("express");
const cors = require("cors");

const app = express();
const productOnSale_Router = require("./routes/productOnSale");

// Middleware
app.use(express.json());
app.use(cors());
// Routes
// app.use("/", (req, res) => {
//     res.send("Welcome to the E-commerce Service API");
// });
app.use("/products", productOnSale_Router);
// app.use("/consumers", consumersRouter);
app.use("/statistic", statisticRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
