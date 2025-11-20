const db = require('../config/database');

/**
 * Get all menus for an app
 */
exports.getAppMenus = async (req, res) => {
  try {
    const { appId } = req.params;

    const query = `
      SELECT 
        m.id,
        m.app_id,
        m.name,
        m.menu_type,
        m.description,
        m.is_active,
        m.created_at,
        m.updated_at,
        COUNT(mi.id) as item_count
      FROM app_menus m
      LEFT JOIN menu_items mi ON m.id = mi.menu_id AND mi.is_active = 1
      WHERE m.app_id = ?
      GROUP BY m.id
      ORDER BY m.menu_type, m.name
    `;

    const result = await db.query(query, [appId]);
    const menus = Array.isArray(result) && Array.isArray(result[0]) ? result[0] : result;

    res.json({
      success: true,
      data: menus || []
    });
  } catch (error) {
    console.error('Error fetching app menus:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching menus',
      error: error.message
    });
  }
};

/**
 * Get a single menu with its items
 */
exports.getMenu = async (req, res) => {
  try {
    const { menuId } = req.params;

    // Get menu details
    const menuQuery = `
      SELECT 
        m.id,
        m.app_id,
        m.name,
        m.menu_type,
        m.description,
        m.is_active,
        m.created_at,
        m.updated_at
      FROM app_menus m
      WHERE m.id = ?
    `;

    const menuResult = await db.query(menuQuery, [menuId]);
    const menus = Array.isArray(menuResult) && Array.isArray(menuResult[0]) ? menuResult[0] : menuResult;
    
    if (!menus || menus.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Menu not found'
      });
    }

    const menu = menus[0];

    // Get menu items
    const itemsQuery = `
      SELECT 
        mi.id,
        mi.menu_id,
        mi.screen_id,
        mi.display_order,
        mi.label,
        mi.icon,
        mi.is_active,
        s.name as screen_name,
        s.category as screen_category
      FROM menu_items mi
      JOIN app_screens s ON mi.screen_id = s.id
      WHERE mi.menu_id = ?
      ORDER BY mi.display_order, mi.id
    `;

    const itemsResult = await db.query(itemsQuery, [menuId]);
    const items = Array.isArray(itemsResult) && Array.isArray(itemsResult[0]) ? itemsResult[0] : itemsResult;

    menu.items = items || [];

    res.json({
      success: true,
      data: menu
    });
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching menu',
      error: error.message
    });
  }
};

/**
 * Create a new menu
 */
exports.createMenu = async (req, res) => {
  try {
    const { appId } = req.params;
    const { name, menu_type, description } = req.body;

    // Validate required fields
    if (!name || !menu_type) {
      return res.status(400).json({
        success: false,
        message: 'Name and menu type are required'
      });
    }

    // Validate menu_type
    const validTypes = ['tabbar', 'sidebar_left', 'sidebar_right'];
    if (!validTypes.includes(menu_type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid menu type. Must be: tabbar, sidebar_left, or sidebar_right'
      });
    }

    const query = `
      INSERT INTO app_menus (app_id, name, menu_type, description)
      VALUES (?, ?, ?, ?)
    `;

    const result = await db.query(query, [appId, name, menu_type, description || null]);
    const insertResult = Array.isArray(result) && Array.isArray(result[0]) ? result[0] : result;
    const menuId = insertResult.insertId;

    res.status(201).json({
      success: true,
      message: 'Menu created successfully',
      data: {
        id: menuId,
        app_id: parseInt(appId),
        name,
        menu_type,
        description
      }
    });
  } catch (error) {
    console.error('Error creating menu:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating menu',
      error: error.message
    });
  }
};

/**
 * Update a menu
 */
exports.updateMenu = async (req, res) => {
  try {
    const { menuId } = req.params;
    const { name, description, is_active } = req.body;

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

    values.push(menuId);

    const query = `UPDATE app_menus SET ${updates.join(', ')} WHERE id = ?`;
    await db.query(query, values);

    res.json({
      success: true,
      message: 'Menu updated successfully'
    });
  } catch (error) {
    console.error('Error updating menu:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating menu',
      error: error.message
    });
  }
};

/**
 * Delete a menu
 */
exports.deleteMenu = async (req, res) => {
  try {
    const { menuId } = req.params;

    // Delete menu (cascade will handle menu_items and screen_menu_assignments)
    const query = 'DELETE FROM app_menus WHERE id = ?';
    await db.query(query, [menuId]);

    res.json({
      success: true,
      message: 'Menu deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting menu:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting menu',
      error: error.message
    });
  }
};

/**
 * Add a screen to a menu
 */
