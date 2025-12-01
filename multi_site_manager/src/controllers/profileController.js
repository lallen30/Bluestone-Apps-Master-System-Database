const db = require('../config/database');
const path = require('path');
const fs = require('fs').promises;

/**
 * Get current user's profile
 * GET /api/v1/apps/:appId/profile
 */
exports.getProfile = async (req, res) => {
  try {
    const { appId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const result = await db.query(
      `SELECT 
        id, app_id, email, first_name, last_name, phone, bio, avatar_url,
        date_of_birth, gender, address_line1, address_line2, city, state, 
        country, zip_code, email_verified, status, created_at, updated_at
       FROM app_users 
       WHERE id = ? AND app_id = ?`,
      [userId, appId]
    );

    const users = Array.isArray(result) && Array.isArray(result[0]) 
      ? result[0] 
      : result;

    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = users[0];

    // Get user stats
    const statsResult = await db.query(
      `SELECT 
        (SELECT COUNT(*) FROM property_listings WHERE user_id = ? AND app_id = ?) as listings_count,
        (SELECT COUNT(*) FROM property_bookings WHERE guest_user_id = ? AND app_id = ?) as bookings_as_guest,
        (SELECT COUNT(*) FROM property_bookings WHERE host_user_id = ? AND app_id = ?) as bookings_as_host,
        (SELECT COUNT(*) FROM user_favorites WHERE user_id = ? AND app_id = ?) as favorites_count,
        (SELECT COUNT(*) FROM property_reviews WHERE user_id = ? AND app_id = ?) as reviews_count`,
      [userId, appId, userId, appId, userId, appId, userId, appId, userId, appId]
    );
    const statsData = Array.isArray(statsResult) && Array.isArray(statsResult[0]) 
      ? statsResult[0] 
      : statsResult;
    const stats = statsData[0] || {};

    res.json({
      success: true,
      data: {
        profile: user,
        stats: {
          listings_count: parseInt(stats.listings_count) || 0,
          bookings_as_guest: parseInt(stats.bookings_as_guest) || 0,
          bookings_as_host: parseInt(stats.bookings_as_host) || 0,
          favorites_count: parseInt(stats.favorites_count) || 0,
          reviews_count: parseInt(stats.reviews_count) || 0
        }
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
};

/**
 * Update current user's profile
 * PUT /api/v1/apps/:appId/profile
 */
exports.updateProfile = async (req, res) => {
  try {
    const { appId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const {
      first_name,
      last_name,
      phone,
      bio,
      date_of_birth,
      gender,
      address_line1,
      address_line2,
      city,
      state,
      country,
      zip_code
    } = req.body;

    // Build update query dynamically
    const updates = [];
    const params = [];

    if (first_name !== undefined) {
      updates.push('first_name = ?');
      params.push(first_name);
    }
    if (last_name !== undefined) {
      updates.push('last_name = ?');
      params.push(last_name);
    }
    if (phone !== undefined) {
      updates.push('phone = ?');
      params.push(phone);
    }
    if (bio !== undefined) {
      updates.push('bio = ?');
      params.push(bio);
    }
    if (date_of_birth !== undefined) {
      updates.push('date_of_birth = ?');
      params.push(date_of_birth || null);
    }
    if (gender !== undefined) {
      updates.push('gender = ?');
      params.push(gender);
    }
    if (address_line1 !== undefined) {
      updates.push('address_line1 = ?');
      params.push(address_line1);
    }
    if (address_line2 !== undefined) {
      updates.push('address_line2 = ?');
      params.push(address_line2);
    }
    if (city !== undefined) {
      updates.push('city = ?');
      params.push(city);
    }
    if (state !== undefined) {
      updates.push('state = ?');
      params.push(state);
    }
    if (country !== undefined) {
      updates.push('country = ?');
      params.push(country);
    }
    if (zip_code !== undefined) {
      updates.push('zip_code = ?');
      params.push(zip_code);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    params.push(userId, appId);

    await db.query(
      `UPDATE app_users SET ${updates.join(', ')} WHERE id = ? AND app_id = ?`,
      params
    );

    // Fetch updated profile
    const result = await db.query(
      `SELECT 
        id, app_id, email, first_name, last_name, phone, bio, avatar_url,
        date_of_birth, gender, address_line1, address_line2, city, state, 
        country, zip_code, email_verified, status, created_at, updated_at
       FROM app_users 
       WHERE id = ? AND app_id = ?`,
      [userId, appId]
    );

    const users = Array.isArray(result) && Array.isArray(result[0]) 
      ? result[0] 
      : result;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { profile: users[0] }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

/**
 * Upload avatar
 * POST /api/v1/apps/:appId/profile/avatar
 */
exports.uploadAvatar = async (req, res) => {
  try {
    const { appId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Generate avatar URL
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    // Get old avatar to delete
    const oldResult = await db.query(
      `SELECT avatar_url FROM app_users WHERE id = ? AND app_id = ?`,
      [userId, appId]
    );
    const oldUsers = Array.isArray(oldResult) && Array.isArray(oldResult[0]) 
      ? oldResult[0] 
      : oldResult;
    const oldAvatarUrl = oldUsers[0]?.avatar_url;

    // Update user's avatar
    await db.query(
      `UPDATE app_users SET avatar_url = ? WHERE id = ? AND app_id = ?`,
      [avatarUrl, userId, appId]
    );

    // Delete old avatar file if exists
    if (oldAvatarUrl && oldAvatarUrl.startsWith('/uploads/avatars/')) {
      const oldPath = path.join(__dirname, '../../public', oldAvatarUrl);
      try {
        await fs.unlink(oldPath);
      } catch (e) {
        // Ignore if file doesn't exist
      }
    }

    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: { avatar_url: avatarUrl }
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload avatar',
      error: error.message
    });
  }
};

/**
 * Delete avatar
 * DELETE /api/v1/apps/:appId/profile/avatar
 */
exports.deleteAvatar = async (req, res) => {
  try {
    const { appId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Get current avatar
    const result = await db.query(
      `SELECT avatar_url FROM app_users WHERE id = ? AND app_id = ?`,
      [userId, appId]
    );
    const users = Array.isArray(result) && Array.isArray(result[0]) 
      ? result[0] 
      : result;
    const avatarUrl = users[0]?.avatar_url;

    // Update user's avatar to null
    await db.query(
      `UPDATE app_users SET avatar_url = NULL WHERE id = ? AND app_id = ?`,
      [userId, appId]
    );

    // Delete avatar file if exists
    if (avatarUrl && avatarUrl.startsWith('/uploads/avatars/')) {
      const filePath = path.join(__dirname, '../../public', avatarUrl);
      try {
        await fs.unlink(filePath);
      } catch (e) {
        // Ignore if file doesn't exist
      }
    }

    res.json({
      success: true,
      message: 'Avatar deleted successfully'
    });
  } catch (error) {
    console.error('Delete avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete avatar',
      error: error.message
    });
  }
};

/**
 * Change password
 * PUT /api/v1/apps/:appId/profile/password
 */
exports.changePassword = async (req, res) => {
  try {
    const { appId } = req.params;
    const userId = req.user?.id;
    const { current_password, new_password } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!current_password || !new_password) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (new_password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters'
      });
    }

    // Get current password hash
    const result = await db.query(
      `SELECT password_hash FROM app_users WHERE id = ? AND app_id = ?`,
      [userId, appId]
    );
    const users = Array.isArray(result) && Array.isArray(result[0]) 
      ? result[0] 
      : result;

    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const bcrypt = require('bcryptjs');
    const isValid = await bcrypt.compare(current_password, users[0].password_hash);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const newHash = await bcrypt.hash(new_password, 10);

    // Update password
    await db.query(
      `UPDATE app_users SET password_hash = ? WHERE id = ? AND app_id = ?`,
      [newHash, userId, appId]
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
