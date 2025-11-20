const express = require('express');
const router = express.Router();
const rolesController = require('../controllers/rolesController');
const { authenticate } = require('../middleware/auth');

/**
 * @route   GET /api/v1/apps/:appId/roles
 * @desc    Get all roles for an app
 * @access  Private (Admin)
 */
router.get('/:appId/roles', authenticate, rolesController.getAppRoles);

/**
 * @route   POST /api/v1/apps/:appId/roles
 * @desc    Create a new role
 * @access  Private (Admin)
 */
router.post('/:appId/roles', authenticate, rolesController.createRole);

/**
 * @route   GET /api/v1/apps/:appId/roles/:roleId
 * @desc    Get role details with permissions
 * @access  Private (Admin)
 */
router.get('/:appId/roles/:roleId', authenticate, rolesController.getRoleDetails);

/**
 * @route   PUT /api/v1/apps/:appId/roles/:roleId
 * @desc    Update a role
 * @access  Private (Admin)
 */
router.put('/:appId/roles/:roleId', authenticate, rolesController.updateRole);

/**
 * @route   DELETE /api/v1/apps/:appId/roles/:roleId
 * @desc    Delete a role
 * @access  Private (Admin)
 */
router.delete('/:appId/roles/:roleId', authenticate, rolesController.deleteRole);

/**
 * @route   GET /api/v1/apps/:appId/roles/:roleId/screens
 * @desc    Get screens assigned to a role
 * @access  Private (Admin)
 */
router.get('/:appId/roles/:roleId/screens', authenticate, rolesController.getRoleScreens);

/**
 * @route   POST /api/v1/apps/:appId/roles/:roleId/screens
 * @desc    Assign screen to role
 * @access  Private (Admin)
 */
router.post('/:appId/roles/:roleId/screens', authenticate, rolesController.assignScreenToRole);

/**
 * @route   DELETE /api/v1/apps/:appId/roles/:roleId/screens/:screenId
 * @desc    Remove screen from role
 * @access  Private (Admin)
 */
router.delete('/:appId/roles/:roleId/screens/:screenId', authenticate, rolesController.removeScreenFromRole);

/**
 * @route   GET /api/v1/apps/:appId/users/:userId/roles
 * @desc    Get user's roles
 * @access  Private (Admin)
 */
router.get('/:appId/users/:userId/roles', authenticate, rolesController.getUserRoles);

/**
 * @route   POST /api/v1/apps/:appId/users/:userId/roles
 * @desc    Assign role to user
 * @access  Private (Admin)
 */
router.post('/:appId/users/:userId/roles', authenticate, rolesController.assignRoleToUser);

/**
 * @route   DELETE /api/v1/apps/:appId/users/:userId/roles/:roleId
 * @desc    Remove role from user
 * @access  Private (Admin)
 */
router.delete('/:appId/users/:userId/roles/:roleId', authenticate, rolesController.removeRoleFromUser);

/**
 * @route   GET /api/v1/permissions
 * @desc    Get all available permissions
 * @access  Private (Admin)
 */
router.get('/permissions', authenticate, rolesController.getAllPermissions);

/**
 * @route   GET /api/v1/apps/:appId/users/:userId/permissions/check
 * @desc    Check if user has specific permission
 * @access  Private (Admin)
 */
router.get('/:appId/users/:userId/permissions/check', authenticate, rolesController.checkUserPermission);

module.exports = router;
