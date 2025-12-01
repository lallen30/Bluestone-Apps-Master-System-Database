const bcrypt = require('bcryptjs');
const { query, queryOne } = require('../config/database');

// Get all users (Master Admin and Admins only)
const getAllUsers = async (req, res) => {
  try {
    const { role_id, is_active, search } = req.query;
    
    let sql = `
      SELECT u.id, u.email, u.first_name, u.last_name, u.role_id, 
             u.is_active, u.last_login, u.created_at, u.updated_at,
             r.name as role_name, r.level as role_level
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE 1=1
    `;
    const params = [];

    if (role_id) {
      sql += ' AND u.role_id = ?';
      params.push(role_id);
    }

    if (is_active !== undefined) {
      sql += ' AND u.is_active = ?';
      params.push(is_active === 'true' ? 1 : 0);
    }

    if (search) {
      sql += ' AND (u.email LIKE ? OR u.first_name LIKE ? OR u.last_name LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    sql += ' ORDER BY u.created_at DESC';

    const users = await query(sql, params);

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get users',
      error: error.message
    });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await queryOne(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.role_id, 
              u.is_active, u.last_login, u.created_at, u.updated_at,
              r.name as role_name, r.level as role_level
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.id = ?`,
      [id]
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's app permissions
    const apps = await query(
      `SELECT s.*, usp.can_view, usp.can_edit, usp.can_delete,
              usp.can_publish, usp.can_manage_users, usp.can_manage_settings,
              usp.custom_permissions
       FROM apps s
       JOIN user_app_permissions usp ON s.id = usp.app_id
       WHERE usp.user_id = ?`,
      [id]
    );

    res.json({
      success: true,
      data: {
        ...user,
        apps
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user',
      error: error.message
    });
  }
};

// Create new user (Master Admin only)
const createUser = async (req, res) => {
  try {
    const { email, password, first_name, last_name, role_id } = req.body;

    // Check if email already exists
    const existingUser = await queryOne(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role_id) 
       VALUES (?, ?, ?, ?, ?)`,
      [email, hashedPassword, first_name, last_name, role_id]
    );

    // Log activity
    await query(
      `INSERT INTO activity_logs (user_id, action, description, ip_address) 
       VALUES (?, 'user.create', ?, ?)`,
      [req.user.id, `Created user: ${email}`, req.ip]
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        id: result.insertId,
        email,
        first_name,
        last_name,
        role_id
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: error.message
    });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if user exists
    const user = await queryOne('SELECT * FROM users WHERE id = ?', [id]);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Build update query
    const fields = [];
    const values = [];

    if (updates.email) {
      // Check if new email already exists
      const existingUser = await queryOne(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [updates.email, id]
      );
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
      fields.push('email = ?');
      values.push(updates.email);
    }

    if (updates.first_name) {
      fields.push('first_name = ?');
      values.push(updates.first_name);
    }

    if (updates.last_name) {
      fields.push('last_name = ?');
      values.push(updates.last_name);
    }

    if (updates.role_id) {
      fields.push('role_id = ?');
      values.push(updates.role_id);
    }

    if (updates.is_active !== undefined) {
      fields.push('is_active = ?');
      values.push(updates.is_active);
    }

    if (updates.password) {
      // If user is updating their own password, verify current password
      if (req.user.id === parseInt(id) && updates.current_password) {
        const isValidPassword = await bcrypt.compare(updates.current_password, user.password_hash);
        if (!isValidPassword) {
          return res.status(400).json({
            success: false,
            message: 'Current password is incorrect'
          });
        }
      }
      // Hash the new password
      const hashedPassword = await bcrypt.hash(updates.password, 10);
      fields.push('password_hash = ?');
      values.push(hashedPassword);
    }

    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    values.push(id);

    await query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    // Log activity
    await query(
      `INSERT INTO activity_logs (user_id, action, description, ip_address) 
       VALUES (?, 'user.update', ?, ?)`,
      [req.user.id, `Updated user ID: ${id}`, req.ip]
    );

    res.json({
      success: true,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message
    });
  }
};

// Delete user (soft delete - set inactive)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await queryOne('SELECT * FROM users WHERE id = ?', [id]);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deleting yourself
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    // Soft delete - set inactive
    await query('UPDATE users SET is_active = FALSE WHERE id = ?', [id]);

    // Log activity
    await query(
      `INSERT INTO activity_logs (user_id, action, description, ip_address) 
       VALUES (?, 'user.delete', ?, ?)`,
      [req.user.id, `Deleted user ID: ${id}`, req.ip]
    );

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
};

// Get all system roles
const getRoles = async (req, res) => {
  try {
    const roles = await query('SELECT id, name, description, level FROM roles ORDER BY level');
    
    res.json({
      success: true,
      data: roles
    });
  } catch (error) {
    console.error('Get roles error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get roles',
      error: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getRoles
};
