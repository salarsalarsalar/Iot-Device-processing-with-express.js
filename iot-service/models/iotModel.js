const { iot_sql } = require('../utils/sql');
const { pool } = require('./db'); // assuming pool is exported from db.js
const { parseTimestamp } = require('../utils/controllerHelper');
const sendKafkaMessage = require('../kafka/producer');

// @route: /api/iot/
// @desc Query to get all IoT data
// @method GET
exports.getAllIotData = (callback) => {
  console.log("Query being run:", iot_sql.getAll);  
  pool.query(iot_sql.getAll,callback); 
};

// @route: /api/iot/:id
// @desc Query to get data by id
// @method GET
exports.getIotDataById = (id, callback) => {
  console.log("Query being run:", iot_sql.deviceById);
  pool.query(iot_sql.deviceById, [id], callback);
};

// @route: /api/iot/ 
// @desc Query to insert data into the table
// @method PUT
exports.insertIotData = (data, callback) => {
  console.log("Query being run:", iot_sql.insertData);
  pool.query(iot_sql.insertData, [data], callback);
};

// @route: /api/iot/
// @desc Query to update data by id
// @method POST
exports.updateIotData = (id, packet_size_avg, packet_size_sum, timestamp, callback) => {
  console.log("Query being run:", iot_sql.updateData);
  pool.query(iot_sql.updateData, [packet_size_avg, packet_size_sum, timestamp, id], callback);
};

// @route: /api/iot/
// @desc Query to delete data by id
// @method DELETE
exports.deleteIotData = (id, callback) => {
  console.log("Query being run:", iot_sql.deleteData);
  pool.query(iot_sql.deleteData, [id], callback);
};

// @route: /api/iot/stats
// @desc Query to get statistics
// @method GET
exports.getStats = (callback) => {
  console.log("Query being run:", iot_sql.stats);
  pool.query(iot_sql.stats, callback);
};

// @route: /api/iot/recent
// @desc Query to get recent entries
// @method GET
exports.getRecent = (callback) => {
  console.log("Query being run:", iot_sql.getRecent);
  pool.query(iot_sql.getRecent,callback);
}

// @route: /api/iot/upload
// @desc: Query to insert from csv
// @method POST

exports.uploadData = (results, res, next) => {
  const flows = [];
  const devices = new Map();
  const times = new Map();

  results.forEach(row => {
    const { id, packet_size_avg, packet_size_sum, timestamp, device_name, device_id } = row;
    sendKafkaMessage('iot_data_stream', row);
    // Insert device if not already seen
    devices.set(device_id, device_name);

    // Parse timestamp to time dimensions
    const parsed = parseTimestamp(timestamp);
    const full_timestamp = parsed.full;
    const timeKey = `${parsed.year}-${parsed.month}-${parsed.day}-${parsed.hour}-${parsed.minute}-${parsed.second}`;
    times.set(timeKey, [full_timestamp, parsed.year, parsed.month, parsed.day, parsed.hour, parsed.minute, parsed.second]);

    // Temporarily use NULL for foreign keys; update later via SQL JOIN
    flows.push([parseInt(id), parseFloat(packet_size_avg), parseInt(packet_size_sum), full_timestamp, device_id, null]);
  });

  const deviceValues = Array.from(devices.entries()).map(([id, name]) => [id, name]);
  const timeValues = Array.from(times.values());

  // Insert all in sequence
  pool.query(iot_sql.deviceInsert, [deviceValues], (err1) => {
    if (err1) return next(err1);

    pool.query(iot_sql.timeInsert, [timeValues], (err2) => {
      if (err2) return next(err2);

      pool.query(iot_sql.flowInsert, [flows], (err3, result) => {
        if (err3) return next(err3);

        res.status(201).json({
          message: 'Data inserted successfully',
          affectedRows: result.affectedRows,
        });
      });
    });
  });
};
