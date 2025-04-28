const pool = require('./db.js');
const {user_sql} = require('../utils/sql.js');
const {redisClient} = require('../utils/redisClient.js');

exports.createUser = async (username, hashedPassword) => {
  const [result] = await pool.query(user_sql.create, [username, hashedPassword]);
  return result;
};

exports.findByUsername = async (username) => {
  console.log('Checking for username:', username); // Debug log
  
  const [rows] = await pool.query(user_sql.find, [username]);
  console.log('Query result:', rows); // Debug log
  return rows; // or rows if you want all
};


exports.createRole = async (name, description) => {
  const [result] = await pool.query(user_sql.createRole, [name, description]);
  return result.insertId;
};

exports.assignRoleToUser = async (user_id, role_id) => {
  const [result] = await pool.query(user_sql.assignRole, [user_id, role_id]);
  return result;
};

exports.getRolesForUser = async (user_id) => {
  const [rows] = await pool.query(user_sql.getUserRoles, [user_id]);
  return rows;
};

exports.getAllUsers = async () => {
  const [rows] = await pool.query(user_sql.getAll);
  return [rows];
}

exports.getAllRoles = async () => {
  const [rows] = await pool.query(user_sql.getAllRoles);
  return [rows];
}