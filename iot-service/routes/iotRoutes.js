// @file: iotRoutes.js
// @description: Routes for IoT device and data management
const express = require('express');
const router = express.Router();
const iotController = require('../controllers/iotController');
const multer = require('multer');
const path = require('path');

// Welcome message
router.get('/home', iotController.welcome);

// Device Management Routes
router.get('/devices', iotController.getDevices);
router.get('/devices/:device_id', iotController.getDevice);
router.post('/devices', iotController.createDevice);
router.put('/devices/:device_id', iotController.updateDevice);
router.delete('/devices/:device_id', iotController.deleteDevice);

// IoT Data Management Routes
router.get('/data', iotController.getAllData);
router.get('/data/:id', iotController.getDataById);
router.post('/data', iotController.insertData);
router.put('/data/:id', iotController.updateData);
router.delete('/data/:id', iotController.deleteData);

// Recent Data and Statistics
router.get('/data/recent', iotController.getRecentData);


// Post Data through WebSocket
router.post('/create',iotController.createData);

// CSV Upload
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });
router.post('/upload', upload.single('file'), iotController.uploadCSV);

module.exports = router;
