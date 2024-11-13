const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Get all products with their offers
router.get('/products', async (req, res) => {
  try {
    const [products] = await pool.query(`
      SELECT p.*, o.offer_title, o.discount_value 
      FROM products p 
      LEFT JOIN offers o ON p.offer_id = o.offer_id
      WHERE p.stock_quantity > 0
    `);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get reviews for a product
router.get('/reviews/:productId', async (req, res) => {
  try {
    const [reviews] = await pool.query(`
      SELECT r.*, c.first_name 
      FROM reviews r
      JOIN customers c ON r.customer_id = c.customer_id
      WHERE r.product_id = ?
      ORDER BY r.review_date DESC
    `, [req.params.productId]);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current offers
router.get('/offers', async (req, res) => {
  try {
    const [offers] = await pool.query(`
      SELECT * FROM offers 
      WHERE end_date >= CURDATE()
      ORDER BY discount_value DESC
    `);
    res.json(offers);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
