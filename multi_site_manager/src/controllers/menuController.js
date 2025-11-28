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

    // Get menu items (including both screen items and sidebar items)
    const itemsQuery = `
      SELECT 
        mi.id,
        mi.menu_id,
        mi.screen_id,
        mi.item_type,
        mi.sidebar_menu_id,
        mi.sidebar_position,
        mi.display_order,
        mi.label,
        mi.icon,
        mi.is_active,
        COALESCE(s.name, sm.name) as screen_name,
        COALESCE(s.category, CONCAT('Sidebar: ', sm.menu_type)) as screen_category,
        sm.name as sidebar_menu_name
      FROM menu_items mi
      LEFT JOIN app_screens s ON mi.screen_id = s.id AND mi.item_type = 'screen'
      LEFT JOIN app_menus sm ON mi.sidebar_menu_id = sm.id AND mi.item_type = 'sidebar'
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
 * Add a screen or sidebar to a menu
 */
exports.addMenuItem = async (req, res) => {
  try {
    const { menuId } = req.params;
    const { screen_id, item_type, sidebar_menu_id, sidebar_position, display_order, label, icon } = req.body;

    // Validate based on item type
    const type = item_type || 'screen';
    
    if (type === 'screen' && !screen_id) {
      return res.status(400).json({
        success: false,
        message: 'Screen ID is required for screen items'
      });
    }
    
    if (type === 'sidebar') {
      if (!sidebar_menu_id) {
        return res.status(400).json({
          success: false,
          message: 'Sidebar menu ID is required for sidebar items'
        });
      }
      if (!sidebar_position || !['left', 'right'].includes(sidebar_position)) {
        return res.status(400).json({
          success: false,
          message: 'Sidebar position must be "left" or "right"'
        });
      }
    }

    // If no icon provided and it's a screen item, get the screen's default icon
    let finalIcon = icon;
    if (!finalIcon && type === 'screen' && screen_id) {
      const screenResult = await db.query('SELECT icon FROM app_screens WHERE id = ?', [screen_id]);
      const screens = Array.isArray(screenResult) && Array.isArray(screenResult[0]) 
        ? screenResult[0] 
        : screenResult;
      if (screens && screens.length > 0 && screens[0].icon) {
        finalIcon = screens[0].icon;
      }
    }

    const query = `
      INSERT INTO menu_items (menu_id, screen_id, item_type, sidebar_menu_id, sidebar_position, display_order, label, icon)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await db.query(query, [
      menuId,
      type === 'screen' ? screen_id : null,
      type,
      type === 'sidebar' ? sidebar_menu_id : null,
      type === 'sidebar' ? sidebar_position : null,
      display_order || 0,
      label || null,
      finalIcon || null
    ]);

    const insertResult = Array.isArray(result) && Array.isArray(result[0]) ? result[0] : result;

    res.status(201).json({
      success: true,
      message: 'Menu item added successfully',
      data: {
        id: insertResult.insertId,
        menu_id: parseInt(menuId),
        screen_id: type === 'screen' ? screen_id : null,
        item_type: type,
        sidebar_menu_id: type === 'sidebar' ? sidebar_menu_id : null,
        sidebar_position: type === 'sidebar' ? sidebar_position : null,
        display_order: display_order || 0,
        label,
        icon: finalIcon
      }
    });
  } catch (error) {
    console.error('Error adding menu item:', error);
    
    // Handle duplicate entry
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'This item is already in this menu'
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
    // Allow null to clear the label (will use screen name instead)
    if (label !== undefined) {
      updates.push('label = ?');
      values.push(label === null ? null : label);
    }
    // Allow null to clear the icon
    if (icon !== undefined) {
      updates.push('icon = ?');
      values.push(icon === null ? null : icon);
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

/**
 * Get role access for a menu
 */
exports.getMenuRoleAccess = async (req, res) => {
  try {
    const { menuId } = req.params;

    const query = `
      SELECT 
        mra.id,
        mra.menu_id,
        mra.role_id,
        mra.app_id,
        r.name as role_name,
        r.description as role_description
      FROM menu_role_access mra
      JOIN roles r ON mra.role_id = r.id
      WHERE mra.menu_id = ?
      ORDER BY r.name
    `;

    const result = await db.query(query, [menuId]);
    const roles = Array.isArray(result) && Array.isArray(result[0]) ? result[0] : result;

    res.json({
      success: true,
      data: roles
    });
  } catch (error) {
    console.error('Error getting menu role access:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting menu role access',
      error: error.message
    });
  }
};

/**
 * Update role access for a menu
 */
exports.updateMenuRoleAccess = async (req, res) => {
  try {
    const { menuId } = req.params;
    const { role_ids, app_id } = req.body;

    if (!app_id) {
      return res.status(400).json({
        success: false,
        message: 'App ID is required'
      });
    }

    // Delete existing role access for this menu
    await db.query('DELETE FROM menu_role_access WHERE menu_id = ?', [menuId]);

    // Insert new role access entries one at a time
    if (role_ids && role_ids.length > 0) {
      for (const roleId of role_ids) {
        await db.query(
          'INSERT INTO menu_role_access (menu_id, role_id, app_id) VALUES (?, ?, ?)',
          [parseInt(menuId), roleId, app_id]
        );
      }
    }

    res.json({
      success: true,
      message: 'Menu role access updated successfully',
      data: {
        menu_id: parseInt(menuId),
        role_ids: role_ids || []
      }
    });
  } catch (error) {
    console.error('Error updating menu role access:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating menu role access',
      error: error.message
    });
  }
};

