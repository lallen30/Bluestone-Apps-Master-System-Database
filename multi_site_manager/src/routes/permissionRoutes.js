const express = require('express');
const router = express.Router();
const permissionController = require('../controllers/permissionController');
const { authenticate, isAdmin, hasAppAccess, hasPermission } = require('../middleware/auth');
const { validatePermissionAssignment } = require('../middleware/validator');

// All routes require authentication and at least Admin role
router.use(authenticate);
router.use(isAdmin);

// Assign user to app with permissions
router.post('/', validatePermissionAssignment, permissionController.assignUserToApp);

// Update user permissions for a app
router.put('/:user_id/:app_id', permissionController.updateUserPermissions);

// Remove user from app
router.delete('/:user_id/:app_id', permissionController.removeUserFromApp);

// Get all permissions for a user
router.get('/user/:user_id', permissionController.getUserPermissions);

// Get all users for a app
router.get('/app/:app_id', permissionController.getAppUsers);

module.exports = router;
