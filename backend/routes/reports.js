const express = require('express');
const { getPool } = require('../config/database');

const router = express.Router();

// Send comprehensive report
router.post('/send/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const pool = getPool();
    
    if (!pool) {
      return res.status(500).json({ error: 'Database connection not available' });
    }
    
    // Get user info
    const [users] = await pool.execute(`SELECT username, email FROM users WHERE id = ?`, [userId]);
    if (users.length === 0) return res.status(404).json({ error: 'User not found' });
    
    const user = users[0];
    
    // Get user statistics
    const [userStats] = await pool.execute(`SELECT * FROM user_statistics WHERE user_id = ?`, [userId]);
    
    // Get quiz history
    const [quizHistory] = await pool.execute(`
      SELECT * FROM quiz_responses WHERE user_id = ? ORDER BY created_at DESC LIMIT 10
    `, [userId]);
    
    // Get mood history
    const [moodHistory] = await pool.execute(`
      SELECT * FROM mood_entries WHERE user_id = ? ORDER BY created_at DESC LIMIT 7
    `, [userId]);
    
    // Get badges
    const [badges] = await pool.execute(`
      SELECT achievement_name, icon, description FROM user_achievements WHERE user_id = ?
    `, [userId]);
    
    const stats = userStats[0] || { wellness_points: 0, current_streak: 0, total_quizzes: 0, total_mood_entries: 0 };
    const latestQuiz = quizHistory[0];
    const avgScore = quizHistory.length > 0 ? (quizHistory.reduce((sum, q) => sum + q.score, 0) / quizHistory.length).toFixed(1) : 'N/A';
    
    let recommendation = 'Continue your wellness journey!';
    if (latestQuiz) {
      if (latestQuiz.score <= 4) recommendation = 'Please consider professional mental health support.';
      else if (latestQuiz.score <= 9) recommendation = 'Consider stress management and regular exercise.';
      else if (latestQuiz.score <= 14) recommendation = 'Focus on wellness practices and self-care.';
      else if (latestQuiz.score <= 19) recommendation = 'Excellent mental health! Keep maintaining your positive habits.';
      else recommendation = 'Outstanding! Continue your wellness journey.';
    }
    
    const reportData = {
      latestScore: latestQuiz?.score || 0,
      level: latestQuiz?.mental_health_level || 'Not assessed',
      points: stats.wellness_points,
      streak: stats.current_streak,
      badges: badges.map(b => ({ name: b.achievement_name, icon: b.icon })),
      totalAssessments: stats.total_quizzes,
      totalMoodEntries: stats.total_mood_entries,
      recentMoods: moodHistory.map(m => `${m.mood} (${new Date(m.created_at).toLocaleDateString()})`),
      recommendation,
      avgScore
    };
    
    res.json({ 
      message: 'Report data ready. Email will be sent from frontend.',
      reportData,
      userEmail: user.email,
      userName: user.username
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;