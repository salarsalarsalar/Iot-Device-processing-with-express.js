// kafka/initKafka.js
const { producer } = require('./producer');

async function initKafka() {
  try {
    await producer.connect();
    console.log('[Kafka] Producer connected');
  } catch (err) {
    console.error('[Kafka] Failed to connect producer:', err);
    process.exit(1); // Exit if Kafka isn't available
  }
}

module.exports = initKafka;
