const pool = require('./db.js');
const user_sql = require('../utils/sql');

const createUser = async (username, hashedPassword) => {
  const [result] = await pool.query(user_sql.create, [username, hashedPassword]);
  return result;
};

const findUserByUsername = async (username) => {
  const [rows] = await pool.query(user_sql.find, [username]);
  return rows[0]; // or rows if you want all
};

module.exports = { createUser, findUserByUsername };