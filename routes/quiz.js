const express = require('express');
const simpleDB = require('../config/simple-db');
const emailService = require('../services/emailService');

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

// Submit quiz responses
router.post('/submit', async (req, res) => {
  try {
    const { userId, responses, weekNumber } = req.body;
    
    // Calculate score (0-3 points per question)
    const score = responses.reduce((total, response) => total + response, 0);
    
    // Determine mental health level (higher scores = better mental health)
    let level;
    if (score <= 4) level = 'Severe - Seek Help';
    else if (score <= 9) level = 'Poor';
    else if (score <= 14) level = 'Fair';
    else if (score <= 19) level = 'Good';
    else level = 'Excellent';
    
    const result = simpleDB.createQuizResponse(userId, weekNumber, responses, score, level);
    
    // Get user stats for email report
    const userStats = simpleDB.getUserStats(userId);
    
    // Generate recommendation based on scoring
    let recommendation = 'Continue your wellness journey!';
    if (score <= 4) recommendation = 'Please seek immediate professional mental health support. You deserve care and help is available.';
    else if (score <= 9) recommendation = 'Your mental health needs attention. Consider speaking with a counselor or therapist.';
    else if (score <= 14) recommendation = 'Consider adding stress management techniques, regular exercise, and mindfulness practices.';
    else if (score <= 19) recommendation = 'Good mental health! Continue your current wellness practices and stay active.';
    else recommendation = 'Excellent! Your mental health is in great shape. Keep maintaining your positive lifestyle!';
    
    // Send email report
    const reportData = {
      score,
      level,
      points: userStats.points,
      streak: userStats.currentStreak,
      badges: userStats.badges,
      recommendation
    };
    
    emailService.sendReport('user@example.com', reportData);
    
    res.json({ 
      score, 
      level, 
      message: `Your mental health assessment is complete. Score: ${score}/30. Report sent to your email!`,
      data: result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;