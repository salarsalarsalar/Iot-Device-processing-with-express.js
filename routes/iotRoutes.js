const express = require('express');
const router = express.Router();
const iotController = require('../controllers/iotController');
const multer = require('multer');
const path = require('path');

// Get all IoT data
router.get('/', iotController.getAllData);

// Get IoT data by ID
router.get('/:id', iotController.getDataById);

// Insert new IoT data (for CSV import or manual entry)
router.post('/', iotController.insertData);

// Update IoT data by ID
router.put('/:id', iotController.updateData);

// Delete IoT data by ID
router.delete('/:id', iotController.deleteData);

// Get all flow records from the database
router.get('/flows', iotController.getAllFlows);

// Get a specific flow record by ID
router.get('/flows/:id', iotController.getFlowById);

// Delete a specific flow record by ID
router.delete('/flows/:id', iotController.deleteFlowById);

// Get flows from the last 24 hours
router.get('/flows/recent', iotController.getRecentFlows);

// Get aggregated statistics (count, average, sum) of flow data
router.get('/flows/stats', iotController.getFlowStats);

// Get all flows related to a specific device (if `device_id` column is present)
router.get('/flows/device/:deviceId', iotController.getDeviceFlows);

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
});
const upload = multer({ storage });
router.post('/upload', upload.single('file'), iotController.uploadCSV);

module.exports = router;
