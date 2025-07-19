const express = require("express");
const app = express();
const port = 3000;

const products = [
    {id: 1, name: "ASRog B650M AM5 ", price: 100, quantity: 10},
    {id: 2, name: "RX 7700 XT", price: 200, quantity: 1},
    {id: 3, name: "Peerless assassin", price: 300, quantity: 5},
];

const usrCart = [];

app.get("/products", (req, res) => {
    res.json(products);
});

app.get("/cart", (req, res) => {
    res.json(usrCart);
});

app.get("/cart/:productId", (req, res) => {
    const idProduct = parseInt(req.params.productId);
    const productIndex = products.findIndex((p) => p.id == idProduct);

    if (productIndex === -1) {
        return res.status(404).json(
            {message: "Produk ini tidak dapat ditemukan"},
        );
    }

    let selectedProduct = {};
    if (products[productIndex].quantity <= 1) {
        selectedProduct = products.splice(productIndex, 1)[0];
        isProductInCart(selectedProduct.id) ?
            addMoreItem(selectedProduct) :
            putIntoCart(selectedProduct);
    } else {
        const currentProduct = products[productIndex];
        currentProduct.quantity -= 1;

        if (isProductInCart(currentProduct.id)) {
            addMoreItem(currentProduct);
        } else {
            selectedProduct = {...currentProduct, quantity: 1};
            putIntoCart(selectedProduct);
        }
    }

    res.json({
        message:
        "Produk ${selectedProduct.name} telah ditambahkan ke keranjang",
        cart: usrCart,
        remainingProducts: products,
    });
});

/**
 * Adds a product to the cart.
 * @param {Object} selectedProduct - The product to add.
 */
function putIntoCart(selectedProduct) {
    console.log(`Adding ${selectedProduct.name} to cart`);
    usrCart.push(selectedProduct);
}

/**
 * Increases the quantity of a product already in the cart.
 * @param {Object} currentProduct - The product to update.
 */
function addMoreItem(currentProduct) {
    console.log(`Adding ${currentProduct.name} quantity to cart`);
    const selectedProduct = usrCart.findIndex(
        (p) => p.id === currentProduct.id,
    );
    usrCart[selectedProduct].quantity += 1;
}

/**
 * Checks if a product exists in the cart by ID.
 * @param {number} productId - The ID of the product.
 * @return {boolean} True if product is in the cart.
 */
function isProductInCart(productId) {
    return usrCart.some((p) => p.id === productId);
}
app.get("/", (req, res) => {
    res.send("Hello world!");
    console.log("this is mom");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
