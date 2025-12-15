const express = require('express');
const router = express.Router();
const mobileScreensController = require('../controllers/mobileScreensController');
const { authenticateMobileUser } = require('../middleware/mobileAuth');

// Note: These endpoints use optional authentication
// If JWT token is provided, screens are filtered by user's role permissions
// Without token, all published screens are returned (for preview/demo)

/**
 * GET /api/v1/mobile/screens/home?domain=example.com
 * Compatibility endpoint: resolve app by domain then return home screen
 */
router.get('/screens/home',
  authenticateMobileUser({ required: false }),
  mobileScreensController.getHomeScreenByDomain
);

/**
 * GET /api/v1/mobile/apps/:appId/screens
 * Get all published screens for an app
 * Optional auth: Filters by user's role if authenticated
 */
router.get('/apps/:appId/screens', 
  authenticateMobileUser({ required: false }),
  mobileScreensController.getPublishedScreens
);

/**
 * GET /api/v1/mobile/apps/:appId/screens/:screenId
 * Get a specific screen with its elements
 * Optional auth: Checks role permission if authenticated
 */
router.get('/apps/:appId/screens/:screenId',
  authenticateMobileUser({ required: false }),
  mobileScreensController.getScreenWithElements
);

/**
 * POST /api/v1/mobile/apps/:appId/screens/:screenId/submit
 * Submit form data for a screen
 * Body: {
 *   submission_data: { field_key1: value1, field_key2: value2, ... },
 *   device_info: "iOS 15.0" // optional
 * }
 */
router.post('/apps/:appId/screens/:screenId/submit', 
  authenticateMobileUser({ required: false }), // Optional auth - captures user_id if logged in
  mobileScreensController.submitScreenData
);

/**
 * GET /api/v1/mobile/apps/:appId/menus
 * Get all menus for an app with their items
 * Returns all active menus (tabbar, sidebar_left, sidebar_right)
 */
router.get('/apps/:appId/menus',
  authenticateMobileUser({ required: false }),
  mobileScreensController.getAppMenus
);

/**
 * GET /api/v1/mobile/apps/:appId/screens/:screenId/menus
 * Get all menus assigned to a specific screen
 * Returns menus with their items that should display on this screen
 */
router.get('/apps/:appId/screens/:screenId/menus',
  authenticateMobileUser({ required: false }),
  mobileScreensController.getScreenMenus
);

/**
 * GET /api/v1/mobile/apps/:appId/forms/:formId/elements
 * Get form elements with app-specific overrides for mobile app
 * Optional auth: Returns all non-hidden elements
 */
router.get('/apps/:appId/forms/:formId/elements',
  authenticateMobileUser({ required: false }),
  mobileScreensController.getFormElements
);

/**
 * GET /api/v1/mobile/apps/:appId/home-screen
 * Get the default home screen ID for an app
 */
router.get('/apps/:appId/home-screen',
  authenticateMobileUser({ required: false }),
  mobileScreensController.getHomeScreen
);

module.exports = router;
