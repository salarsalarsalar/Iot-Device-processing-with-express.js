const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimiter = require('../middleware/rateLimiter');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const router = express.Router();

dotenv.config(); // Load .env variables
const sharedEnv = dotenv.config({ path: '../.env' });
dotenvExpand.expand(sharedEnv); // Expand shared variables

// // Proxy requests to Flask service's /process endpoint
// router.use('/api/process', createProxyMiddleware({
//   target: 'https://127.0.0.1:3003',  // Flask app URL (where the Flask app is running)
//   changeOrigin: true,
//   secure: false, // Allows HTTPS with self-signed certs
//   pathRewrite: {
//     '^/api/process': '/process',  // Rewrite '/api/process' to '/process' for Flask
//   },
//   onProxyReq: (proxyReq, req) => {
//     proxyReq.setHeader('X-Gateway', 'api-gateway');
//   },
// }));

router.get('/api/welcome', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the API Gateway',
    services: [
      { name: 'User Service', url: `https://localhost:${process.env.USER_SERVICE_PORT}` },
      { name: 'IoT Service', url: `https://localhost:${process.env.IOT_SERVICE_PORT}` }
    ]
  });
});
router.use('/api/user', rateLimiter, createProxyMiddleware({
  target: `https://user-service:${process.env.USER_SERVICE_PORT}`, // User service URL
  changeOrigin: true,
  secure: false, // Allows HTTPS with self-signed certs
  pathRewrite: { '^/api/user': '' },
  onProxyReq: (proxyReq, req) => {
    proxyReq.setHeader('X-Gateway', 'api-gateway');
  }
}));

router.use('/api/iot', createProxyMiddleware({
  target: `https://iot-service:${process.env.IOT_SERVICE_PORT}`, // IoT service URL
  changeOrigin: true,
  secure: false, // Allows HTTPS with self-signed certs
  ws: true, // WebSocket support
  pathRewrite: { '^/api/iot': '' },
  onProxyReq: (proxyReq, req) => {
    proxyReq.setHeader('x-gateway', 'API Gateway');
  }
}));

module.exports = router;
