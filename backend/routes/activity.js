const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/admin');

// Log user activity
router.post('/log', auth, async (req, res) => {
  try {
    const { activity_type, description, page_url } = req.body;
    const user_id = req.user.id;
    const ip_address = req.ip;
    const user_agent = req.headers['user-agent'];

    const query = `
      INSERT INTO user_activities 
      (user_id, activity_type, description, page_url, ip_address, user_agent)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const values = [user_id, activity_type, description, page_url, ip_address, user_agent];
    await pool.query(query, values);

    res.json({ message: 'Activity logged successfully' });
  } catch (error) {
    console.error('Error logging activity:', error);
    res.status(500).json({ error: 'Failed to log activity' });
  }
});

// Get user activities (admin only)
router.get('/user/:userId', auth, isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const query = `
      SELECT 
        a.*,
        u.username,
        u.email
      FROM user_activities a
      JOIN users u ON a.user_id = u.id
      WHERE a.user_id = $1
      ORDER BY a.created_at DESC
    `;

    const result = await pool.query(query, [userId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching user activities:', error);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

// Get all activities (admin only)
router.get('/all', auth, isAdmin, async (req, res) => {
  try {
    const query = `
      SELECT 
        a.*,
        u.username,
        u.email,
        u.is_admin
      FROM user_activities a
      JOIN users u ON a.user_id = u.id
      ORDER BY a.created_at DESC
      LIMIT 100
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching all activities:', error);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

module.exports = router;