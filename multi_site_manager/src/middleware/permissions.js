const db = require('../config/database');

/**
 * Middleware to check if user has required permission
 * Usage: requirePermission('content.create')
 */
function requirePermission(permissionName) {
  return async (req, res, next) => {
    try {
      // User should be authenticated first (via mobileAuth middleware)
      if (!req.user || !req.user.id || !req.user.app_id) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const userId = req.user.id;
      const appId = req.user.app_id;

      // Check if user has the required permission through their roles
      const result = await db.query(
        `SELECT COUNT(*) as has_permission
         FROM app_user_role_assignments ura
         INNER JOIN role_permission_assignments rpa ON ura.role_id = rpa.role_id
         INNER JOIN role_permissions p ON rpa.permission_id = p.id
         INNER JOIN user_roles r ON ura.role_id = r.id
         WHERE ura.user_id = ? AND r.app_id = ? AND p.name = ?`,
        [userId, appId, permissionName]
      );

      const hasPermission = result && result[0] && result[0].has_permission > 0;

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions',
          required_permission: permissionName
        });
      }

      // User has permission, continue
      next();

    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to verify permissions'
      });
    }
  };
}

/**
 * Middleware to check if user has ANY of the required permissions
 * Usage: requireAnyPermission(['content.edit', 'content.edit.all'])
 */
function requireAnyPermission(permissionNames) {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.id || !req.user.app_id) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const userId = req.user.id;
      const appId = req.user.app_id;

      // Check if user has any of the required permissions
      const placeholders = permissionNames.map(() => '?').join(',');
      const result = await db.query(
        `SELECT COUNT(*) as has_permission
         FROM app_user_role_assignments ura
         INNER JOIN role_permission_assignments rpa ON ura.role_id = rpa.role_id
         INNER JOIN role_permissions p ON rpa.permission_id = p.id
         INNER JOIN user_roles r ON ura.role_id = r.id
         WHERE ura.user_id = ? AND r.app_id = ? AND p.name IN (${placeholders})`,
        [userId, appId, ...permissionNames]
      );

      const hasPermission = result && result[0] && result[0].has_permission > 0;

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions',
          required_permissions: permissionNames
        });
      }

      next();

    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to verify permissions'
      });
    }
  };
}

/**
 * Middleware to check if user has ALL of the required permissions
 * Usage: requireAllPermissions(['content.create', 'content.publish'])
 */
function requireAllPermissions(permissionNames) {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.id || !req.user.app_id) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const userId = req.user.id;
      const appId = req.user.app_id;

      // Check each permission individually
      for (const permissionName of permissionNames) {
        const result = await db.query(
          `SELECT COUNT(*) as has_permission
           FROM app_user_role_assignments ura
           INNER JOIN role_permission_assignments rpa ON ura.role_id = rpa.role_id
           INNER JOIN role_permissions p ON rpa.permission_id = p.id
           INNER JOIN user_roles r ON ura.role_id = r.id
           WHERE ura.user_id = ? AND r.app_id = ? AND p.name = ?`,
          [userId, appId, permissionName]
        );

        const hasPermission = result && result[0] && result[0].has_permission > 0;

        if (!hasPermission) {
          return res.status(403).json({
            success: false,
            message: 'Insufficient permissions',
            missing_permission: permissionName,
            required_permissions: permissionNames
          });
        }
      }

      next();

    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to verify permissions'
      });
    }
  };
}

/**
 * Helper function to get all user permissions (not middleware)
 * Can be used in controllers to check permissions programmatically
 */
async function getUserPermissions(userId, appId) {
  try {
    const permissions = await db.query(
      `SELECT DISTINCT p.name, p.display_name, p.description, p.category
       FROM app_user_role_assignments ura
       INNER JOIN role_permission_assignments rpa ON ura.role_id = rpa.role_id
       INNER JOIN role_permissions p ON rpa.permission_id = p.id
       INNER JOIN user_roles r ON ura.role_id = r.id
       WHERE ura.user_id = ? AND r.app_id = ?
       ORDER BY p.category, p.name`,
      [userId, appId]
    );

    return permissions || [];
  } catch (error) {
    console.error('Get user permissions error:', error);
    return [];
  }
}

/**
 * Helper function to check if user has permission (not middleware)
 */
async function hasPermission(userId, appId, permissionName) {
  try {
    const result = await db.query(
      `SELECT COUNT(*) as has_permission
       FROM app_user_role_assignments ura
       INNER JOIN role_permission_assignments rpa ON ura.role_id = rpa.role_id
       INNER JOIN role_permissions p ON rpa.permission_id = p.id
       INNER JOIN user_roles r ON ura.role_id = r.id
       WHERE ura.user_id = ? AND r.app_id = ? AND p.name = ?`,
      [userId, appId, permissionName]
    );

    return result && result[0] && result[0].has_permission > 0;
  } catch (error) {
    console.error('Has permission check error:', error);
    return false;
  }
}

module.exports = {
  requirePermission,
  requireAnyPermission,
  requireAllPermissions,
  getUserPermissions,
  hasPermission
};
