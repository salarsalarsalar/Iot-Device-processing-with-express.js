// imports of external libraries
const fs = require('fs');
const cors = require('cors');
const https = require("https");
const redis = require('redis');
const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');

// imports of files with project
const {logger} = require('./middleware/logger');
const iotRoutes = require('./routes/iotRoutes');
const {limiter} = require('./middleware/rateLimiter');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/error');
const {notFound} = require('./middleware/notFound');

const app = express(); // initialising express.js

// initialising environment variables

dotenv.config(); // Load .env variables
const PORT = process.env.PORT;

// Middleware Functions

app.use(bodyParser.json()); // Parse incoming JSON requests
app.use(cors()); // allows cross origin resource sharing
app.use(logger); // Logs GET,POST,DELETE,PUT
app.use(limiter); // applies rate limiting



// Routes
app.use('/api/iot', iotRoutes);
app.use('/api/user', userRoutes);

app.use(notFound);
// Error handling
app.use(errorHandler); // This must be at the end, prevents errors


// SSL Setup
const sslOptions = {
  key: fs.readFileSync('./cert/server.key'),
  cert: fs.readFileSync('./cert/server.cert')
};


// Start server using https
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`HTTPS Server running on https://localhost:${PORT}`);
});
