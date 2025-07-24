const express = require("express");
const app = express();
const productsRouter = require("./routes/products");
const consumersRouter = require("./routes/consumers");

// Middleware
app.use(express.json());

// Routes
app.use("/products", productsRouter);
app.use("/consumers", consumersRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
