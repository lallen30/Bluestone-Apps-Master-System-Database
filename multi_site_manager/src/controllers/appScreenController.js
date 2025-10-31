const db = require('../config/database');

// Get all app screens
exports.getAllScreens = async (req, res) => {
  try {
    const screens = await db.query(
      `SELECT s.*, u.first_name, u.last_name,
              (SELECT COUNT(*) FROM app_screen_assignments WHERE screen_id = s.id) as app_count
       FROM app_screens s
       LEFT JOIN users u ON s.created_by = u.id
       WHERE s.is_active = 1
       ORDER BY s.created_at DESC`
    );
    
    res.json({
      success: true,
      data: screens
    });
  } catch (error) {
    console.error('Error fetching screens:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching screens'
    });
  }
};

// Get screen by ID with elements
exports.getScreenById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get screen details
    const screens = await db.query(
      `SELECT s.*, u.first_name, u.last_name
       FROM app_screens s
       LEFT JOIN users u ON s.created_by = u.id
       WHERE s.id = ?`,
      [id]
    );
    
    if (screens.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Screen not found'
      });
    }
    
    // Get screen elements
    const elements = await db.query(
      `SELECT sei.*, se.name as element_name, se.element_type, se.category, 
              se.icon, se.has_options, se.is_content_field, se.is_input_field
       FROM screen_element_instances sei
       JOIN screen_elements se ON sei.element_id = se.id
       WHERE sei.screen_id = ?
       ORDER BY sei.display_order`,
      [id]
    );
    
    res.json({
      success: true,
      data: {
        ...screens[0],
        elements
      }
    });
  } catch (error) {
    console.error('Error fetching screen:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching screen'
    });
  }
};

// Create new screen
exports.createScreen = async (req, res) => {
  try {
    const { name, screen_key, description, icon, category } = req.body;
    const created_by = req.user.id;
    
    const [result] = await db.query(
      `INSERT INTO app_screens (name, screen_key, description, icon, category, created_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, screen_key, description, icon, category, created_by]
    );
    
    res.status(201).json({
      success: true,
      message: 'Screen created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Error creating screen:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'Screen key already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error creating screen'
    });
  }
};

// Update screen
exports.updateScreen = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, icon, category, is_active } = req.body;
    
    await db.query(
      `UPDATE app_screens 
       SET name = ?, description = ?, icon = ?, category = ?, is_active = ?
       WHERE id = ?`,
      [name, description, icon, category, is_active, id]
    );
    
    res.json({
      success: true,
      message: 'Screen updated successfully'
    });
  } catch (error) {
    console.error('Error updating screen:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating screen'
    });
  }
};

// Delete screen
exports.deleteScreen = async (req, res) => {
  try {
    const { id } = req.params;
    
    await db.query('DELETE FROM app_screens WHERE id = ?', [id]);
    
    res.json({
      success: true,
      message: 'Screen deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting screen:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting screen'
    });
  }
};

// Add element to screen
exports.addElementToScreen = async (req, res) => {
  try {
    const { screen_id, element_id, field_key, label, placeholder, default_value, 
            is_required, is_readonly, display_order, config, validation_rules } = req.body;
    
    const [result] = await db.query(
      `INSERT INTO screen_element_instances 
       (screen_id, element_id, field_key, label, placeholder, default_value, 
        is_required, is_readonly, display_order, config, validation_rules)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [screen_id, element_id, field_key, label, placeholder, default_value,
       is_required, is_readonly, display_order, 
       config ? JSON.stringify(config) : null,
       validation_rules ? JSON.stringify(validation_rules) : null]
    );
    
    res.status(201).json({
      success: true,
      message: 'Element added to screen successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Error adding element to screen:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'Field key already exists on this screen'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error adding element to screen'
    });
  }
};

// Update element instance
exports.updateElementInstance = async (req, res) => {
  try {
    const { id } = req.params;
    const { label, placeholder, default_value, is_required, is_readonly, 
            display_order, config, validation_rules } = req.body;
    
    await db.query(
      `UPDATE screen_element_instances 
       SET label = ?, placeholder = ?, default_value = ?, is_required = ?, 
           is_readonly = ?, display_order = ?, config = ?, validation_rules = ?
       WHERE id = ?`,
      [label, placeholder, default_value, is_required, is_readonly, display_order,
       config ? JSON.stringify(config) : null,
       validation_rules ? JSON.stringify(validation_rules) : null,
       id]
    );
    
    res.json({
      success: true,
      message: 'Element updated successfully'
    });
  } catch (error) {
    console.error('Error updating element instance:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating element'
    });
  }
};

