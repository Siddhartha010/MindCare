const express = require('express');
const simpleDB = require('../config/simple-db');
const emailService = require('../services/emailService');

const router = express.Router();

// Send comprehensive report
router.post('/send/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const userStats = simpleDB.getUserStats(parseInt(userId));
    const quizHistory = simpleDB.getQuizResponsesByUser(parseInt(userId));
    const moodHistory = simpleDB.getMoodHistory(parseInt(userId));
    
    const latestQuiz = quizHistory[quizHistory.length - 1];
    const recentMoods = moodHistory.slice(-7);
    
    let recommendation = 'Continue your wellness journey!';
    if (latestQuiz) {
      if (latestQuiz.score <= 10) recommendation = 'Excellent mental health! Keep maintaining your positive habits.';
      else if (latestQuiz.score <= 20) recommendation = 'Consider stress management and regular exercise.';
      else recommendation = 'Please consider professional mental health support.';
    }
    
    const reportData = {
      score: latestQuiz?.score || 0,
      level: latestQuiz?.mental_health_level || 'Not assessed',
      points: userStats.points,
      streak: userStats.currentStreak,
      badges: userStats.badges,
      totalAssessments: userStats.totalQuizzes,
      totalMoodEntries: userStats.totalMoodEntries,
      recentMoods: recentMoods.map(m => `${m.mood} (${new Date(m.created_at).toLocaleDateString()})`),
      recommendation
    };
    
    const result = await emailService.sendReport('user@example.com', reportData);
    
    res.json({ 
      message: 'Comprehensive report sent to your email!',
      success: result.success 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;