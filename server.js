const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');

const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // your MySQL username
    password: 'Tp212476@.', // your MySQL password
    database: 'wings_cafe_invetory'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

// Routes

// Get all products
app.get('/products', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Add a new product
app.post('/products', (req, res) => {
    const { name, description, category, price, quantity } = req.body;
    const sql = 'INSERT INTO products (name, description, category, price, quantity) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [name, description, category, price, quantity], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: result.insertId, ...req.body });
    });
});

// Update product stock
app.put('/products/:id', (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;
    const sql = 'UPDATE products SET quantity = ? WHERE id = ?';
    db.query(sql, [quantity, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Product updated' });
    });
});

// Delete a product
app.delete('/products/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM products WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Product deleted' });
    });
});

// Record a stock transaction
app.post('/stock_transactions', (req, res) => {
    const { product_id, change, transaction_type } = req.body;
    const sql = 'INSERT INTO stock_transactions (product_id, change, transaction_type) VALUES (?, ?, ?)';
    db.query(sql, [product_id, change, transaction_type], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: result.insertId, ...req.body });
    });
});

// Get stock transactions
app.get('/stock_transactions', (req, res) => {
    db.query('SELECT * FROM stock_transactions', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Start the server
const PORT = 5111;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
