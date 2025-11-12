const db = require('../config/database');

/**
 * Get all roles for an app
 */
exports.getAppRoles = async (req, res) => {
  try {
    const { appId } = req.params;

    const rolesResult = await db.query(
      `SELECT id, name, display_name, description, is_default, created_at
       FROM app_roles
       WHERE app_id = ?
       ORDER BY is_default DESC, name`,
      [appId]
    );

    const roles = Array.isArray(rolesResult) && Array.isArray(rolesResult[0]) 
      ? rolesResult[0] 
      : rolesResult;

    res.json({
      success: true,
      data: {
        roles: roles || []
      }
    });
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching roles',
      error: error.message
    });
  }
};

/**
 * Get screen access settings (which roles can access this screen)
 */
exports.getScreenAccess = async (req, res) => {
  try {
    const { appId, screenId } = req.params;

    // Get all roles for this app
    const rolesResult = await db.query(
      `SELECT 
        ar.id,
        ar.name,
        ar.display_name,
        ar.is_default,
        COALESCE(sra.can_access, 0) as can_access
       FROM app_roles ar
       LEFT JOIN screen_role_access sra ON sra.role_id = ar.id AND sra.screen_id = ? AND sra.app_id = ?
       WHERE ar.app_id = ?
       ORDER BY ar.is_default DESC, ar.name`,
      [screenId, appId, appId]
    );

    const roles = Array.isArray(rolesResult) && Array.isArray(rolesResult[0]) 
      ? rolesResult[0] 
      : rolesResult;

    res.json({
      success: true,
      data: {
        roles: roles || []
      }
    });
  } catch (error) {
    console.error('Error fetching screen access:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching screen access',
      error: error.message
    });
  }
};

/**
 * Update screen access for specific roles
 */
exports.updateScreenAccess = async (req, res) => {
  try {
    const { appId, screenId } = req.params;
    const { role_ids } = req.body; // Array of role IDs that should have access

    if (!Array.isArray(role_ids)) {
      return res.status(400).json({
        success: false,
        message: 'role_ids must be an array'
      });
    }

    // Delete existing access permissions for this screen
    await db.query(
      `DELETE FROM screen_role_access WHERE screen_id = ? AND app_id = ?`,
      [screenId, appId]
    );

    // Insert new permissions
    if (role_ids.length > 0) {
      const values = role_ids.map(roleId => `(${screenId}, ${roleId}, ${appId}, 1)`).join(',');
      await db.query(
        `INSERT INTO screen_role_access (screen_id, role_id, app_id, can_access) VALUES ${values}`
      );
    }

    res.json({
      success: true,
      message: 'Screen access updated successfully'
    });
  } catch (error) {
    console.error('Error updating screen access:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating screen access',
      error: error.message
    });
  }
};

/**
 * Get user's assigned roles
 */
exports.getUserRoles = async (req, res) => {
  try {
    const { userId } = req.params;

    const rolesResult = await db.query(
      `SELECT 
        ar.id,
        ar.name,
        ar.display_name,
        ar.description,
        ar.is_default,
        aura.assigned_at
       FROM app_user_role_assignments aura
       JOIN app_roles ar ON ar.id = aura.app_role_id
       WHERE aura.user_id = ?
       ORDER BY ar.is_default DESC, ar.name`,
      [userId]
    );

    const roles = Array.isArray(rolesResult) && Array.isArray(rolesResult[0]) 
      ? rolesResult[0] 
      : rolesResult;

    res.json({
      success: true,
      data: {
        roles: roles || []
      }
    });
  } catch (error) {
    console.error('Error fetching user roles:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user roles',
      error: error.message
    });
  }
};

/**
 * Update user's assigned roles
 */
exports.updateUserRoles = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role_ids } = req.body; // Array of role IDs to assign

    if (!Array.isArray(role_ids)) {
      return res.status(400).json({
        success: false,
        message: 'role_ids must be an array'
      });
    }

    // Delete existing role assignments
    await db.query(
      `DELETE FROM app_user_role_assignments WHERE user_id = ? AND app_role_id IS NOT NULL`,
      [userId]
    );

    // Insert new role assignments
    if (role_ids.length > 0) {
      const values = role_ids.map(roleId => `(${userId}, NULL, ${roleId})`).join(',');
      await db.query(
        `INSERT INTO app_user_role_assignments (user_id, role_id, app_role_id) VALUES ${values}`
      );
    }

    res.json({
      success: true,
      message: 'User roles updated successfully'
    });
  } catch (error) {
    console.error('Error updating user roles:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user roles',
      error: error.message
    });
  }
};

/**
 * Create a new role for an app
 */
exports.createRole = async (req, res) => {
  try {
    const { appId } = req.params;
    const { name, display_name, description, is_default } = req.body;

    if (!name || !display_name) {
      return res.status(400).json({
        success: false,
        message: 'name and display_name are required'
      });
    }

    const result = await db.query(
      `INSERT INTO app_roles (app_id, name, display_name, description, is_default)
       VALUES (?, ?, ?, ?, ?)`,
      [appId, name, display_name, description || null, is_default || false]
    );

    const insertResult = Array.isArray(result) && Array.isArray(result[0]) 
      ? result[0] 
      : result;

    res.status(201).json({
      success: true,
      message: 'Role created successfully',
      data: {
        id: insertResult.insertId
      }
    });
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating role',
      error: error.message
    });
  }
};
