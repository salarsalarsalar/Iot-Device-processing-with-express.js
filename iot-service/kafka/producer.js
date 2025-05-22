const { Kafka, Partitioners } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'iot-producer',
  brokers: ['localhost:9092']
});

const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,  // Use the old partitioner
});
console.log('[Kafka] producer created');

async function sendKafkaMessage(topic, message) {
  await producer.connect();
  console.log(`[Kafka] Producer connected to topic: ${topic}`);
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
  await producer.disconnect();
}

module.exports = sendKafkaMessage;
