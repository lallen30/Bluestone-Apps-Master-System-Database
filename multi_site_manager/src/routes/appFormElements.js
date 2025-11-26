const express = require('express');
const router = express.Router();
const appFormElementsController = require('../controllers/appFormElementsController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Get form elements with app-specific overrides
router.get('/apps/:appId/forms/:formId/elements', appFormElementsController.getAppFormElements);

// Create or update form element override
router.post('/apps/:appId/forms/:formId/elements/:elementId/override', appFormElementsController.createOrUpdateOverride);
router.put('/apps/:appId/forms/:formId/elements/:elementId/override', appFormElementsController.createOrUpdateOverride);

// Toggle form element visibility
router.patch('/apps/:appId/forms/:formId/elements/:elementId/visibility', appFormElementsController.toggleVisibility);

// Delete form element override (revert to master)
router.delete('/apps/:appId/forms/:formId/elements/:elementId/override', appFormElementsController.deleteOverride);

module.exports = router;
