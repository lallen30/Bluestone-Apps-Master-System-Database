const express = require('express');
const router = express.Router();
const {
  getAllAppTemplates,
  getAppTemplateById,
  createAppTemplate,
  updateAppTemplate,
  deleteAppTemplate,
  addScreenToTemplate,
  updateTemplateScreen,
  deleteTemplateScreen,
  addElementToTemplateScreen,
  deleteElementFromTemplateScreen,
  createAppFromTemplate
} = require('../controllers/appTemplatesController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Get all app templates
router.get('/', getAllAppTemplates);

// Get app template by ID
router.get('/:id', getAppTemplateById);

// Create new app template
router.post('/', createAppTemplate);

// Update app template
router.put('/:id', updateAppTemplate);

// Delete app template
router.delete('/:id', deleteAppTemplate);

// Add screen to template
router.post('/:templateId/screens', addScreenToTemplate);

// Update template screen
router.put('/:templateId/screens/:screenId', updateTemplateScreen);

// Delete template screen
router.delete('/:templateId/screens/:screenId', deleteTemplateScreen);

// Add element to template screen
router.post('/:templateId/screens/:screenId/elements', addElementToTemplateScreen);

// Delete element from template screen
router.delete('/:templateId/screens/:screenId/elements/:elementId', deleteElementFromTemplateScreen);

// Create app from template
router.post('/create-from-template', createAppFromTemplate);

module.exports = router;
