const express = require('express');
const { getPool } = require('../config/database');

const router = express.Router();

// Save mood entry
router.post('/save', async (req, res) => {
  try {
    const { userId, mood, note } = req.body;
    const pool = getPool();
    
    const moodValues = {
      'Happy': 5, 'Grateful': 5, 'Calm': 4, 'Neutral': 3,
      'Tired': 2, 'Sad': 2, 'Anxious': 1, 'Angry': 1
    };
    
    const [result] = await pool.execute(`
      INSERT INTO mood_entries (user_id, mood, mood_value, note, entry_date)
      VALUES (?, ?, ?, ?, CURDATE())
      ON DUPLICATE KEY UPDATE
        mood = VALUES(mood),
        mood_value = VALUES(mood_value),
        note = VALUES(note),
        created_at = NOW()
    `, [userId, mood, moodValues[mood] || 3, note || '']);
    
    // Update user statistics
    await pool.execute(`
      INSERT INTO user_statistics (user_id, total_mood_entries, wellness_points, last_activity)
      VALUES (?, 1, 5, NOW())
      ON DUPLICATE KEY UPDATE
        total_mood_entries = total_mood_entries + 1,
        wellness_points = wellness_points + 5,
        last_activity = NOW()
    `, [userId]);
    
    res.json({ message: 'Mood saved successfully', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get mood history
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const pool = getPool();
    
    const [moodHistory] = await pool.execute(`
      SELECT * FROM mood_entries 
      WHERE user_id = ? 
      ORDER BY created_at ASC
    `, [userId]);
    
    res.json(moodHistory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;