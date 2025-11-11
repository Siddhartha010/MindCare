// setup-db.js
// This script initializes the application's database schema.
// It prefers calling `pool.initDB()` exported by `config/database.js` so
// it works regardless of the underlying database implementation (Postgres,
// SQLite, etc.). If you need to create a Postgres database at the server
// level (i.e. `CREATE DATABASE`), set environment variable
// `PG_ADMIN=true` and ensure `pg` is available in the environment.

const path = require('path');

const run = async () => {
  console.log('🔧 Running setup-db...');

  // Try to load the project's database module which should export a pool
  // object with an `initDB` function. This decouples the setup script from
  // any specific database implementation.
  try {
    const pool = require(path.join(__dirname, 'config', 'database'));

    if (pool && typeof pool.initDB === 'function') {
      console.log('➡️  Calling pool.initDB() to create tables...');
      await pool.initDB();
      console.log('🎉 Database initialization complete.');
      process.exit(0);
    }

    console.log('⚠️  No initDB() found on pool. Nothing to do.');
    process.exit(0);
  } catch (err) {
    // If the user explicitly asked for Postgres admin mode, try the old
    // behavior to create a Postgres database using the `pg` module.
    if (process.env.PG_ADMIN === 'true') {
      try {
        // Lazy require pg so projects that switched away from Postgres don't
        // need the package installed for normal setup.
        // eslint-disable-next-line global-require
        const { Pool } = require('pg');

        const adminPool = new Pool({
          user: process.env.DB_USER || 'postgres',
          host: process.env.DB_HOST || 'localhost',
          database: process.env.PG_ADMIN_DB || 'postgres',
          password: process.env.DB_PASSWORD || 'password',
          port: process.env.DB_PORT || 5432,
        });

        console.log('➡️  Creating Postgres database (PG_ADMIN mode)...');
        await adminPool.query(`CREATE DATABASE ${process.env.DB_NAME || 'mental_health_db'}`);
        await adminPool.end();
        console.log('✅ Postgres database created. You may still need to run pool.initDB()');
        process.exit(0);
      } catch (pgErr) {
        console.error('❌ PG admin flow failed:', pgErr && pgErr.message ? pgErr.message : pgErr);
        process.exit(1);
      }
    }

    console.error('❌ setup-db failed with error:', err && err.message ? err.message : err);
    process.exit(1);
  }
};

run();