const { Pool } = require('pg');

// First connect to postgres database to create our database
const adminPool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres', // Connect to default postgres database
  password: 'password',
  port: 5432,
});

const setupDatabase = async () => {
  try {
    console.log('🔧 Setting up database...');
    
    // Create database if it doesn't exist
    try {
      await adminPool.query('CREATE DATABASE mental_health_db');
      console.log('✅ Database "mental_health_db" created successfully!');
    } catch (error) {
      if (error.code === '42P04') {
        console.log('ℹ️  Database "mental_health_db" already exists');
      } else {
        throw error;
      }
    }
    
    await adminPool.end();
    
    // Now connect to our database and create tables
    const appPool = new Pool({
      user: 'postgres',
      host: 'localhost',
      database: 'mental_health_db',
      password: 'password',
      port: 5432,
    });
    
    // Create tables
    await appPool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await appPool.query(`
      CREATE TABLE IF NOT EXISTS quiz_responses (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        week_number INTEGER NOT NULL,
        responses JSONB NOT NULL,
        score INTEGER NOT NULL,
        mental_health_level VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await appPool.query(`
      CREATE TABLE IF NOT EXISTS chat_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        message TEXT NOT NULL,
        response TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✅ All tables created successfully!');
    
    await appPool.end();
    console.log('🎉 Database setup complete!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('\n💡 Make sure:');
    console.log('1. PostgreSQL is installed and running');
    console.log('2. Username is "postgres" and password is "password"');
    console.log('3. PostgreSQL is running on port 5432');
  }
};

setupDatabase();