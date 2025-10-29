const { query, queryOne } = require('../config/database');

// Get all apps
const getAllApps = async (req, res) => {
  try {
    const { is_active, search } = req.query;
    
    let sql = `
      SELECT s.*, 
             CONCAT(u.first_name, ' ', u.last_name) as created_by_name,
             (SELECT COUNT(*) FROM user_app_permissions WHERE app_id = s.id) as user_count
      FROM apps s
      LEFT JOIN users u ON s.created_by = u.id
      WHERE 1=1
    `;
    const params = [];

    // Master Admin sees all apps, others see only their assigned apps
    if (req.user.role_level !== 1) {
      sql += ' AND s.id IN (SELECT app_id FROM user_app_permissions WHERE user_id = ?)';
      params.push(req.user.id);
    }

    if (is_active !== undefined) {
      sql += ' AND s.is_active = ?';
      params.push(is_active === 'true' ? 1 : 0);
    }

    if (search) {
      sql += ' AND (s.name LIKE ? OR s.domain LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    sql += ' ORDER BY s.created_at DESC';

    const apps = await query(sql, params);

    res.json({
      success: true,
      data: apps
    });
  } catch (error) {
    console.error('Get all apps error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get apps',
      error: error.message
    });
  }
};

// Get app by ID
const getAppById = async (req, res) => {
  try {
    const { id } = req.params;

    const app = await queryOne(
      `SELECT s.*, 
              CONCAT(u.first_name, ' ', u.last_name) as created_by_name
       FROM apps s
       LEFT JOIN users u ON s.created_by = u.id
       WHERE s.id = ?`,
      [id]
    );

    if (!app) {
      return res.status(404).json({
        success: false,
        message: 'App not found'
      });
    }

    // Get app settings
    const settings = await query(
      'SELECT setting_key, setting_value FROM app_settings WHERE app_id = ?',
      [id]
    );

    // Get users with access to this app
    const users = await query(
      `SELECT u.id, u.email, u.first_name, u.last_name, r.name as role_name,
              usp.can_view, usp.can_edit, usp.can_delete, usp.can_publish,
              usp.can_manage_users, usp.can_manage_settings
       FROM users u
       JOIN roles r ON u.role_id = r.id
       JOIN user_app_permissions usp ON u.id = usp.user_id
       WHERE usp.app_id = ? AND u.is_active = TRUE`,
      [id]
    );

    res.json({
      success: true,
      data: {
        ...app,
        settings,
        users
      }
    });
  } catch (error) {
    console.error('Get app error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get app',
      error: error.message
    });
  }
};

// Create new app
const createApp = async (req, res) => {
  try {
    const { name, domain, description, is_active = true } = req.body;

    // Check if domain already exists
    const existingApp = await queryOne(
      'SELECT id FROM apps WHERE domain = ?',
      [domain]
    );

    if (existingApp) {
      return res.status(400).json({
        success: false,
        message: 'Domain already exists'
      });
    }

    // Create app
    const result = await query(
      `INSERT INTO apps (name, domain, description, is_active, created_by) 
       VALUES (?, ?, ?, ?, ?)`,
      [name, domain, description, is_active, req.user.id]
    );

    // Log activity
    await query(
      `INSERT INTO activity_logs (user_id, app_id, action, description, ip_address) 
       VALUES (?, ?, 'app.create', ?, ?)`,
      [req.user.id, result.insertId, `Created app: ${name}`, req.ip]
    );

    res.status(201).json({
      success: true,
      message: 'App created successfully',
      data: {
        id: result.insertId,
        name,
        domain,
        description,
        is_active
      }
    });
  } catch (error) {
    console.error('Create app error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create app',
      error: error.message
    });
  }
};

