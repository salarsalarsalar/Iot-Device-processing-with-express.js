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
const { sendResponse, sendError } = require('../utils/responseHelper');
dotenv.config();

// @route: /api/iot
// @desc: Get/Retrieve all IoT data
exports.getAllData = (req, res) => {
  iotModel.getAllIotData(async (err, results) => {
    if (err) return sendError(res, 500, err.message);
    await redisClient.setEx('All devices:', 3600, JSON.stringify(result[0]));
    sendResponse(res, 200, results);
  });
};

// @route: /api/iot/:id
// @desc: Get IoT data by ID
exports.getDataById =  (req, res) => {
  const { id } = req.params;
  iotModel.getIotDataById(id, async (err, result) => {
    if (err) return sendError(res, 500, err.message);
    if (!result.length) return sendError(res, 404, `Data with ID ${id} not found`);
    await redisClient.setEx(`device:${id}`, 3600, JSON.stringify(result[0]));
    sendResponse(res, 200, result[0]);
  });
};

// @route: /api/iot/
// @desc: Insert data
exports.insertData = (req, res) => {
  const data = req.body.data;
  iotModel.insertIotData(data, (err, result) => {
    if (err) return sendError(res, 500, err.message);
    sendResponse(res, 201, { message: 'Data inserted successfully', result });
  });
};

// @route: /api/iot/
// @desc: Update IoT data
exports.updateData = (req, res) => {
  const { id } = req.params;
  const { packet_size_avg, packet_size_sum, timestamp, device_id } = req.body;

  iotModel.updateIotData(id, packet_size_avg, packet_size_sum, timestamp, device_id, (err, result) => {
    if (err) return sendError(res, 500, err.message);
    sendResponse(res, 200, { message: 'Data updated successfully', result });
  });
};

// @route: /api/iot/
// @desc: Delete IoT data by ID
exports.deleteByID = (req, res) => {
  const { id } = req.params;
  iotModel.deleteByID(id, (err, result) => {
    if (err) return sendError(res, 500, err.message);
    sendResponse(res, 200, { message: 'Data deleted successfully', result });
  });
};

// @route: /api/iot/recent
// @desc: Get all of the recent data 
exports.getRecentDevice = (req, res) => {
  iotModel.getRecentData(async (err, results) => {
    if (err) return sendError(res, 500, err.message);
    await redisClient.setEx('device:', 3600, JSON.stringify(result[0]));
    sendResponse(res, 200, results);
  });
};

// @route: /api/iot/stats
// @desc: Get Device statistics
exports.getDeviceStats = (req, res) => {
  iotModel.getStats(async(err, stats) => {
    if (err) return sendError(res, 500, err.message);
    await redisClient.setEx('Device statistics =', 3600, JSON.stringify(result[0]));
    sendResponse(res, 200, stats);
  });
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
