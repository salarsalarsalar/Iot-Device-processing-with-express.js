const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const iotModel = require('../models/iotModel');
const { ReadCSV } = require('../utils/controllerHelper');
const { sendResponse, sendError } = require('../utils/responseHelper');
const { broadcastNewIoTData } = require('../webSocket/publisher');

// Welcome Controller
exports.welcome = (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to Iot Service'
    });
};

// Device Controllers
exports.getDevices = async (req, res) => {
    try {
        const devices = await iotModel.getAllDevices();
        sendResponse(res, 200, devices);
    } catch (error) {
        sendError(res, 500, 'Error fetching devices');
    }
};

exports.getDevice = async (req, res) => {
    try {
        const device = await iotModel.getDeviceById(req.params.device_id);
        if (!device) {
            return sendError(res, 404, 'Device not found');
        }
        sendResponse(res, 200, device);
    } catch (error) {
        sendError(res, 500, 'Error fetching device');
    }
};

exports.createDevice = async (req, res) => {
    try {
        const device = await iotModel.createDevice(req.body);
        sendResponse(res, 201, device);
    } catch (error) {
        sendError(res, 500, 'Error creating device');
    }
};

exports.updateDevice = async (req, res) => {
    try {
        const device = await iotModel.updateDevice(req.params.device_id, req.body);
        if (!device) {
            return sendError(res, 404, 'Device not found');
        }
        sendResponse(res, 200, device);
    } catch (error) {
        sendError(res, 500, 'Error updating device');
    }
};

exports.deleteDevice = async (req, res) => {
    try {
        const result = await iotModel.deleteDevice(req.params.device_id);
        if (!result) {
            return sendError(res, 404, 'Device not found');
        }
        sendResponse(res, 200, { message: 'Device deleted successfully' });
    } catch (error) {
        sendError(res, 500, 'Error deleting device');
    }
};

// Data Controllers
exports.getAllData = async (req, res) => {
    try {
        const data = await iotModel.getAllIotData();
        sendResponse(res, 200, data);
    } catch (error) {
        sendError(res, 500, 'Error fetching IoT data');
    }
};

exports.getDataById = async (req, res) => {
    try {
        const data = await iotModel.getIotData(req.params.id);
        if (!data) {
            return sendError(res, 404, 'Data not found');
        }
        sendResponse(res, 200, data);
    } catch (error) {
        sendError(res, 500, 'Error fetching IoT data');
    }
};

exports.insertData = async (req, res) => {
    try {
        const data = await iotModel.insertIotData(req.body);
        sendResponse(res, 201, data);
    } catch (error) {
        sendError(res, 500, 'Error inserting data');
    }
};

exports.updateData = async (req, res) => {
    try {
        const data = await iotModel.updateIotData(req.params.id, req.body);
        if (!data) {
            return sendError(res, 404, 'Data not found');
        }
        sendResponse(res, 200, data);
    } catch (error) {
        sendError(res, 500, 'Error updating data');
    }
};

exports.deleteData = async (req, res) => {
    try {
        const result = await iotModel.deleteIotData(req.params.id);
        if (!result) {
            return sendError(res, 404, 'Data not found');
        }
        sendResponse(res, 200, { message: 'Data deleted successfully' });
    } catch (error) {
        sendError(res, 500, 'Error deleting data');
    }
};

exports.getRecentData = async (req, res) => {
    try {
        const data = await iotModel.getRecent();
        sendResponse(res, 200, data);
    } catch (error) {
        sendError(res, 500, 'Error fetching recent data');
    }
};

exports.getStats = async (req, res) => {
    try {
        const stats = await iotModel.getStats();
        sendResponse(res, 200, stats);
    } catch (error) {
        sendError(res, 500, 'Error fetching statistics');
    }
};

exports.uploadCSV = async (req, res) => {
    try {
        if (!req.file) {
            return sendError(res, 400, 'No file uploaded');
        }

        const results = [];
        const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);

        await new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (row) => ReadCSV(row, results))
                .on('end', resolve)
                .on('error', reject);
        });

        const result = await iotModel.uploadData(results);
        sendResponse(res, 201, result);
    } catch (error) {
        sendError(res, 500, 'Error processing CSV file');
    } finally {
        // Clean up uploaded file
        if (req.file) {
            fs.unlink(req.file.path, () => {});
        }
    }
};

exports.createData = async (req, res) => {
    try {
        const newData = await iotModel.insertIotData(req.body);
        broadcastNewIoTData(newData);
        sendResponse(res, 201, { message: 'Data inserted', data: newData });
    } catch (error) {
        sendError(res, 500, 'Error creating data stream');
    }
};