// @file: iotRoutes.js
// @description: Routes for IoT device and data management
const express = require('express');
const router = express.Router();
const iotController = require('../controllers/iotController');
const multer = require('multer');
const path = require('path');
const { verifyToken } = require('../middleware/verifyToken');

// Welcome message
router.get('/home', iotController.welcome);

// Device Management Routes
router.get('/devices', iotController.getDevices);
router.get('/devices/:device_id', iotController.getDevice);
router.post('/devices', verifyToken, iotController.createDevice);
router.put('/devices/:device_id', verifyToken, iotController.updateDevice);
router.delete('/devices/:device_id', verifyToken, iotController.deleteDevice);

// IoT Data Management Routes
router.get('/data', iotController.getAllData);
router.get('/data/:id', iotController.getDataById);
router.post('/data', verifyToken, iotController.insertData);
router.put('/data/:id', verifyToken, iotController.updateData);
router.delete('/data/:id', verifyToken, iotController.deleteData);

// Recent Data and Statistics
router.get('/data/recent', iotController.getRecentData);

// CSV Upload
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });
router.post('/upload', verifyToken, upload.single('file'), iotController.uploadCSV);

module.exports = router;
