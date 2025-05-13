// kafka/kafka.js
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'user-service',
  brokers: ['localhost:29092'],
});

const producer = kafka.producer();
module.exports = { producer };
