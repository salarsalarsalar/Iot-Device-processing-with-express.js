const db = require('./db');  // Database connection

// Function to get all IoT data
exports.getAllIotData = async () => {
  const [rows] = await db.query('SELECT * FROM iot_flows');
  return rows;
};

exports.getPaginatedIotData = async (page = 1, limit = 20) => {
  const offset = (page - 1) * limit;
  const sql = 'SELECT id, packet_size_avg, packet_size_sum, timestamp FROM iot_flows LIMIT ? OFFSET ?';
  const [rows] = await db.query(sql, [limit, offset]);
  return rows;
};

// Function to get data by id
exports.getIotDataById = async (id) => {
  const [rows] = await db.query('SELECT * FROM iot_flows WHERE id = ?', [id]);
  return rows;
};

// Function to insert data into the table
exports.insertIotData = async (data) => {
  const [result] = await db.query(
    'INSERT INTO iot_flows (id, packet_size_avg, packet_size_sum, timestamp) VALUES ?',
    [data]
  );
  return result;
};

// Function to update data by id
exports.updateIotData = async (id, packet_size_avg, packet_size_sum, timestamp) => {
  const [result] = await db.query(
    'UPDATE iot_flows SET packet_size_avg = ?, packet_size_sum = ?, timestamp = ? WHERE id = ?',
    [packet_size_avg, packet_size_sum, timestamp, id]
  );
  return result;
};

// Function to delete data by id
exports.deleteIotData = async (id) => {
  const [result] = await db.query('DELETE FROM iot_flows WHERE id = ?', [id]);
  return result;
};

exports.getFlowById = async (id) => {
  const [rows] = await db.query('SELECT * FROM iot_flows WHERE id = ?', [id]);
  return rows;
};

exports.deleteFlowById = async (id) => {
  const [result] = await db.query('DELETE FROM iot_flows WHERE id = ?', [id]);
  return result;
};

exports.getRecentFlows = async () => {
  const [rows] = await db.query(
    'SELECT * FROM iot_flows WHERE timestamp >= NOW() - INTERVAL 1 DAY'
  );
  return rows;
};

exports.getFlowStats = async () => {
  const [rows] = await db.query(`
    SELECT 
      COUNT(*) AS total,
      AVG(packet_size_avg) AS avg_packet_size,
      SUM(packet_size_sum) AS total_packet_sum
    FROM iot_flows
  `);
  return rows[0];
};

exports.getDeviceFlows = async (deviceId) => {
  const [rows] = await db.query('SELECT * FROM iot_flows WHERE device_id = ?', [deviceId]);
  return rows;
};

