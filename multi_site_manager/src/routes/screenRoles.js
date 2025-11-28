const express = require('express');
const router = express.Router();
const screenRolesController = require('../controllers/screenRolesController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

/**
 * GET /api/v1/apps/:appId/roles
 * Get all roles for an app
 */
router.get('/apps/:appId/roles', screenRolesController.getAppRoles);

/**
 * POST /api/v1/apps/:appId/roles
 * Create a new role for an app
 */
router.post('/apps/:appId/roles', screenRolesController.createRole);

/**
 * GET /api/v1/apps/:appId/screens/:screenId/access
 * Get screen access settings (which roles can access this screen)
 */
router.get('/apps/:appId/screens/:screenId/access', screenRolesController.getScreenAccess);

/**
 * PUT /api/v1/apps/:appId/screens/:screenId/access
 * Update screen access for specific roles
 * Body: { role_ids: [1, 2, 3] }
 */
router.put('/apps/:appId/screens/:screenId/access', screenRolesController.updateScreenAccess);

/**
 * GET /api/v1/app-users/:userId/roles
 * Get user's assigned roles
 */
router.get('/app-users/:userId/roles', screenRolesController.getUserRoles);

/**
 * PUT /api/v1/app-users/:userId/roles
 * Update user's assigned roles
 * Body: { role_ids: [1, 2, 3] }
 */
router.put('/app-users/:userId/roles', screenRolesController.updateUserRoles);

/**
 * GET /api/v1/apps/:appId/role-home-screens
 * Get all role home screen assignments for an app
 */
router.get('/apps/:appId/role-home-screens', screenRolesController.getAllRoleHomeScreens);

/**
 * GET /api/v1/apps/:appId/roles/:roleId/home-screen
 * Get home screen for a specific role
 */
router.get('/apps/:appId/roles/:roleId/home-screen', screenRolesController.getRoleHomeScreen);

/**
 * PUT /api/v1/apps/:appId/roles/:roleId/home-screen
 * Set home screen for a specific role
 * Body: { screen_id: 123 } or { screen_id: null } to remove
 */
router.put('/apps/:appId/roles/:roleId/home-screen', screenRolesController.setRoleHomeScreen);

module.exports = router;
