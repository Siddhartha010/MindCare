const pool = require('./database');

const logUserActivity = async (userId, activityType, description, pageUrl = null, req = null) => {
  try {
    const query = `
      INSERT INTO user_activities 
      (user_id, activity_type, description, page_url, ip_address, user_agent)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const values = [
      userId,
      activityType,
      description,
      pageUrl,
      req?.ip || null,
      req?.headers?.['user-agent'] || null
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error logging user activity:', error);
    // Don't throw the error - we don't want activity logging to break the main functionality
    return null;
  }
};

module.exports = {
  logUserActivity
};