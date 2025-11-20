const express = require('express');
const router = express.Router();
const { uploadFile } = require('../controllers/uploadController');
const { uploadImage } = require('../middleware/upload');
const { authenticateMobileUser } = require('../middleware/mobileAuth');

// Upload profile photo (mobile app)
// POST /api/v1/mobile/apps/:appId/upload/image
router.post('/apps/:appId/upload/image', 
  authenticateMobileUser({ required: false }),
  (req, res, next) => {
    // Add app_id to request body for multer middleware
    req.body.app_id = req.params.appId;
    next();
  },
  uploadImage.single('file'),
  uploadFile
);

module.exports = router;
