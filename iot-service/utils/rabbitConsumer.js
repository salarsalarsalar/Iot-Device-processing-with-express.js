const amqp = require('amqplib');

const startConsumer = async () => {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  const exchange = 'service-exchange'; // ✅ match publisher
  const queue = 'iotQueue';            // you can name it anything
  const routingKey = 'user.created';   // ✅ match publisher

  await channel.assertExchange(exchange, 'topic', { durable: false  });

  const q = await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(q.queue, exchange, routingKey); // 🔗 bind queue to exchange

  console.log('[x] Waiting for messages with routing key "user.created"...');

  channel.consume(q.queue, (msg) => {
    if (msg !== null) {
      const user = JSON.parse(msg.content.toString());
      console.log('[✔] Received user:', user);

      // Do something with user data (e.g., store IoT device)
      // e.g., await Device.create({ user_id: user.id, ... })

      channel.ack(msg); // Acknowledge message
    }
  });
};

module.exports = { startConsumer };
