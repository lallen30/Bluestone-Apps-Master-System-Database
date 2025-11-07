const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/mobileSettingsController');
const { authenticateMobileUser } = require('../middleware/mobileAuth');

/**
 * Mobile Settings Routes
 * All routes require authentication
 */

// General Settings
router.get('/', authenticateMobileUser, settingsController.getSettings);
router.put('/', authenticateMobileUser, settingsController.updateSettings);
router.post('/reset', authenticateMobileUser, settingsController.resetSettings);

// Notification Preferences
router.get('/notifications', authenticateMobileUser, settingsController.getNotificationPreferences);
router.put('/notifications', authenticateMobileUser, settingsController.updateNotificationPreferences);

// Privacy Settings
router.get('/privacy', authenticateMobileUser, settingsController.getPrivacySettings);
router.put('/privacy', authenticateMobileUser, settingsController.updatePrivacySettings);

// Custom Settings (app-specific)
router.get('/custom', authenticateMobileUser, settingsController.getCustomSettings);
router.put('/custom', authenticateMobileUser, settingsController.updateCustomSettings);

module.exports = router;
