const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Get all orders with customer details
router.get('/orders', async (req, res) => {
  try {
    const [orders] = await pool.query(`
      SELECT o.*, c.first_name, c.last_name, c.phone_number
      FROM orders o
      JOIN customers c ON o.customer_id = c.customer_id
      ORDER BY o.order_date DESC
    `);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update order status
router.put('/orders/:orderId', async (req, res) => {
  try {
    const { status } = req.body;
    await pool.query('UPDATE orders SET status = ? WHERE order_id = ?', 
      [status, req.params.orderId]
    );
    res.json({ message: 'Order updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get inventory status
router.get('/inventory', async (req, res) => {
  try {
    const [inventory] = await pool.query(`
      SELECT p.*, s.first_name as supplier_first_name, s.last_name as supplier_last_name,
      s.phone_number as supplier_phone
      FROM products p
      LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id
      ORDER BY p.stock_quantity ASC
    `);
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get daily transactions summary
router.get('/daily-transactions', async (req, res) => {
  try {
    const [transactions] = await pool.query(`
      SELECT COUNT(*) as total_transactions, 
      SUM(amount) as total_amount,
      transaction_status,
      payment_method
      FROM transactions
      WHERE DATE(transaction_date) = CURDATE()
      GROUP BY transaction_status, payment_method
    `);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;