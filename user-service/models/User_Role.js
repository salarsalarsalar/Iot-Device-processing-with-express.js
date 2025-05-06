const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User_Role = sequelize.define('User_Role', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'user_roles'
});

module.exports = User_Role; 