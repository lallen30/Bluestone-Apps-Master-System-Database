const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Template routes
router.get('/', templateController.getAllTemplates);
router.get('/:id', templateController.getTemplateById);
router.post('/create-from-template', templateController.createScreenFromTemplate);
router.post('/clone/:screen_id', templateController.cloneScreen);

module.exports = router;
