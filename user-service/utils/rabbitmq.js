const amqp = require('amqplib');

let channel;

async function connect() {
  const conn = await amqp.connect('amqp://localhost');
  channel = await conn.createChannel();
  await channel.assertExchange('service-exchange', 'topic', { durable: false });
  return channel;
}

async function getChannel() {
  if (!channel) await connect();
  return channel;
}

module.exports = { getChannel };
