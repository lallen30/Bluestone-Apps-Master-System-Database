const express = require('express');
const router = express.Router();
const mobileAuthController = require('../controllers/mobileAuthController');
const { authenticateMobileUser } = require('../middleware/mobileAuth');

/**
 * @route   POST /api/mobile/auth/register
 * @desc    Register a new mobile app user
 * @access  Public
 */
router.post('/register', mobileAuthController.register);

/**
 * @route   POST /api/mobile/auth/login
 * @desc    Login mobile app user
 * @access  Public
 */
router.post('/login', mobileAuthController.login);

/**
 * @route   POST /api/mobile/auth/logout
 * @desc    Logout mobile app user
 * @access  Public (but uses token if provided)
 */
router.post('/logout', mobileAuthController.logout);

/**
 * @route   POST /api/mobile/auth/verify-email
 * @desc    Verify email with token
 * @access  Public
 */
router.post('/verify-email', mobileAuthController.verifyEmail);

module.exports = router;
