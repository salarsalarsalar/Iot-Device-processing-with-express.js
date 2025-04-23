
// SQL queries related to iot
exports.iot_sql = {
    getAll: 'SELECT * FROM iot_flows',
    getAllDevices: 'SELECT * FROM devices',
    paginated: 'SELECT id, packet_size_avg, packet_size_sum, timestamp FROM iot_flows LIMIT ? OFFSET ?',
    recent: 'SELECT * FROM iot_flows WHERE timestamp >= NOW() - INTERVAL 1 DAY',
    deviceById:'SELECT * FROM iot_flows WHERE id = ?',
    insertData:'INSERT INTO iot_flows (id, packet_size_avg, packet_size_sum, timestamp) VALUES ?',
    updateData:'UPDATE iot_flows SET packet_size_avg = ?, packet_size_sum = ?, timestamp = ? WHERE id = ?',
    deleteData:'DELETE FROM iot_flows WHERE id = ?',
    flowInsert: 'INSERT INTO iot_flows (id, packet_size_avg, packet_size_sum, timestamp, device_id, time_id) VALUES ?',
    deviceInsert: 'INSERT IGNORE INTO devices (device_id, device_name) VALUES ?',
    timeInsert: 'INSERT IGNORE INTO time (full_timestamp, year, month, day, hour, minute, second) VALUES ?',

    
    stats:`
      SELECT 
        COUNT(*) AS total,
        AVG(packet_size_avg) AS avg_packet_size,
        SUM(packet_size_sum) AS total_packet_sum
      FROM iot_flows`,
};

// SQL queries related to users and roles
exports.user_sql ={
  create:'INSERT INTO users (username, password) VALUES (?, ?)',
  find:'SELECT * FROM users WHERE username = ?'
};