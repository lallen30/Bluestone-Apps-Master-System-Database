const express = require('express');
const router = express.Router();
const { uploadFile, uploadMultipleFiles } = require('../controllers/uploadController');
const { uploadImage, uploadVideo, uploadMedia } = require('../middleware/upload');
const { authenticateMobileUser } = require('../middleware/mobileAuth');

// Upload single image (mobile app)
// POST /api/v1/mobile/apps/:appId/upload/image
router.post('/apps/:appId/upload/image', 
  authenticateMobileUser({ required: false }),
  (req, res, next) => {
    req.body.app_id = req.params.appId;
    next();
  },
  uploadImage.single('file'),
  uploadFile
);

// Upload single video (mobile app)
// POST /api/v1/mobile/apps/:appId/upload/video
router.post('/apps/:appId/upload/video', 
  authenticateMobileUser({ required: false }),
  (req, res, next) => {
    req.body.app_id = req.params.appId;
    next();
  },
  uploadVideo.single('file'),
  uploadFile
);

// Upload multiple media files (images and/or videos)
// POST /api/v1/mobile/apps/:appId/upload/media
router.post('/apps/:appId/upload/media', 
  authenticateMobileUser({ required: false }),
  (req, res, next) => {
    req.body.app_id = req.params.appId;
    next();
  },
  uploadMedia.array('files', 20), // Max 20 files at once
  uploadMultipleFiles
);

module.exports = router;
