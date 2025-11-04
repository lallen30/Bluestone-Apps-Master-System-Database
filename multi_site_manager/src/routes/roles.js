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
 * @route   GET /api/v1/apps/:appId/roles/:roleId
 * @desc    Get role details with permissions
 * @access  Private (Admin)
 */
router.get('/:appId/roles/:roleId', authenticate, rolesController.getRoleDetails);

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
