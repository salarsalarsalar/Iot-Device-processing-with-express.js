const { getDB } = require('../config/database.js');
const { ObjectId } = require('mongodb');

exports.getAllUsers = async () => {
    const db = getDB();
    return db.collection('users').find().toArray();
};

exports.createUser = async (username, email, hashedPassword) => {
    const db = getDB();
    return db.collection('users').insertOne({ username, email, password: hashedPassword });
};

exports.getUserById = async (userId) => {
    const db = getDB();
    return db.collection('users').findOne({ _id: new ObjectId(userId) });
};

exports.getUserByEmail = async (email) => {
    const db = getDB();
    return db.collection('users').findOne({ email });
};

exports.findByUsername = async (username) => {
    const db = getDB();
    return db.collection('users').findOne({ username });
};

exports.createRole = async (name, description) => {
    const db = getDB();
    return db.collection('roles').insertOne({ name, description });
};

exports.getRoleById = async (roleId) => {
    const db = getDB();
    return db.collection('roles').findOne({ _id: new ObjectId(roleId) }); // typo was 'role' before
};

exports.assignRoleToUser = async (userId, roleId) => {
    const db = getDB();
    return db.collection('user_roles').insertOne({
        user_id: new ObjectId(userId),
        role_id: new ObjectId(roleId)
    });
};

exports.getRolesForUser = async (userId) => {
    const db = getDB();
    return db.collection('user_roles').find({ user_id: new ObjectId(userId) }).toArray();
};

exports.deleteUser = async (userId) => {
    const db = getDB();
    return db.collection('users').deleteOne({ _id: new ObjectId(userId) });
};

exports.getAllRoles = async () => {
    const db = getDB();
    return db.collection('roles').find().toArray();
};
