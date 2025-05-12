const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const sequelize = require('../config/database');
const { Device, Time, IoT_Flow } = require('../models');

async function setupDatabase() {
    try {
        // Sync all models
        await sequelize.sync({ force: true });
        console.log('Database tables created successfully');

        // Path to the CSV file
        const csvFilePath = path.join(__dirname, '..', 'data', 'iot_data.csv'); // Adjust the path as needed

        // Read and parse the CSV file
        const devices = [];
        const times = [];
        const iotFlows = [];

        await new Promise((resolve, reject) => {
            fs.createReadStream(csvFilePath)
                .pipe(csv())
                .on('data', (row) => {
                    // Assuming the CSV has columns: device_name, device_id, full_timestamp, packet_size_avg, packet_size_sum, time_id
                    devices.push({
                        device_name: row.device_name,
                        device_id: row.device_id,
                    });

                    times.push({
                        full_timestamp: new Date(row.full_timestamp),
                        year: new Date(row.full_timestamp).getFullYear(),
                        month: new Date(row.full_timestamp).getMonth() + 1,
                        day: new Date(row.full_timestamp).getDate(),
                        hour: new Date(row.full_timestamp).getHours(),
                        minute: new Date(row.full_timestamp).getMinutes(),
                        second: new Date(row.full_timestamp).getSeconds(),
                    });

                    iotFlows.push({
                        id: row.id,
                        packet_size_avg: row.packet_size_avg,
                        packet_size_sum: row.packet_size_sum,
                        timestamp: new Date(row.full_timestamp),
                        device_id: row.device_id,
                        time_id: row.time_id,
                    });
                })
                .on('end', resolve)
                .on('error', reject);
        });

        // Insert data into the database
        await Device.bulkCreate(devices);
        console.log('Devices created successfully');

        await Time.bulkCreate(times);
        console.log('Time entries created successfully');

        await IoT_Flow.bulkCreate(iotFlows);
        console.log('IoT flows created successfully');

        console.log('Database setup completed successfully');
    } catch (error) {
        console.error('Error setting up database:', error);
    } finally {
        await sequelize.close();
    }
}

setupDatabase();