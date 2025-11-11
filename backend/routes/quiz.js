const express = require('express');
const { getPool } = require('../config/database');

const router = express.Router();

const quizQuestions = [
  { id: 1, question: "How often have you felt down, depressed, or hopeless?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { id: 2, question: "How often have you had little interest or pleasure in doing things?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { id: 3, question: "How often have you felt nervous, anxious, or on edge?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { id: 4, question: "How often have you been bothered by trouble falling or staying asleep?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { id: 5, question: "How often have you felt tired or had little energy?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { id: 6, question: "How often have you had poor appetite or overeating?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { id: 7, question: "How often have you felt bad about yourself or that you are a failure?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { id: 8, question: "How often have you had trouble concentrating on things?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { id: 9, question: "How often have you been moving or speaking slowly or restlessly?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { id: 10, question: "How satisfied are you with your social relationships?", options: ["Very satisfied", "Somewhat satisfied", "Somewhat dissatisfied", "Very dissatisfied"] }
];

// Get quiz questions
router.get('/questions', (req, res) => {
  res.json(quizQuestions);
});

// Submit quiz with MySQL operations
router.post('/submit', async (req, res) => {
  const pool = getPool();
  const connection = await pool.getConnection();
  try {
    const { userId, responses, weekNumber } = req.body;
    const score = responses.reduce((total, response) => total + response, 0);
    
    // Determine mental health level
    let level;
    if (score <= 4) level = 'Severe - Seek Help';
    else if (score <= 9) level = 'Poor';
    else if (score <= 14) level = 'Fair';
    else if (score <= 19) level = 'Good';
    else level = 'Excellent';
    
    await connection.beginTransaction();
    
    // Insert quiz response (no duplicate key update - allow multiple per day)
    const [quizResult] = await connection.execute(`
      INSERT INTO quiz_responses (user_id, week_number, responses, score, mental_health_level, completion_time)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [userId, weekNumber, JSON.stringify(responses), score, level, 120]);
    
    // Get user statistics with complex query
    const [statsResult] = await connection.execute(`
      SELECT 
        us.*,
        u.username,
        u.email,
        COUNT(DISTINCT ua.id) as badge_count,
        JSON_ARRAYAGG(
          CASE WHEN ua.id IS NOT NULL THEN
            JSON_OBJECT(
              'name', ua.achievement_name,
              'icon', ua.icon,
              'description', ua.description
            )
          END
        ) as badges
      FROM user_statistics us
      JOIN users u ON us.user_id = u.id
      LEFT JOIN user_achievements ua ON us.user_id = ua.user_id
      WHERE us.user_id = ?
      GROUP BY us.id, u.username, u.email
    `, [userId]);
    
    await connection.commit();
    
    const userStats = statsResult[0];
    
    // Generate recommendation
    let recommendation = 'Continue your wellness journey!';
    if (score <= 4) recommendation = 'Please seek immediate professional mental health support. You deserve care and help is available.';
    else if (score <= 9) recommendation = 'Your mental health needs attention. Consider speaking with a counselor or therapist.';
    else if (score <= 14) recommendation = 'Consider adding stress management techniques, regular exercise, and mindfulness practices.';
    else if (score <= 19) recommendation = 'Good mental health! Continue your current wellness practices and stay active.';
    else recommendation = 'Excellent! Your mental health is in great shape. Keep maintaining your positive lifestyle!';
    
    res.json({ 
      score, 
      level, 
      message: `Assessment complete. Score: ${score}/30`,
      userStats: {
        wellness_points: userStats.wellness_points,
        current_streak: userStats.current_streak,
        total_quizzes: userStats.total_quizzes,
        badges: userStats.badges ? JSON.parse(userStats.badges).filter(b => b !== null) : []
      },
      recommendation
    });
    
  } catch (error) {
    await connection.rollback();
    console.error('Quiz submission error:', error);
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
});

module.exports = router;