// Delete element from screen
exports.deleteElementFromScreen = async (req, res) => {
  try {
    const { id } = req.params;
    
    await db.query('DELETE FROM screen_element_instances WHERE id = ?', [id]);
    
    res.json({
      success: true,
      message: 'Element removed from screen successfully'
    });
  } catch (error) {
    console.error('Error deleting element:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting element'
    });
  }
};

// Get screens for an app
exports.getAppScreens = async (req, res) => {
  try {
    const { app_id } = req.params;
    
    const screens = await db.query(
      `SELECT s.*, asa.is_active as assigned_active, asa.display_order as assigned_order,
              (SELECT COUNT(*) FROM screen_element_instances WHERE screen_id = s.id) as element_count
       FROM app_screen_assignments asa
       JOIN app_screens s ON asa.screen_id = s.id
       WHERE asa.app_id = ? AND asa.is_active = 1
       ORDER BY asa.display_order`,
      [app_id]
    );
    
    res.json({
      success: true,
      data: screens
    });
  } catch (error) {
    console.error('Error fetching app screens:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching app screens'
    });
  }
};

// Assign screen to app
exports.assignScreenToApp = async (req, res) => {
  try {
    const { app_id, screen_id, display_order } = req.body;
    const assigned_by = req.user.id;
    
    const [result] = await db.query(
      `INSERT INTO app_screen_assignments (app_id, screen_id, display_order, assigned_by)
       VALUES (?, ?, ?, ?)`,
      [app_id, screen_id, display_order || 0, assigned_by]
    );
    
    res.status(201).json({
      success: true,
      message: 'Screen assigned to app successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Error assigning screen to app:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'Screen already assigned to this app'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error assigning screen to app'
    });
  }
};

// Unassign screen from app
exports.unassignScreenFromApp = async (req, res) => {
  try {
    const { app_id, screen_id } = req.params;
    
    await db.query(
      'DELETE FROM app_screen_assignments WHERE app_id = ? AND screen_id = ?',
      [app_id, screen_id]
    );
    
    res.json({
      success: true,
      message: 'Screen unassigned from app successfully'
    });
  } catch (error) {
    console.error('Error unassigning screen:', error);
    res.status(500).json({
      success: false,
      message: 'Error unassigning screen'
    });
  }
};

// Get screen content for an app
exports.getAppScreenContent = async (req, res) => {
  try {
    const { app_id, screen_id } = req.params;
    
    // Get screen with elements
    const screens = await db.query(
      `SELECT s.* FROM app_screens s
       JOIN app_screen_assignments asa ON s.id = asa.screen_id
       WHERE asa.app_id = ? AND s.id = ? AND asa.is_active = 1`,
      [app_id, screen_id]
    );
    
    if (screens.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Screen not found for this app'
      });
    }
    
    // Get elements with content
    const elements = await db.query(
      `SELECT sei.*, se.name as element_name, se.element_type, se.category,
              se.icon, se.has_options, se.is_content_field, se.is_editable_by_app_admin,
              asc.content_value, asc.options as content_options
       FROM screen_element_instances sei
       JOIN screen_elements se ON sei.element_id = se.id
       LEFT JOIN app_screen_content asc ON asc.element_instance_id = sei.id 
              AND asc.app_id = ? AND asc.screen_id = ?
       WHERE sei.screen_id = ?
       ORDER BY sei.display_order`,
      [app_id, screen_id, screen_id]
    );
    
    res.json({
      success: true,
      data: {
        ...screens[0],
        elements
      }
    });
  } catch (error) {
    console.error('Error fetching app screen content:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching screen content'
    });
  }
};

// Update screen content for an app
exports.updateAppScreenContent = async (req, res) => {
  try {
    const { app_id, screen_id, element_instance_id, content_value, options } = req.body;
    const updated_by = req.user.id;
    
    await db.query(
      `INSERT INTO app_screen_content 
       (app_id, screen_id, element_instance_id, content_value, options, updated_by)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
       content_value = VALUES(content_value),
       options = VALUES(options),
       updated_by = VALUES(updated_by)`,
      [app_id, screen_id, element_instance_id, content_value,
       options ? JSON.stringify(options) : null, updated_by]
    );
    
    res.json({
      success: true,
      message: 'Content updated successfully'
    });
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating content'
    });
  }
};
