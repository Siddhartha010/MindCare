const express = require('express');
const { getPool } = require('../config/database');
const pool = getPool();

const router = express.Router();

// Get all questions with replies
router.get('/questions', async (req, res) => {
  try {
    const [questions] = await pool.execute(`
      SELECT 
        cq.*,
        u.username,
        COUNT(cr.id) as reply_count
      FROM community_questions cq
      JOIN users u ON cq.user_id = u.id
      LEFT JOIN community_replies cr ON cq.id = cr.question_id
      GROUP BY cq.id
      ORDER BY cq.created_at DESC
    `);
    
    // Get replies for each question
    for (let question of questions) {
      const [replies] = await pool.execute(`
        SELECT 
          cr.*,
          u.username
        FROM community_replies cr
        JOIN users u ON cr.user_id = u.id
        WHERE cr.question_id = ?
        ORDER BY cr.created_at ASC
      `, [question.id]);
      
      question.replies = replies;
    }
    
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new question
router.post('/questions', async (req, res) => {
  try {
    const { userId, title, content, category } = req.body;
    
    const [result] = await pool.execute(`
      INSERT INTO community_questions (user_id, title, content, category)
      VALUES (?, ?, ?, ?)
    `, [userId, title, content, category || 'General']);
    
    res.json({ 
      message: 'Question posted successfully', 
      questionId: result.insertId 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add reply to question
router.post('/questions/:questionId/reply', async (req, res) => {
  try {
    const { questionId } = req.params;
    const { userId, content } = req.body;
    
    const [result] = await pool.execute(`
      INSERT INTO community_replies (question_id, user_id, content)
      VALUES (?, ?, ?)
    `, [questionId, userId, content]);
    
    res.json({ 
      message: 'Reply added successfully', 
      replyId: result.insertId 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;