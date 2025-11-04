const express = require('express');
const router = express.Router();
const {
  getAllAppTemplates,
  getAppTemplateById,
  createAppTemplate,
  updateAppTemplate,
  deleteAppTemplate,
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

// Create app from template
router.post('/create-from-template', createAppFromTemplate);

module.exports = router;
