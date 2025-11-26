const express = require('express');
const router = express.Router();
const appFormsController = require('../controllers/appFormsController');
const { authenticate } = require('../middleware/auth');

// All routes require admin authentication
router.use(authenticate);

// Master forms management
router.get('/forms', appFormsController.getForms);
router.get('/forms/:formId', appFormsController.getFormById);
router.post('/forms', appFormsController.createForm);
router.put('/forms/:formId', appFormsController.updateForm);
router.delete('/forms/:formId', appFormsController.deleteForm);

// Form elements management
router.post('/forms/:formId/elements', appFormsController.addFormElement);
router.put('/forms/:formId/elements/:elementId', appFormsController.updateFormElement);
router.delete('/forms/:formId/elements/:elementId', appFormsController.deleteFormElement);

// Available elements registry
router.get('/elements/available-for-forms', appFormsController.getAvailableElements);

module.exports = router;
