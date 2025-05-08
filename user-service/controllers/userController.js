const { hashPassword, comparePasswords } = require('../utils/bcryptHelper');
const { generateToken, generateRefreshToken } = require('../utils/jwtHelper');
const { getOrSetCache } = require('../utils/cacheHelper');
const { sendResponse, sendError } = require('../utils/responseHelper');
const { User, Role, User_Role } = require('../models');
const bcrypt = require('bcrypt');
const { Sequelize } = require('sequelize');

// Welcome message
const welcome = (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to User Service'
    });
};

// Register a new user
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log('Received request to register:', username);

        if (!username || !email || !password) {
            return sendError(res, 400, 'Username, email and password are required.');
        }

        console.log('Checking if user already exists...');
        const existingUser = await User.findOne({
            where: {
                [Sequelize.Op.or]: [
                    { username: username },
                    { email: email }
                ]
            }
        });

        if (existingUser) {
            return sendError(res, 400, 'User with this username or email already exists.');
        }

        const hashedPassword = await hashPassword(password);
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });
        
        // Remove sensitive data before sending response
        const userResponse = {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            createdAt: newUser.createdAt
        };

        sendResponse(res, 201, {
            message: 'User registered successfully.',
            user: userResponse
        });
    } catch (err) {
        console.error('Error during registration:', err);
        sendError(res, 500, 'An error occurred while registering the user.');
    }
};

// Login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }
        
        const token = generateToken({ id: user.id, email: user.email });
        const refreshToken = generateRefreshToken({ id: user.id, email: user.email });
        
        // Store refresh token in cache
        await getOrSetCache(`refresh_token:${user.id}`, refreshToken);
        
        res.status(200).json({
            success: true,
            data: {
                token,
                refreshToken,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }
            }
        });
    } catch (err) {
        console.error('Error during login:', err);
        sendError(res, 500, 'An error occurred while logging in.');
    }
};

// Get all users
const getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'username', 'email', 'createdAt'],
            include: [{
                model: Role,
                through: { attributes: [] }
            }]
        });
        sendResponse(res, 200, users);
    } catch (err) {
        console.error('Error fetching users:', err);
        sendError(res, 500, 'An error occurred while fetching users.');
    }
};

// Get a single user
const getUser = async (req, res) => {
    try {
        const user = await User.findOne({
            where: { id: req.params.id },
            attributes: ['id', 'username', 'email', 'createdAt'],
            include: [{
                model: Role,
                through: { attributes: [] }
            }]
        });

        if (!user) {
            return sendError(res, 404, 'User not found.');
        }

        sendResponse(res, 200, user);
    } catch (err) {
        console.error('Error fetching user:', err);
        sendError(res, 500, 'An error occurred while fetching the user.');
    }
};

// Update a user
const updateUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await User.findOne({ where: { id: req.params.id } });

        if (!user) {
            return sendError(res, 404, 'User not found.');
        }

        if (password) {
            const hashedPassword = await hashPassword(password);
            user.password = hashedPassword;
        }

        if (username) user.username = username;
        if (email) user.email = email;

        await user.save();

        sendResponse(res, 200, {
            message: 'User updated successfully.',
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        console.error('Error updating user:', err);
        sendError(res, 500, 'An error occurred while updating the user.');
    }
};

// Delete a user
const deleteUser = async (req, res) => {
    try {
        const user = await User.findOne({ where: { id: req.params.id } });

        if (!user) {
            return sendError(res, 404, 'User not found.');
        }

        await user.destroy();
        sendResponse(res, 200, { message: 'User deleted successfully.' });
    } catch (err) {
        console.error('Error deleting user:', err);
        sendError(res, 500, 'An error occurred while deleting the user.');
    }
};

// Create a new role
const createRole = async (req, res) => {
    try {
        const { name, description } = req.body;
        const role = await Role.create({ name, description });
        sendResponse(res, 201, role);
    } catch (err) {
        console.error('Error creating role:', err);
        sendError(res, 500, 'An error occurred while creating the role.');
    }
};

// Assign a role to a user
const assignRole = async (req, res) => {
    try {
        const { userId, roleId } = req.body;
        await User_Role.create({ user_id: userId, role_id: roleId });
        sendResponse(res, 201, { message: 'Role assigned successfully.' });
    } catch (err) {
        console.error('Error assigning role:', err);
        sendError(res, 500, 'An error occurred while assigning the role.');
    }
};

// Get all roles
const getAllRoles = async (req, res) => {
    try {
        const roles = await Role.findAll();
        sendResponse(res, 200, roles);
    } catch (err) {
        console.error('Error fetching roles:', err);
        sendError(res, 500, 'An error occurred while fetching roles.');
    }
};

// Generate new token
const token = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const decoded = verifyRefreshToken(refreshToken);
        const newToken = generateToken({ id: decoded.id, email: decoded.email });
        sendResponse(res, 200, { token: newToken });
    } catch (err) {
        console.error('Error generating token:', err);
        sendError(res, 401, 'Invalid refresh token.');
    }
};

// Delete refresh token
const deleteToken = async (req, res) => {
    try {
        const { userId } = req.body;
        await redisClient.del(`refresh_token:${userId}`);
        sendResponse(res, 200, { message: 'Token deleted successfully.' });
    } catch (err) {
        console.error('Error deleting token:', err);
        sendError(res, 500, 'An error occurred while deleting the token.');
    }
};

module.exports = {
    welcome,
    register,
    login,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    createRole,
    assignRole,
    getAllRoles,
    token,
    deleteToken
};
