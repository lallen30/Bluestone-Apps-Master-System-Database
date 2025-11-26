const express = require('express');
const router = express.Router();
const appController = require('../controllers/appController');
const { authenticate, isMasterAdmin, hasAppAccess, hasPermission } = require('../middleware/auth');
const {
  validateAppCreation,
  validateAppUpdate,
  validateId
} = require('../middleware/validator');

// Get app by domain (no auth required for login page)
router.get('/by-domain/:domain', appController.getAppByDomain);

// All routes below require authentication
router.use(authenticate);

// Get all apps (user sees only their assigned apps unless Master Admin)
router.get('/', appController.getAllApps);

// Get app by ID
router.get('/:id', validateId, hasAppAccess, appController.getAppById);

// Create new app (Master Admin only)
router.post('/', isMasterAdmin, validateAppCreation, appController.createApp);

// Update app (Master Admin or Admin with manage_settings permission)
router.put('/:id',
  validateId,
  hasAppAccess,
  hasPermission('can_manage_settings'),
  validateAppUpdate,
  appController.updateApp
);

// Delete app (Master Admin only)
router.delete('/:id', validateId, isMasterAdmin, appController.deleteApp);

// Get app settings
router.get('/:id/settings', validateId, hasAppAccess, appController.getAppSettings);

// Update app settings (requires can_manage_settings permission)
router.put('/:id/settings',
  validateId,
  hasAppAccess,
  hasPermission('can_manage_settings'),
  appController.updateAppSettings
);

// Set home screen for app
router.put('/:id/home-screen',
  validateId,
  hasAppAccess,
  hasPermission('can_manage_settings'),
  appController.setHomeScreen
);

module.exports = router;
