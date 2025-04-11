const db = require('../db');  // Database connection

// Function to get all IoT data
const getAllIotData = (callback) => {
  const query = 'SELECT * FROM iot_flows';
  db.query(query, callback);
};

// Function to get data by id
const getIotDataById = (id, callback) => {
  const query = 'SELECT * FROM iot_flows WHERE id = ?';
  db.query(query, [id], callback);
};

// Function to insert data into the table
const insertIotData = (data, callback) => {
  const query = 'INSERT INTO iot_flows (id, packet_size_avg, packet_size_sum, timestamp) VALUES ?';
  db.query(query, [data], callback);
};

// Function to update data by id
const updateIotData = (id, packet_size_avg, packet_size_sum, timestamp, callback) => {
  const query = 'UPDATE iot_flows SET packet_size_avg = ?, packet_size_sum = ?, timestamp = ? WHERE id = ?';
  db.query(query, [packet_size_avg, packet_size_sum, timestamp, id], callback);
};

// Function to delete data by id
const deleteIotData = (id, callback) => {
  const query = 'DELETE FROM iot_flows WHERE id = ?';
  db.query(query, [id], callback);
};

module.exports = {
  getAllIotData,
  getIotDataById,
  insertIotData,
  updateIotData,
  deleteIotData
};
