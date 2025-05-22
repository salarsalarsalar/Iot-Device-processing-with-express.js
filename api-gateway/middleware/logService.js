// middleware/logService.js
module.exports = (req, res, next) => {
    const originalUrl = req.originalUrl;
  
    // You can customize these patterns based on your gateway routes
    if (originalUrl.startsWith('/api/iot')) {
      console.log(`[Gateway] --> Routing to IoT Service for: ${originalUrl}`);
      req.targetService = 'iot-service';
    } else if (originalUrl.startsWith('/api/user')) {
      console.log(`[Gateway] --> Routing to User Service for: ${originalUrl}`);
      req.targetService = 'user-service';
    } else if (originalUrl.startsWith('/api/welcome')) {
      console.log(`[Gateway] --> welcome message by gateway for: ${originalUrl}`);
    } else {
      console.log(`[Gateway] --> Unknown service for: ${originalUrl}`);
      req.targetService = 'unknown';
    }
  
    next();
  };
  