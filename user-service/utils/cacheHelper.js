const redis = require('redis');
const { promisify } = require('util');

// Create Redis client
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// Connect to Redis
redisClient.connect().catch(console.error);

// Promisify Redis methods
const getAsync = async (key) => {
  try {
    return await redisClient.get(key);
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  }
};

const setExAsync = async (key, seconds, value) => {
  try {
    return await redisClient.setEx(key, seconds, value);
  } catch (error) {
    console.error('Redis setEx error:', error);
    return null;
  }
};

// Cache helper function
const getOrSetCache = async (key, cb) => {
  try {
    // Try to get data from cache
    const cachedData = await getAsync(key);
    
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    
    // If not in cache, execute callback to get fresh data
    const freshData = await cb();
    
    // Store in cache with 1 hour expiration
    await setExAsync(key, 3600, JSON.stringify(freshData));
    
    return freshData;
  } catch (error) {
    console.error('Cache error:', error);
    // If cache fails, still try to get fresh data
    return cb();
  }
};

// Handle Redis client errors
redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.on('connect', () => console.log('Redis connected'));
redisClient.on('ready', () => console.log('Redis ready'));
redisClient.on('end', () => console.log('Redis connection ended'));

// Graceful shutdown
process.on('SIGINT', async () => {
  await redisClient.quit();
  process.exit(0);
});

module.exports = {
  getOrSetCache,
  redisClient
}; 