const express = require('express');
const simpleDB = require('../config/simple-db');

const router = express.Router();

// Save mood entry
router.post('/save', async (req, res) => {
  try {
    const { userId, mood, note } = req.body;
    
    const moodEntry = simpleDB.createMoodEntry(userId, mood, note);
    res.json({ message: 'Mood saved successfully', data: moodEntry });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get mood history
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const moodHistory = simpleDB.getMoodHistory(parseInt(userId));
    res.json(moodHistory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;