exports.addMenuItem = async (req, res) => {
  try {
    const { menuId } = req.params;
    const { screen_id, display_order, label, icon } = req.body;

    if (!screen_id) {
      return res.status(400).json({
        success: false,
        message: 'Screen ID is required'
      });
    }

    const query = `
      INSERT INTO menu_items (menu_id, screen_id, display_order, label, icon)
      VALUES (?, ?, ?, ?, ?)
    `;

    const result = await db.query(query, [
      menuId,
      screen_id,
      display_order || 0,
      label || null,
      icon || null
    ]);

    const insertResult = Array.isArray(result) && Array.isArray(result[0]) ? result[0] : result;

    res.status(201).json({
      success: true,
      message: 'Menu item added successfully',
      data: {
        id: insertResult.insertId,
        menu_id: parseInt(menuId),
        screen_id,
        display_order: display_order || 0,
        label,
        icon
      }
    });
  } catch (error) {
    console.error('Error adding menu item:', error);
    
    // Handle duplicate entry
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'This screen is already in this menu'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error adding menu item',
      error: error.message
    });
  }
};

/**
 * Update a menu item
 */
exports.updateMenuItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { display_order, label, icon, is_active } = req.body;

    const updates = [];
    const values = [];

    if (display_order !== undefined) {
      updates.push('display_order = ?');
      values.push(display_order);
    }
    if (label !== undefined) {
      updates.push('label = ?');
      values.push(label);
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

    values.push(itemId);

    const query = `UPDATE menu_items SET ${updates.join(', ')} WHERE id = ?`;
    await db.query(query, values);

    res.json({
      success: true,
      message: 'Menu item updated successfully'
    });
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating menu item',
      error: error.message
    });
  }
};

/**
 * Remove a menu item
 */
exports.removeMenuItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const query = 'DELETE FROM menu_items WHERE id = ?';
    await db.query(query, [itemId]);

    res.json({
      success: true,
      message: 'Menu item removed successfully'
    });
  } catch (error) {
    console.error('Error removing menu item:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing menu item',
      error: error.message
    });
  }
};

/**
 * Get menus assigned to a screen
 */
exports.getScreenMenus = async (req, res) => {
  try {
    const { screenId } = req.params;

    const query = `
      SELECT 
        m.id,
        m.name,
        m.menu_type,
        m.description
      FROM screen_menu_assignments sma
      JOIN app_menus m ON sma.menu_id = m.id
      WHERE sma.screen_id = ? AND m.is_active = 1
      ORDER BY m.menu_type
    `;

    const result = await db.query(query, [screenId]);
    const menus = Array.isArray(result) && Array.isArray(result[0]) ? result[0] : result;

    res.json({
      success: true,
      data: menus || []
    });
  } catch (error) {
    console.error('Error fetching screen menus:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching screen menus',
      error: error.message
    });
  }
};

/**
 * Assign menus to a screen with smart auto-configuration
 * Automatically configures header bar icons and footer bar based on menu assignments
 */
