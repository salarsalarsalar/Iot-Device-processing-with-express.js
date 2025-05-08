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
const {Time, Device, DeviceData} = require('../models');
const {getOrSetCache} = require('../utils/cache')
const {promisifyModel} = require('../utils/dbHelper')
const { sendResponse, sendError } = require('../utils/responseHelper');


// @route: /api/iot/
// @desc: Welcome message
exports.welcome = (req, res) => {
    sendResponse(res, 200, { message: 'Welcome to IoT Service' });
};

// @route: /api/iot/devices
// @desc: Get all devices
exports.getDevices = async (req, res) => {
    try {
        const devices = await Device.findAll();
        sendResponse(res, 200, devices);
    } catch (error) {
        sendError(res, 500, 'Error fetching devices');
    }
};

// @route: /api/iot/devices/:device_id
// @desc: Get a single device with its data
exports.getDevice = async (req, res) => {
    try {
        const device = await Device.findOne({
            where: { device_id: req.params.device_id },
            include: [{
                model: IoT_Flow,
                limit: 10,
                order: [['timestamp', 'DESC']]
            }]
        });

        if (!device) {
            return sendError(res, 404, 'Device not found');
        }

        sendResponse(res, 200, device);
    } catch (error) {
        sendError(res, 500, 'Error fetching device');
    }
};

// @route: /api/iot/devices
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
        const device = await Device.findOne({
            where: { device_id: req.params.device_id }
        });

        if (!device) {
            return sendError(res, 404, 'Device not found');
        }

        await device.update(req.body);
        sendResponse(res, 200, device);
    } catch (error) {
        sendError(res, 500, 'Error updating device');
    }
};

// @route: /api/iot/devices/:device_id
// @desc: Delete a device
exports.deleteDevice = async (req, res) => {
    try {
        const device = await Device.findOne({
            where: { device_id: req.params.device_id }
        });

        if (!device) {
            return sendError(res, 404, 'Device not found');
        }

        await device.destroy();
        sendResponse(res, 200, { message: 'Device deleted successfully' });
    } catch (error) {
        sendError(res, 500, 'Error deleting device');
    }
};

// @route: /api/iot/data
// @desc: Get all IoT data
exports.getAllData = async (req, res) => {
    try {
        const data = await IoT_Flow.findAll({
            include: [Device, Time],
            order: [['timestamp', 'DESC']]
        });
        await getOrSetCache('all_devices', () => promisifyModel(IoT_Flow.findAll));
        sendResponse(res, 200, data);
    } catch (error) {
        sendError(res, 500, 'Error fetching IoT data');
    }
};

// @route: /api/iot/data/:id
// @desc: Get IoT data by ID
exports.getDataById = async (req, res) => {
    try {
        const data = await IoT_Flow.findOne({
            where: { id: req.params.id },
            include: [Device, Time]
        });

        if (!data) {
            return sendError(res, 404, `Data with ID ${req.params.id} not found`);
        }

        await getOrSetCache(`device:${req.params.id}`, () => promisifyModel(IoT_Flow.findOne));
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
        const data = await IoT_Flow.findOne({
            where: { id: req.params.id }
        });

        if (!data) {
            return sendError(res, 404, `Data with ID ${req.params.id} not found`);
        }

        await data.update(req.body);
        sendResponse(res, 200, { message: 'Data updated successfully', data });
    } catch (error) {
        sendError(res, 500, 'Error updating data');
    }
};

// @route: /api/iot/data/:id
// @desc: Delete IoT data
exports.deleteData = async (req, res) => {
    try {
        const data = await IoT_Flow.findOne({
            where: { id: req.params.id }
        });

        if (!data) {
            return sendError(res, 404, `Data with ID ${req.params.id} not found`);
        }

        await data.destroy();
        sendResponse(res, 200, { message: 'Data deleted successfully' });
    } catch (error) {
        sendError(res, 500, 'Error deleting data');
    }
};

// @route: /api/iot/data/recent
// @desc: Get recent IoT data
exports.getRecentData = async (req, res) => {
    try {
        const data = await IoT_Flow.findAll({
            include: [Device, Time],
            order: [['timestamp', 'DESC']],
            limit: 10
        });
        await getOrSetCache('recent_devices', () => promisifyModel(IoT_Flow.findAll));
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
    // Created a stream for reading potentially large csv data
    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {ReadCSV(row,results)})
        .on('end', () => {iotModel.uploadData(results, res, next);})
        .on('error', (err) => {
            next(err);
        });
};
