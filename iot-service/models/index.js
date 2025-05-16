const Device = require('./Device');
const Time = require('./Time');
const IoT_Flow = require('./DeviceData');

// No need to define relationships here since they're defined in the schemas
// through refs in DeviceData.js, Device.js, and Time.js
// // Device-IoT_Flow one-to-many relationship
// Device.hasMany(IoT_Flow, { foreignKey: 'device_id' });
// IoT_Flow.belongsTo(Device, { foreignKey: 'device_id' });

// // Time-IoT_Flow one-to-many relationship
// Time.hasMany(IoT_Flow, { foreignKey: 'time_id' });
// IoT_Flow.belongsTo(Time, { foreignKey: 'time_id' });

module.exports = {
    Device,
    Time,
    IoT_Flow
};