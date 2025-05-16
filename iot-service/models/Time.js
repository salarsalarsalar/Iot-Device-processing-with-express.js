const mongoose = require('mongoose');


const TimeSchema = new mongoose.Schema({
    full_timestamp: {
        type: Date,
        required: false
    },
    year: {
        type: Number,
        required: false
    },
    month: {
        type: Number,
        required: false
    },
    day: {
        type: Number,
        required: false
    },
    hour: {
        type: Number,
        required: false
    },
    minute: {
        type: Number,
        required: false
    },
    second: {
        type: Number,
        required: false
    }
}, {
    timestamps: false,
    collection: 'time'
});

const Time = mongoose.model('Time', TimeSchema);
module.exports = Time; 