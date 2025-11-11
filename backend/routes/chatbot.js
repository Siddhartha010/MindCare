const express = require('express');
const { getPool } = require('../config/database');

const router = express.Router();

// AI Chatbot responses
const generateResponse = (message) => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('stress') || lowerMessage.includes('anxious')) {
    return "Try deep breathing exercises: Inhale for 4 counts, hold for 4, exhale for 4. Practice mindfulness meditation for 10 minutes daily.";
  } else if (lowerMessage.includes('sleep') || lowerMessage.includes('insomnia')) {
    return "Establish a bedtime routine: No screens 1 hour before bed, keep room cool and dark, try chamomile tea or light stretching.";
  } else if (lowerMessage.includes('diet') || lowerMessage.includes('food')) {
    return "Focus on omega-3 rich foods (salmon, walnuts), leafy greens, and limit caffeine. Stay hydrated and eat regular meals.";
  } else if (lowerMessage.includes('exercise') || lowerMessage.includes('activity')) {
    return "Start with 20-30 minutes of walking daily. Yoga, swimming, or dancing can boost mood through endorphin release.";
  } else if (lowerMessage.includes('sad') || lowerMessage.includes('depressed')) {
    return "Connect with friends/family, engage in activities you enjoy, consider journaling your thoughts, and maintain a routine.";
  } else if (lowerMessage.includes('meditation') || lowerMessage.includes('relax')) {
    return "Try guided meditation apps, progressive muscle relaxation, or simple breathing exercises. Start with 5-10 minutes daily.";
  } else {
    return "I'm here to help with mental wellness advice. You can ask me about stress management, sleep, diet, exercise, or relaxation techniques.";
  }
};

// Chat with AI assistant
router.post('/chat', async (req, res) => {
  try {
    const { userId, message } = req.body;
    const pool = getPool();
    
    const response = generateResponse(message);
    
    // Save chat history
    await pool.execute(`
      INSERT INTO chat_history (user_id, message, response, category)
      VALUES (?, ?, ?, ?)
    `, [userId, message, response, 'general']);
    
    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get chat history
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const pool = getPool();
    
    const [history] = await pool.execute(`
      SELECT * FROM chat_history 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT 20
    `, [userId]);
    
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;