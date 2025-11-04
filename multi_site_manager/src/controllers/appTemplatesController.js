const db = require('../config/database');

/**
 * Get all app templates
 * GET /api/v1/app-templates
 */
const getAllAppTemplates = async (req, res) => {
  try {
    const templates = await db.query(
      `SELECT 
        at.*,
        COUNT(DISTINCT ats.id) as screen_count,
        CONCAT(u.first_name, ' ', u.last_name) as created_by_name
       FROM app_templates at
       LEFT JOIN app_template_screens ats ON at.id = ats.template_id
       LEFT JOIN users u ON at.created_by = u.id
       GROUP BY at.id
       ORDER BY at.category, at.name`
    );

    res.json({
      success: true,
      data: templates
    });
  } catch (error) {
    console.error('Get app templates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get app templates',
      error: error.message
    });
  }
};

/**
 * Get app template by ID with screens and elements
 * GET /api/v1/app-templates/:id
 */
const getAppTemplateById = async (req, res) => {
  try {
    const { id } = req.params;

    // Get template details
    const templates = await db.query(
      'SELECT * FROM app_templates WHERE id = ?',
      [id]
    );

    if (!templates || templates.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'App template not found'
      });
    }

    const template = templates[0];

    // Get screens for this template
    const screens = await db.query(
      `SELECT * FROM app_template_screens 
       WHERE template_id = ? 
       ORDER BY display_order`,
      [id]
    );

    // Get elements for each screen
    for (let screen of screens) {
      const elements = await db.query(
        `SELECT 
          atse.*,
          se.name as element_name,
          se.element_type,
          se.category as element_category,
          se.icon as element_icon
         FROM app_template_screen_elements atse
         JOIN screen_elements se ON atse.element_id = se.id
         WHERE atse.template_screen_id = ?
         ORDER BY atse.display_order`,
        [screen.id]
      );
      screen.elements = elements;
    }

    template.screens = screens;

    res.json({
      success: true,
      data: template
    });
  } catch (error) {
    console.error('Get app template by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get app template',
      error: error.message
    });
  }
};

/**
 * Create app from template
 * POST /api/v1/app-templates/create-from-template
 */
const createAppFromTemplate = async (req, res) => {
  try {
    const { template_id, app_name, app_domain, created_by } = req.body;

    // Validate required fields
    if (!template_id || !app_name || !created_by) {
      return res.status(400).json({
        success: false,
        message: 'Template ID, app name, and created_by are required'
      });
    }

    // Get template with screens and elements
    const templates = await db.query(
      'SELECT * FROM app_templates WHERE id = ?',
      [template_id]
    );

    if (!templates || templates.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'App template not found'
      });
    }

    const template = templates[0];

    // Generate domain from app name if not provided
    let domain = app_domain;
    if (!domain) {
      const baseDomain = app_name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      // Add timestamp to ensure uniqueness
      const timestamp = Date.now();
      domain = `${baseDomain}-${timestamp}.app`;
    }

    // Create the app
    const appResult = await db.query(
      `INSERT INTO apps (name, domain, description, is_active, created_by)
       VALUES (?, ?, ?, TRUE, ?)`,
      [app_name, domain, template.description, created_by]
    );

    const appId = appResult.insertId;

    // Get template screens
    const screens = await db.query(
      `SELECT * FROM app_template_screens 
       WHERE template_id = ? 
       ORDER BY display_order`,
      [template_id]
    );

    // Create screens and their elements
    for (let templateScreen of screens) {
      // Check if screen with this name already exists
      const existingScreens = await db.query(
        `SELECT id FROM app_screens WHERE name = ? LIMIT 1`,
        [templateScreen.screen_name]
      );

      let screenId;
      let isNewScreen = false;
      
      if (existingScreens && existingScreens.length > 0) {
        // Use existing screen
        screenId = existingScreens[0].id;
      } else {
        // Create new screen in app_screens (master screens table)
        const screenResult = await db.query(
          `INSERT INTO app_screens (name, screen_key, description, icon, category, is_active, created_by)
           VALUES (?, ?, ?, ?, ?, TRUE, ?)`,
          [
            templateScreen.screen_name,
            `${templateScreen.screen_key}_${appId}_${Date.now()}`, // Make screen_key unique
            templateScreen.screen_description,
            templateScreen.screen_icon,
            templateScreen.screen_category,
            created_by
          ]
        );
        screenId = screenResult.insertId;
        isNewScreen = true;
      }

      // Assign screen to app
      await db.query(
        `INSERT INTO app_screen_assignments (app_id, screen_id, is_active, display_order, assigned_by)
         VALUES (?, ?, TRUE, ?, ?)`,
        [appId, screenId, templateScreen.display_order, created_by]
      );

      // Only add elements if this is a new screen (existing screens already have elements)
      if (isNewScreen) {
        // Get elements for this template screen
        const elements = await db.query(
          `SELECT * FROM app_template_screen_elements 
           WHERE template_screen_id = ? 
           ORDER BY display_order`,
          [templateScreen.id]
        );

        // Create screen elements
        for (let element of elements) {
          await db.query(
            `INSERT INTO screen_element_instances 
             (screen_id, element_id, field_key, label, placeholder, default_value, 
              is_required, is_readonly, display_order, config, validation_rules)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              screenId,
              element.element_id,
              element.field_key,
              element.label,
              element.placeholder,
              element.default_value,
              element.is_required,
              element.is_readonly,
              element.display_order,
              element.config,
              element.validation_rules
            ]
          );
        }
      }
    }

    res.json({
      success: true,
      message: 'App created from template successfully',
      data: {
        app_id: appId,
        app_name: app_name,
        screens_created: screens.length
      }
    });
  } catch (error) {
    console.error('Create app from template error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create app from template',
      error: error.message
    });
  }
};

/**
 * Create a new app template
 * POST /api/v1/app-templates
 */
const createAppTemplate = async (req, res) => {
  try {
    const { name, description, category, icon, is_active, created_by } = req.body;

    if (!name || !created_by) {
      return res.status(400).json({
        success: false,
        message: 'Name and created_by are required'
      });
    }

    const result = await db.query(
      `INSERT INTO app_templates (name, description, category, icon, is_active, created_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, description, category, icon, is_active !== false, created_by]
    );

    res.json({
      success: true,
      message: 'App template created successfully',
      data: {
        id: result.insertId,
        name
      }
    });
  } catch (error) {
    console.error('Create app template error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create app template',
      error: error.message
    });
  }
};

