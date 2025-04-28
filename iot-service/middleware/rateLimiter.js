const rateLimit = require('express-rate-limit');
// rate limiting of 100 requests per 15 minutes)
exports.limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, //100 requests per window
    message: 'Too many requests from this IP, please try again later.'
});
  