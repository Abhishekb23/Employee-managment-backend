// routes/employee.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Add new employee
router.post('/', async (req, res) => {
  const { name, email, position } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO employees (name, email, position) VALUES ($1, $2, $3) RETURNING *',
      [name, email, position]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add employee' });
  }
});

// Get all employees
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM employees');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get employees' });
  }
});

// Get employee by ID
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM employees WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get employee' });
  }
});



// Update employee
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { name, email, position } = req.body;

  try {
    const result = await pool.query(
      `UPDATE employees 
       SET name = $1, email = $2, position = $3 
       WHERE id = $4 
       RETURNING *`,
      [name, email, position, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error updating employee:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Delete employee
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query('DELETE FROM employees WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted', employee: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

module.exports = router;
