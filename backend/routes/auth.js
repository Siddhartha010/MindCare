const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getPool } = require('../config/database');

const router = express.Router();

// Test database connection with complex query
router.get('/test', async (req, res) => {
  try {
    const pool = getPool();
    const [result] = await pool.execute(`
      SELECT 
        NOW() as current_time,
        COUNT(DISTINCT u.id) as total_users,
        COUNT(DISTINCT qr.id) as total_quizzes,
        COUNT(DISTINCT me.id) as total_mood_entries,
        AVG(us.wellness_points) as avg_wellness_points
      FROM users u
      LEFT JOIN quiz_responses qr ON u.id = qr.user_id
      LEFT JOIN mood_entries me ON u.id = me.user_id
      LEFT JOIN user_statistics us ON u.id = us.user_id
    `);
    
    res.json({ 
      message: 'MySQL database connected with complex analytics!', 
      stats: result[0]
    });
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed: ' + error.message });
  }
});

// Register with complex transaction
router.post('/register', async (req, res) => {
  const pool = getPool();
  const connection = await pool.getConnection();
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    await connection.beginTransaction();
    
    // Check if user exists
    const [existingUser] = await connection.execute(`
      SELECT id, email, username 
      FROM users 
      WHERE LOWER(email) = LOWER(?) OR LOWER(username) = LOWER(?)
    `, [email, username]);
    
    if (existingUser.length > 0) {
      await connection.rollback();
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert user
    const [userResult] = await connection.execute(`
      INSERT INTO users (username, email, password, profile_data, last_login) 
      VALUES (?, ?, ?, ?, NOW())
    `, [username, email, hashedPassword, JSON.stringify({ registration_source: 'web' })]);
    
    const userId = userResult.insertId;
    
    // Create session
    const sessionToken = jwt.sign({ userId }, process.env.JWT_SECRET || 'secret');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    await connection.execute(`
      INSERT INTO user_sessions (user_id, session_token, expires_at) 
      VALUES (?, ?, ?)
    `, [userId, sessionToken, expiresAt]);
    
    // Initialize user statistics
    await connection.execute(`
      INSERT INTO user_statistics (user_id, wellness_points, last_activity) 
      VALUES (?, 0, NOW())
    `, [userId]);
    
    await connection.commit();
    
    console.log('Registration successful for:', email);
    res.json({ 
      token: sessionToken, 
      user: { id: userId, username, email }
    });
    
  } catch (error) {
    await connection.rollback();
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
});

// Login with session management
router.post('/login', async (req, res) => {
  try {
    const pool = getPool();
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Complex query with user stats
    const [result] = await pool.execute(`
      SELECT 
        u.id, u.username, u.email, u.password, u.last_login,
        us.wellness_points, us.current_streak, us.total_quizzes,
        COUNT(ua.id) as total_achievements
      FROM users u
      LEFT JOIN user_statistics us ON u.id = us.user_id
      LEFT JOIN user_achievements ua ON u.id = ua.user_id
      WHERE LOWER(u.email) = LOWER(?) AND u.is_active = true
      GROUP BY u.id, us.wellness_points, us.current_streak, us.total_quizzes
    `, [email]);
    
    if (result.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Update last login and create session
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      // Update last login
      await connection.execute(`
        UPDATE users 
        SET last_login = NOW(), updated_at = NOW() 
        WHERE id = ?
      `, [user.id]);
      
      // Clean expired sessions
      await connection.execute(`
        DELETE FROM user_sessions 
        WHERE user_id = ? AND expires_at < NOW()
      `, [user.id]);
      
      // Create new session
      const sessionToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret');
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      
      await connection.execute(`
        INSERT INTO user_sessions (user_id, session_token, expires_at) 
        VALUES (?, ?, ?)
      `, [user.id, sessionToken, expiresAt]);
      
      await connection.commit();
      
      console.log('Login successful for:', email);
      res.json({ 
        token: sessionToken, 
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          stats: {
            wellness_points: user.wellness_points || 0,
            current_streak: user.current_streak || 0,
            total_quizzes: user.total_quizzes || 0,
            total_achievements: user.total_achievements || 0
          }
        }
      });
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;