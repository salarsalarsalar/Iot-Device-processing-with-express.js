// kafka/kafka.js
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'user-service',
  brokers: ['localhost:9092']  // or use your Docker internal network hostname
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'user-service-group' });

module.exports = { kafka, producer, consumer };

// // kafka/producer.js
// const { Kafka } = require('kafkajs');
// const kafka = new Kafka({ clientId: 'user-service', brokers: ['localhost:9092'] });

// const producer = kafka.producer();
// let isConnected = false;

// const connectProducer = async () => {
//     if (!isConnected) {
//         await producer.connect();
//         isConnected = true;
//     }
// };

// module.exports = { producer, connectProducer };
