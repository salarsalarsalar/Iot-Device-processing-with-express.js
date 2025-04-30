const { redisClient } = require('./redisClient');

const DEFAULT_EXPIRATION = 3600; // 1 hour

const getOrSetCache = async (key, value) => {
  try {
    const cached = await redisClient.get(key);
    if (cached) {
      console.log("Cache hit");
      return JSON.parse(cached);
    }

    console.log("Cache miss");
    const freshData = await value;
    await redisClient.setEx(key, DEFAULT_EXPIRATION, JSON.stringify(freshData));
    return freshData;

  } catch (err) {
    console.error("Redis cache error:", err);
    return value; // fallback to DB call
  }
};

module.exports = {
  getOrSetCache,
};
