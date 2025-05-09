const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const IoT_Flow = sequelize.define('IoT_Flow', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    packet_size_avg: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    packet_size_sum: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: true
    },
    device_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    time_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    timestamps: false,
    tableName: 'iot_flows'
});

module.exports = IoT_Flow; 