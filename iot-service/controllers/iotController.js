// @file: iotController.js
// @description: Controller for handling IoT data and device management

// imports of external libraries
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const redis = require('redis');
const dotenv = require('dotenv');

// imports of files with project
const iotModel = require('../models/iotModel');
const {ReadCSV} = require('../utils/controllerHelper');
const {redisClient} = require('../utils/redisClient');
const {Time, Device, DeviceData, IoT_Flow} = require('../models');
const {getOrSetCache} = require('../utils/cache')
const {promisifyModel} = require('../utils/dbHelper')
const { sendResponse, sendError } = require('../utils/responseHelper');
// const { insertIoTData } = require('../models/iotModel');
const { broadcastNewIoTData } = require('../webSocket/publisher');


// @route: /api/iot/
// @desc: Welcome message
exports.welcome = (req, res) => {
    sendResponse(res, 200, { message: 'Welcome to IoT Service' });
};


// @route: /api/iot/devices
// @desc: Get all devices
exports.getDevices = async (req, res) => {
    try {
        const devices = await Device.find();
        sendResponse(res, 200, devices);
    } catch (error) {
        sendError(res, 500, 'Error fetching devices');
    }
};

// @route: /api/iot/devices/:device_id
// @desc: Get a single device with its data
exports.getDevice = async (req, res) => {
    try {
        const device = await Device.findById(req.params.device_id)
            .populate({
                path: 'iot_flows',
                options: { limit: 10, sort: { timestamp: -1 } }
            });

        if (!device) {
            return sendError(res, 404, 'Device not found');
        }

        sendResponse(res, 200, device);
    } catch (error) {
        sendError(res, 500, 'Error fetching device');
    }
};

// @route: /api/iot/create
// @desc: Create a new device
exports.createDevice = async (req, res) => {
    try {
        const device = await Device.create(req.body);
        sendResponse(res, 201, device);
    } catch (error) {
        sendError(res, 500, 'Error creating device');
    }
};

// @route: /api/iot/devices/:device_id
// @desc: Update a device
exports.updateDevice = async (req, res) => {
    try {
        const device = await Device.findByIdAndUpdate(
            req.params.device_id,
            req.body,
            { new: true }
        );

        if (!device) {
            return sendError(res, 404, 'Device not found');
        }

        sendResponse(res, 200, device);
    } catch (error) {
        sendError(res, 500, 'Error updating device');
    }
};


// @route: /api/iot/devices/:device_id
// @desc: Delete a device
exports.deleteDevice = async (req, res) => {
    try {
        const device = await Device.findByIdAndDelete(req.params.device_id);

        if (!device) {
            return sendError(res, 404, 'Device not found');
        }

        sendResponse(res, 200, { message: 'Device deleted successfully' });
    } catch (error) {
        sendError(res, 500, 'Error deleting device');
    }
};
// @route: /api/iot/data
// @desc: Get all IoT data
exports.getAllData = async (req, res) => {
    try {
        const data = await IoT_Flow.find()
            .populate('device_id')
            .populate('time_id')
            .sort({ timestamp: -1 });

        await getOrSetCache('all_devices', () => IoT_Flow.find());
        sendResponse(res, 200, data);
    } catch (error) {
        sendError(res, 500, 'Error fetching IoT data');
    }
};

// @route: /api/iot/data/:id
// @desc: Get IoT data by ID
exports.getDataById = async (req, res) => {
    try {
        const data = await IoT_Flow.findById(req.params.id)
            .populate('device_id')
            .populate('time_id');

        if (!data) {
            return sendError(res, 404, `Data with ID ${req.params.id} not found`);
        }

        await getOrSetCache(`device:${req.params.id}`, () => IoT_Flow.findById(req.params.id));
        sendResponse(res, 200, data);
    } catch (error) {
        sendError(res, 500, 'Error fetching IoT data');
    }
};


// @route: /api/iot/data
// @desc: Insert IoT data
exports.insertData = async (req, res) => {
    try {
        const data = await IoT_Flow.create(req.body);
        sendResponse(res, 201, { message: 'Data inserted successfully', data });
    } catch (error) {
        sendError(res, 500, 'Error inserting data');
    }
};

// @route: /api/iot/data/:id
// @desc: Update IoT data
exports.updateData = async (req, res) => {
    try {
        const data = await IoT_Flow.findById(req.params.id);
        if (!data) {
            return sendError(res, 404, `Data with ID ${req.params.id} not found`);
        }

        // Apply updates from req.body
        Object.assign(data, req.body);
        await data.save();

        sendResponse(res, 200, { message: 'Data updated successfully', data });
    } catch (error) {
        sendError(res, 500, 'Error updating data');
    }
};

// @route: /api/iot/data/:id
// @desc: Delete IoT data
exports.deleteData = async (req, res) => {
    try {
        const data = await IoT_Flow.findByIdAndDelete(req.params.id);

        if (!data) {
            return sendError(res, 404, `Data with ID ${req.params.id} not found`);
        }

        sendResponse(res, 200, { message: 'Data deleted successfully' });
    } catch (error) {
        sendError(res, 500, 'Error deleting data');
    }
};
// @route: /api/iot/data/recent
// @desc: Get recent IoT data
exports.getRecentData = async (req, res) => {
    try {
        const data = await IoT_Flow.find()
            .populate('device_id')
            .populate('time_id')
            .sort({ timestamp: -1 })
            .limit(10);

        await getOrSetCache('recent_devices', () => IoT_Flow.find().limit(10));
        sendResponse(res, 200, data);
    } catch (error) {
        sendError(res, 500, 'Error fetching recent data');
    }
};

// @route: /api/iot/upload
// @desc: Function to handle CSV file upload
exports.uploadCSV = (req, res, next) => {
    if (!req.file) return sendError(res, 400, 'No file uploaded.');

    const filePath = path.join(__dirname, '..', 'uploads', req.file.originalname);
    const results = [];

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {ReadCSV(row,results)})
        .on('end', async () => {
            try {
                const result = await iotModel.uploadData(results);
                sendResponse(res, 201, result);
            } catch (error) {
                next(error);
            }
        })
        .on('error', (err) => {
            next(err);
        });
};

exports.createData = async (req, res, next) => {
    try {
        const newData = await iotModel.insertIotData(req.body);
        broadcastNewIoTData(newData);
        res.status(201).json({ message: 'Data inserted', data: newData });
    } catch (error) {
        next(error);
    }
};
