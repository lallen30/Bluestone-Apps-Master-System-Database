const express = require('express');
const router = express.Router();
const { uploadFile, deleteFile } = require('../controllers/uploadController');
const { uploadImage, uploadFile: uploadFileMiddleware } = require('../middleware/upload');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Upload image
router.post('/image', uploadImage.single('file'), uploadFile);

// Upload any file
router.post('/file', uploadFileMiddleware.single('file'), uploadFile);

// Delete file
router.delete('/:filename', deleteFile);

module.exports = router;
