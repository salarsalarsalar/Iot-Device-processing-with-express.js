// userController.js
const { producer } = require('./kafka');

async function registerUser(req, res, user) {
  // register logic ...

  await producer.connect();
  await producer.send({
    topic: 'user.events',
    messages: [
      {
        key: 'user.created',
        value: JSON.stringify(user),
      },
    ],
  });

  res.json({ message: 'User registered', user });
}
