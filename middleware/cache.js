const redis = require('redis');
const {redisClient} = require('../utils/redisClient');;
exports.cache = async (req, res, next) => {
    const { id } = req.params;
  
    try {
      const cachedData = await redisClient.get(`device:${id}`);
  
      if (cachedData) {
        console.log("Cache hit");
        return res.json(JSON.parse(cachedData)); // Convert back to object
      }
  
      console.log("Cache miss");
      next(); // Go to DB fetch
    } catch (err) {
      console.error("Redis error:", err);
      next(); // Proceed anyway if Redis fails
    }
  };
  
  