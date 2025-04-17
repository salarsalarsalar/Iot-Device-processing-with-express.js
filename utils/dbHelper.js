const db = require('../models/db');

const runQuery = async (sql, params = []) => {
  try {
    const [rows] = await db.query(sql, params);
    return rows;
  } 
  catch (error) {
    console.error('Query error:', error);
    throw error;
  }
};

module.exports = runQuery;