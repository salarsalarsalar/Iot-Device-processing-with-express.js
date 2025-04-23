const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { register, login } = require('../controllers/userController.js');


router.post('/register', register);

router.post('/login', login);

module.exports = router;