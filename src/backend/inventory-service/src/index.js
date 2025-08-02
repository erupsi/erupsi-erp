// server.js

import express from 'express';
import crypto from 'crypto';

const app = express();
const port = 3000;

// --- In-Memory Database ---
// This will act as our temporary database to make the mock server stateful.
const db = {
    products: [],
    warehouses: [],
    suppliers: [],
};

app.use(express.json());

// --- Helper Functions ---
const createSuccessResponse = (data) => ({ success: true, data });
const createErrorResponse = (message, status = 400) => ({ success: false, error: { message, status } });

// --- Middleware for Logging ---
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// ===================================
//  Product Catalog Endpoints
// ===================================

// GET /api/v1/products
app.get('/api/v1/products', (req, res) => {
    // For simplicity, pagination is mocked but returns all items.
    // A real implementation would use req.query.page and req.query.limit.
    const response = {
        success: true,
        pagination: {
            total: db.products.length,
            page: 1,
            limit: db.products.length,
            totalPages: 1
        },
        data: db.products
    };
    res.status(200).json(response);
});

// POST /api/v1/products
app.post('/api/v1/products', (req, res) => {
    const { name, description } = req.body;
    if (!name) {
        return res.status(400).json(createErrorResponse("Product name is required."));
    }
    const newProduct = {
        id: crypto.randomUUID(),
        name,
        description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };
    db.products.push(newProduct);
    res.status(201).json(createSuccessResponse(newProduct));
});

// GET /api/v1/products/{id}
app.get('/api/v1/products/:id', (req, res) => {
    const product = db.products.find(p => p.id === req.params.id);
    if (!product) {
        return res.status(404).json(createErrorResponse("Product not found."));
    }
    // Add mock variants for detail view
    const productWithVariants = {
        ...product,
        variants: [{
            id: crypto.randomUUID(),
            sku: `${product.name.substring(0,3).toUpperCase()}-001`,
            price: "99.99"
        }]
    };
    res.status(200).json(createSuccessResponse(productWithVariants));
});

// PUT /api/v1/products/{id}
app.put('/api/v1/products/:id', (req, res) => {
    const productIndex = db.products.findIndex(p => p.id === req.params.id);
    if (productIndex === -1) {
        return res.status(404).json(createErrorResponse("Product not found."));
    }
    const updatedProduct = {
        ...db.products[productIndex],
        ...req.body,
        updated_at: new Date().toISOString(),
    };
    db.products[productIndex] = updatedProduct;
    res.status(200).json(createSuccessResponse(updatedProduct));
});

// DELETE /api/v1/products/{id}
app.delete('/api/v1/products/:id', (req, res) => {
    const initialLength = db.products.length;
    db.products = db.products.filter(p => p.id !== req.params.id);
    if (db.products.length === initialLength) {
        return res.status(404).json(createErrorResponse("Product not found."));
    }
    res.status(200).json({
        success: true,
        message: `Product with ID ${req.params.id} has been deleted successfully.`
    });
});


// ===================================
//  Warehouse Management Endpoints
// ===================================

// GET /api/v1/warehouses
app.get('/api/v1/warehouses', (req, res) => {
    res.status(200).json(createSuccessResponse(db.warehouses));
});

// POST /api/v1/warehouses
app.post('/api/v1/warehouses', (req, res) => {
    const { name, address, is_active } = req.body;
    if (!name) {
        return res.status(400).json(createErrorResponse("Warehouse name is required."));
    }
    const newWarehouse = {
        id: crypto.randomUUID(),
        name,
        address,
        is_active,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };
    db.warehouses.push(newWarehouse);
    res.status(201).json(createSuccessResponse(newWarehouse));
});


// ===================================
//  Supplier Management Endpoints
// ===================================

// GET /api/v1/suppliers
app.get('/api/v1/suppliers', (req, res) => {
    res.status(200).json(createSuccessResponse(db.suppliers));
});

// POST /api/v1/suppliers
app.post('/api/v1/suppliers', (req, res) => {
    const { name, contact_person, email, phone } = req.body;
    if (!name) {
        return res.status(400).json(createErrorResponse("Supplier name is required."));
    }
    const newSupplier = {
        id: crypto.randomUUID(),
        name,
        contact_person,
        email,
        phone,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };
    db.suppliers.push(newSupplier);
    res.status(201).json(createSuccessResponse(newSupplier));
});


// --- Server Start ---
app.listen(port, () => {
    console.log(`Erupsi Mock API Server v1.2 running at http://localhost:${port}`);
});
