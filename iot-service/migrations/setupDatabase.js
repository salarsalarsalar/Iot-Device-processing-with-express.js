const sequelize = require('../config/database');
const { Device, Time, IoT_Flow } = require('../models');

async function setupDatabase() {
    try {
        // Sync all models
        await sequelize.sync({ force: true });
        console.log('Database tables created successfully');

        // Create sample devices
        const devices = await Device.bulkCreate([
            {
                device_name: 'Temperature Sensor 1',
                user_id: 1
            },
            {
                device_name: 'Humidity Sensor 1',
                user_id: 1
            },
            {
                device_name: 'Motion Sensor 1',
                user_id: 2
            }
        ]);
        console.log('Sample devices created');

        // Create sample time entries
        const times = await Time.bulkCreate([
            {
                full_timestamp: new Date('2024-05-01T10:00:00'),
                year: 2024,
                month: 5,
                day: 1,
                hour: 10,
                minute: 0,
                second: 0
            },
            {
                full_timestamp: new Date('2024-05-01T10:15:00'),
                year: 2024,
                month: 5,
                day: 1,
                hour: 10,
                minute: 15,
                second: 0
            },
            {
                full_timestamp: new Date('2024-05-01T10:30:00'),
                year: 2024,
                month: 5,
                day: 1,
                hour: 10,
                minute: 30,
                second: 0
            }
        ]);
        console.log('Sample time entries created');

        // Create sample IoT flows
        const iotFlows = await IoT_Flow.bulkCreate([
            {
                id: 1,
                packet_size_avg: 150.5,
                packet_size_sum: 1505,
                timestamp: new Date('2024-05-01T10:00:00'),
                device_id: 1,
                time_id: 1
            },
            {
                id: 2,
                packet_size_avg: 120.3,
                packet_size_sum: 1203,
                timestamp: new Date('2024-05-01T10:15:00'),
                device_id: 2,
                time_id: 2
            },
            {
                id: 3,
                packet_size_avg: 200.7,
                packet_size_sum: 2007,
                timestamp: new Date('2024-05-01T10:30:00'),
                device_id: 3,
                time_id: 3
            }
        ]);
        console.log('Sample IoT flows created');

        console.log('Database setup completed successfully');
    } catch (error) {
        console.error('Error setting up database:', error);
    } finally {
        await sequelize.close();
    }
}

setupDatabase(); 