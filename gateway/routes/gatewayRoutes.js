const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimiter = require('../middleware/rateLimiter');

const router = express.Router();

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
