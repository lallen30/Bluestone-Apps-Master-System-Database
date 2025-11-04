const { query, queryOne } = require('../config/database');

// Assign user to app with permissions
const assignUserToApp = async (req, res) => {
  try {
    const {
      user_id,
      app_id,
      can_view = true,
      can_edit = false,
      can_delete = false,
      can_publish = false,
      can_manage_users = false,
      can_manage_settings = false,
      custom_permissions = null
    } = req.body;

    // Check if user exists
    const user = await queryOne('SELECT * FROM users WHERE id = ?', [user_id]);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if app exists
    const app = await queryOne('SELECT * FROM apps WHERE id = ?', [app_id]);
    if (!app) {
      return res.status(404).json({
        success: false,
        message: 'App not found'
      });
    }

    // Check if permission already exists
    const existing = await queryOne(
      'SELECT * FROM user_app_permissions WHERE user_id = ? AND app_id = ?',
      [user_id, app_id]
    );

    if (existing) {
      // Update existing permission
      await query(
        `UPDATE user_app_permissions 
         SET can_view = ?, can_edit = ?, can_delete = ?, can_publish = ?,
             can_manage_users = ?, can_manage_settings = ?, custom_permissions = ?
         WHERE user_id = ? AND app_id = ?`,
        [can_view, can_edit, can_delete, can_publish,
         can_manage_users, can_manage_settings,
         custom_permissions ? JSON.stringify(custom_permissions) : null,
         user_id, app_id]
      );
    } else {
      // Create new permission
      await query(
        `INSERT INTO user_app_permissions 
         (user_id, app_id, can_view, can_edit, can_delete, can_publish, 
          can_manage_users, can_manage_settings, custom_permissions, granted_by) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [user_id, app_id, can_view, can_edit, can_delete, can_publish,
         can_manage_users, can_manage_settings, 
         custom_permissions ? JSON.stringify(custom_permissions) : null,
         req.user.id]
      );
    }

    // Log activity
    await query(
      `INSERT INTO activity_logs (user_id, app_id, action, description, ip_address) 
       VALUES (?, ?, 'permission.assign', ?, ?)`,
      [req.user.id, app_id, `Assigned user ${user_id} to app ${app_id}`, req.ip]
    );

    res.status(201).json({
      success: true,
      message: 'User assigned to app successfully'
    });
  } catch (error) {
    console.error('Assign user to app error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to assign user to app',
      error: error.message
    });
  }
};

// Update user permissions for a app
const updateUserPermissions = async (req, res) => {
  try {
    const { user_id, app_id } = req.params;
    const updates = req.body;

    // Check if permission exists
    const permission = await queryOne(
      'SELECT * FROM user_app_permissions WHERE user_id = ? AND app_id = ?',
      [user_id, app_id]
    );

    // If permission doesn't exist, create it first
    if (!permission) {
      await query(
        `INSERT INTO user_app_permissions (user_id, app_id, can_view, can_edit, can_delete, can_publish, can_manage_users, can_manage_settings)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user_id,
          app_id,
          updates.can_view || false,
          updates.can_edit || false,
          updates.can_delete || false,
          updates.can_publish || false,
          updates.can_manage_users || false,
          updates.can_manage_settings || false
        ]
      );
      
      // Get the newly created permission
      const newPermission = await queryOne(
        'SELECT * FROM user_app_permissions WHERE user_id = ? AND app_id = ?',
        [user_id, app_id]
      );
      
      return res.json({
        success: true,
        message: 'Permissions created successfully',
        data: newPermission
      });
    }

    // Build update query
    const fields = [];
    const values = [];

    const allowedFields = [
      'can_view', 'can_edit', 'can_delete', 'can_publish',
      'can_manage_users', 'can_manage_settings'
    ];

    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(updates[field]);
      }
    });

    if (updates.custom_permissions !== undefined) {
      fields.push('custom_permissions = ?');
      values.push(updates.custom_permissions ? JSON.stringify(updates.custom_permissions) : null);
    }

    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    values.push(user_id, app_id);

    await query(
      `UPDATE user_app_permissions 
       SET ${fields.join(', ')} 
       WHERE user_id = ? AND app_id = ?`,
      values
    );

    // Log activity
    await query(
      `INSERT INTO activity_logs (user_id, app_id, action, description, ip_address) 
       VALUES (?, ?, 'permission.update', ?, ?)`,
      [req.user.id, app_id, `Updated permissions for user ${user_id}`, req.ip]
    );

    res.json({
      success: true,
      message: 'Permissions updated successfully'
    });
  } catch (error) {
    console.error('Update permissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update permissions',
      error: error.message
    });
  }
};

// Remove user from app
const removeUserFromApp = async (req, res) => {
  try {
    const { user_id, app_id } = req.params;

    // Check if permission exists
    const permission = await queryOne(
      'SELECT * FROM user_app_permissions WHERE user_id = ? AND app_id = ?',
      [user_id, app_id]
    );

    if (!permission) {
      return res.status(404).json({
        success: false,
        message: 'Permission not found'
      });
    }

    // Delete permission
    await query(
      'DELETE FROM user_app_permissions WHERE user_id = ? AND app_id = ?',
      [user_id, app_id]
    );

    // Log activity
    await query(
      `INSERT INTO activity_logs (user_id, app_id, action, description, ip_address) 
       VALUES (?, ?, 'permission.remove', ?, ?)`,
      [req.user.id, app_id, `Removed user ${user_id} from app ${app_id}`, req.ip]
    );

    res.json({
      success: true,
      message: 'User removed from app successfully'
    });
  } catch (error) {
    console.error('Remove user from app error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove user from app',
      error: error.message
    });
  }
};

// Get all permissions for a user
const getUserPermissions = async (req, res) => {
  try {
    const { user_id } = req.params;

    const permissions = await query(
      `SELECT s.id as app_id, s.name, s.domain, 
              usp.can_view, usp.can_edit, usp.can_delete, usp.can_publish,
              usp.can_manage_users, usp.can_manage_settings, usp.custom_permissions
       FROM user_app_permissions usp
       JOIN apps s ON usp.app_id = s.id
       WHERE usp.user_id = ?`,
      [user_id]
    );

    res.json({
      success: true,
      data: permissions
    });
  } catch (error) {
    console.error('Get user permissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user permissions',
      error: error.message
    });
  }
};

// Get all users for a app
const getAppUsers = async (req, res) => {
  try {
    const { app_id } = req.params;

    const users = await query(
      `SELECT u.id, u.email, u.first_name, u.last_name, r.name as role_name,
              usp.can_view, usp.can_edit, usp.can_delete, usp.can_publish,
              usp.can_manage_users, usp.can_manage_settings, usp.custom_permissions,
              CONCAT(granted.first_name, ' ', granted.last_name) as granted_by_name
       FROM user_app_permissions usp
       JOIN users u ON usp.user_id = u.id
       JOIN roles r ON u.role_id = r.id
       LEFT JOIN users granted ON usp.granted_by = granted.id
       WHERE usp.app_id = ? AND u.is_active = TRUE`,
      [app_id]
    );

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Get app users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get app users',
      error: error.message
    });
  }
};

module.exports = {
  assignUserToApp,
  updateUserPermissions,
  removeUserFromApp,
  getUserPermissions,
  getAppUsers
};
