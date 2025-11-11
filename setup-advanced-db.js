const pool = require('./config/database');

const setupAdvancedDB = async () => {
  try {
    console.log('🔧 Setting up advanced PostgreSQL database...');
    
    // Initialize the database
    await pool.initDB();
    
    console.log('✅ Advanced database setup complete!');
    console.log('📊 Features enabled:');
    console.log('  - Complex queries with JOINs');
    console.log('  - Database triggers for auto-updates');
    console.log('  - Indexes for performance');
    console.log('  - Transaction support');
    console.log('  - Session management');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
};

setupAdvancedDB();