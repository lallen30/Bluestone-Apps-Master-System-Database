const express = require('express');
const router = express.Router();
const mobileController = require('../controllers/mobileController');
const { authenticate } = require('../middleware/auth');

// All mobile routes require authentication
router.use(authenticate);

// Get all screens for an app (mobile)
router.get('/apps/:app_id/screens', mobileController.getAppScreens);

// Get screen content with elements (mobile)
router.get('/apps/:app_id/screens/:screen_id', mobileController.getScreenContent);

// Get screen by key (alternative lookup)
router.get('/apps/:app_id/screens/key/:screen_key', mobileController.getScreenByKey);

module.exports = router;
