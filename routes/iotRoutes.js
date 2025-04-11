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

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
});
const upload = multer({ storage });
router.post('/upload', upload.single('file'), iotController.uploadCSV);

module.exports = router;
