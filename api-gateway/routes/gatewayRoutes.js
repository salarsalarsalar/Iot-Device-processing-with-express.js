const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimiter = require('../middleware/rateLimiter');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const router = express.Router();

dotenv.config(); // Load .env variables
const sharedEnv = dotenv.config({ path: '../.env' });
dotenvExpand.expand(sharedEnv); // Expand shared variables

// Proxy requests to Flask service's /process endpoint
router.use('/api/process', createProxyMiddleware({
  target: 'https://127.0.0.1:3003',  // Flask app URL (where the Flask app is running)
  changeOrigin: true,
  secure: false, // Allows HTTPS with self-signed certs
  pathRewrite: {
    '^/api/process': '/process',  // Rewrite '/api/process' to '/process' for Flask
  },
  onProxyReq: (proxyReq, req) => {
    proxyReq.setHeader('X-Gateway', 'api-gateway');
  },
}));


router.use('/api/user', rateLimiter, createProxyMiddleware({
  target: process.env.USER_SERVICE_URL,
  changeOrigin: true,
  secure: false, // Allows HTTPS with self-signed certs
  pathRewrite: { '^/api/user': '' },
  onProxyReq: (proxyReq, req) => {
    proxyReq.setHeader('X-Gateway', 'api-gateway');
  }
}));

router.use('/api/iot', createProxyMiddleware({
  target: process.env.IOT_SERVICE_URL,
  changeOrigin: true,
  secure: false, // Allows HTTPS with self-signed certs
  pathRewrite: { '^/api/iot': '' },
  onProxyReq: (proxyReq, req) => {
    proxyReq.setHeader('x-gateway', 'API Gateway');
  }
}));

module.exports = router;
