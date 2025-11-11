const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const isAdmin = async (req, res, next) => {
  try {
    // Query to check if user is admin
    const query = 'SELECT is_admin FROM users WHERE id = $1';
    const result = await pool.query(query, [req.user.id]);

    if (result.rows.length === 0 || !result.rows[0].is_admin) {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    next();
  } catch (error) {
    console.error('Error checking admin status:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = isAdmin;