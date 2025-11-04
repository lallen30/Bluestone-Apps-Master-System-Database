const express = require('express');
const router = express.Router();
const {
  getAllAppTemplates,
  getAppTemplateById,
  createAppFromTemplate
} = require('../controllers/appTemplatesController');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Get all app templates
router.get('/', getAllAppTemplates);

// Get app template by ID
router.get('/:id', getAppTemplateById);

// Create app from template
router.post('/create-from-template', createAppFromTemplate);

module.exports = router;
