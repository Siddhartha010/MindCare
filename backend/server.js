const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { initDB } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Backend only - frontend deployed separately

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/quiz', require('./routes/quiz'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/chatbot', require('./routes/chatbot'));
app.use('/api/mood', require('./routes/mood'));
app.use('/api/gamification', require('./routes/gamification'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/community', require('./routes/community'));
app.use('/api/breathing', require('./routes/breathing'));
app.use('/api/activity', require('./routes/activity'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'MindCare API is running', version: '1.0.0' });
});

const startServer = async () => {
  try {
    await initDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();