const db = require('../config/database');

/**
 * Get all roles for an app
 * GET /api/v1/apps/:appId/roles
 */
async function getAppRoles(req, res) {
  try {
    const { appId } = req.params;
    
    const roles = await db.query(
      `SELECT r.*, 
        (SELECT COUNT(*) FROM app_user_role_assignments WHERE role_id = r.id) as user_count,
        (SELECT COUNT(*) FROM role_permission_assignments WHERE role_id = r.id) as permission_count
       FROM user_roles r
       WHERE r.app_id = ?
       ORDER BY r.is_default DESC, r.name ASC`,
      [appId]
    );
    
    res.json({
      success: true,
      data: roles
    });
    
  } catch (error) {
    console.error('Get app roles error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch roles'
    });
  }
}

/**
 * Get role details with permissions
 * GET /api/v1/apps/:appId/roles/:roleId
 */
async function getRoleDetails(req, res) {
  try {
    const { appId, roleId } = req.params;
    
    // Get role info
    const roles = await db.query(
      'SELECT * FROM user_roles WHERE id = ? AND app_id = ?',
      [roleId, appId]
    );
    
    if (!roles || roles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }
    
    // Get role permissions
    const permissions = await db.query(
      `SELECT p.* 
       FROM role_permissions p
       INNER JOIN role_permission_assignments rpa ON p.id = rpa.permission_id
       WHERE rpa.role_id = ?
       ORDER BY p.category, p.name`,
      [roleId]
    );
    
    res.json({
      success: true,
      data: {
        ...roles[0],
        permissions: permissions || []
      }
    });
    
  } catch (error) {
    console.error('Get role details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch role details'
    });
  }
}

/**
 * Get user's roles
 * GET /api/v1/apps/:appId/users/:userId/roles
 */
async function getUserRoles(req, res) {
  try {
    const { appId, userId } = req.params;
    
    const roles = await db.query(
      `SELECT r.*, ura.assigned_at
       FROM user_roles r
       INNER JOIN app_user_role_assignments ura ON r.id = ura.role_id
       WHERE ura.user_id = ? AND r.app_id = ?
       ORDER BY r.name`,
      [userId, appId]
    );
    
    res.json({
      success: true,
      data: roles || []
    });
    
  } catch (error) {
    console.error('Get user roles error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user roles'
    });
  }
}

/**
 * Assign role to user
 * POST /api/v1/apps/:appId/users/:userId/roles
 */
async function assignRoleToUser(req, res) {
  try {
    const { appId, userId } = req.params;
    const { role_id } = req.body;
    
    if (!role_id) {
      return res.status(400).json({
        success: false,
        message: 'Role ID is required'
      });
    }
    
    // Verify user exists
    const users = await db.query(
      'SELECT id FROM app_users WHERE id = ? AND app_id = ?',
      [userId, appId]
    );
    
    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Verify role exists and belongs to this app
    const roles = await db.query(
      'SELECT id FROM user_roles WHERE id = ? AND app_id = ?',
      [role_id, appId]
    );
    
    if (!roles || roles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }
    
    // Check if already assigned
    const existing = await db.query(
      'SELECT id FROM app_user_role_assignments WHERE user_id = ? AND role_id = ?',
      [userId, role_id]
    );
    
    if (existing && existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Role already assigned to user'
      });
    }
    
    // Assign role
    await db.query(
      'INSERT INTO app_user_role_assignments (user_id, role_id, assigned_by) VALUES (?, ?, ?)',
      [userId, role_id, req.user?.id || null]
    );
    
    res.json({
      success: true,
      message: 'Role assigned successfully'
    });
    
  } catch (error) {
    console.error('Assign role error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to assign role'
    });
  }
}

/**
 * Remove role from user
 * DELETE /api/v1/apps/:appId/users/:userId/roles/:roleId
 */
async function removeRoleFromUser(req, res) {
  try {
    const { appId, userId, roleId } = req.params;
    
    // Verify the role belongs to this app
    const roles = await db.query(
      'SELECT id FROM user_roles WHERE id = ? AND app_id = ?',
      [roleId, appId]
    );
    
    if (!roles || roles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }
    
    // Remove role assignment
    const result = await db.query(
      'DELETE FROM app_user_role_assignments WHERE user_id = ? AND role_id = ?',
      [userId, roleId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Role assignment not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Role removed successfully'
    });
    
  } catch (error) {
    console.error('Remove role error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove role'
    });
  }
}

/**
 * Get all available permissions
 * GET /api/v1/permissions
 */
async function getAllPermissions(req, res) {
  try {
    const permissions = await db.query(
      'SELECT * FROM role_permissions ORDER BY category, name'
    );
    
    // Group by category
    const grouped = {};
    (permissions || []).forEach(perm => {
      const category = perm.category || 'other';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(perm);
    });
    
    res.json({
      success: true,
      data: {
        all: permissions || [],
        byCategory: grouped
      }
    });
    
  } catch (error) {
    console.error('Get permissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch permissions'
    });
  }
}

/**
 * Check if user has permission
 * GET /api/v1/apps/:appId/users/:userId/permissions/check
 */
async function checkUserPermission(req, res) {
  try {
    const { appId, userId } = req.params;
    const { permission } = req.query;
    
    if (!permission) {
      return res.status(400).json({
        success: false,
        message: 'Permission name is required'
      });
    }
    
    const result = await db.query(
      `SELECT COUNT(*) as has_permission
       FROM app_user_role_assignments ura
       INNER JOIN role_permission_assignments rpa ON ura.role_id = rpa.role_id
       INNER JOIN role_permissions p ON rpa.permission_id = p.id
       INNER JOIN user_roles r ON ura.role_id = r.id
       WHERE ura.user_id = ? AND r.app_id = ? AND p.name = ?`,
      [userId, appId, permission]
    );
    
    const hasPermission = result && result[0] && result[0].has_permission > 0;
    
    res.json({
      success: true,
      data: {
        permission,
        hasPermission
      }
    });
    
  } catch (error) {
    console.error('Check permission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check permission'
    });
  }
}

module.exports = {
  getAppRoles,
  getRoleDetails,
  getUserRoles,
  assignRoleToUser,
  removeRoleFromUser,
  getAllPermissions,
  checkUserPermission
};
