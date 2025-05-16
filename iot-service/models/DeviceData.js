const mongoose = require('mongoose');

const IoTFlowSchema = new mongoose.Schema({
    packet_size_avg: {
        type: Number,
        required: false
    },
    packet_size_sum: {
        type: Number,
        required: false
    },
    timestamp: {
        type: Date,
        required: false
    },
    device_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Device',
        required: false
    },
    time_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Time',
        required: false
    }
}, {
    timestamps: false,
    collection: 'iot_flows'
});

const IoT_Flow = mongoose.model('IoT_Flow', IoTFlowSchema);

module.exports = IoT_Flow;