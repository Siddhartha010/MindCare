const express = require('express');
const { getPool } = require('../config/database');

const router = express.Router();

// Get user progress data
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const pool = getPool();
    
    const [responses] = await pool.execute(`
      SELECT * FROM quiz_responses 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `, [userId]);
    
    const progressData = responses.map(row => {
      let parsedResponses;
      try {
        parsedResponses = typeof row.responses === 'string' ? JSON.parse(row.responses) : row.responses;
      } catch (e) {
        parsedResponses = [];
      }
      return {
        week: row.week_number,
        score: row.score,
        level: row.mental_health_level,
        date: row.created_at,
        responses: parsedResponses
      };
    });
    
    res.json(progressData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get analytics summary
router.get('/analytics/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const pool = getPool();
    
    const [summary] = await pool.execute(`
      SELECT 
        mental_health_level,
        AVG(score) as avg_score,
        COUNT(*) as total_assessments
      FROM quiz_responses 
      WHERE user_id = ? 
      GROUP BY mental_health_level
    `, [userId]);
    
    const [recentTrend] = await pool.execute(`
      SELECT score, created_at 
      FROM quiz_responses 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT 5
    `, [userId]);
    
    const [totalCount] = await pool.execute(`
      SELECT COUNT(*) as total 
      FROM quiz_responses 
      WHERE user_id = ?
    `, [userId]);
    
    res.json({
      summary,
      recentTrend,
      totalAssessments: totalCount[0].total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;