/**
 * Update an app template
 * PUT /api/v1/app-templates/:id
 */
const updateAppTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, icon, is_active } = req.body;

    // Check if template exists
    const existing = await db.query(
      'SELECT id FROM app_templates WHERE id = ?',
      [id]
    );

    if (!existing || existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    // Build update query dynamically
    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    if (category !== undefined) {
      updates.push('category = ?');
      values.push(category);
    }
    if (icon !== undefined) {
      updates.push('icon = ?');
      values.push(icon);
    }
    if (is_active !== undefined) {
      updates.push('is_active = ?');
      values.push(is_active);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    values.push(id);
    await db.query(
      `UPDATE app_templates SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    res.json({
      success: true,
      message: 'App template updated successfully'
    });
  } catch (error) {
    console.error('Update app template error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update app template',
      error: error.message
    });
  }
};

/**
 * Delete an app template
 * DELETE /api/v1/app-templates/:id
 */
const deleteAppTemplate = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if template exists
    const existing = await db.query(
      'SELECT id, name FROM app_templates WHERE id = ?',
      [id]
    );

    if (!existing || existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    // Delete template (cascade will handle screens and elements)
    await db.query('DELETE FROM app_templates WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'App template deleted successfully'
    });
  } catch (error) {
    console.error('Delete app template error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete app template',
      error: error.message
    });
  }
};

/**
 * Add screen to app template
 * POST /api/v1/app-templates/:templateId/screens
 */
const addScreenToTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;
    const { screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen } = req.body;

    if (!screen_name || !screen_key) {
      return res.status(400).json({
        success: false,
        message: 'Screen name and key are required'
      });
    }

    const result = await db.query(
      `INSERT INTO app_template_screens 
       (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [templateId, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order || 0, is_home_screen || false]
    );

    res.json({
      success: true,
      message: 'Screen added to template successfully',
      data: {
        id: result.insertId,
        screen_name
      }
    });
  } catch (error) {
    console.error('Add screen to template error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add screen to template',
      error: error.message
    });
  }
};

/**
 * Update template screen
 * PUT /api/v1/app-templates/:templateId/screens/:screenId
 */
const updateTemplateScreen = async (req, res) => {
  try {
    const { templateId, screenId } = req.params;
    const { screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen } = req.body;

    // Check if screen exists
    const existing = await db.query(
      'SELECT id FROM app_template_screens WHERE id = ? AND template_id = ?',
      [screenId, templateId]
    );

    if (!existing || existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Screen not found'
      });
    }

    // Build update query dynamically
    const updates = [];
    const values = [];

    if (screen_name !== undefined) {
      updates.push('screen_name = ?');
      values.push(screen_name);
    }
    if (screen_key !== undefined) {
      updates.push('screen_key = ?');
      values.push(screen_key);
    }
    if (screen_description !== undefined) {
      updates.push('screen_description = ?');
      values.push(screen_description);
    }
    if (screen_icon !== undefined) {
      updates.push('screen_icon = ?');
      values.push(screen_icon);
    }
    if (screen_category !== undefined) {
      updates.push('screen_category = ?');
      values.push(screen_category);
    }
    if (display_order !== undefined) {
      updates.push('display_order = ?');
      values.push(display_order);
    }
    if (is_home_screen !== undefined) {
      updates.push('is_home_screen = ?');
      values.push(is_home_screen);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    values.push(screenId);
    values.push(templateId);
    await db.query(
      `UPDATE app_template_screens SET ${updates.join(', ')} WHERE id = ? AND template_id = ?`,
      values
    );

    res.json({
      success: true,
      message: 'Screen updated successfully'
    });
  } catch (error) {
    console.error('Update template screen error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update screen',
      error: error.message
    });
  }
};

/**
 * Delete template screen
 * DELETE /api/v1/app-templates/:templateId/screens/:screenId
 */
const deleteTemplateScreen = async (req, res) => {
  try {
    const { templateId, screenId } = req.params;

    // Check if screen exists
    const existing = await db.query(
      'SELECT id, screen_name FROM app_template_screens WHERE id = ? AND template_id = ?',
      [screenId, templateId]
    );

    if (!existing || existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Screen not found'
      });
    }

    // Delete screen (cascade will handle elements)
    await db.query('DELETE FROM app_template_screens WHERE id = ? AND template_id = ?', [screenId, templateId]);

    res.json({
      success: true,
      message: 'Screen deleted successfully'
    });
  } catch (error) {
    console.error('Delete template screen error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete screen',
      error: error.message
    });
  }
};

module.exports = {
  getAllAppTemplates,
  getAppTemplateById,
  createAppTemplate,
  updateAppTemplate,
  deleteAppTemplate,
  addScreenToTemplate,
  updateTemplateScreen,
  deleteTemplateScreen,
  createAppFromTemplate
};
