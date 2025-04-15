// models/userModel.js
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

// routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const userModel = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET

// Route: POST /api/auth/register
// Purpose: Register a new user
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    userModel.createUser(username, hashedPassword, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'User creation failed.' });
      }
      res.status(201).json({ message: 'User registered successfully!' });
    });
  } catch (err) {
    res.status(500).json({ error: 'Error hashing password.' });
  }
});

// Route: POST /api/auth/login
// Purpose: Log in a user and return a JWT
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  userModel.findUserByUsername(username, async (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ message: 'Login successful!', token });
  });
});

module.exports = router;
