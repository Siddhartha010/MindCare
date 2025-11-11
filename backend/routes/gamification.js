const express = require('express');
const { getPool } = require('../config/database');
const pool = getPool();

const router = express.Router();

// Get user stats and badges
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get user statistics
    const [stats] = await pool.execute(`
      SELECT * FROM user_statistics WHERE user_id = ?
    `, [userId]);
    
    // Get user badges
    const [badges] = await pool.execute(`
      SELECT * FROM user_achievements WHERE user_id = ?
    `, [userId]);
    
    // Calculate current streak from mood entries
    const [streakData] = await pool.execute(`
      SELECT COUNT(*) as streak
      FROM mood_entries 
      WHERE user_id = ? 
      AND DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    `, [userId]);
    
    const userStats = stats[0] || {
      total_quizzes: 0,
      total_mood_entries: 0,
      current_streak: 0,
      wellness_points: 0
    };
    
    res.json({
      totalQuizzes: userStats.total_quizzes,
      totalMoodEntries: userStats.total_mood_entries,
      currentStreak: streakData[0].streak,
      points: userStats.wellness_points,
      badges: badges.map(badge => ({
        name: badge.achievement_name,
        icon: badge.icon,
        description: badge.description
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;