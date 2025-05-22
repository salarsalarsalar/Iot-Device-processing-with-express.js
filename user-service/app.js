// imports of external libraries
const fs = require('fs');
const cors = require('cors');
const https = require("https");
const http = require('http');
const redis = require('redis');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const helmet = require('helmet');
const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const cluster = require('cluster');
const os = require('os');

// imports of files of project
const connectDB  = require('./config/database'); // MongoDB connection
const { logger } = require('./middleware/logger');
const { limiter } = require('./middleware/rateLimiter');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/error');
const { notFound } = require('./middleware/notFound');
const initKafka = require('./kafka/initKafka');
require('./kafka/consumer'); // Import the Kafka consumer


const app = express(); // initialising express.js


// initialising environment variables
dotenv.config(); // Load .env variables
const sharedEnv = dotenv.config({ path: '../.env' });
dotenvExpand.expand(sharedEnv); // Expand the shared .env variables

const PORT = process.env.USER_SERVICE_PORT || 3002; // Port for the User service
// Middleware Functions
app.use(bodyParser.json()); // Parse incoming JSON requests
app.use(cors()); // allows cross origin resource sharing
app.use(logger); // Logs GET,POST,DELETE,PUT
app.use(limiter); // applies rate limiting
app.use(helmet()); // protects against XSS and CSRF

// Kafka Producer Initialization
initKafka();

// MongoDB Connection
connectDB().then(() => {
    console.log('MongoDB connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the MongoDB database:', err);
    process.exit(1);
  });
  
// Routes
app.use('/', userRoutes);

// Handles undefined routes
app.use(notFound);

// Error handling (MUST BE AT THE END)
app.use(errorHandler); // you will run into errors if you don't put it at the end

if (process.env.NODE_ENV === 'production') {
  const sslOptions = {
    key: fs.readFileSync(path.join(__dirname, 'cert', 'server.key')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'server.cert')),
  };

  https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`Secure server running on https://localhost:${PORT}`);
  });
} else if (process.env.NODE_ENV !== 'test') {
  // For development & test (like GitHub Actions)
  http.createServer(app).listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
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
