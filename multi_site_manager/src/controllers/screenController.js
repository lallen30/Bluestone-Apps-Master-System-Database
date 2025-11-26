const { query, queryOne } = require('../config/database');

// Get all screens for an app
const getAppScreens = async (req, res) => {
  try {
    const { app_id } = req.params;
    const { is_published } = req.query;

    let sql = `
      SELECT s.*, 
             CONCAT(u.first_name, ' ', u.last_name) as created_by_name
      FROM screens s
      LEFT JOIN users u ON s.created_by = u.id
      WHERE s.app_id = ?
    `;
    const params = [app_id];

    if (is_published !== undefined) {
      sql += ' AND s.is_published = ?';
      params.push(is_published === 'true' ? 1 : 0);
    }

    sql += ' ORDER BY s.display_order ASC, s.created_at DESC';

    const screens = await query(sql, params);

    res.json({
      success: true,
      data: screens
    });
  } catch (error) {
    console.error('Get app screens error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get screens',
      error: error.message
    });
  }
};

// Get screen by ID
const getScreenById = async (req, res) => {
  try {
    const { id } = req.params;

    const screen = await queryOne(
      `SELECT s.*, 
              CONCAT(u.first_name, ' ', u.last_name) as created_by_name
       FROM screens s
       LEFT JOIN users u ON s.created_by = u.id
       WHERE s.id = ?`,
      [id]
    );

    if (!screen) {
      return res.status(404).json({
        success: false,
        message: 'Screen not found'
      });
    }

    // Fetch element instances with form references
    const elements = await query(
      `SELECT 
        sei.id,
        sei.element_id,
        sei.field_key,
        sei.label,
        sei.placeholder,
        sei.default_value,
        sei.is_required,
        sei.is_readonly,
        sei.display_order,
        sei.config,
        sei.validation_rules,
        sei.form_id,
        se.name as element_name,
        se.element_type,
        se.category,
        se.icon,
        se.has_options,
        se.is_content_field,
        se.is_input_field,
        f.name as form_name,
        f.form_key,
        f.form_type,
        (SELECT COUNT(*) FROM app_form_elements WHERE form_id = sei.form_id) as form_field_count
       FROM screen_element_instances sei
       JOIN screen_elements se ON sei.element_id = se.id
       LEFT JOIN app_forms f ON sei.form_id = f.id
       WHERE sei.screen_id = ?
       ORDER BY sei.display_order`,
      [id]
    );

    screen.elements = elements;

    res.json({
      success: true,
      data: screen
    });
  } catch (error) {
    console.error('Get screen error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get screen',
      error: error.message
    });
  }
};

// Create screen
const createScreen = async (req, res) => {
  try {
    const {
      app_id,
      name,
      slug,
      description,
      screen_type = 'page',
      content,
      is_published = false,
      display_order = 0
    } = req.body;

    // Check if slug already exists for this app
    const existing = await queryOne(
      'SELECT id FROM screens WHERE app_id = ? AND slug = ?',
      [app_id, slug]
    );

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A screen with this slug already exists for this app'
      });
    }

    const result = await query(
      `INSERT INTO screens 
       (app_id, name, slug, description, screen_type, content, is_published, display_order, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        app_id,
        name,
        slug,
        description,
        screen_type,
        content ? JSON.stringify(content) : null,
        is_published,
        display_order,
        req.user.id
      ]
    );

    // Log activity
    await query(
      `INSERT INTO activity_logs (user_id, app_id, action, description, ip_address)
       VALUES (?, ?, 'screen.create', ?, ?)`,
      [req.user.id, app_id, `Created screen: ${name}`, req.ip]
    );

    res.status(201).json({
      success: true,
      message: 'Screen created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Create screen error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create screen',
      error: error.message
    });
  }
};

// Update screen
const updateScreen = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if screen exists
    const screen = await queryOne('SELECT * FROM screens WHERE id = ?', [id]);

    if (!screen) {
      return res.status(404).json({
        success: false,
        message: 'Screen not found'
      });
    }

    // Build update query
    const fields = [];
    const values = [];

    const allowedFields = [
      'name', 'slug', 'description', 'screen_type',
      'is_published', 'display_order'
    ];

    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(updates[field]);
      }
    });

    if (updates.content !== undefined) {
      fields.push('content = ?');
      values.push(updates.content ? JSON.stringify(updates.content) : null);
    }

    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    values.push(id);

    await query(
      `UPDATE screens SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    // Log activity
    await query(
      `INSERT INTO activity_logs (user_id, app_id, action, description, ip_address)
       VALUES (?, ?, 'screen.update', ?, ?)`,
      [req.user.id, screen.app_id, `Updated screen: ${screen.name}`, req.ip]
    );

    res.json({
      success: true,
      message: 'Screen updated successfully'
    });
  } catch (error) {
    console.error('Update screen error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update screen',
      error: error.message
    });
  }
};

// Delete screen
const deleteScreen = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if screen exists
    const screen = await queryOne('SELECT * FROM screens WHERE id = ?', [id]);

    if (!screen) {
      return res.status(404).json({
        success: false,
        message: 'Screen not found'
      });
    }

    await query('DELETE FROM screens WHERE id = ?', [id]);

    // Log activity
    await query(
      `INSERT INTO activity_logs (user_id, app_id, action, description, ip_address)
       VALUES (?, ?, 'screen.delete', ?, ?)`,
      [req.user.id, screen.app_id, `Deleted screen: ${screen.name}`, req.ip]
    );

    res.json({
      success: true,
      message: 'Screen deleted successfully'
    });
  } catch (error) {
    console.error('Delete screen error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete screen',
      error: error.message
    });
  }
};

module.exports = {
  getAppScreens,
  getScreenById,
  createScreen,
  updateScreen,
  deleteScreen
};
