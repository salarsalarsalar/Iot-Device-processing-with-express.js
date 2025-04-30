const express = require('express');
const router = express.Router();
const iotController = require('../controllers/iotController.js');
const multer = require('multer');
const path = require('path');
const redis = require('redis');

/* 
  CRUD Operations
*/

// Get aggregated statistics (count, average, sum) of flow data
router.get('/stats', iotController.getDeviceStats);


// Get all data
router.get('/', iotController.getAllData);

// Get/Retrieve data by ID
router.get('/:id',  iotController.getDataById);

// Insert new data 
router.post('/', iotController.insertData);

// Update data by ID
router.put('/:id', iotController.updateData);

// Delete data by ID
router.delete('/:id', iotController.deleteByID);


/* 
  Additional Operations
*/

// Get flows from the last 24 hours
router.get('/recent', iotController.getRecentDevice);



// Upload CSV
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
});

const upload = multer({ storage });
router.post('/upload', upload.single('file'), iotController.uploadCSV);

module.exports = router;
