const db = require('../config/database');

/**
 * Get all modules
 */
exports.getAllModules = async (req, res) => {
  try {
    const query = `
      SELECT * FROM app_modules 
      WHERE is_active = 1 
      ORDER BY module_type, name
    `;
    
    const result = await db.query(query);
    const modules = Array.isArray(result) && Array.isArray(result[0]) ? result[0] : result;
    
    // Parse JSON fields
    const parsedModules = (modules || []).map(module => ({
      ...module,
      default_config: typeof module.default_config === 'string' 
        ? JSON.parse(module.default_config) 
        : module.default_config
    }));
    
    console.log('Modules fetched:', parsedModules.length);
    
    res.json({
      success: true,
      data: parsedModules
    });
  } catch (error) {
    console.error('Error fetching modules:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching modules',
      error: error.message
    });
  }
};

/**
 * Get a single module by ID
 */
exports.getModuleById = async (req, res) => {
  try {
    const { moduleId } = req.params;
    
    const query = 'SELECT * FROM app_modules WHERE id = ?';
    const result = await db.query(query, [moduleId]);
    const modules = Array.isArray(result) && Array.isArray(result[0]) ? result[0] : result;
    
    if (!modules || modules.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }
    
    res.json({
      success: true,
      data: modules[0]
    });
  } catch (error) {
    console.error('Error fetching module:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching module',
      error: error.message
    });
  }
};

/**
 * Assign a module to a screen
 */
exports.assignModuleToScreen = async (req, res) => {
  try {
    const { screenId } = req.params;
    const { module_id, config } = req.body;
    
    if (!module_id) {
      return res.status(400).json({
        success: false,
        message: 'module_id is required'
      });
    }
    
    // Check if assignment already exists
    const checkQuery = 'SELECT id FROM screen_module_assignments WHERE screen_id = ? AND module_id = ?';
    const checkResult = await db.query(checkQuery, [screenId, module_id]);
    const existing = Array.isArray(checkResult) && Array.isArray(checkResult[0]) ? checkResult[0] : checkResult;
    
    if (existing && existing.length > 0) {
      // Update existing assignment
      const updateQuery = `
        UPDATE screen_module_assignments 
        SET config = ?, is_active = 1, updated_at = CURRENT_TIMESTAMP 
        WHERE screen_id = ? AND module_id = ?
      `;
      await db.query(updateQuery, [JSON.stringify(config || {}), screenId, module_id]);
    } else {
      // Create new assignment
      const insertQuery = `
        INSERT INTO screen_module_assignments (screen_id, module_id, config, is_active) 
        VALUES (?, ?, ?, 1)
      `;
      await db.query(insertQuery, [screenId, module_id, JSON.stringify(config || {})]);
    }
    
    res.json({
      success: true,
      message: 'Module assigned to screen successfully'
    });
  } catch (error) {
    console.error('Error assigning module to screen:', error);
    res.status(500).json({
      success: false,
      message: 'Error assigning module to screen',
      error: error.message
    });
  }
};

/**
 * Get modules assigned to a screen
 */
exports.getScreenModules = async (req, res) => {
  try {
    const { screenId } = req.params;
    
    const query = `
      SELECT 
        sma.id as assignment_id,
        sma.module_id as module_id,
        sma.config,
        sma.is_active,
        m.name,
        m.module_type,
        m.description,
        m.default_config
      FROM screen_module_assignments sma
      JOIN app_modules m ON sma.module_id = m.id
      WHERE sma.screen_id = ? AND sma.is_active = 1 AND m.is_active = 1
      ORDER BY m.module_type
    `;
    
    const result = await db.query(query, [screenId]);
    const modules = Array.isArray(result) && Array.isArray(result[0]) ? result[0] : result;
    
    res.json({
      success: true,
      data: modules || []
    });
  } catch (error) {
    console.error('Error fetching screen modules:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching screen modules',
      error: error.message
    });
  }
};

/**
 * Remove a module from a screen
 */
exports.removeModuleFromScreen = async (req, res) => {
  try {
    const { screenId, moduleId } = req.params;
    
    const query = 'DELETE FROM screen_module_assignments WHERE screen_id = ? AND module_id = ?';
    await db.query(query, [screenId, moduleId]);
    
    res.json({
      success: true,
      message: 'Module removed from screen successfully'
    });
  } catch (error) {
    console.error('Error removing module from screen:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing module from screen',
      error: error.message
    });
  }
};
