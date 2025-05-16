const { User, Role, User_Role } = require('./index');
const { redisClient } = require('../utils/redisClient.js');


exports.createUser = async (username, hashedPassword) => {
    const user = await User.create({
        username,
        email: username,
        password: hashedPassword
    });
    return user;
};

exports.findByUsername = async (username) => {
    console.log('Checking for username:', username);
    const user = await User.findOne({ username });
    console.log('Query result:', user);
    return user;
};

exports.createRole = async (name, description) => {
    const role = await Role.create({
        name,
        description
    });
    return role._id;
};

exports.assignRoleToUser = async (user_id, role_id) => {
    const userRole = await User_Role.create({
        user_id,
        role_id
    });
    return userRole;
};

exports.getRolesForUser = async (user_id) => {
    const userRoles = await User_Role.find({ user_id })
        .populate('role_id');
    return userRoles;
};

exports.getAllUsers = async () => {
    const users = await User.find()
        .populate({
            path: 'roles',
            select: 'name description'
        });
    return users;
};

exports.getAllRoles = async () => {
    const roles = await Role.find();
    return roles;
};