// imports of external libraries
const fs = require('fs');
const cors = require('cors');
const https = require("https");
const redis = require('redis');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const helmet = require('helmet');
const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const cluster = require('cluster');
const os = require('os');
const WebSocket = require('ws');

// imports of files of project
const { logger } = require('./middleware/logger');
const CronLogger = require('./utils/cronLogger');
const iotRoutes = require('./routes/iotRoutes');
const { limiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/error');
const { notFound } = require('./middleware/notFound');
const setupWebSocket = require('./webSocket/webSocket'); 
const { startConsumer } = require('./utils/rabbitConsumer'); 
const connectDB = require('./config/database'); // MongoDB connection
const app = express(); // initialising express.js

// initialising environment variables
dotenv.config(); // Load .env variables
const sharedEnv = dotenv.config({ path: '../.env' });
dotenvExpand.expand(sharedEnv); // Expand the shared .env variables

const PORT = process.env.IOT_SERVICE_PORT;

// Middleware Functions
app.use(bodyParser.json()); // Parse incoming JSON requests
app.use(cors()); // allows cross origin resource sharing
app.use(logger); // Logs GET,POST,DELETE,PUT
app.use(limiter); // applies rate limiting
app.use(helmet()); // protects against XSS and CSRF


// Routes
app.use('/', iotRoutes);
// app.use('/api/user', userRoutes);

// Rabbit MQ Consumer
startConsumer(); // Start the RabbitMQ consumer

// MongoDB Connection
connectDB().then(() => {
    console.log('MongoDB connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the MongoDB database:', err);
    process.exit(1);
  });
// Handles undefined routes
app.use(notFound);

// Error handling (MUST BE AT THE END)
app.use(errorHandler); // you will run into errors if you don't put it at the end

let server;

if (ENV === 'production') {
  // Use HTTPS with real certs
  const sslOptions = {
    key: fs.readFileSync(path.join(__dirname, 'cert', 'server.key')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'server.cert')),
  };
  server = https.createServer(sslOptions, app);
  console.log('Using HTTPS server with SSL certs');
} else {
  // Use HTTP for local dev and CI
  server = http.createServer(app);
  console.log('Using HTTP server (no SSL)');
}

// WebSocket server
const wss = new WebSocket.Server({ server });
setupWebSocket(wss);

// Start server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`${ENV.toUpperCase()} Server running on http${ENV === 'production' ? 's' : ''}://localhost:${PORT}`);
  CronLogger('iot-service', '*/5 * * * *'); // Log every 5 minutes
});


// // Clustering logic
// const numCPUs = os.cpus().length; // Number of CPU cores

// if (cluster.isMaster) {
//   console.log(`Master process started with PID ${process.pid}`);
  
//   // Fork workers for each CPU core
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();  // Create worker processes
//   }

//   // When a worker dies, log it
//   cluster.on('exit', (worker, code, signal) => {
//     console.log(`Worker ${worker.process.pid} died`);
//   });

// } else {
//   // Workers run the HTTPS server
//   https.createServer(sslOptions, app).listen(PORT, () => {
//     console.log(`HTTPS Server running on https://localhost:${PORT} (Worker ${process.pid})`);
//   });
// }
