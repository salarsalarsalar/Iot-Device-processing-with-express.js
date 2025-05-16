// middleware/logsFromGateway.js
module.exports = (req, res, next) => {
  const gateway = req.headers['x-gateway'] || 'unknown';
  console.log(`[GATEWAY LOG] Hit from ${gateway} → ${req.method} ${req.originalUrl}`);
  next();
};
