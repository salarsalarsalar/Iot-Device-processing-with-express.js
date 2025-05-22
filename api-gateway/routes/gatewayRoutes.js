const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimiter = require('../middleware/rateLimiter');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

const router = express.Router();

// Load and expand .env variables
dotenv.config();
const sharedEnv = dotenv.config({ path: '../.env' });
dotenvExpand.expand(sharedEnv);

// Determine protocol based on environment
const isProduction = process.env.NODE_ENV === 'production';
const protocol = isProduction ? 'https' : 'http';

// Logging
console.log(`[API-Gateway] Running in ${process.env.NODE_ENV || 'development'} mode`);
console.log(`[API-Gateway] Proxying with protocol: ${protocol.toUpperCase()}`);

// Welcome Route
router.get('/api/welcome', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the API Gateway',
    services: [
      { name: 'User Service', url: `${protocol}://localhost:${process.env.USER_SERVICE_PORT}` },
      { name: 'IoT Service', url: `${protocol}://localhost:${process.env.IOT_SERVICE_PORT}` }
    ]
  });
});

// // Proxy requests to Flask service's /process endpoint
// router.use('/api/process', createProxyMiddleware({
//   target: `${protocol}://user-service:${process.env.DATA_SERVICE_PORT}`,  // Flask app URL (where the Flask app is running)
//   changeOrigin: true,
//   secure: false, // Allows HTTPS with self-signed certs
//   pathRewrite: {
//     '^/api/process': '/process',  // Rewrite '/api/process' to '/process' for Flask
//   },
//   onProxyReq: (proxyReq, req) => {
//     proxyReq.setHeader('X-Gateway', 'api-gateway');
//   },
// }));

// Proxy to User Service
router.use('/api/user', rateLimiter, createProxyMiddleware({
  target: `${protocol}://user-service:${process.env.USER_SERVICE_PORT}`,
  changeOrigin: true,
  secure: isProduction, // Only validate SSL in production
  pathRewrite: { '^/api/user': '' },
  onProxyReq: (proxyReq, req) => {
    proxyReq.setHeader('X-Gateway', 'api-gateway');
  }
}));

// Proxy to IoT Service
router.use('/api/iot', createProxyMiddleware({
  target: `${protocol}://iot-service:${process.env.IOT_SERVICE_PORT}`,
  changeOrigin: true,
  secure: isProduction,
  ws: true,
  pathRewrite: { '^/api/iot': '' },
  onProxyReq: (proxyReq, req) => {
    proxyReq.setHeader('x-gateway', 'API Gateway');
  }
}));

module.exports = router;
