const express = require('express');
const router = express.Router();
const modulesController = require('../controllers/modulesController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Get all modules
router.get('/', modulesController.getAllModules);

// Get a single module
router.get('/:moduleId', modulesController.getModuleById);

// Assign a module to a screen
router.post('/screens/:screenId/assign', modulesController.assignModuleToScreen);

// Get modules assigned to a screen
router.get('/screens/:screenId', modulesController.getScreenModules);

// Remove a module from a screen
router.delete('/screens/:screenId/modules/:moduleId', modulesController.removeModuleFromScreen);

module.exports = router;
