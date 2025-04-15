const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const iotRoutes = require('./routes/iotRoutes');
const userRoutes = require('./routes/userRoutes'); 
const app = express();
const errorHandler = require('./middleware/error')
const fs = require('fs');
const https = require('https');

dotenv.config(); // Load .env variables

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Parse incoming JSON requests

// Routes
app.use('/api/iot', iotRoutes);
app.use('/api/user', userRoutes);

// Error Handling
app.use(errorHandler);

// SSL setup
const sslOptions = {
  key: fs.readFileSync('./cert/server.key'),
  cert: fs.readFileSync('./cert/server.cert')
};
// Start server
const PORT = process.env.PORT || 3000;
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`Secure server running on https://localhost:${PORT}`);
});

