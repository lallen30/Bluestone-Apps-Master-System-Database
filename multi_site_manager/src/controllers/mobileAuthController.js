const bcrypt = require('bcryptjs');
const db = require('../config/database');
const { generateAccessToken, generateRefreshToken, hashToken, generateRandomToken, calculateExpiration } = require('../utils/jwt');

/**
 * Register a new mobile app user
 * POST /api/mobile/auth/register
 */
async function register(req, res) {
  try {
    const { app_id, email, password, first_name, last_name, phone } = req.body;
    
    // Validation
    if (!app_id || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'App ID, email, and password are required'
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }
    
    // Validate password strength (min 8 chars)
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      });
    }
    
    // Check if app exists
    const apps = await db.query('SELECT id FROM apps WHERE id = ?', [app_id]);
    if (!apps || apps.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'App not found'
      });
    }
    
    // Check if email already exists for this app
    const existingUsers = await db.query(
      'SELECT id FROM app_users WHERE app_id = ? AND email = ?',
      [app_id, email]
    );
    
    if (existingUsers && existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered for this app'
      });
    }
    
    // Hash password
    const password_hash = await bcrypt.hash(password, 10);
    
    // Generate email verification token
    const email_verification_token = generateRandomToken();
    const email_verification_expires = calculateExpiration('24h');
    
    // Create user
    const result = await db.query(
      `INSERT INTO app_users 
       (app_id, email, password_hash, first_name, last_name, phone, 
        email_verification_token, email_verification_expires, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
      [app_id, email, password_hash, first_name || null, last_name || null, phone || null,
       email_verification_token, email_verification_expires]
    );
    
    const user_id = result.insertId;
    
    // Create default user settings
    await db.query(
      'INSERT INTO user_settings (user_id) VALUES (?)',
      [user_id]
    );
    
    // Generate tokens
    const accessToken = generateAccessToken({ user_id, app_id, email });
    const refreshToken = generateRefreshToken({ user_id, app_id });
    
    // Store session
    const token_hash = hashToken(accessToken);
    const refresh_token_hash = hashToken(refreshToken);
    const expires_at = calculateExpiration('7d');
    const refresh_expires_at = calculateExpiration('30d');
    
    await db.query(
      `INSERT INTO user_sessions 
       (user_id, app_id, token_hash, refresh_token_hash, expires_at, refresh_expires_at, 
        ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, app_id, token_hash, refresh_token_hash, expires_at, refresh_expires_at,
       req.ip, req.get('user-agent')]
    );
    
    // Log activity
    await db.query(
      `INSERT INTO user_activity_log (user_id, app_id, action, ip_address, user_agent)
       VALUES (?, ?, 'register', ?, ?)`,
      [user_id, app_id, req.ip, req.get('user-agent')]
    );
    
    // TODO: Send verification email
    // For now, we'll just return the token in the response
    
    res.status(201).json({
      success: true,
      message: 'Registration successful. Please verify your email.',
      data: {
        user: {
          id: user_id,
          app_id,
          email,
          first_name,
          last_name,
          phone,
          email_verified: false
        },
        tokens: {
          access_token: accessToken,
          refresh_token: refreshToken,
          token_type: 'Bearer',
          expires_in: '7d'
        },
        email_verification_token // Remove this in production, send via email instead
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
}

/**
 * Login mobile app user
 * POST /api/mobile/auth/login
 */
async function login(req, res) {
  try {
    const { app_id, email, password } = req.body;
    
    // Validation
    if (!app_id || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'App ID, email, and password are required'
      });
    }
    
    // Find user
    const users = await db.query(
      `SELECT id, app_id, email, password_hash, first_name, last_name, phone, 
              bio, avatar_url, date_of_birth, gender, email_verified, status
       FROM app_users 
       WHERE app_id = ? AND email = ?`,
      [app_id, email]
    );
    
    if (!users || users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    const user = users[0];
    
    // Check if user is active
    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Account is inactive or suspended'
      });
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Generate tokens
    const accessToken = generateAccessToken({ 
      user_id: user.id, 
      app_id: user.app_id, 
      email: user.email 
    });
    const refreshToken = generateRefreshToken({ 
      user_id: user.id, 
      app_id: user.app_id 
    });
    
    // Store session
    const token_hash = hashToken(accessToken);
    const refresh_token_hash = hashToken(refreshToken);
    const expires_at = calculateExpiration('7d');
    const refresh_expires_at = calculateExpiration('30d');
    
    await db.query(
      `INSERT INTO user_sessions 
       (user_id, app_id, token_hash, refresh_token_hash, expires_at, refresh_expires_at,
        ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [user.id, user.app_id, token_hash, refresh_token_hash, expires_at, refresh_expires_at,
       req.ip, req.get('user-agent')]
    );
    
    // Update last login
    await db.query(
      'UPDATE app_users SET last_login_at = NOW() WHERE id = ?',
      [user.id]
    );
    
    // Log activity
    await db.query(
      `INSERT INTO user_activity_log (user_id, app_id, action, ip_address, user_agent)
       VALUES (?, ?, 'login', ?, ?)`,
      [user.id, user.app_id, req.ip, req.get('user-agent')]
    );
    
    // Remove sensitive data
    delete user.password_hash;
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user,
        tokens: {
          access_token: accessToken,
          refresh_token: refreshToken,
          token_type: 'Bearer',
          expires_in: '7d'
        }
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
}

/**
 * Logout mobile app user
 * POST /api/mobile/auth/logout
 */
async function logout(req, res) {
  try {
    const token = req.headers.authorization?.substring(7);
    
    if (token) {
      const token_hash = hashToken(token);
      
      // Delete session
      await db.query(
        'DELETE FROM user_sessions WHERE token_hash = ?',
        [token_hash]
      );
      
      // Log activity
      await db.query(
        `INSERT INTO user_activity_log (user_id, app_id, action, ip_address, user_agent)
         VALUES (?, ?, 'logout', ?, ?)`,
        [req.user.id, req.user.app_id, req.ip, req.get('user-agent')]
      );
    }
    
    res.json({
      success: true,
      message: 'Logout successful'
    });
    
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
}

/**
 * Verify email with token
 * POST /api/mobile/auth/verify-email
 */
async function verifyEmail(req, res) {
  try {
    const { verification_code } = req.body;
    
    if (!verification_code) {
      return res.status(400).json({
        success: false,
        message: 'Verification code is required'
      });
    }
    
    // Find user with this verification token
    const users = await db.query(
      `SELECT id, email FROM app_users 
       WHERE email_verification_token = ? 
       AND email_verification_expires > NOW()
       AND email_verified = FALSE`,
      [verification_code]
    );
    
    if (users.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code'
      });
    }
    
    const user = users[0];
    
    // Mark email as verified
    await db.query(
      `UPDATE app_users 
       SET email_verified = TRUE, 
           email_verification_token = NULL,
           email_verification_expires = NULL
       WHERE id = ?`,
      [user.id]
    );
    
    res.json({
      success: true,
      message: 'Email verified successfully',
      data: {
        email: user.email,
        verified: true
      }
    });
    
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Email verification failed'
    });
  }
}

module.exports = {
  register,
  login,
  logout,
  verifyEmail
};
