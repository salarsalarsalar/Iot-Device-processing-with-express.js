const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const express = require('express');
const fs = require('fs');
const https = require('https');
const cors = require('cors');
const path = require('path');
const gatewayRoutes = require('./routes/gatewayRoutes');
const logService = require('./middleware/logService');
const { logger } = require('./middleware/logger');
const bodyParser = require('body-parser');
const { notFound } = require('./middleware/notFound');
const helmet = require('helmet');
const app = express();

// Load shared .env file first
const sharedEnv = dotenv.config({ path: '../.env' });
dotenvExpand.expand(sharedEnv); // Expand shared variables

// Load service-specific .env file
const serviceEnv = dotenv.config();
dotenvExpand.expand(serviceEnv); // Expand service-specific variables

// Debugging to ensure variables are loaded
console.log('USER_SERVICE_URL:', process.env.USER_SERVICE_URL);
console.log('IOT_SERVICE_URL:', process.env.IOT_SERVICE_URL);

const GATEWAY_PORT = process.env.GATEWAY_PORT;
const GATEWAY_URL = process.env.API_GATEWAY_URL;

// Middleware
app.use(bodyParser.json()); // Parse incoming JSON requests
app.use(cors()); // Allows cross-origin resource sharing
app.use(logger); // Logs from gateway
app.use(logService); // Logs related to services
app.use(helmet()); // Secure HTTP headers

// Routes
app.use('/', gatewayRoutes);

app.use(notFound);

// SSL options
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, 'cert', 'server.key')),
  cert: fs.readFileSync(path.join(__dirname, 'cert', 'server.cert')),
};

// Start HTTPS server
https.createServer(sslOptions, app).listen(GATEWAY_PORT, () => {
  console.log(`HTTPS API Gateway running at ${GATEWAY_URL}`);
});
