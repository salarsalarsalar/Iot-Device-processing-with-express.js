// @file iot-service/routes/iotRoutes.js
// @description Routes for IoT Service
const express = require('express');
const router = express.Router();
const iotController = require('../controllers/iotController');
const multer = require('multer');
const path = require('path');

// Configure multer storage
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// Welcome route
router.get('/home', iotController.welcome);

// Device Management Routes
router.get('/devices', iotController.getDevices);
router.get('/devices/:device_id', iotController.getDevice);
router.post('/devices', iotController.createDevice);
router.put('/devices/:device_id', iotController.updateDevice);
router.delete('/devices/:device_id', iotController.deleteDevice);

// IoT Data Management Routes
router.get('/data/recent', iotController.getRecentData); // Move before specific ID route
router.get('/data/stats', iotController.getStats); // Add stats route
router.get('/data', iotController.getAllData);
router.get('/data/:id', iotController.getDataById);
router.post('/data', iotController.insertData);
router.put('/data/:id', iotController.updateData);
router.delete('/data/:id', iotController.deleteData);

// File Upload Route
router.post('/upload', upload.single('file'), iotController.uploadCSV);

// WebSocket Data Route
router.post('/stream', iotController.createData);

module.exports = router;