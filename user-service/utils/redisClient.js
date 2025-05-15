const { createClient } = require('redis');

const redisClient = createClient();
redisClient.connect().then(() => console.log("Redis connected"));

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

module.exports={
  redisClient
}