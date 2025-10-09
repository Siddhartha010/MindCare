const express = require('express');
const simpleDB = require('../config/simple-db');

const router = express.Router();

// Get user stats and badges
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const stats = simpleDB.getUserStats(parseInt(userId));
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;