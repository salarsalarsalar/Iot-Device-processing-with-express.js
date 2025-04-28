
// used in ../models/iotModel.uploadData() function
// used for making day, month, year, hour, minute from timestamp 
exports.parseTimestamp = (timestamp) => {
    const dt = new Date(timestamp);
    return {
      full: dt.toISOString().slice(0, 19).replace('T', ' '), // MySQL DATETIME format
      year: dt.getFullYear(),
      month: dt.getMonth() + 1,
      day: dt.getDate(),
      hour: dt.getHours(),
      minute: dt.getMinutes(),
      second: dt.getSeconds()
    };
  };

exports.ReadCSV= (row,results) => {
  const { id, packet_size_avg, packet_size_sum, timestamp, device_name } = row;
  if (packet_size_avg && packet_size_sum && timestamp && device_name) {
    results.push({
      id: parseInt(id),
      packet_size_avg: parseFloat(packet_size_avg),
      packet_size_sum: parseFloat(packet_size_sum),
      timestamp,
      device_name
    });
  }
};
  