exports.assignMenusToScreen = async (req, res) => {
  try {
    const { screenId } = req.params;
    const { menu_ids } = req.body;

    if (!Array.isArray(menu_ids)) {
      return res.status(400).json({
        success: false,
        message: 'menu_ids must be an array'
      });
    }

    // Delete existing assignments
    await db.query('DELETE FROM screen_menu_assignments WHERE screen_id = ?', [screenId]);

    // Insert new assignments
    if (menu_ids.length > 0) {
      const values = menu_ids.map(menuId => [screenId, menuId]);
      const placeholders = values.map(() => '(?, ?)').join(', ');
      const flatValues = values.flat();

      const query = `INSERT INTO screen_menu_assignments (screen_id, menu_id) VALUES ${placeholders}`;
      await db.query(query, flatValues);
    }

    // ============================================================================
    // SMART AUTO-CONFIGURATION
    // ============================================================================
    // Automatically configure header and footer modules based on menu assignments
    
    // Get menu types that were assigned
    let hasLeftSidebar = false;
    let hasRightSidebar = false;
    let hasTabBar = false;

    if (menu_ids.length > 0) {
      const menuTypesQuery = `
        SELECT menu_type 
        FROM app_menus 
        WHERE id IN (${menu_ids.map(() => '?').join(', ')})
      `;
      const menuTypesResult = await db.query(menuTypesQuery, menu_ids);
      const menuTypes = Array.isArray(menuTypesResult) && Array.isArray(menuTypesResult[0]) 
        ? menuTypesResult[0] 
        : menuTypesResult;

      hasLeftSidebar = menuTypes.some(m => m.menu_type === 'sidebar_left');
      hasRightSidebar = menuTypes.some(m => m.menu_type === 'sidebar_right');
      hasTabBar = menuTypes.some(m => m.menu_type === 'tabbar');
    }

    // ============================================================================
    // AUTO-CONFIGURE HEADER BAR
    // ============================================================================
    // Get existing header bar module for this screen
    const headerQuery = `
      SELECT sma.id as assignment_id, sma.module_id, sma.config, m.module_type
      FROM screen_module_assignments sma
      JOIN app_modules m ON sma.module_id = m.id
      WHERE sma.screen_id = ? AND m.module_type = 'header_bar' AND m.is_active = 1
    `;
    const headerResult = await db.query(headerQuery, [screenId]);
    const headerModules = Array.isArray(headerResult) && Array.isArray(headerResult[0]) 
      ? headerResult[0] 
      : headerResult;

    if (headerModules && headerModules.length > 0) {
      // Update existing header bar config to show/hide sidebar icons
      const headerModule = headerModules[0];
      const currentConfig = typeof headerModule.config === 'string' 
        ? JSON.parse(headerModule.config) 
        : headerModule.config || {};
      
      // Update config with sidebar icon visibility
      const updatedConfig = {
        ...currentConfig,
        showLeftIcon: hasLeftSidebar || currentConfig.leftIconType === 'back',
        showRightIcon: hasRightSidebar
      };

      await db.query(
        'UPDATE screen_module_assignments SET config = ? WHERE id = ?',
        [JSON.stringify(updatedConfig), headerModule.assignment_id]
      );

      console.log(`Auto-configured header bar for screen ${screenId}:`, {
        showLeftIcon: updatedConfig.showLeftIcon,
        showRightIcon: updatedConfig.showRightIcon
      });
    } else {
      // No header bar assigned yet, assign Simple Header Bar (id=2) if sidebars are present
      if (hasLeftSidebar || hasRightSidebar) {
        const defaultConfig = {
          showTitle: true,
          backgroundColor: '#FFFFFF',
          textColor: '#000000',
          showLeftIcon: hasLeftSidebar,
          showRightIcon: hasRightSidebar,
          elevation: 2
        };

        await db.query(
          'INSERT INTO screen_module_assignments (screen_id, module_id, config) VALUES (?, ?, ?)',
          [screenId, 2, JSON.stringify(defaultConfig)]
        );

        console.log(`Auto-assigned Simple Header Bar to screen ${screenId} with sidebar icons`);
      }
    }

    // ============================================================================
    // AUTO-CONFIGURE FOOTER BAR
    // ============================================================================
    // Get existing footer bar module for this screen
    const footerQuery = `
      SELECT sma.id as assignment_id, sma.module_id
      FROM screen_module_assignments sma
      JOIN app_modules m ON sma.module_id = m.id
      WHERE sma.screen_id = ? AND m.module_type = 'footer_bar' AND m.is_active = 1
    `;
    const footerResult = await db.query(footerQuery, [screenId]);
    const footerModules = Array.isArray(footerResult) && Array.isArray(footerResult[0]) 
      ? footerResult[0] 
      : footerResult;

    if (hasTabBar) {
      // Tab bar is assigned, ensure footer bar exists
      if (!footerModules || footerModules.length === 0) {
        // Assign Simple Footer Bar (id=4)
        await db.query(
          'INSERT INTO screen_module_assignments (screen_id, module_id, config) VALUES (?, ?, ?)',
          [screenId, 4, JSON.stringify({})]
        );

        console.log(`Auto-assigned Simple Footer Bar to screen ${screenId} for tab bar`);
      }
    } else {
      // No tab bar, remove footer bar if it exists
      if (footerModules && footerModules.length > 0) {
        await db.query(
          'DELETE FROM screen_module_assignments WHERE screen_id = ? AND module_id IN (SELECT id FROM app_modules WHERE module_type = "footer_bar")',
          [screenId]
        );

        console.log(`Auto-removed footer bar from screen ${screenId} (no tab bar assigned)`);
      }
    }

    res.json({
      success: true,
      message: 'Screen menus updated successfully',
      auto_configured: {
        header_icons: hasLeftSidebar || hasRightSidebar,
        footer_bar: hasTabBar,
        left_sidebar: hasLeftSidebar,
        right_sidebar: hasRightSidebar,
        tab_bar: hasTabBar
      }
    });
  } catch (error) {
    console.error('Error assigning menus to screen:', error);
    res.status(500).json({
      success: false,
      message: 'Error assigning menus to screen',
      error: error.message
    });
  }
};