// Update app
const updateApp = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if app exists
    const app = await queryOne('SELECT * FROM apps WHERE id = ?', [id]);
    
    if (!app) {
      return res.status(404).json({
        success: false,
        message: 'App not found'
      });
    }

    // Build update query
    const fields = [];
    const values = [];

    if (updates.name) {
      fields.push('name = ?');
      values.push(updates.name);
    }

    if (updates.domain) {
      // Check if new domain already exists
      const existingApp = await queryOne(
        'SELECT id FROM apps WHERE domain = ? AND id != ?',
        [updates.domain, id]
      );
      if (existingApp) {
        return res.status(400).json({
          success: false,
          message: 'Domain already exists'
        });
      }
      fields.push('domain = ?');
      values.push(updates.domain);
    }

    if (updates.description !== undefined) {
      fields.push('description = ?');
      values.push(updates.description);
    }

    if (updates.is_active !== undefined) {
      fields.push('is_active = ?');
      values.push(updates.is_active);
    }

    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    values.push(id);

    await query(
      `UPDATE apps SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    // Log activity
    await query(
      `INSERT INTO activity_logs (user_id, app_id, action, description, ip_address) 
       VALUES (?, ?, 'app.update', ?, ?)`,
      [req.user.id, id, `Updated app ID: ${id}`, req.ip]
    );

    res.json({
      success: true,
      message: 'App updated successfully'
    });
  } catch (error) {
    console.error('Update app error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update app',
      error: error.message
    });
  }
};

// Delete app
const deleteApp = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if app exists
    const app = await queryOne('SELECT * FROM apps WHERE id = ?', [id]);
    
    if (!app) {
      return res.status(404).json({
        success: false,
        message: 'App not found'
      });
    }

    // Delete app (cascade will handle related records)
    await query('DELETE FROM apps WHERE id = ?', [id]);

    // Log activity
    await query(
      `INSERT INTO activity_logs (user_id, action, description, ip_address) 
       VALUES (?, 'app.delete', ?, ?)`,
      [req.user.id, `Deleted app: ${app.name}`, req.ip]
    );

    res.json({
      success: true,
      message: 'App deleted successfully'
    });
  } catch (error) {
    console.error('Delete app error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete app',
      error: error.message
    });
  }
};

// Get app settings
const getAppSettings = async (req, res) => {
  try {
    const { id } = req.params;

    const settings = await query(
      'SELECT * FROM app_settings WHERE app_id = ?',
      [id]
    );

    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Get app settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get app settings',
      error: error.message
    });
  }
};

// Update app settings
const updateAppSettings = async (req, res) => {
  try {
    const { id } = req.params;
    const settings = req.body;

    // Check if app exists
    const app = await queryOne('SELECT * FROM apps WHERE id = ?', [id]);
    
    if (!app) {
      return res.status(404).json({
        success: false,
        message: 'App not found'
      });
    }

    // Update or insert settings
    for (const [key, value] of Object.entries(settings)) {
      await query(
        `INSERT INTO app_settings (app_id, setting_key, setting_value) 
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE setting_value = ?`,
        [id, key, value, value]
      );
    }

    // Log activity
    await query(
      `INSERT INTO activity_logs (user_id, app_id, action, description, ip_address) 
       VALUES (?, ?, 'app.settings_update', ?, ?)`,
      [req.user.id, id, `Updated settings for app ID: ${id}`, req.ip]
    );

    res.json({
      success: true,
      message: 'App settings updated successfully'
    });
  } catch (error) {
    console.error('Update app settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update app settings',
      error: error.message
    });
  }
};

// Get app by domain
const getAppByDomain = async (req, res) => {
  try {
    const { domain } = req.params;

    const app = await queryOne(
      `SELECT * FROM apps WHERE domain = ? AND is_active = TRUE`,
      [domain]
    );

    if (!app) {
      return res.status(404).json({
        success: false,
        message: 'App not found for this domain'
      });
    }

    res.json({
      success: true,
      data: app
    });
  } catch (error) {
    console.error('Get app by domain error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get app',
      error: error.message
    });
  }
};

module.exports = {
  getAllApps,
  getAppById,
  createApp,
  updateApp,
  deleteApp,
  getAppSettings,
  updateAppSettings,
  getAppByDomain
};
