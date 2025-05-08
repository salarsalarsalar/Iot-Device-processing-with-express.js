const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Time = sequelize.define('Time', {
    time_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    full_timestamp: {
        type: DataTypes.DATE,
        allowNull: true
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    month: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    day: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    hour: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    minute: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    second: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    timestamps: false,
    tableName: 'time'
});

module.exports = Time; 