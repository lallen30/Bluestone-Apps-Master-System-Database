const { verifyToken } = require('../utils/jwt');
const db = require('../config/database');

/**
 * Middleware to authenticate mobile app users via JWT
 * Validates token and attaches user info to request
 * Can be configured to allow optional authentication
 */
function authenticateMobileUser(options = {}) {
  const required = options.required !== false; // Default to required
  
  return async (req, res, next) => {
    try {
      // Get token from Authorization header
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        if (!required) {
          // Optional auth - continue without user
          req.user = null;
          return next();
        }
        return res.status(401).json({
          success: false,
          message: 'No token provided. Please include Authorization header with Bearer token.'
        });
      }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify token
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: error.message || 'Invalid or expired token'
      });
    }
    
    // Check if user exists and is active
    const users = await db.query(
      `SELECT id, app_id, email, first_name, last_name, status, email_verified
       FROM app_users 
       WHERE id = ? AND app_id = ? AND status = 'active'`,
      [decoded.user_id, decoded.app_id]
    );
    
    if (!users || users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }
    
    const user = users[0];
    
    // Attach user info to request
    req.user = {
      id: user.id,
      app_id: user.app_id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      email_verified: user.email_verified
    };
    
    // Update last activity
    await db.query(
      'UPDATE user_sessions SET last_activity_at = NOW() WHERE token_hash = SHA2(?, 256)',
      [token]
    );
    
    next();
    } catch (error) {
      console.error('Authentication error:', error);
      return res.status(500).json({
        success: false,
        message: 'Authentication failed'
      });
    }
  };
}

/**
 * Middleware to check if email is verified
 */
function requireEmailVerification(req, res, next) {
  if (!req.user.email_verified) {
    return res.status(403).json({
      success: false,
      message: 'Email verification required. Please verify your email address.',
      code: 'EMAIL_NOT_VERIFIED'
    });
  }
  next();
}

/**
 * Middleware to validate app_id matches authenticated user's app
 */
function validateAppAccess(req, res, next) {
  const appId = parseInt(req.params.appId || req.body.app_id);
  
  if (!appId) {
    return res.status(400).json({
      success: false,
      message: 'App ID is required'
    });
  }
  
  if (appId !== req.user.app_id) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. You do not have permission to access this app.'
    });
  }
  
  next();
}

module.exports = {
  authenticateMobileUser,
  requireEmailVerification,
  validateAppAccess
};
