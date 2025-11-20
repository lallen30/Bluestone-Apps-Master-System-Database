const db = require('../config/database');

/**
 * Get all roles for an app
 * GET /api/v1/apps/:appId/roles
 */
async function getAppRoles(req, res) {
  try {
    const { appId } = req.params;
    
    // Use app_roles (newer system) instead of user_roles
    const roles = await db.query(
      `SELECT r.*, 
        (SELECT COUNT(*) FROM app_user_role_assignments WHERE app_role_id = r.id) as user_count,
        (SELECT COUNT(*) FROM role_permission_assignments rpa 
         INNER JOIN user_roles ur ON rpa.role_id = ur.id 
         WHERE ur.app_id = r.app_id) as permission_count
       FROM app_roles r
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
    
    // Get role info from app_roles
    const roles = await db.query(
      'SELECT * FROM app_roles WHERE id = ? AND app_id = ?',
      [roleId, appId]
    );
    
    if (!roles || roles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }
    
    // Get role permissions (currently app_roles don't have direct permission assignments)
    // This would need to be implemented when we add permission support to app_roles
    // For now, return empty permissions array
    const permissions = [];
    
    // TODO: Implement app_role_permissions table and query
    // const permissions = await db.query(
    //   `SELECT p.* 
    //    FROM role_permissions p
    //    INNER JOIN app_role_permissions arp ON p.id = arp.permission_id
    //    WHERE arp.app_role_id = ?
    //    ORDER BY p.category, p.name`,
    //   [roleId]
    // );
    
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
    
    // Use app_roles instead of user_roles
    const roles = await db.query(
      `SELECT r.*, ura.assigned_at
       FROM app_roles r
       INNER JOIN app_user_role_assignments ura ON r.id = ura.app_role_id
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
    
    // Verify role exists and belongs to this app (use app_roles)
    const roles = await db.query(
      'SELECT id FROM app_roles WHERE id = ? AND app_id = ?',
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
      'SELECT id FROM app_user_role_assignments WHERE user_id = ? AND app_role_id = ?',
      [userId, role_id]
    );
    
    if (existing && existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Role already assigned to user'
      });
    }
    
    // Assign role (use app_role_id)
    await db.query(
      'INSERT INTO app_user_role_assignments (user_id, app_role_id, assigned_by) VALUES (?, ?, ?)',
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
    
    // Verify the role belongs to this app (use app_roles)
    const roles = await db.query(
      'SELECT id FROM app_roles WHERE id = ? AND app_id = ?',
      [roleId, appId]
    );
    
    if (!roles || roles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }
    
    // Remove role assignment (use app_role_id)
    const result = await db.query(
      'DELETE FROM app_user_role_assignments WHERE user_id = ? AND app_role_id = ?',
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
    
    // TODO: Implement permission checking for app_roles
    // Currently app_roles don't have direct permission assignments
    // This needs to be implemented when app_role_permissions table is created
    
    // For now, return false (no permissions assigned to app_roles yet)
    const hasPermission = false;
    
    // Future implementation:
    // const result = await db.query(
    //   `SELECT COUNT(*) as has_permission
    //    FROM app_user_role_assignments ura
    //    INNER JOIN app_role_permissions arp ON ura.app_role_id = arp.app_role_id
    //    INNER JOIN role_permissions p ON arp.permission_id = p.id
    //    INNER JOIN app_roles r ON ura.app_role_id = r.id
    //    WHERE ura.user_id = ? AND r.app_id = ? AND p.name = ?`,
    //   [userId, appId, permission]
    // );
    // const hasPermission = result && result[0] && result[0].has_permission > 0;
    
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

/**
 * Create a new role for an app
 * POST /api/v1/apps/:appId/roles
 */
async function createRole(req, res) {
  try {
    const { appId } = req.params;
    const { name, display_name, description, is_default = false } = req.body;
    
    if (!name || !display_name) {
      return res.status(400).json({
        success: false,
        message: 'Name and display name are required'
      });
    }
    
    // Check if role name already exists for this app
    const existing = await db.query(
      'SELECT id FROM app_roles WHERE app_id = ? AND name = ?',
      [appId, name]
    );
    
    if (existing && existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Role with this name already exists for this app'
      });
    }
    
    // Create role
    const result = await db.query(
      'INSERT INTO app_roles (app_id, name, display_name, description, is_default) VALUES (?, ?, ?, ?, ?)',
      [appId, name, display_name, description, is_default ? 1 : 0]
    );
    
    // Get created role
    const roles = await db.query(
      'SELECT * FROM app_roles WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json({
      success: true,
      message: 'Role created successfully',
      data: roles[0]
    });
    
  } catch (error) {
    console.error('Create role error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create role'
    });
  }
}

/**
 * Update a role
 * PUT /api/v1/apps/:appId/roles/:roleId
 */
