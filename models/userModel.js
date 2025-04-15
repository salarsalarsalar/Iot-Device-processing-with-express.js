const db = require('../db');

const createUser = (username, hashedPassword, callback) => {
  const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
  db.query(sql, [username, hashedPassword], callback);
};

const findUserByUsername = (username, callback) => {
  const sql = 'SELECT * FROM users WHERE username = ?';
  db.query(sql, [username], callback);
};

module.exports = { createUser, findUserByUsername };