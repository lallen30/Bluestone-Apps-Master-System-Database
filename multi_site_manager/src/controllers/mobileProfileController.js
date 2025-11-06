const db = require('../config/database');
const bcrypt = require('bcryptjs');
const { getUserPermissions } = require('../middleware/permissions');

/**
 * Get current user's profile
 * GET /api/v1/mobile/profile
 */
async function getProfile(req, res) {
  try {
    const userId = req.user.id;
    const appId = req.user.app_id;
    
    // Get user profile
    const users = await db.query(
      `SELECT 
        id, app_id, email, first_name, last_name, phone, bio, 
        avatar_url, date_of_birth, gender, email_verified, status,
        last_login_at, created_at, updated_at
       FROM app_users 
       WHERE id = ? AND app_id = ?`,
      [userId, appId]
    );
    
    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const user = users[0];
    
    // Get user settings
    const settings = await db.query(
      `SELECT 
        notifications_enabled, email_notifications, push_notifications,
        sms_notifications, language, timezone, theme, privacy_settings
       FROM user_settings 
       WHERE user_id = ?`,
      [userId]
    );
    
    // Remove sensitive data
    delete user.password_hash;
    
    res.json({
      success: true,
      data: {
        ...user,
        settings: settings && settings[0] ? settings[0] : null
      }
    });
    
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
}

/**
 * Update current user's profile
 * PUT /api/v1/mobile/profile
 */
async function updateProfile(req, res) {
  try {
    const userId = req.user.id;
    const appId = req.user.app_id;
    const { first_name, last_name, phone, bio, date_of_birth, gender } = req.body;
    
    // Update user profile
    await db.query(
      `UPDATE app_users 
       SET first_name = ?, last_name = ?, phone = ?, bio = ?, 
           date_of_birth = ?, gender = ?, updated_at = NOW()
       WHERE id = ? AND app_id = ?`,
      [first_name, last_name, phone, bio, date_of_birth, gender, userId, appId]
    );
    
    // Get updated profile
    const users = await db.query(
      `SELECT 
        id, app_id, email, first_name, last_name, phone, bio, 
        avatar_url, date_of_birth, gender, email_verified, status,
        last_login_at, created_at, updated_at
       FROM app_users 
       WHERE id = ? AND app_id = ?`,
      [userId, appId]
    );
    
    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: users[0]
    });
    
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
}

/**
 * Get another user's public profile
 * GET /api/v1/mobile/profile/:userId
 */
async function getUserProfile(req, res) {
  try {
    const { userId } = req.params;
    const appId = req.user.app_id;
    
    // Get user profile (only public fields)
    const users = await db.query(
      `SELECT 
        id, first_name, last_name, bio, avatar_url, created_at
       FROM app_users 
       WHERE id = ? AND app_id = ? AND status = 'active'`,
      [userId, appId]
    );
    
    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: users[0]
    });
    
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile'
    });
  }
}

/**
 * Get current user's permissions
 * GET /api/v1/mobile/profile/permissions
 */
async function getUserPermissionsEndpoint(req, res) {
  try {
    const userId = req.user.id;
    const appId = req.user.app_id;
    
    const permissions = await getUserPermissions(userId, appId);
    
    // Group by category
    const byCategory = {};
    permissions.forEach(perm => {
      const category = perm.category || 'other';
      if (!byCategory[category]) {
        byCategory[category] = [];
      }
      byCategory[category].push(perm);
    });
    
    res.json({
      success: true,
      data: {
        permissions,
        byCategory,
        permissionNames: permissions.map(p => p.name)
      }
    });
    
  } catch (error) {
    console.error('Get user permissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch permissions'
    });
  }
}

/**
 * Upload/Update user avatar
 * POST /api/v1/mobile/profile/avatar
 */
async function uploadAvatar(req, res) {
  try {
    const userId = req.user.id;
    const appId = req.user.app_id;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }
    
    const file = req.file;
    
    // Extract app folder from the file path
    const path = require('path');
    const pathParts = file.path.split(path.sep);
    const uploadsIndex = pathParts.indexOf('uploads');
    const appFolder = pathParts[uploadsIndex + 1];
    
    // Construct avatar URL
    const avatarUrl = `/uploads/${appFolder}/${file.filename}`;
    
    // Update user's avatar_url
    await db.query(
      'UPDATE app_users SET avatar_url = ?, updated_at = NOW() WHERE id = ? AND app_id = ?',
      [avatarUrl, userId, appId]
    );
    
    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: {
        avatar_url: avatarUrl,
        filename: file.filename
      }
    });
    
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload avatar',
      error: error.message
    });
  }
}

/**
 * Change user password
 * PUT /api/v1/mobile/profile/password
 */
async function changePassword(req, res) {
  try {
    const userId = req.user.id;
    const appId = req.user.app_id;
    const { current_password, new_password } = req.body;
    
    // Validation
    if (!current_password || !new_password) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }
    
    // Validate new password strength (min 8 chars)
    if (new_password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long'
      });
    }
    
    // Get user's current password hash
    const users = await db.query(
      'SELECT password_hash FROM app_users WHERE id = ? AND app_id = ?',
      [userId, appId]
    );
    
    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const user = users[0];
    
    // Verify current password
    const isValidPassword = await bcrypt.compare(current_password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(new_password, salt);
    
    // Update password
    await db.query(
      'UPDATE app_users SET password_hash = ?, updated_at = NOW() WHERE id = ? AND app_id = ?',
      [newPasswordHash, userId, appId]
    );
    
    // Log activity
    await db.query(
      `INSERT INTO user_activity_log (user_id, app_id, activity_type, activity_description, ip_address, user_agent, created_at)
       VALUES (?, ?, 'password_change', 'User changed password', ?, ?, NOW())`,
      [userId, appId, req.ip, req.get('user-agent')]
    );
    
    res.json({
      success: true,
      message: 'Password changed successfully'
    });
    
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    });
  }
}

module.exports = {
  getProfile,
  updateProfile,
  getUserProfile,
  getUserPermissionsEndpoint,
  uploadAvatar,
  changePassword
};
