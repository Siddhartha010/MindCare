const express = require('express');
const simpleDB = require('../config/simple-db');

const router = express.Router();

// Get all questions
router.get('/questions', (req, res) => {
  try {
    const questions = simpleDB.getAllQuestions();
    const questionsWithUsernames = questions.map(q => {
      const user = simpleDB.findUserByEmail ? { username: 'Anonymous' } : { username: 'User' + q.user_id };
      return {
        ...q,
        username: user.username,
        replies: q.replies.map(r => ({
          ...r,
          username: 'User' + r.user_id
        }))
      };
    });
    res.json(questionsWithUsernames.reverse());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new question
router.post('/questions', (req, res) => {
  try {
    const { userId, title, content, category } = req.body;
    const question = simpleDB.createQuestion(userId, title, content, category);
    res.json({ message: 'Question posted successfully', question });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add reply to question
router.post('/questions/:questionId/reply', (req, res) => {
  try {
    const { questionId } = req.params;
    const { userId, content } = req.body;
    const reply = simpleDB.addReply(questionId, userId, content);
    
    if (reply) {
      res.json({ message: 'Reply added successfully', reply });
    } else {
      res.status(404).json({ error: 'Question not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;