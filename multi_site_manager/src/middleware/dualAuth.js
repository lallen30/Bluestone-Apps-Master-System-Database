const jwt = require('jsonwebtoken');
const db = require('../config/database');

/**
 * Dual authentication middleware
 * Accepts both admin tokens and mobile user tokens
 * Tries admin authentication first, then mobile authentication
 */
const authenticateDual = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }

    // Try admin authentication first (has userId field)
    if (decoded.userId) {
      const adminResult = await db.query(
        `SELECT u.*, r.name as role_name, r.level as role_level 
         FROM users u 
         JOIN roles r ON u.role_id = r.id 
         WHERE u.id = ? AND u.is_active = TRUE`,
        [decoded.userId]
      );

      const admin = Array.isArray(adminResult) && Array.isArray(adminResult[0])
        ? adminResult[0][0]
        : adminResult[0];

      if (admin) {
        delete admin.password_hash;
        req.user = admin;
        req.authType = 'admin';
        return next();
      }
    }

    // Try mobile user authentication (has user_id or id field)
    const mobileUserId = decoded.user_id || decoded.id;
    if (mobileUserId) {
      const mobileUserResult = await db.query(
        'SELECT * FROM app_users WHERE id = ? AND status = "active"',
        [mobileUserId]
      );

      const mobileUser = Array.isArray(mobileUserResult) && Array.isArray(mobileUserResult[0])
        ? mobileUserResult[0][0]
        : mobileUserResult[0];

      if (!mobileUser) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token. User not found.'
        });
      }

      // Load user roles
      const rolesResult = await db.query(
        `SELECT r.id, r.name, r.display_name 
         FROM app_user_role_assignments ura
         JOIN app_roles r ON ura.app_role_id = r.id
         WHERE ura.user_id = ?`,
        [mobileUser.id]
      );

      const roles = Array.isArray(rolesResult) && Array.isArray(rolesResult[0])
        ? rolesResult[0]
        : rolesResult;

      const safeRoles = roles || [];

      // Attach user info to request
      req.user = {
        id: mobileUser.id,
        app_id: mobileUser.app_id,
        email: mobileUser.email,
        first_name: mobileUser.first_name,
        last_name: mobileUser.last_name,
        email_verified: mobileUser.email_verified,
        roles: safeRoles.map(r => r.name),
        role_ids: safeRoles.map(r => r.id),
        role_display_names: safeRoles.map(r => r.display_name)
      };
      req.authType = 'mobile';
      return next();
    }

    // No valid authentication found
    return res.status(401).json({
      success: false,
      message: 'Invalid token format.'
    });

  } catch (error) {
    console.error('Dual authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication error.',
      error: error.message
    });
  }
};

module.exports = { authenticateDual };
