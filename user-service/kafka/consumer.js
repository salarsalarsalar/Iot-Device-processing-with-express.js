// kafka/consumer.js
const { Kafka } = require('kafkajs');
const { User, Role, User_Role } = require('../models');
const { Sequelize } = require('sequelize');
// Initialize the Kafka client
const kafka = new Kafka({
    clientId: 'user-service',
    brokers: ['kafka:9092'],  // Use the appropriate broker address for your setup
});

// Create a consumer instance
const consumer = kafka.consumer({ groupId: 'user-service-group' });

const run = async () => {
    try {
        await consumer.connect();
        await consumer.subscribe({ topic: 'user-registered', fromBeginning: true });

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    const userData = JSON.parse(message.value.toString());

                    // Logging for audit
                    console.log('----------------------------------');
                    console.log(' Kafka:');
                    console.log(' New User Register logged via Kafka:');
                    console.log(` Username: ${userData.username}`);
                    console.log(` Email: ${userData.email}`);
                    console.log(` Registered At: ${new Date().toISOString()}`);

                    // (Optional) Tracking
                    // You can also push this data to an analytics service or write to a log file if needed
                } catch (error) {
                    console.error(' Error parsing Kafka message for tracking:', error);
                }
            }
        });


    } catch (err) {
        console.error('Error in consumer:', err);
    }
};

process.on('SIGINT', async () => {
    await consumer.disconnect();
    process.exit(0);
});

run();