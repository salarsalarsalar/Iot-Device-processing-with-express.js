const db = require('./db');  // Database connection
const runQuery = require('../utils/dbHelper.js'); //helper function


sql = {
  all: 'SELECT * FROM iot_flows',
  paginated: 'SELECT id, packet_size_avg, packet_size_sum, timestamp FROM iot_flows LIMIT ? OFFSET ?',
  getId: 'SELECT * FROM iot_flows WHERE id = ?',
  insert: 'INSERT INTO iot_flows (id, packet_size_avg, packet_size_sum, timestamp) VALUES ?',
  update: 'UPDATE iot_flows SET packet_size_avg = ?, packet_size_sum = ?, timestamp = ? WHERE id = ?',
  delete: 'DELETE FROM iot_flows WHERE id = ?',
  getRecent: 'SELECT * FROM iot_flows WHERE timestamp >= NOW() - INTERVAL 1 DAY',
  getStats: `SELECT 
      COUNT(*) AS total,
      AVG(packet_size_avg) AS avg_packet_size,
      SUM(packet_size_sum) AS total_packet_sum
      FROM iot_flows`,
};

// Function to get all IoT data
const getAllIotData = async () => runQuery(sql.all);

// Function to get Paginated data
const getPaginatedIotData = async (limit, offset) => runQuery(sql.paginated, [limit, offset]);

// Function to get data by Id
const getIotDataById = async (id) => runQuery(sql.getId, [id]);

// Function to insert data
const insertIotData = async (data) => runQuery(sql.insert, [data]);

// Function to update data
const updateIotData = async (id, packet_size_avg, packet_size_sum, timestamp) =>
  runQuery(sql.update, [packet_size_avg, packet_size_sum, timestamp, id]);

// Function to delete data
const deleteFlowById = async (id) => runQuery(sql.delete, [id]);

// Function to get recent data
const getRecentIot = async () => runQuery(sql.getRecent);

// Function to get averages and sum
const getIotStats = async () => runQuery(sql.getStats);

module.exports = {
  getAllIotData,
  getPaginatedIotData,
  getIotDataById,
  insertIotData,
  updateIotData,
  getRecentIot,
  getIotStats
};


