const express = require('express');
const router = express.Router();
const mobileProfileController = require('../controllers/mobileProfileController');
const { authenticateMobileUser } = require('../middleware/mobileAuth');

/**
 * @route   GET /api/v1/mobile/profile
 * @desc    Get current user's profile
 * @access  Private (Mobile User)
 */
router.get('/', authenticateMobileUser, mobileProfileController.getProfile);

/**
 * @route   PUT /api/v1/mobile/profile
 * @desc    Update current user's profile
 * @access  Private (Mobile User)
 */
router.put('/', authenticateMobileUser, mobileProfileController.updateProfile);

/**
 * @route   GET /api/v1/mobile/profile/permissions
 * @desc    Get current user's permissions
 * @access  Private (Mobile User)
 */
router.get('/permissions', authenticateMobileUser, mobileProfileController.getUserPermissionsEndpoint);

/**
 * @route   GET /api/v1/mobile/profile/:userId
 * @desc    Get another user's public profile
 * @access  Private (Mobile User)
 */
router.get('/:userId', authenticateMobileUser, mobileProfileController.getUserProfile);

module.exports = router;
