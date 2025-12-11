const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { authenticateMobileUser } = require('../middleware/mobileAuth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for avatar uploads
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save to uploads/avatars (same folder served by express.static)
    const uploadDir = path.join(__dirname, '../../uploads/avatars');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${req.user?.id || 'unknown'}-${uniqueSuffix}${ext}`);
  }
});

const avatarUpload = multer({
  storage: avatarStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'));
    }
  }
});

// All routes require authentication

/**
 * GET /api/v1/apps/:appId/profile
 * Get current user's profile
 */
router.get(
  '/apps/:appId/profile',
  authenticateMobileUser({ required: true }),
  profileController.getProfile
);

/**
 * PUT /api/v1/apps/:appId/profile
 * Update current user's profile
 */
router.put(
  '/apps/:appId/profile',
  authenticateMobileUser({ required: true }),
  profileController.updateProfile
);

/**
 * POST /api/v1/apps/:appId/profile/avatar
 * Upload avatar
 */
router.post(
  '/apps/:appId/profile/avatar',
  authenticateMobileUser({ required: true }),
  avatarUpload.single('avatar'),
  profileController.uploadAvatar
);

/**
 * DELETE /api/v1/apps/:appId/profile/avatar
 * Delete avatar
 */
router.delete(
  '/apps/:appId/profile/avatar',
  authenticateMobileUser({ required: true }),
  profileController.deleteAvatar
);

/**
 * PUT /api/v1/apps/:appId/profile/password
 * Change password
 */
router.put(
  '/apps/:appId/profile/password',
  authenticateMobileUser({ required: true }),
  profileController.changePassword
);

module.exports = router;
