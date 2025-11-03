const db = require('../config/database');
const bcrypt = require('bcryptjs');
const { generateRandomToken, calculateExpiration } = require('../utils/jwt');

/**
 * Create a new app user (admin function)
 * POST /api/v1/apps/:appId/users
 */
async function createAppUser(req, res) {
  try {
    const { appId } = req.params;
    const { email, password, first_name, last_name, phone, email_verified = false } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
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
    
    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      });
    }
    
    // Check if app exists
    const [apps] = await db.query('SELECT id FROM apps WHERE id = ?', [appId]);
    if (apps.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'App not found'
      });
    }
    
    // Check if email already exists for this app
    const [existingUsers] = await db.query(
      'SELECT id FROM app_users WHERE app_id = ? AND email = ?',
      [appId, email]
    );
    
    if (existingUsers && existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered for this app'
      });
    }
    
    // Hash password
    const password_hash = await bcrypt.hash(password, 10);
    
    // Generate email verification token if not verified
    let email_verification_token = null;
    let email_verification_expires = null;
    
    if (!email_verified) {
      email_verification_token = generateRandomToken();
      email_verification_expires = calculateExpiration('24h');
    }
    
    // Create user
    const [result] = await db.query(
      `INSERT INTO app_users 
       (app_id, email, password_hash, first_name, last_name, phone, 
        email_verified, email_verification_token, email_verification_expires, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
      [appId, email, password_hash, first_name, last_name, phone,
       email_verified ? 1 : 0, email_verification_token, email_verification_expires]
    );
    
    const user_id = result.insertId;
    
    // Create default user settings
    await db.query(
      'INSERT INTO user_settings (user_id) VALUES (?)',
      [user_id]
    );
    
    // Get created user
    const [users] = await db.query(
      `SELECT id, email, first_name, last_name, phone, email_verified, status, created_at
       FROM app_users WHERE id = ?`,
      [user_id]
    );
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: users[0]
    });
    
  } catch (error) {
    console.error('Create app user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user'
    });
  }
}

/**
 * Get all users for a specific app
 * GET /api/v1/apps/:appId/users
 */
async function getAppUsers(req, res) {
  try {
    const { appId } = req.params;
    const { search, status, email_verified, page = 1, per_page = 50, sort_by = 'created_at', sort_order = 'DESC' } = req.query;
    
    // Build WHERE clause
    let whereConditions = ['app_id = ?'];
    let queryParams = [appId];
    
    if (search) {
      whereConditions.push('(email LIKE ? OR first_name LIKE ? OR last_name LIKE ?)');
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }
    
    if (status) {
      whereConditions.push('status = ?');
      queryParams.push(status);
    }
    
    if (email_verified !== undefined) {
      whereConditions.push('email_verified = ?');
      queryParams.push(email_verified === 'true' ? 1 : 0);
    }
    
    const whereClause = whereConditions.join(' AND ');
    
    // Get total count
    const [countResult] = await db.query(
      `SELECT COUNT(*) as total FROM app_users WHERE ${whereClause}`,
      queryParams
    );
    const total = countResult && countResult[0] ? countResult[0].total : 0;
    
    // Calculate pagination
    const limit = parseInt(per_page);
    const offset = (parseInt(page) - 1) * limit;
    
    // Validate sort column
    const allowedSortColumns = ['id', 'email', 'first_name', 'last_name', 'created_at', 'last_login_at', 'status'];
    const sortColumn = allowedSortColumns.includes(sort_by) ? sort_by : 'created_at';
    const sortDirection = sort_order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    
    // Get users
    const [users] = await db.query(
      `SELECT 
        id, email, first_name, last_name, phone, 
        email_verified, status, last_login_at, created_at
       FROM app_users 
       WHERE ${whereClause}
       ORDER BY ${sortColumn} ${sortDirection}
       LIMIT ${limit} OFFSET ${offset}`,
      queryParams
    );
    
    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          per_page: limit,
          total,
          total_pages: Math.ceil(total / limit)
        }
      }
    });
    
  } catch (error) {
    console.error('Get app users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch app users'
    });
  }
}

/**
 * Get app user statistics
 * GET /api/v1/apps/:appId/users/stats
 */
async function getAppUserStats(req, res) {
  try {
    const { appId } = req.params;
    
    // Get various stats
    const [stats] = await db.query(
      `SELECT 
        COUNT(*) as total_users,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_users,
        SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) as inactive_users,
        SUM(CASE WHEN status = 'suspended' THEN 1 ELSE 0 END) as suspended_users,
        SUM(CASE WHEN email_verified = TRUE THEN 1 ELSE 0 END) as verified_users,
        SUM(CASE WHEN email_verified = FALSE THEN 1 ELSE 0 END) as unverified_users,
        SUM(CASE WHEN last_login_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as active_last_7_days,
        SUM(CASE WHEN last_login_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as active_last_30_days,
        SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as new_last_7_days,
        SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as new_last_30_days
       FROM app_users 
       WHERE app_id = ?`,
      [appId]
    );
    
    res.json({
      success: true,
      data: stats[0]
    });
    
  } catch (error) {
    console.error('Get app user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user statistics'
    });
  }
}

/**
 * Get single app user details
 * GET /api/v1/apps/:appId/users/:userId
 */
async function getAppUser(req, res) {
  try {
    const { appId, userId } = req.params;
    
    // Get user details
    const [users] = await db.query(
      `SELECT 
        id, app_id, email, first_name, last_name, phone, bio, 
        avatar_url, date_of_birth, gender, email_verified, status, 
        last_login_at, created_at, updated_at
       FROM app_users 
       WHERE id = ? AND app_id = ?`,
      [userId, appId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const user = users[0];
    
    // Get user settings
    const [settings] = await db.query(
      'SELECT * FROM user_settings WHERE user_id = ?',
      [userId]
    );
    
    // Get recent activity (last 10 actions)
    const [activity] = await db.query(
      `SELECT action, resource_type, resource_id, ip_address, created_at
       FROM user_activity_log 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT 10`,
      [userId]
    );
    
    // Get active sessions count
    const [sessions] = await db.query(
      `SELECT COUNT(*) as active_sessions
       FROM user_sessions 
       WHERE user_id = ? AND expires_at > NOW()`,
      [userId]
    );
    
    res.json({
      success: true,
      data: {
        user,
        settings: settings[0] || null,
        recent_activity: activity,
        active_sessions: sessions[0].active_sessions
      }
    });
    
  } catch (error) {
    console.error('Get app user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user details'
    });
  }
}

/**
 * Update app user
 * PUT /api/v1/apps/:appId/users/:userId
 */
async function updateAppUser(req, res) {
  try {
    const { appId, userId } = req.params;
    const { first_name, last_name, phone, bio, date_of_birth, gender } = req.body;
    
    // Check if user exists
    const [users] = await db.query(
      'SELECT id FROM app_users WHERE id = ? AND app_id = ?',
      [userId, appId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Update user
    await db.query(
      `UPDATE app_users 
       SET first_name = ?, last_name = ?, phone = ?, bio = ?, 
           date_of_birth = ?, gender = ?, updated_at = NOW()
       WHERE id = ? AND app_id = ?`,
      [first_name, last_name, phone, bio, date_of_birth, gender, userId, appId]
    );
    
    // Get updated user
    const [updatedUsers] = await db.query(
      `SELECT id, email, first_name, last_name, phone, bio, 
              date_of_birth, gender, email_verified, status, 
              last_login_at, created_at, updated_at
       FROM app_users 
       WHERE id = ? AND app_id = ?`,
      [userId, appId]
    );
    
    res.json({
      success: true,
      message: 'User updated successfully',
      data: updatedUsers[0]
    });
    
  } catch (error) {
    console.error('Update app user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    });
  }
}

/**
 * Update app user status
 * PUT /api/v1/apps/:appId/users/:userId/status
 */
async function updateAppUserStatus(req, res) {
  try {
    const { appId, userId } = req.params;
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['active', 'inactive', 'suspended', 'deleted'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: active, inactive, suspended, deleted'
      });
    }
    
    // Check if user exists
    const [users] = await db.query(
      'SELECT id FROM app_users WHERE id = ? AND app_id = ?',
      [userId, appId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Update status
    await db.query(
      'UPDATE app_users SET status = ?, updated_at = NOW() WHERE id = ? AND app_id = ?',
      [status, userId, appId]
    );
    
    // If suspended or deleted, invalidate all sessions
    if (status === 'suspended' || status === 'deleted') {
      await db.query(
        'DELETE FROM user_sessions WHERE user_id = ?',
        [userId]
      );
    }
    
    res.json({
      success: true,
      message: `User status updated to ${status}`,
      data: { status }
    });
    
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status'
    });
  }
}

/**
 * Delete app user
 * DELETE /api/v1/apps/:appId/users/:userId
 */
async function deleteAppUser(req, res) {
  try {
    const { appId, userId } = req.params;
    
    // Check if user exists
    const [users] = await db.query(
      'SELECT id FROM app_users WHERE id = ? AND app_id = ?',
      [userId, appId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Delete user (cascade will delete sessions, settings, activity logs)
    await db.query(
      'DELETE FROM app_users WHERE id = ? AND app_id = ?',
      [userId, appId]
    );
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete app user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
}

/**
 * Resend verification email
 * POST /api/v1/apps/:appId/users/:userId/resend-verification
 */
async function resendVerificationEmail(req, res) {
  try {
    const { appId, userId } = req.params;
    
    // Get user
    const [users] = await db.query(
      'SELECT id, email, email_verified FROM app_users WHERE id = ? AND app_id = ?',
      [userId, appId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const user = users[0];
    
    if (user.email_verified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }
    
    // Generate new verification token
    const crypto = require('crypto');
    const email_verification_token = crypto.randomBytes(32).toString('hex');
    const email_verification_expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    // Update user
    await db.query(
      `UPDATE app_users 
       SET email_verification_token = ?, email_verification_expires = ?
       WHERE id = ?`,
      [email_verification_token, email_verification_expires, userId]
    );
    
    // TODO: Send email with verification token
    
    res.json({
      success: true,
      message: 'Verification email sent',
      data: {
        email_verification_token // Remove in production
      }
    });
    
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend verification email'
    });
  }
}

module.exports = {
  createAppUser,
  getAppUsers,
  getAppUserStats,
  getAppUser,
  updateAppUser,
  updateAppUserStatus,
  deleteAppUser,
  resendVerificationEmail
};
