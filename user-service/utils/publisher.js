const { getChannel } = require('./rabbitmq');

exports.publishUserCreated = async (user) => {
  const channel = await getChannel();
  channel.publish('service-exchange', 'user.created', Buffer.from(JSON.stringify(user)));
};
