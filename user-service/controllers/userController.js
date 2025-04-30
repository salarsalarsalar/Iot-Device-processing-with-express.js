// controllers/userController.js
const { hashPassword, comparePasswords } = require('../utils/bcryptHelper');
const { generateToken, generateRefreshToken } = require('../utils/jwtHelper');
const {getOrSetCache} = require("../utils/bcryptHelper")
const userModel = require('../models/userModel');
const { sendResponse, sendError } = require('../utils/responseHelper');


 // @route: POST /api/user/register
 // @desc: Register a new user
 
 exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Received request to register:', username);

    if (!username || !password) {
      return sendError(res, 400, 'Username and password are required.');
    }

    console.log('Checking if user already exists...');
    const existingUsers = await userModel.findByUsername(username);
    console.log('Checking for username:', username);

    if (existingUsers.length > 0) {
      return sendError(res, 400, 'User already exists.');
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await userModel.createUser(username, hashedPassword);

    sendResponse(res, 201, {
      message: 'User registered successfully.',
      user: newUser,
    });
  } catch (err) {
    console.error('Error during registration:', err);
    sendError(res, 500, 'An error occurred while registering the user.');
  }
};

 


// @route: POST /api/user/login
// @desc: Log in a user and return a JWT
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const users = await userModel.findByUsername(username);

    
    if (users.length === 0) {
      return sendError(res, 401, 'Invalid username or password.');
    }
    
    const user = users[0]; // Get the first user

    const isMatch = await comparePasswords(password, user.password);

    if (!isMatch) {
      return sendError(res, 401, 'Invalid username or password.');
    }

    // Generating JWT Token
    const token = generateToken({ id: user.id, username: user.username });
    const refreshToken = generateRefreshToken({ id: user.id, username: user.username });

    getOrSetCache("refresh_token", refreshToken);
    sendResponse(res, 200, { message: 'Login successful.', token, refreshToken });
  } catch (err) {
    console.error('Error during login:', err);
    sendError(res, 500, 'An error occurred during login.');
  }
};

// @route: POST /api/user/token
// @desc: get refresh token
exports.token = async (req, res) => {
  const refreshToken = req.params.token;

  if (!refreshToken) {
    return sendError(res, 401, "Token does not exist");
  }

  try {
    // Fetching the refresh token from the cache (this returns a promise)
    const cachedToken = await getOrSetCache("refresh_token", () => null);  // Pass null as a fallback to simulate cache miss

    if (cachedToken === refreshToken) {
      return sendResponse(res, 200, "Token is valid");
    }

    // If the token does not exist or is invalid
    return sendError(res, 401, "Invalid or expired token");
  } catch (err) {
    console.error("Error checking refresh token:", err);
    return sendError(res, 500, "Internal server error");
  }
};

// @route: DELETE /api/user/logout
// @desc: delete token
exports.deleteToken = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return sendError(res, 400, "Token is required");
  }

  try {
    // Fetch current refresh tokens from cache
    const refreshTokens = await getOrSetCache("refresh_tokens", () => []); // Default to an empty array if not in cache

    // Remove the token from the list if it exists
    const updatedTokens = refreshTokens.filter(existingToken => existingToken !== token);

    // If the token is found and deleted, update the cache
    if (refreshTokens.length !== updatedTokens.length) {
      await redisClient.setEx("refresh_tokens", 3600, JSON.stringify(updatedTokens));  // Update cache with new tokens
      return sendResponse(res, 204, "Token deleted successfully");
    }

    // If the token doesn't exist
    return sendError(res, 404, "Token not found");
  } catch (err) {
    console.error("Error deleting token:", err);
    return sendError(res, 500, "Internal server error");
  }
};


// @route: POST /api/user/roles/create
// @desc: Create a new role
exports.createRole = async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ message: 'Role name is required' });

  try {
    const roleId = await userModel.createRole(name, description);
    res.status(201).json({ message: 'Role created', roleId });
  } catch (err) {
    console.error('Role creation error:', err);
    res.status(500).json({ message: 'Server error while creating role' });
  }
};

// @route: POST /api/roles/assign
// @desc: Assign a role to a user
exports.assignRole = (req, res) => {
  const { user_id, role_id } = req.body;
  if (!user_id || !role_id) return sendError(res, 400, 'User ID and Role ID are required.');

  userModel.assignRoleToUser(user_id, role_id, (err, result) => {
    if (err) return sendError(res, 500, err.message);
    sendResponse(res, 200, { message: 'Role assigned to user' });
  });
};

// @route: GET /api/users/:id/roles
// @desc: Get all roles for a specific user
exports.createRole = (req, res) => {
  const { name, description } = req.body;
  if (!name) return sendError(res, 400, 'Role name is required.');

  userModel.createRole(name, description, (err, roleId) => {
    if (err) return sendError(res, 500, err.message);
    sendResponse(res, 201, { message: 'Role created', roleId });
  });
};

// @route: /api/user/
// @desc: Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await getOrSetCache('all_users', () => promisifyModel(userModel.getAllUsers));
    sendResponse(res, 200, users);
  } catch (err) {
    console.error('Error fetching users:', err);
    sendError(res, 500, 'Failed to fetch users.');
  }
};

// @route: /api/user/roles
// @desc: Get all users
exports.getAllRoles = async (req, res) => {
  try {
    const users = await getOrSetCache('all_users', () => promisifyModel(userModel.getAllRoles));
    sendResponse(res, 200, users);
  } catch (err) {
    console.error('Error fetching users:', err);
    sendError(res, 500, 'Failed to fetch users.');
  }
};
