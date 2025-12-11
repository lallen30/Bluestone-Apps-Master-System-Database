const jwt = require("jsonwebtoken");

/**
 * Authentication middleware for Stripe service
 * Validates JWT tokens and extracts project/app context
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded token data to request
    // This should include app_id or project_id to determine which Stripe keys to use
    req.auth = {
      userId: decoded.userId || decoded.user_id,
      appId: decoded.appId || decoded.app_id,
      email: decoded.email,
      roles: decoded.roles || [],
    };

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired.",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Authentication error.",
      error: error.message,
    });
  }
};

/**
 * Optional authentication - allows requests without token
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      req.auth = null;
      return next();
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.auth = {
      userId: decoded.userId || decoded.user_id,
      appId: decoded.appId || decoded.app_id,
      email: decoded.email,
      roles: decoded.roles || [],
    };

    next();
  } catch (error) {
    // If token is invalid, continue without auth
    req.auth = null;
    next();
  }
};

module.exports = {
  authenticate,
  optionalAuth,
};
