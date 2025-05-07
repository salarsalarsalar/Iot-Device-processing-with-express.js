const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
dotenv.config(); // Load .env variables
const sharedEnv = dotenv.config({ path: '../.env' });
dotenvExpand.expand(sharedEnv); // Expand shared variables


const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit:10,
  queueLimit: 0
});
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('MySQL Connected');
    connection.release(); // Always release the connection back to the pool
  } catch (err) {
    console.error('MySQL connection error:', err);
  }
})();
module.exports = pool;