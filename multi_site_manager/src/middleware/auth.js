const jwt = require('jsonwebtoken');
const { queryOne } = require('../config/database');

// Verify JWT token
const authenticate = async (req, res, next) => {
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await queryOne(
      `SELECT u.*, r.name as role_name, r.level as role_level 
       FROM users u 
       JOIN roles r ON u.role_id = r.id 
       WHERE u.id = ? AND u.is_active = TRUE`,
      [decoded.userId]
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.'
      });
    }

    // Remove password from user object
    delete user.password_hash;

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired.'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Authentication error.',
      error: error.message
    });
  }
};

// Check if user is Master Admin
const isMasterAdmin = (req, res, next) => {
  if (req.user.role_level !== 1) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Master Admin privileges required.'
    });
  }
  next();
};

// Check if user is Admin or higher
const isAdmin = (req, res, next) => {
  if (req.user.role_level > 2) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
  next();
};

// Check if user has access to a specific app
const hasAppAccess = async (req, res, next) => {
  try {
    const appId = req.params.id || req.params.appId || req.body.app_id;
    
    if (!appId) {
      return res.status(400).json({
        success: false,
        message: 'App ID is required.'
      });
    }

    // Master Admin has access to all apps
    if (req.user.role_level === 1) {
      return next();
    }

    // Check if user has permission for this app
    const permission = await queryOne(
      `SELECT * FROM user_app_permissions 
       WHERE user_id = ? AND app_id = ?`,
      [req.user.id, appId]
    );

    if (!permission) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not have access to this app.'
      });
    }

    // Attach permission to request
    req.appPermission = permission;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error checking app access.',
      error: error.message
    });
  }
};

// Check specific permission for a app
const hasPermission = (permissionType) => {
  return (req, res, next) => {
    // Master Admin has all permissions
    if (req.user.role_level === 1) {
      return next();
    }

    // Check if permission exists
    if (!req.appPermission || !req.appPermission[permissionType]) {
      return res.status(403).json({
        success: false,
        message: `Access denied. You do not have ${permissionType} permission.`
      });
    }

    next();
  };
};

module.exports = {
  authenticate,
  isMasterAdmin,
  isAdmin,
  hasAppAccess,
  hasPermission
};
