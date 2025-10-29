const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query, queryOne } = require('../config/database');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await queryOne(
      `SELECT u.*, r.name as role_name, r.level as role_level 
       FROM users u 
       JOIN roles r ON u.role_id = r.id 
       WHERE u.email = ?`,
      [email]
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Account is inactive. Please contact administrator.'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    await query(
      'UPDATE users SET last_login = NOW() WHERE id = ?',
      [user.id]
    );

    // Generate token
    const token = generateToken(user.id);

    // Remove password from response
    delete user.password_hash;

    // Log activity
    await query(
      `INSERT INTO activity_logs (user_id, action, description, ip_address) 
       VALUES (?, 'auth.login', 'User logged in', ?)`,
      [user.id, req.ip]
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    // Get user with apps they have access to
    const apps = await query(
      `SELECT s.*, usp.can_view, usp.can_edit, usp.can_delete, 
              usp.can_publish, usp.can_manage_users, usp.can_manage_settings
       FROM apps s
       JOIN user_app_permissions usp ON s.id = usp.app_id
       WHERE usp.user_id = ? AND s.is_active = TRUE`,
      [req.user.id]
    );

    // Master Admin has access to all apps
    let allApps = apps;
    if (req.user.role_level === 1) {
      allApps = await query(
        'SELECT * FROM apps WHERE is_active = TRUE'
      );
    }

    res.json({
      success: true,
      data: {
        user: req.user,
        apps: allApps
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: error.message
    });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;

    // Get current password hash
    const user = await queryOne(
      'SELECT password_hash FROM users WHERE id = ?',
      [req.user.id]
    );

    // Verify current password
    const isValid = await bcrypt.compare(current_password, user.password_hash);
    
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(new_password, 10);

    // Update password
    await query(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [hashedPassword, req.user.id]
    );

    // Log activity
    await query(
      `INSERT INTO activity_logs (user_id, action, description, ip_address) 
       VALUES (?, 'auth.password_change', 'User changed password', ?)`,
      [req.user.id, req.ip]
    );

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: error.message
    });
  }
};

module.exports = {
  login,
  getProfile,
  changePassword
};
