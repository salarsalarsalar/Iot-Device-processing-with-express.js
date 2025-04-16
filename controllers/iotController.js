const iotModel = require('../models/iotModel');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const db = require('../models/db'); // For raw CSV insert fallback

exports.getAllData = async (req, res) => {
  try {
    const data = await iotModel.getAllIotData();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err });
  }
};

exports.getPaginatedData = async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    const data = await iotModel.getPaginatedData(parseInt(limit), parseInt(offset));
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err });
  }
};

exports.getDataById = async (req, res) => {
  try {
    const data = await iotModel.getIotDataById(req.params.id);
    if (!data.length) return res.status(404).json({ message: 'Data not found' });
    res.status(200).json(data[0]);
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err });
  }
};

exports.insertData = async (req, res) => {
  try {
    const result = await iotModel.insertIotData(req.body.data);
    res.status(201).json({ message: 'Data inserted successfully', result });
  } catch (err) {
    res.status(500).json({ message: 'Failed to insert data', error: err });
  }
};

exports.updateData = async (req, res) => {
  try {
    const { id } = req.params;
    const { packet_size_avg, packet_size_sum, timestamp } = req.body;
    const result = await iotModel.updateIotData(id, packet_size_avg, packet_size_sum, timestamp);
    res.status(200).json({ message: 'Data updated successfully', result });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update data', error: err });
  }
};

exports.deleteData = async (req, res) => {
  try {
    const result = await iotModel.deleteIotData(req.params.id);
    res.status(200).json({ message: 'Data deleted successfully', result });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete data', error: err });
  }
};

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

exports.getAllFlows = async (req, res) => {
  try {
    const data = await iotModel.getAllIotData();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFlowById = async (req, res) => {
  try {
    const data = await iotModel.getFlowById(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteFlowById = async (req, res) => {
  try {
    await iotModel.deleteFlowById(req.params.id);
    res.json({ message: 'Flow deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRecentFlows = async (req, res) => {
  try {
    const data = await iotModel.getRecentFlows();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFlowStats = async (req, res) => {
  try {
    const stats = await iotModel.getFlowStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDeviceFlows = async (req, res) => {
  try {
    const data = await iotModel.getDeviceFlows(req.params.deviceId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
