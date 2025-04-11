const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const iotRoutes = require('./routes/iotRoutes');
const app = express();

dotenv.config(); // Load .env variables

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Parse incoming JSON requests

// Routes
app.use('/api/iot', iotRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
