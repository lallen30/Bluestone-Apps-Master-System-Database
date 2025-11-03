const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '30d';

/**
 * Generate JWT access token
 * @param {Object} payload - Token payload (user_id, app_id, email)
 * @returns {String} JWT token
 */
function generateAccessToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'multi-app-manager',
    audience: 'mobile-app'
  });
}

/**
 * Generate refresh token
 * @param {Object} payload - Token payload (user_id, app_id)
 * @returns {String} Refresh token
 */
function generateRefreshToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    issuer: 'multi-app-manager',
    audience: 'mobile-app'
  });
}

/**
 * Verify JWT token
 * @param {String} token - JWT token to verify
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'multi-app-manager',
      audience: 'mobile-app'
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    }
    throw error;
  }
}

/**
 * Hash token for storage (for session management)
 * @param {String} token - Token to hash
 * @returns {String} Hashed token
 */
function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Generate random token (for email verification, password reset)
 * @param {Number} length - Token length (default: 32)
 * @returns {String} Random token
 */
function generateRandomToken(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Calculate token expiration date
 * @param {String} duration - Duration string (e.g., '7d', '24h', '30m')
 * @returns {Date} Expiration date
 */
function calculateExpiration(duration) {
  const units = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000
  };
  
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) {
    throw new Error('Invalid duration format');
  }
  
  const [, value, unit] = match;
  const milliseconds = parseInt(value) * units[unit];
  
  return new Date(Date.now() + milliseconds);
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  hashToken,
  generateRandomToken,
  calculateExpiration,
  JWT_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN
};
