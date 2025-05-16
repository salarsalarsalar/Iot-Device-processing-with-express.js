const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const { Device, Time, IoT_Flow } = require('../models');
const connectDB = require('../config/database');

async function setupDatabase() {
    try {
        // Connect to MongoDB
        await connectDB();
        console.log('Connected to MongoDB');

        // Clear existing collections
        await Promise.all([
            Device.deleteMany({}),
            Time.deleteMany({}),
            IoT_Flow.deleteMany({})
        ]);
        console.log('Existing collections cleared');

        // Path to the CSV file
        const csvFilePath = path.join(__dirname, '..', 'data', 'iot_data.csv');

        // Read and parse the CSV file
        const devices = new Map();
        const times = new Map();
        const iotFlows = [];

        await new Promise((resolve, reject) => {
            fs.createReadStream(csvFilePath)
                .pipe(csv())
                .on('data', (row) => {
                    // Handle devices
                    if (!devices.has(row.device_id)) {
                        devices.set(row.device_id, {
                            _id: new mongoose.Types.ObjectId(row.device_id),
                            device_name: row.device_name
                        });
                    }

                    // Handle times
                    const timestamp = new Date(row.full_timestamp);
                    const timeKey = timestamp.toISOString();
                    if (!times.has(timeKey)) {
                        times.set(timeKey, {
                            _id: new mongoose.Types.ObjectId(),
                            full_timestamp: timestamp,
                            year: timestamp.getFullYear(),
                            month: timestamp.getMonth() + 1,
                            day: timestamp.getDate(),
                            hour: timestamp.getHours(),
                            minute: timestamp.getMinutes(),
                            second: timestamp.getSeconds()
                        });
                    }

                    // Handle IoT flows
                    iotFlows.push({
                        packet_size_avg: parseFloat(row.packet_size_avg),
                        packet_size_sum: parseInt(row.packet_size_sum),
                        timestamp: timestamp,
                        device_id: devices.get(row.device_id)._id,
                        time_id: times.get(timeKey)._id
                    });
                })
                .on('end', resolve)
                .on('error', reject);
        });

        // Insert data into MongoDB
        await Device.insertMany(Array.from(devices.values()));
        console.log('Devices created successfully');

        await Time.insertMany(Array.from(times.values()));
        console.log('Time entries created successfully');

        await IoT_Flow.insertMany(iotFlows);
        console.log('IoT flows created successfully');

        console.log('Database setup completed successfully');
    } catch (error) {
        console.error('Error setting up database:', error);
    } finally {
        await mongoose.connection.close();
    }
}

setupDatabase();