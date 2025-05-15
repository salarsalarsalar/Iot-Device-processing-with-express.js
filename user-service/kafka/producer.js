// kafka/kafka.js
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'user-service',
  brokers: ['localhost:9092'],
});

const producer = kafka.producer();
module.exports = { producer };
