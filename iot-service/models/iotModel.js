const { parseTimestamp } = require('../utils/controllerHelper');
const sendKafkaMessage = require('../kafka/producer');
const { getDB } = require('../config/database');
const { ObjectId } = require('mongodb');
// @route: /api/iot/
// @desc Query to get all IoT data
// @method GET
exports.getAllIotData = async () => {
  const db = getDB();
  const query = db.collection('iot_flows').find().toArray();
  console.log('MongoDB Query:', {
    operation: 'find',
    collection: 'iot_flows'
  });
  return query;
}

// @route: /api/iot/:id
// @desc Query to get data by id
// @method GET
exports.getIotData = async (id) => {
  const db = getDB();
  const query = db.collection('iot_flows').findOne({ _id: new ObjectId(id) });
  console.log('MongoDB Query:', {
    operation: 'findOne',
    collection: 'iot_flows',
    filter: { _id: new ObjectId(id) }
  });
  return query;
}
// @route: /api/iot/ 
// @desc Query to insert data into the table
// @method POST

exports.insertIotData = async (data) => {
  const db = getDB();
  const query = db.collection('iot_flows').insertOne(data);
  console.log('MongoDB Insert:', {
    operation: 'insertOne',
    collection: 'iot_flows',
    data: data
  });
  return query;
};

// @route: /api/iot/
// @desc Query to update data by id
// @method POST
exports.updateIotData = async (id, updateData) => {
  const db = getDB();
  const query = await db.collection('iot_flows').updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
  );
  console.log('MongoDB Update:', {
    operation: 'updateOne',
    collection: 'iot_flows',
    filter: { _id: new ObjectId(id) },
    update: updateData
  });
  return query;
};
// @route: /api/iot/:id
// @desc Query to delete data by id
// @method DELETE

exports.deleteIotData = async (id) => {
  const db = getDB();
  const query = db.collection('iot_flows').deleteOne({ _id: new ObjectId(id) });
  console.log('MongoDB Delete:', {
    operation: 'deleteOne',
    collection: 'iot_flows',
    filter: { _id: new ObjectId(id) }
  });
  return query;
};
// @route: /api/iot/stats
// @desc Query to get statistics
// @method GET
exports.getStats = async () => {
  const db = getDB();
  const query = db.collection('iot_flows').aggregate([
    {
      $group: {
        _id: null,
        avgPacketSize: { $avg: '$packet_size_avg' },
        totalPackets: { $sum: 1 }
      }
    }
  ]);
  console.log('MongoDB Aggregation:', {
    operation: 'aggregate',
    collection: 'iot_flows',
    pipeline: [
      {
        $group: {
          _id: null,
          avgPacketSize: { $avg: '$packet_size_avg' },
          totalPackets: { $sum: 1 }
        }
      }
    ]
  });
  return query.toArray();
}

// @route: /api/iot/recent
// @desc Query to get recent entries
// @method GET
exports.getRecent = async () => {
  const db = getDB();
  const query = db.collection('iot_flows').find().sort({ timestamp: -1 }).limit(10).toArray();
  console.log('MongoDB Query:', {
    operation: 'find',
    collection: 'iot_flows',
    sort: { timestamp: -1 },
    limit: 10
  });
  return query;
};

// @route: /api/iot/upload
// @desc: Query to insert from csv
// @method POST
exports.uploadData = async (results) => {
  try {
    console.log('MongoDB Bulk Insert Started');
    const db = getDB();

    for (const row of results) {
      const { packet_size_avg, packet_size_sum, timestamp, device_name, device_id } = row;

      // Send to Kafka stream
      sendKafkaMessage('iot_data_stream', row);

      const deviceObjectId = ObjectId.isValid(device_id) ? new ObjectId(device_id) : new ObjectId();

      // Create or update device
      await db.collection('devices').updateOne(
        { _id: deviceObjectId },
        { $set: { device_name } },
        { upsert: true }
      );

      console.log('MongoDB Device Operation:', {
        operation: 'updateOne',
        collection: 'devices',
        filter: { _id: deviceObjectId },
        update: { device_name }
      });

      // Parse and insert time document
      const parsed = parseTimestamp(timestamp);
      const timeDoc = {
        full_timestamp: parsed.full,
        year: parsed.year,
        month: parsed.month,
        day: parsed.day,
        hour: parsed.hour,
        minute: parsed.minute,
        second: parsed.second
      };

      const timeResult = await db.collection('times').insertOne(timeDoc);
      const timeId = timeResult.insertedId;

      console.log('MongoDB Time Operation:', {
        operation: 'insertOne',
        collection: 'times',
        document: timeDoc
      });

      // Insert IoT flow entry
      const iotFlow = {
        packet_size_avg: parseFloat(packet_size_avg),
        packet_size_sum: parseInt(packet_size_sum),
        timestamp: parsed.full,
        device_id: deviceObjectId,
        time_id: timeId
      };

      await db.collection('iot_flows').insertOne(iotFlow);

      console.log('MongoDB Flow Operation:', {
        operation: 'insertOne',
        collection: 'iot_flows',
        document: iotFlow
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