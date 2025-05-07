// middleware/logFromGateway.js
module.exports = (req, res, next) => {
    const gatewayIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const from = req.get('X-Gateway') || 'Unknown Source';
  
    console.log(`[${new Date().toISOString()}] Received request from API Gateway (${from}) at ${req.method} ${req.originalUrl}`);
    next();
  };
  