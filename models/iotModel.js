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

const getAllFlows = (callback) => {
  db.query('SELECT * FROM iot_flows', callback);
};

const getFlowById = (id, callback) => {
  db.query('SELECT * FROM iot_flows WHERE id = ?', [id], callback);
};

const deleteFlowById = (id, callback) => {
  db.query('DELETE FROM iot_flows WHERE id = ?', [id], callback);
};

const getRecentFlows = (callback) => {
  db.query('SELECT * FROM iot_flows WHERE timestamp >= NOW() - INTERVAL 1 DAY', callback);
};

const getFlowStats = (callback) => {
  const sql = `
    SELECT 
      COUNT(*) AS total,
      AVG(packet_size_avg) AS avg_packet_size,
      SUM(packet_size_sum) AS total_packet_sum
    FROM iot_flows`;
  db.query(sql, callback);
};

exports.getDeviceFlows = (deviceId, callback) => {
  db.query('SELECT * FROM iot_flows WHERE device_id = ?', [deviceId], callback);
};

module.exports = {
  getAllIotData,
  getIotDataById,
  insertIotData,
  updateIotData,
  deleteIotData,
  getAllFlows,
  getFlowById,
  deleteFlowById,
  getRecentFlows,
  getFlowStats
};
