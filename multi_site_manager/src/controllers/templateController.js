const db = require('../config/database');

// Get all templates
exports.getAllTemplates = async (req, res) => {
  try {
    const templates = await db.query(
      `SELECT * FROM screen_templates WHERE is_active = 1 ORDER BY category, name`
    );
    
    res.json({
      success: true,
      data: templates
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching templates'
    });
  }
};

// Get template by ID with elements
exports.getTemplateById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get template details
    const templates = await db.query(
      'SELECT * FROM screen_templates WHERE id = ? AND is_active = 1',
      [id]
    );
    
    if (templates.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }
    
    // Get template elements
    const elements = await db.query(
      `SELECT te.*, se.element_type, se.name as element_name
       FROM template_elements te
       JOIN screen_elements se ON te.element_id = se.id
       WHERE te.template_id = ?
       ORDER BY te.display_order`,
      [id]
    );
    
    res.json({
      success: true,
      data: {
        ...templates[0],
        elements
      }
    });
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching template'
    });
  }
};

// Create screen from template
exports.createScreenFromTemplate = async (req, res) => {
  try {
    const { template_id, screen_name, screen_description, created_by } = req.body;
    
    // Get template with elements
    const templates = await db.query(
      'SELECT * FROM screen_templates WHERE id = ? AND is_active = 1',
      [template_id]
    );
    
    if (templates.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }
    
    const template = templates[0];
    
    // Generate screen key from name
    const screen_key = screen_name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
    
    // Create the screen
    const screenResult = await db.query(
      `INSERT INTO app_screens (name, screen_key, description, icon, category, created_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [screen_name, screen_key, screen_description || template.description, template.icon, template.category, created_by]
    );
    
    const screenId = screenResult.insertId;
    
    // Get template elements
    const templateElements = await db.query(
      `SELECT * FROM template_elements WHERE template_id = ? ORDER BY display_order`,
      [template_id]
    );
    
    // Copy elements to the new screen
    for (const element of templateElements) {
      await db.query(
        `INSERT INTO screen_element_instances 
         (screen_id, element_id, label, field_key, placeholder, default_value, is_required, is_readonly, display_order, config)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          screenId,
          element.element_id,
          element.label,
          element.field_key,
          element.placeholder,
          element.default_value,
          element.is_required,
          element.is_readonly,
          element.display_order,
          element.config ? JSON.stringify(element.config) : null
        ]
      );
    }
    
    res.json({
      success: true,
      message: 'Screen created from template successfully',
      data: {
        screen_id: screenId,
        screen_key
      }
    });
  } catch (error) {
    console.error('Error creating screen from template:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating screen from template'
    });
  }
};

// Clone existing screen
exports.cloneScreen = async (req, res) => {
  try {
    const { screen_id } = req.params;
    const { new_name, created_by } = req.body;
    
    // Get original screen
    const screens = await db.query(
      'SELECT * FROM app_screens WHERE id = ?',
      [screen_id]
    );
    
    if (screens.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Screen not found'
      });
    }
    
    const originalScreen = screens[0];
    
    // Generate new screen key
    const screen_key = new_name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
    
    // Create cloned screen
    const screenResult = await db.query(
      `INSERT INTO app_screens (name, screen_key, description, icon, category, created_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [new_name, screen_key, originalScreen.description, originalScreen.icon, originalScreen.category, created_by]
    );
    
    const newScreenId = screenResult.insertId;
    
    // Get original screen elements
    const elements = await db.query(
      `SELECT * FROM screen_element_instances WHERE screen_id = ? ORDER BY display_order`,
      [screen_id]
    );
    
    // Copy elements to the new screen
    for (const element of elements) {
      await db.query(
        `INSERT INTO screen_element_instances 
         (screen_id, element_id, label, field_key, placeholder, default_value, is_required, is_readonly, display_order, config)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newScreenId,
          element.element_id,
          element.label,
          element.field_key,
          element.placeholder,
          element.default_value,
          element.is_required,
          element.is_readonly,
          element.display_order,
          element.config ? JSON.stringify(element.config) : null
        ]
      );
    }
    
    res.json({
      success: true,
      message: 'Screen cloned successfully',
      data: {
        screen_id: newScreenId,
        screen_key
      }
    });
  } catch (error) {
    console.error('Error cloning screen:', error);
    res.status(500).json({
      success: false,
      message: 'Error cloning screen'
    });
  }
};

module.exports = exports;