async function updateRole(req, res) {
  try {
    const { appId, roleId } = req.params;
    const { name, display_name, description, is_default } = req.body;
    
    // Check if role exists
    const roles = await db.query(
      'SELECT id FROM app_roles WHERE id = ? AND app_id = ?',
      [roleId, appId]
    );
    
    if (!roles || roles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }
    
    // Check if new name conflicts with existing role
    if (name) {
      const existing = await db.query(
        'SELECT id FROM app_roles WHERE app_id = ? AND name = ? AND id != ?',
        [appId, name, roleId]
      );
      
      if (existing && existing.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Role with this name already exists'
        });
      }
    }
    
    // Build update query
    const updateFields = [];
    const updateValues = [];
    
    if (name !== undefined) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    if (display_name !== undefined) {
      updateFields.push('display_name = ?');
      updateValues.push(display_name);
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    if (is_default !== undefined) {
      updateFields.push('is_default = ?');
      updateValues.push(is_default ? 1 : 0);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }
    
    updateFields.push('updated_at = NOW()');
    updateValues.push(roleId, appId);
    
    await db.query(
      `UPDATE app_roles SET ${updateFields.join(', ')} WHERE id = ? AND app_id = ?`,
      updateValues
    );
    
    // Get updated role
    const updatedRoles = await db.query(
      'SELECT * FROM app_roles WHERE id = ?',
      [roleId]
    );
    
    res.json({
      success: true,
      message: 'Role updated successfully',
      data: updatedRoles[0]
    });
    
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update role'
    });
  }
}

/**
 * Delete a role
 * DELETE /api/v1/apps/:appId/roles/:roleId
 */
async function deleteRole(req, res) {
  try {
    const { appId, roleId } = req.params;
    
    // Check if role exists
    const roles = await db.query(
      'SELECT id, name FROM app_roles WHERE id = ? AND app_id = ?',
      [roleId, appId]
    );
    
    if (!roles || roles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }
    
    // Check if role is assigned to any users
    const assignments = await db.query(
      'SELECT COUNT(*) as count FROM app_user_role_assignments WHERE app_role_id = ?',
      [roleId]
    );
    
    if (assignments && assignments[0] && assignments[0].count > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete role. It is assigned to ${assignments[0].count} user(s). Please remove all user assignments first.`
      });
    }
    
    // Delete role (cascade will delete screen_role_access entries)
    await db.query(
      'DELETE FROM app_roles WHERE id = ? AND app_id = ?',
      [roleId, appId]
    );
    
    res.json({
      success: true,
      message: 'Role deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete role error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete role'
    });
  }
}

/**
 * Get screens assigned to a role
 * GET /api/v1/apps/:appId/roles/:roleId/screens
 */
async function getRoleScreens(req, res) {
  try {
    const { appId, roleId } = req.params;
    
    const screens = await db.query(
      `SELECT s.id, s.name, s.screen_key, s.description, s.icon, 
              asa.is_published, sra.can_access
       FROM app_screens s
       INNER JOIN app_screen_assignments asa ON s.id = asa.screen_id
       LEFT JOIN screen_role_access sra ON s.id = sra.screen_id AND sra.role_id = ? AND sra.app_id = ?
       WHERE asa.app_id = ?
       ORDER BY asa.display_order, s.name`,
      [roleId, appId, appId]
    );
    
    res.json({
      success: true,
      data: screens || []
    });
    
  } catch (error) {
    console.error('Get role screens error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch role screens'
    });
  }
}

/**
 * Assign screen to role
 * POST /api/v1/apps/:appId/roles/:roleId/screens
 */
async function assignScreenToRole(req, res) {
  try {
    const { appId, roleId } = req.params;
    const { screen_id, can_access = true } = req.body;
    
    if (!screen_id) {
      return res.status(400).json({
        success: false,
        message: 'Screen ID is required'
      });
    }
    
    // Verify role exists
    const roles = await db.query(
      'SELECT id FROM app_roles WHERE id = ? AND app_id = ?',
      [roleId, appId]
    );
    
    if (!roles || roles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }
    
    // Verify screen exists and belongs to this app
    const screens = await db.query(
      'SELECT s.id FROM app_screens s INNER JOIN app_screen_assignments asa ON s.id = asa.screen_id WHERE s.id = ? AND asa.app_id = ?',
      [screen_id, appId]
    );
    
    if (!screens || screens.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Screen not found or not assigned to this app'
      });
    }
    
    // Check if already assigned
    const existing = await db.query(
      'SELECT id FROM screen_role_access WHERE screen_id = ? AND role_id = ? AND app_id = ?',
      [screen_id, roleId, appId]
    );
    
    if (existing && existing.length > 0) {
      // Update existing
      await db.query(
        'UPDATE screen_role_access SET can_access = ? WHERE id = ?',
        [can_access ? 1 : 0, existing[0].id]
      );
    } else {
      // Create new
      await db.query(
        'INSERT INTO screen_role_access (screen_id, role_id, app_id, can_access) VALUES (?, ?, ?, ?)',
        [screen_id, roleId, appId, can_access ? 1 : 0]
      );
    }
    
    res.json({
      success: true,
      message: 'Screen access updated successfully'
    });
    
  } catch (error) {
    console.error('Assign screen to role error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to assign screen to role'
    });
  }
}

/**
 * Remove screen from role
 * DELETE /api/v1/apps/:appId/roles/:roleId/screens/:screenId
 */
async function removeScreenFromRole(req, res) {
  try {
    const { appId, roleId, screenId } = req.params;
    
    const result = await db.query(
      'DELETE FROM screen_role_access WHERE screen_id = ? AND role_id = ? AND app_id = ?',
      [screenId, roleId, appId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Screen access assignment not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Screen access removed successfully'
    });
    
  } catch (error) {
    console.error('Remove screen from role error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove screen from role'
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
  checkUserPermission,
  createRole,
  updateRole,
  deleteRole,
  getRoleScreens,
  assignScreenToRole,
  removeScreenFromRole
};
