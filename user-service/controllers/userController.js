const { hashPassword, comparePasswords } = require('../utils/bcryptHelper');
const { generateToken, generateRefreshToken } = require('../utils/jwtHelper');
const { getOrSetCache } = require('../utils/cacheHelper');
const { sendResponse, sendError } = require('../utils/responseHelper');
const { User, Role, User_Role } = require('../models');
const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');
const {producer} = require('../kafka/producer');
const {publishUserCreated} = require('../utils/publisher');

// @route: /api/user/home
// @desc: Welcome message
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

        // Check for existing user
        const existingUser = await User.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
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
        
        const userResponse = {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            createdAt: newUser.createdAt
        };

        const kafkaMessage = {
            username,
            email,
            password: hashedPassword
        };
        // Send Kafka message
        await producer.send({
            topic: 'user-registered',
            messages: [
                {
                    key: String(newUser.id),
                    value: JSON.stringify(kafkaMessage)
                }
            ]
        });

        // RabbitMQ sending to other service
        await publishUserCreated(userResponse);
        
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
        
        const user = await User.findOne({ email });
        if (!user) {
            return sendError(res, 401, 'Invalid credentials');
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return sendError(res, 401, 'Invalid credentials');
        }
        
        const token = generateToken({ id: user._id, email: user.email });
        const refreshToken = generateRefreshToken({ id: user._id, email: user.email });
        
        await getOrSetCache(`refresh_token:${user._id}`, refreshToken);
        
        sendResponse(res, 200, {
            token,
            refreshToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
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
        const users = await User.find()
            .select('username email createdAt')
            .populate('roles');
        sendResponse(res, 200, users);
    } catch (err) {
        console.error('Error fetching users:', err);
        sendError(res, 500, 'An error occurred while fetching users.');
    }
};

// Get a single user
const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('username email createdAt')
            .populate('roles');

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
        const updateData = {};

        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (password) {
            updateData.password = await hashPassword(password);
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        ).select('username email');

        if (!user) {
            return sendError(res, 404, 'User not found.');
        }

        sendResponse(res, 200, {
            message: 'User updated successfully.',
            user
        });
    } catch (err) {
        console.error('Error updating user:', err);
        sendError(res, 500, 'An error occurred while updating the user.');
    }
};

// Delete a user
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return sendError(res, 404, 'User not found.');
        }

        sendResponse(res, 200, { message: 'User deleted successfully.' });
    } catch (err) {
        console.error('Error deleting user:', err);
        sendError(res, 500, 'An error occurred while deleting the user.');
    }
};

// Delete all users
// Delete all users
const deleteAllUsers = async (req, res) => {
    try {
        await User.deleteMany({});
        sendResponse(res, 200, { message: 'All users deleted successfully.' });
    } catch (err) {
        console.error('Error deleting all users:', err);
        sendError(res, 500, 'An error occurred while deleting all users.');
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
        await User_Role.create({ 
            user_id: userId, 
            role_id: roleId 
        });
        sendResponse(res, 201, { message: 'Role assigned successfully.' });
    } catch (err) {
        console.error('Error assigning role:', err);
        sendError(res, 500, 'An error occurred while assigning the role.');
    }
};

// Get all roles
const getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find();
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
    deleteAllUsers,
    createRole,
    assignRole,
    getAllRoles,
    token,
    deleteToken
};
