const express = require('express');
const simpleDB = require('../config/simple-db');

const router = express.Router();

// Get user progress data
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const responses = simpleDB.getQuizResponsesByUser(parseInt(userId));
    
    const progressData = responses.map(row => ({
      week: row.week_number,
      score: row.score,
      level: row.mental_health_level,
      date: row.created_at,
      responses: row.responses
    }));
    
    res.json(progressData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get analytics summary
router.get('/analytics/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const responses = simpleDB.getQuizResponsesByUser(parseInt(userId));
    
    const summary = responses.reduce((acc, response) => {
      const level = response.mental_health_level;
      if (!acc[level]) acc[level] = { count: 0, totalScore: 0 };
      acc[level].count++;
      acc[level].totalScore += response.score;
      return acc;
    }, {});
    
    const recentTrend = responses.slice(-5);
    
    res.json({
      summary: Object.entries(summary).map(([level, data]) => ({
        mental_health_level: level,
        avg_score: data.totalScore / data.count,
        total_assessments: data.count
      })),
      recentTrend,
      totalAssessments: responses.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;