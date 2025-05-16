const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
    device_name: {
        type: String,
        required: false
    },
    user_id: {
        type: Number,
        ref: 'User',
        required: false
    }
}, {
    timestamps: false,
    collection: 'devices'
});

// Add virtual populate for iot_flows referencing IoT_Flow's device_id
DeviceSchema.virtual('iot_flows', {
    ref: 'IoT_Flow',          // The model to use
    localField: '_id',        // Find iot_flows where 'device_id' is equal to this device's _id
    foreignField: 'device_id', 
    justOne: false            // Return an array of iot_flows
});

// Enable virtual fields in JSON and Object outputs
DeviceSchema.set('toObject', { virtuals: true });
DeviceSchema.set('toJSON', { virtuals: true });

const Device = mongoose.model('Device', DeviceSchema);

module.exports = Device; 