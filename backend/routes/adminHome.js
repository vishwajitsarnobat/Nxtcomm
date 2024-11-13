const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Get employees overview
router.get('/employees', async (req, res) => {
  try {
    const [employees] = await pool.query(`
      SELECT employee_id, first_name, last_name, role, 
      email, phone_number, hire_date, salary
      FROM employees
      ORDER BY hire_date DESC
    `);
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get warehouses status
router.get('/warehouses', async (req, res) => {
  try {
    const [warehouses] = await pool.query(`
      SELECT w.*, e.first_name as manager_first_name, 
      e.last_name as manager_last_name
      FROM warehouses w
      LEFT JOIN employees e ON w.manager_id = e.employee_id
    `);
    res.json(warehouses);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get business analytics
router.get('/analytics', async (req, res) => {
  try {
    // Sales Overview
    const [sales] = await pool.query(`
      SELECT 
        COUNT(*) as total_orders,
        SUM(total_amount) as total_revenue,
        AVG(total_amount) as average_order_value
      FROM orders
      WHERE MONTH(order_date) = MONTH(CURRENT_DATE())
    `);

    // Top Products
    const [topProducts] = await pool.query(`
      SELECT p.name, p.price, COUNT(*) as order_count
      FROM orders o
      JOIN products p ON o.order_id = p.product_id
      GROUP BY p.product_id
      ORDER BY order_count DESC
      LIMIT 5
    `);

    // Customer Growth
    const [customerGrowth] = await pool.query(`
      SELECT COUNT(*) as new_customers
      FROM customers
      WHERE MONTH(registration_date) = MONTH(CURRENT_DATE())
    `);

    // Low Stock Products
    const [lowStock] = await pool.query(`
      SELECT product_id, name, stock_quantity
      FROM products
      WHERE stock_quantity < 10
      ORDER BY stock_quantity ASC
    `);

    res.json({
      sales: sales[0],
      topProducts,
      customerGrowth: customerGrowth[0],
      lowStock
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;