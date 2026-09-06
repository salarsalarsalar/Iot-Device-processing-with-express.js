
const db = require('./db');

const createUser = async (username, hashedPassword) => {
  const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
  const [result] = await db.query(sql, [username, hashedPassword]);
  return result;
};

const findUserByUsername = async (username) => {
  const sql = 'SELECT * FROM users WHERE username = ?';
  const [rows] = await db.query(sql, [username]);
  return rows[0]; // or rows if you want all
};

module.exports = { createUser, findUserByUsername };
