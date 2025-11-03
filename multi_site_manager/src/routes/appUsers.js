const express = require('express');
const router = express.Router();
const appUsersController = require('../controllers/appUsersController');
const { authenticate } = require('../middleware/auth');

/**
 * @route   GET /api/v1/apps/:appId/users/stats
 * @desc    Get app user statistics
 * @access  Private (Admin)
 */
router.get('/:appId/users/stats', authenticate, appUsersController.getAppUserStats);

/**
 * @route   GET /api/v1/apps/:appId/users
 * @desc    Get all users for an app
 * @access  Private (Admin)
 */
router.get('/:appId/users', authenticate, appUsersController.getAppUsers);

/**
 * @route   GET /api/v1/apps/:appId/users/:userId
 * @desc    Get single app user details
 * @access  Private (Admin)
 */
router.get('/:appId/users/:userId', authenticate, appUsersController.getAppUser);

/**
 * @route   PUT /api/v1/apps/:appId/users/:userId
 * @desc    Update app user
 * @access  Private (Admin)
 */
router.put('/:appId/users/:userId', authenticate, appUsersController.updateAppUser);

/**
 * @route   PUT /api/v1/apps/:appId/users/:userId/status
 * @desc    Update app user status
 * @access  Private (Admin)
 */
router.put('/:appId/users/:userId/status', authenticate, appUsersController.updateAppUserStatus);

/**
 * @route   DELETE /api/v1/apps/:appId/users/:userId
 * @desc    Delete app user
 * @access  Private (Admin)
 */
router.delete('/:appId/users/:userId', authenticate, appUsersController.deleteAppUser);

/**
 * @route   POST /api/v1/apps/:appId/users/:userId/resend-verification
 * @desc    Resend verification email
 * @access  Private (Admin)
 */
router.post('/:appId/users/:userId/resend-verification', authenticate, appUsersController.resendVerificationEmail);

module.exports = router;
