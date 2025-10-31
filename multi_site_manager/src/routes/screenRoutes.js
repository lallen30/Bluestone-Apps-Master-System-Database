const express = require('express');
const router = express.Router();
const screenController = require('../controllers/screenController');
const { authenticate, hasAppAccess, hasPermission } = require('../middleware/auth');
const { validateId } = require('../middleware/validator');

// All routes require authentication
router.use(authenticate);

// Get all screens for an app
router.get('/app/:app_id', hasAppAccess, screenController.getAppScreens);

// Get screen by ID
router.get('/:id', validateId, hasAppAccess, screenController.getScreenById);

// Create screen (requires edit permission)
router.post('/', hasAppAccess, hasPermission('can_edit'), screenController.createScreen);

// Update screen (requires edit permission)
router.put('/:id', validateId, hasAppAccess, hasPermission('can_edit'), screenController.updateScreen);

// Delete screen (requires delete permission)
router.delete('/:id', validateId, hasAppAccess, hasPermission('can_delete'), screenController.deleteScreen);

module.exports = router;
