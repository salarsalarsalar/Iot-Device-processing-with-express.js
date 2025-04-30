require('dotenv').config();
const express = require('express');
const fs = require('fs');
const https = require('https');
const cors = require('cors');
const path = require('path');
const gatewayRoutes = require('./routes/gatewayRoutes');
const logService = require('./middleware/logService');
const {logger} = require('./middleware/logger');
const bodyParser = require('body-parser');
const { notFound } = require('./middleware/notFound');
const helmet = require('helmet');

const app = express();

// Middleware
app.use(bodyParser.json()); // Parse incoming JSON requests
app.use(cors()); // allows cross origin resource sharing
app.use(logger); // shows logs from gateway
app.use(logService); // shows logs related to services
app.use(helmet()); // secure HTTP headers
// routes
app.use('/', gatewayRoutes);


app.use(notFound);
// SSL options
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, 'cert', 'server.key')),
  cert: fs.readFileSync(path.join(__dirname, 'cert', 'server.cert'))
};

// Start HTTPS server
https.createServer(sslOptions, app).listen(process.env.GATEWAY_PORT, () => {
  console.log(`HTTPS API Gateway running at https://localhost:${process.env.GATEWAY_PORT}`);
});
