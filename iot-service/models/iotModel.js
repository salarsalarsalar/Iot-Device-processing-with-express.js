const { Device, Time, IoT_Flow } = require('./index');
const { parseTimestamp } = require('../utils/controllerHelper');
const sendKafkaMessage = require('../kafka/producer');

// @route: /api/iot/
// @desc Query to get all IoT data
// @method GET
exports.getAllIotData = async () => {
  const query = IoT_Flow.find().populate('device_id').populate('time_id');
  console.log('MongoDB Query:', query.getFilter());
  return await query.exec();
};

// @route: /api/iot/:id
// @desc Query to get data by id
// @method GET
exports.getIotDataById = async (id) => {
  const query = IoT_Flow.findById(id).populate('device_id').populate('time_id');
  console.log('MongoDB Query:', {
    operation: 'findById',
    collection: 'iot_flows',
    id: id,
    populates: ['device_id', 'time_id']
  });
  return await query.exec();
};

// @route: /api/iot/ 
// @desc Query to insert data into the table
// @method PUT
exports.insertIotData = async (data) => {
  console.log('MongoDB Insert:', {
    collection: 'iot_flows',
    data: data
  });
  return await IoT_Flow.create(data);
};

// @route: /api/iot/
// @desc Query to update data by id
// @method POST
exports.updateIotData = async (id, updateData) => {
  console.log('MongoDB Update:', {
    collection: 'iot_flows',
    filter: { _id: id },
    update: updateData
  });
  return await IoT_Flow.findByIdAndUpdate(id, updateData, { new: true });
};
// @route: /api/iot/
// @desc Query to delete data by id
// @method DELETE
exports.deleteIotData = async (id) => {
  console.log('MongoDB Delete:', {
    collection: 'iot_flows',
    filter: { _id: id }
  });
  return await IoT_Flow.findByIdAndDelete(id);
};

// @route: /api/iot/stats
// @desc Query to get statistics
// @method GET
exports.getStats = async () => {
  const query = IoT_Flow.aggregate([
    {
      $group: {
        _id: null,
        avgPacketSize: { $avg: '$packet_size_avg' },
        totalPackets: { $sum: 1 }
      }
    }
  ]);
  console.log('MongoDB Aggregation:', query._pipeline);
  const result = await query.exec();
  return result[0] || { avgPacketSize: 0, totalPackets: 0 }; 
};

// @route: /api/iot/recent
// @desc Query to get recent entries
// @method GET
exports.getRecent = async () => {
  const query = IoT_Flow.find()
    .sort({ timestamp: -1 })
    .limit(10)
    .populate('device_id')
    .populate('time_id');

  console.log('MongoDB Query:', {
    operation: 'find',
    collection: 'iot_flows',
    sort: { timestamp: -1 },
    limit: 10,
    populates: ['device_id', 'time_id']
  });

  return await query.exec();
};

// @route: /api/iot/upload
// @desc: Query to insert from csv
// @method POST

exports.uploadData = async (results) => {
  try {
    console.log('MongoDB Bulk Insert Started');
    
    for (const row of results) {
      const { packet_size_avg, packet_size_sum, timestamp, device_name, device_id } = row;
      
      // Send to Kafka stream
      sendKafkaMessage('iot_data_stream', row);

      // Create or update device
      const device = await Device.findOneAndUpdate(
        { _id: device_id },
        { device_name },
        { upsert: true, new: true }
      );

      console.log('MongoDB Device Operation:', {
        operation: 'findOneAndUpdate',
        collection: 'devices',
        filter: { _id: device_id },
        update: { device_name }
      });

      // Parse and create time entry
      const parsed = parseTimestamp(timestamp);
      const time = await Time.create({
        full_timestamp: parsed.full,
        year: parsed.year,
        month: parsed.month,
        day: parsed.day,
        hour: parsed.hour,
        minute: parsed.minute,
        second: parsed.second
      });

      console.log('MongoDB Time Operation:', {
        operation: 'create',
        collection: 'times',
        data: { year: parsed.year, month: parsed.month }
      });

      // Create IoT flow entry
      await IoT_Flow.create({
        packet_size_avg: parseFloat(packet_size_avg),
        packet_size_sum: parseInt(packet_size_sum),
        timestamp: parsed.full,
        device_id: device._id,
        time_id: time._id
      });

      console.log('MongoDB Flow Operation:', {
        operation: 'create',
        collection: 'iot_flows',
        data: {
          packet_size_avg,
          device_id: device._id,
          time_id: time._id
        }
      });
    }

    return {
      success: true,
      message: 'Data inserted successfully',
      count: results.length
    };

  } catch (error) {
    console.error('MongoDB Error:', error);
    throw error;
  }
};