const express = require('express');
const router = express.Router();
const appScreenElementsController = require('../controllers/appScreenElementsController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Get all elements for an app's screen (master + overrides + custom)
router.get(
  '/apps/:appId/screens/:screenId/elements',
  appScreenElementsController.getAppScreenElements
);

// Create or update an override for a master element
router.put(
  '/apps/:appId/screens/:screenId/elements/:elementInstanceId/override',
  appScreenElementsController.createOrUpdateOverride
);

// Delete an override (revert to master)
router.delete(
  '/apps/:appId/elements/:elementInstanceId/override',
  appScreenElementsController.deleteOverride
);

// Add a custom element to an app's screen
router.post(
  '/apps/:appId/screens/:screenId/elements/custom',
  appScreenElementsController.addCustomElement
);

// Update a custom element
router.put(
  '/apps/:appId/elements/custom/:customElementId',
  appScreenElementsController.updateCustomElement
);

// Delete a custom element
router.delete(
  '/apps/:appId/elements/custom/:customElementId',
  appScreenElementsController.deleteCustomElement
);

module.exports = router;
