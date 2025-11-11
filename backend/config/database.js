const mysql = require('mysql2/promise');

let dbPool;
let isInitialized = false;

const initDB = async () => {
  if (isInitialized) return dbPool;
  
  try {
    // First connection without database
    const tempPool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306
    });
    
    await tempPool.execute(`CREATE DATABASE IF NOT EXISTS mental_health_db`);
    await tempPool.end();
    
    // Create pool with database
    dbPool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: 'mental_health_db',
      port: process.env.DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Users table
    await dbPool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        profile_data JSON,
        last_login TIMESTAMP NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // User sessions table
    await dbPool.execute(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        session_token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Quiz responses
    await dbPool.execute(`
      CREATE TABLE IF NOT EXISTS quiz_responses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        week_number INT NOT NULL,
        responses JSON NOT NULL,
        score INT NOT NULL,
        mental_health_level VARCHAR(20) NOT NULL,
        completion_time INT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_week (user_id, week_number)
      )
    `);

    // Mood entries
    await dbPool.execute(`
      CREATE TABLE IF NOT EXISTS mood_entries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        mood VARCHAR(20) NOT NULL,
        mood_value INT NOT NULL,
        note TEXT,
        entry_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_date (user_id, entry_date)
      )
    `);

    // Chat history
    await dbPool.execute(`
      CREATE TABLE IF NOT EXISTS chat_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        message TEXT NOT NULL,
        response TEXT NOT NULL,
        category VARCHAR(50) DEFAULT 'general',
        sentiment FLOAT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Community questions
    await dbPool.execute(`
      CREATE TABLE IF NOT EXISTS community_questions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        category VARCHAR(50) DEFAULT 'General',
        is_anonymous BOOLEAN DEFAULT false,
        view_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Community replies
    await dbPool.execute(`
      CREATE TABLE IF NOT EXISTS community_replies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        question_id INT NOT NULL,
        user_id INT NOT NULL,
        content TEXT NOT NULL,
        is_anonymous BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (question_id) REFERENCES community_questions(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // User achievements
    await dbPool.execute(`
      CREATE TABLE IF NOT EXISTS user_achievements (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        achievement_type VARCHAR(50) NOT NULL,
        achievement_name VARCHAR(100) NOT NULL,
        description TEXT,
        icon VARCHAR(10),
        earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_achievement (user_id, achievement_type)
      )
    `);

    // User statistics
    await dbPool.execute(`
      CREATE TABLE IF NOT EXISTS user_statistics (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL UNIQUE,
        total_quizzes INT DEFAULT 0,
        total_mood_entries INT DEFAULT 0,
        current_streak INT DEFAULT 0,
        longest_streak INT DEFAULT 0,
        wellness_points INT DEFAULT 0,
        last_activity TIMESTAMP NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create indexes (MySQL doesn't support IF NOT EXISTS for indexes)
    try { await dbPool.execute(`CREATE INDEX idx_quiz_user_date ON quiz_responses(user_id, created_at)`); } catch(e) {}
    try { await dbPool.execute(`CREATE INDEX idx_mood_user_date ON mood_entries(user_id, created_at)`); } catch(e) {}
    try { await dbPool.execute(`CREATE INDEX idx_chat_user_date ON chat_history(user_id, created_at)`); } catch(e) {}
    try { await dbPool.execute(`CREATE INDEX idx_questions_category ON community_questions(category, created_at)`); } catch(e) {}
    try { await dbPool.execute(`CREATE INDEX idx_sessions_token ON user_sessions(session_token)`); } catch(e) {}

    // Create triggers for automatic updates (using query instead of execute)
    const conn = await dbPool.getConnection();
    try {
      await conn.query(`DROP TRIGGER IF EXISTS quiz_stats_trigger`);
      await conn.query(`
        CREATE TRIGGER quiz_stats_trigger
        AFTER INSERT ON quiz_responses
        FOR EACH ROW
        BEGIN
          INSERT INTO user_statistics (user_id, total_quizzes, wellness_points, last_activity, updated_at)
          VALUES (NEW.user_id, 1, 10, NOW(), NOW())
          ON DUPLICATE KEY UPDATE
            total_quizzes = total_quizzes + 1,
            wellness_points = wellness_points + 10,
            last_activity = NOW(),
            updated_at = NOW();
        END
      `);
    } catch(e) {}
    finally {
      conn.release();
    }

    console.log('✅ MySQL database schema initialized successfully');
    isInitialized = true;
    return dbPool;
  } catch (err) {
    console.error('❌ MySQL initialization error:', err.message);
    throw err;
  }
};

module.exports = { initDB, getPool: () => dbPool };