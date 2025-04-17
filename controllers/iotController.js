const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const { error } = require('console');
const { runController, msg } = require('../utils/controllerHelper');
const db = require('../models/db'); // For raw CSV insert fallback
const iotModel = require('../models/iotModel');


// @desc    Get all IoT data
// @route   GET /api/iot
exports.getAllData = (req, res) => {
  runController(res, iotModel.getAllIotData, {
    errorMessage: msg.notGotten
  });
};
// @desc    Get paginated IoT data
// @route   GET /api/iot/paginated?limit=10&offset=0
exports.getPaginatedData = (req, res) => {
  const { limit = 10, offset = 0 } = req.query;
  runController(res, iotModel.getPaginatedIotData, {
    errorMessage: msg.notGotten
  }, parseInt(limit), parseInt(offset));
};

// @desc    Get IoT data by ID
// @route   GET /api/iot/:id
exports.getDataById = (req, res) => {
  runController(res, iotModel.getIotDataById, {
    notFoundMessage: msg.notFound,
    errorMessage: msg.notGotten
  }, req.params.id);
};

// @desc    Insert new IoT data (single or manual entry)
// @route   POST /api/iot
exports.insertData = (req, res) => {
  runController(res, iotModel.insertIotData, {
    successStatus: 201,
    successMessage: msg.inserted,
    errorMessage: msg.notInserted,
    checkNotFound: false // insertion won't be "not found"
  }, req.body.data);
};

// @desc    Update IoT data by ID
// @route   PUT /api/iot/:id
exports.updateData = (req, res) => {
  const { id } = req.params;
  const { packet_size_avg, packet_size_sum, timestamp } = req.body;
  runController(res, iotModel.updateIotData, {
    successMessage: msg.updated,
    errorMessage: msg.notUpdated,
    checkNotFound: false
  }, id, packet_size_avg, packet_size_sum, timestamp);
};

// @desc    Delete IoT data by ID
// @route   DELETE /api/iot/:id
exports.deleteData = (req, res) => {
  runController(res, iotModel.deleteIotData, {
    successMessage: msg.deleted,
    errorMessage: msg.notDeleted,
    checkNotFound: false
  }, req.params.id);
};

// @desc    Get IoT data from the last 24 hours
// @route   GET /api/iot/recent
exports.getRecent = (req,res) => {
  runController(res, iotModel.getRecentIot,{
    successMessage: msg.gotten,
    errorMessage: msg.notFound
  })
}

// @desc    Get statistics (count, avg, sum) from IoT flows
// @route   GET /api/iot/stats
exports.getIotStats = (req,res) => {
  runController(res,iotModel.getIotStats,{
    successMessage: msg.gotten,
    errorMessage: msg.notFound,
  })
};

// @desc    Upload CSV file and insert bulk IoT flow data
// @route   POST /api/iot/upload
exports.uploadCSV = async (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');

  const filePath = path.join(__dirname, '..', 'uploads', req.file.originalname);
  const results = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      const { id, packet_size_avg, packet_size_sum, timestamp } = row;
      if (packet_size_avg && packet_size_sum && timestamp) {
        results.push([parseInt(id), parseFloat(packet_size_avg), parseFloat(packet_size_sum), timestamp]);
      }
    })
    .on('end', async () => {
      try {
        if (!results.length) return res.status(400).send('No valid data in CSV.');
        const result = await db.query(
          'INSERT INTO iot_flows (id, packet_size_avg, packet_size_sum, timestamp) VALUES ?',
          [results]
        );
        res.send(`File uploaded. Rows inserted: ${result[0].affectedRows}`);
      } catch (err) {
        console.error(err);
        res.status(500).send('Database insertion error.');
      }
    });
};