/**
 * Get all menus with their role access for an app
 */
exports.getAppMenusWithRoles = async (req, res) => {
  try {
    const { appId } = req.params;

    // Get all menus
    const menusQuery = `
      SELECT 
        m.id,
        m.app_id,
        m.name,
        m.menu_type,
        m.description,
        m.is_active,
        COUNT(mi.id) as item_count
      FROM app_menus m
      LEFT JOIN menu_items mi ON m.id = mi.menu_id AND mi.is_active = 1
      WHERE m.app_id = ?
      GROUP BY m.id
      ORDER BY m.menu_type, m.name
    `;

    const menusResult = await db.query(menusQuery, [appId]);
    const menus = Array.isArray(menusResult) && Array.isArray(menusResult[0]) ? menusResult[0] : menusResult;

    // Get role access for all menus
    const roleAccessQuery = `
      SELECT 
        mra.menu_id,
        mra.role_id,
        r.name as role_name
      FROM menu_role_access mra
      JOIN app_roles r ON mra.role_id = r.id
      WHERE mra.app_id = ?
    `;

    const roleAccessResult = await db.query(roleAccessQuery, [appId]);
    const roleAccess = Array.isArray(roleAccessResult) && Array.isArray(roleAccessResult[0]) ? roleAccessResult[0] : roleAccessResult;

    // Map role access to menus
    const menusWithRoles = menus.map(menu => ({
      ...menu,
      roles: roleAccess
        .filter(ra => ra.menu_id === menu.id)
        .map(ra => ({ id: ra.role_id, name: ra.role_name }))
    }));

    res.json({
      success: true,
      data: menusWithRoles
    });
  } catch (error) {
    console.error('Error getting app menus with roles:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting app menus with roles',
      error: error.message
    });
  }
};

/**
 * Get menus accessible by a specific role
 */
exports.getMenusByRole = async (req, res) => {
  try {
    const { appId, roleId } = req.params;

    const query = `
      SELECT 
        m.id,
        m.name,
        m.menu_type,
        m.description,
        m.is_active
      FROM app_menus m
      JOIN menu_role_access mra ON m.id = mra.menu_id
      WHERE m.app_id = ? AND mra.role_id = ? AND m.is_active = 1
      ORDER BY m.menu_type, m.name
    `;

    const result = await db.query(query, [appId, roleId]);
    const menus = Array.isArray(result) && Array.isArray(result[0]) ? result[0] : result;

    res.json({
      success: true,
      data: menus
    });
  } catch (error) {
    console.error('Error getting menus by role:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting menus by role',
      error: error.message
    });
  }
};

/**
 * Duplicate a menu with all its items
 */
exports.duplicateMenu = async (req, res) => {
  try {
    const { menuId } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'New menu name is required'
      });
    }

    // Get the original menu
    const menuResult = await db.query(
      'SELECT * FROM app_menus WHERE id = ?',
      [menuId]
    );
    const menus = Array.isArray(menuResult) && Array.isArray(menuResult[0]) ? menuResult[0] : menuResult;

    if (!menus || menus.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Menu not found'
      });
    }

    const originalMenu = menus[0];

    // Create the new menu
    const insertResult = await db.query(
      `INSERT INTO app_menus (app_id, name, menu_type, description, is_active)
       VALUES (?, ?, ?, ?, ?)`,
      [originalMenu.app_id, name, originalMenu.menu_type, originalMenu.description, originalMenu.is_active]
    );

    const insertData = Array.isArray(insertResult) && Array.isArray(insertResult[0]) ? insertResult[0] : insertResult;
    const newMenuId = insertData.insertId;

    // Get all menu items from the original menu
    const itemsResult = await db.query(
      'SELECT * FROM menu_items WHERE menu_id = ? ORDER BY display_order',
      [menuId]
    );
    const items = Array.isArray(itemsResult) && Array.isArray(itemsResult[0]) ? itemsResult[0] : itemsResult;

    // Duplicate each menu item
    if (items && items.length > 0) {
      for (const item of items) {
        await db.query(
          `INSERT INTO menu_items (menu_id, screen_id, item_type, sidebar_menu_id, sidebar_position, display_order, label, icon, is_active)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [newMenuId, item.screen_id, item.item_type, item.sidebar_menu_id, item.sidebar_position, item.display_order, item.label, item.icon, item.is_active]
        );
      }
    }

    // Duplicate role access
    const roleAccessResult = await db.query(
      'SELECT * FROM menu_role_access WHERE menu_id = ?',
      [menuId]
    );
    const roleAccess = Array.isArray(roleAccessResult) && Array.isArray(roleAccessResult[0]) ? roleAccessResult[0] : roleAccessResult;

    if (roleAccess && roleAccess.length > 0) {
      for (const access of roleAccess) {
        await db.query(
          'INSERT INTO menu_role_access (menu_id, role_id) VALUES (?, ?)',
          [newMenuId, access.role_id]
        );
      }
    }

    res.json({
      success: true,
      message: 'Menu duplicated successfully',
      data: {
        id: newMenuId,
        name: name,
        items_copied: items?.length || 0,
        roles_copied: roleAccess?.length || 0
      }
    });
  } catch (error) {
    console.error('Error duplicating menu:', error);
    res.status(500).json({
      success: false,
      message: 'Error duplicating menu',
      error: error.message
    });
  }
};
