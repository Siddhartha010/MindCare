const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Track breathing exercise session
router.post('/session', auth, async (req, res) => {
  try {
    const { pattern, duration, completed } = req.body;
    const userId = req.user.id;

    // Store session data in activity log
    const activityData = {
      userId,
      type: 'breathing_exercise',
      details: {
        pattern,
        duration,
        completed
      },
      timestamp: new Date()
    };

    // Log the activity
    const logger = require('../config/activity-logger');
    await logger.logActivity(activityData);

    res.json({ success: true, message: 'Session logged successfully' });
  } catch (error) {
    console.error('Error logging breathing session:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's breathing exercise history
router.get('/history', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const logger = require('../config/activity-logger');
    
    const history = await logger.getActivities({
      userId,
      type: 'breathing_exercise',
      limit: 10
    });

    res.json(history);
  } catch (error) {
    console.error('Error fetching breathing history:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;