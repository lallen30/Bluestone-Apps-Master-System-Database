const express = require('express');
const router = express.Router();
const permissionController = require('../controllers/permissionController');
const { authenticate, isAdmin, hasAppAccess, hasPermission } = require('../middleware/auth');
const { validatePermissionAssignment } = require('../middleware/validator');
const db = require('../config/database');

// All routes require authentication
router.use(authenticate);

// Helper: Check if user can manage admins for a specific app
const canManageAppAdmins = async (req, res, next) => {
  const appId = parseInt(req.params.app_id);
  const userId = req.user.id;
  
  // Master Admin or Admin role always has access
  if (req.user.role_level <= 2) {
    return next();
  }
  
  // Check if user has can_manage_admins permission for this app
  try {
    const result = await db.query(
      'SELECT can_manage_admins FROM user_app_permissions WHERE user_id = ? AND app_id = ?',
      [userId, appId]
    );
    const perms = Array.isArray(result) && Array.isArray(result[0]) ? result[0] : result;
    
    if (perms && perms.length > 0 && perms[0].can_manage_admins) {
      return next();
    }
  } catch (e) {
    console.error('Error checking app admin permissions:', e);
  }
  
  return res.status(403).json({
    success: false,
    message: 'Access denied. You do not have permission to manage administrators for this app.'
  });
};

// Get all permissions for a user - allow users to fetch their own permissions
router.get('/user/:user_id', (req, res, next) => {
  // Allow users to fetch their own permissions, or admins to fetch anyone's
  if (req.user.id === parseInt(req.params.user_id) || req.user.role_level <= 2) {
    return permissionController.getUserPermissions(req, res, next);
  }
  return res.status(403).json({
    success: false,
    message: 'Access denied. You can only view your own permissions.'
  });
});

// Get all users for a app - allow users with can_manage_admins permission
router.get('/app/:app_id', canManageAppAdmins, permissionController.getAppUsers);

// Routes below require global Admin role
// Assign user to app with permissions
router.post('/', isAdmin, validatePermissionAssignment, permissionController.assignUserToApp);

// Update user permissions for a app
router.put('/:user_id/:app_id', isAdmin, permissionController.updateUserPermissions);

// Remove user from app
router.delete('/:user_id/:app_id', isAdmin, permissionController.removeUserFromApp);

module.exports = router;
