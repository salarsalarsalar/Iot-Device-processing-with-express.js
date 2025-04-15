const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const iotRoutes = require('./routes/iotRoutes');
const userRoutes = require('./routes/userRoutes'); 
const app = express();
const errorHandler = require('./middleware/error')

dotenv.config(); // Load .env variables

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Parse incoming JSON requests

// Routes
app.use('/api/iot', iotRoutes);
app.use('/api/user', userRoutes);

// Error Handling
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

