const iotModel = require('../models/iotModel');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');

// Get all IoT data
const getAllData = (req, res) => {
  iotModel.getAllIotData((err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.status(200).json(results);
  });
};

// Get IoT data by ID
const getDataById = (req, res) => {
  const { id } = req.params;
  iotModel.getIotDataById(id, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    if (!result.length) {
      return res.status(404).json({ message: 'Data not found' });
    }
    res.status(200).json(result[0]);
  });
};

// Insert IoT data (from CSV upload)
const insertData = (req, res) => {
  const data = req.body.data;  // Assume 'data' comes from CSV or body
  iotModel.insertIotData(data, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to insert data', error: err });
    }
    res.status(201).json({ message: 'Data inserted successfully', result });
  });
};

// Update IoT data
const updateData = (req, res) => {
  const { id } = req.params;
  const { packet_size_avg, packet_size_sum, timestamp } = req.body;
  
  iotModel.updateIotData(id, packet_size_avg, packet_size_sum, timestamp, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to update data', error: err });
    }
    res.status(200).json({ message: 'Data updated successfully', result });
  });
};

// Delete IoT data by ID
const deleteData = (req, res) => {
  const { id } = req.params;
  iotModel.deleteIotData(id, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to delete data', error: err });
    }
    res.status(200).json({ message: 'Data deleted successfully', result });
  });
};

// Function to handle CSV file upload
const uploadCSV = (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const filePath = path.join(__dirname, '..', 'uploads', req.file.originalname);
  const results = [];

  // Read CSV file and parse its contents
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => { 
      const { id, packet_size_avg, packet_size_sum, timestamp } = row;

      if (packet_size_avg && packet_size_sum && timestamp) {
        results.push([parseInt(id), parseFloat(packet_size_avg), parseFloat(packet_size_sum), timestamp]);
      }
    })
    .on('end', () => {
      if (results.length > 0) {
        const sql = 'INSERT INTO iot_flows (id, packet_size_avg, packet_size_sum, timestamp) VALUES ?';
        db.query(sql, [results], (err, result) => {
          if (err) {
            console.error('Error inserting into DB:', err);
            return res.status(500).send('Database insertion error.');
          }
          console.log('Inserted rows:', result.affectedRows);
          res.send('File uploaded and data inserted!');
        });
      } else { 
        res.send('No valid data found in CSV.');
      }
    });
};



const getAllFlows = (req, res) => {
  iotModel.getAllFlows((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

const getFlowById = (req, res) => {
  const id = req.params.id;
  iotModel.getFlowById(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

const deleteFlowById = (req, res) => {
  const id = req.params.id;
  iotModel.deleteFlowById(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Flow deleted successfully' });
  });
};

const getRecentFlows = (req, res) => {
  iotModel.getRecentFlows((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

const getFlowStats = (req, res) => {
  iotModel.getFlowStats((err, stats) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(stats);
  });
};

const getDeviceFlows = (req, res) => {
  const deviceId = req.params.deviceId;
  iotModel.getDeviceFlows(deviceId, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

module.exports = {
  getAllData,
  getDataById,
  insertData,
  updateData,
  deleteData,
  uploadCSV,
  getAllFlows,
  getFlowById,
  deleteFlowById,
  getRecentFlows,
  getFlowStats,
  getDeviceFlows
};
