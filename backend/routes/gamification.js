const express = require('express');
const { getPool } = require('../config/database');

const router = express.Router();

// Get user stats and badges
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const pool = getPool();
    
    // Initialize user statistics if not exists
    await pool.execute(`
      INSERT IGNORE INTO user_statistics (user_id, total_quizzes, total_mood_entries, wellness_points)
      VALUES (?, 0, 0, 0)
    `, [userId]);
    
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
    
    const calculatedStreak = streakData[0].streak;
    
    // Update the streak in database
    await pool.execute(`
      UPDATE user_statistics 
      SET current_streak = ?, 
          longest_streak = GREATEST(longest_streak, ?)
      WHERE user_id = ?
    `, [calculatedStreak, calculatedStreak, userId]);
    
    const userStats = stats[0] || {
      total_quizzes: 0,
      total_mood_entries: 0,
      current_streak: 0,
      wellness_points: 0
    };
    
    res.json({
      totalQuizzes: userStats.total_quizzes,
      totalMoodEntries: userStats.total_mood_entries,
      currentStreak: calculatedStreak,
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