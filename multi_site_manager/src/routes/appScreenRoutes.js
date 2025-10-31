const express = require('express');
const router = express.Router();
const appScreenController = require('../controllers/appScreenController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Screen management routes
router.get('/', appScreenController.getAllScreens);
router.get('/:id', appScreenController.getScreenById);
router.post('/', appScreenController.createScreen);
router.put('/:id', appScreenController.updateScreen);
router.delete('/:id', appScreenController.deleteScreen);

// Screen element instance routes
router.post('/elements', appScreenController.addElementToScreen);
router.put('/elements/:id', appScreenController.updateElementInstance);
router.delete('/elements/:id', appScreenController.deleteElementFromScreen);

// App-specific screen routes
router.get('/app/:app_id', appScreenController.getAppScreens);
router.post('/app/assign', appScreenController.assignScreenToApp);
router.delete('/app/:app_id/:screen_id', appScreenController.unassignScreenFromApp);

// App screen content routes
router.get('/app/:app_id/screen/:screen_id', appScreenController.getAppScreenContent);
router.post('/app/content', appScreenController.updateAppScreenContent);

module.exports = router;
