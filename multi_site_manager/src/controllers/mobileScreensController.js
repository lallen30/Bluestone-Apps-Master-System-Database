const db = require('../config/database');

/**
 * Get all published screens for an app
 * Mobile apps use this to fetch available screens
 * Filters by user's assigned roles
 */
exports.getPublishedScreens = async (req, res) => {
  try {
    const { appId } = req.params;
    const userId = req.user?.id;
    const userRoleIds = req.user?.role_ids || [];

    let query, params;

    // If user is authenticated and has roles, filter by role access
    if (userId && userRoleIds.length > 0) {
      // Filter screens by user's roles
      const roleIdPlaceholders = userRoleIds.map(() => '?').join(',');
      
      query = `SELECT DISTINCT
          s.id,
          s.name,
          s.description,
          s.category,
          s.icon,
          asa.display_order,
          asa.published_at,
          asa.show_in_tabbar,
          asa.tabbar_order,
          asa.tabbar_icon,
          asa.tabbar_label,
          asa.show_in_sidebar,
          asa.sidebar_order,
          (SELECT COUNT(*) FROM screen_element_instances WHERE screen_id = s.id) as element_count
         FROM app_screen_assignments asa
         JOIN app_screens s ON asa.screen_id = s.id
         LEFT JOIN screen_role_access sra ON sra.screen_id = s.id 
           AND sra.app_id = asa.app_id
           AND sra.role_id IN (${roleIdPlaceholders})
         WHERE asa.app_id = ? 
           AND asa.is_published = 1 
           AND asa.is_active = 1
           AND s.is_active = 1
           AND (sra.can_access = 1 OR sra.id IS NULL)
         ORDER BY asa.display_order`;
      
      params = [...userRoleIds, appId];
    } else {
      // Guest user (not authenticated or no roles) - show only screens with no role restrictions
      query = `SELECT DISTINCT
          s.id,
          s.name,
          s.description,
          s.category,
          s.icon,
          asa.display_order,
          asa.published_at,
          asa.show_in_tabbar,
          asa.tabbar_order,
          asa.tabbar_icon,
          asa.tabbar_label,
          asa.show_in_sidebar,
          asa.sidebar_order,
          (SELECT COUNT(*) FROM screen_element_instances WHERE screen_id = s.id) as element_count
         FROM app_screen_assignments asa
         JOIN app_screens s ON asa.screen_id = s.id
         LEFT JOIN screen_role_access sra ON sra.screen_id = s.id 
           AND sra.app_id = asa.app_id
         WHERE asa.app_id = ? 
           AND asa.is_published = 1 
           AND asa.is_active = 1
           AND s.is_active = 1
           AND sra.id IS NULL
         ORDER BY asa.display_order`;
      
      params = [appId];
    }

    const screensResult = await db.query(query, params);

    const screens = Array.isArray(screensResult) && Array.isArray(screensResult[0]) 
      ? screensResult[0] 
      : screensResult;

    res.json({
      success: true,
      data: {
        screens: screens || [],
        total: screens ? screens.length : 0
      }
    });
  } catch (error) {
    console.error('Error fetching published screens:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching published screens',
      error: error.message
    });
  }
};

/**
 * Get a specific screen with its elements
 * Returns app-specific elements (master + overrides + custom)
 * Checks role permissions before returning
 */
exports.getScreenWithElements = async (req, res) => {
  try {
    const { appId, screenId } = req.params;
    const requestUserId = req.user?.id; // From JWT auth middleware (optional)

    // Check if screen is published for this app
    const assignmentResult = await db.query(
      `SELECT id, is_published, auto_sync_enabled 
       FROM app_screen_assignments 
       WHERE app_id = ? AND screen_id = ? AND is_active = 1`,
      [appId, screenId]
    );

    const assignment = Array.isArray(assignmentResult) && Array.isArray(assignmentResult[0]) 
      ? assignmentResult[0] 
      : assignmentResult;

    if (!assignment || assignment.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Screen not found for this app'
      });
    }

    if (!assignment[0].is_published) {
      return res.status(403).json({
        success: false,
        message: 'Screen is not published'
      });
    }

    // Check role-based access
    const userId = requestUserId;
    const userRoleIds = req.user?.role_ids || [];

    console.log(`[Screen ${screenId}] User ${userId} has role_ids:`, userRoleIds);
    console.log(`[Screen ${screenId}] Full req.user:`, req.user);

    if (userId && userRoleIds.length > 0) {
      // Check if any role restrictions exist for this screen
      const roleRestrictionsResult = await db.query(
        'SELECT id FROM screen_role_access WHERE screen_id = ? AND app_id = ? LIMIT 1',
        [screenId, appId]
      );
      
      const restrictions = Array.isArray(roleRestrictionsResult) && Array.isArray(roleRestrictionsResult[0]) 
        ? roleRestrictionsResult[0] 
        : roleRestrictionsResult;
      
      // If role restrictions exist, check if user has access
      if (restrictions && restrictions.length > 0) {
        const roleIdPlaceholders = userRoleIds.map(() => '?').join(',');
        
        const accessResult = await db.query(
          `SELECT can_access 
           FROM screen_role_access 
           WHERE screen_id = ? 
             AND app_id = ? 
             AND role_id IN (${roleIdPlaceholders})
             AND can_access = 1
           LIMIT 1`,
          [screenId, appId, ...userRoleIds]
        );
        
        const hasAccess = Array.isArray(accessResult) && Array.isArray(accessResult[0]) 
          ? accessResult[0] 
          : accessResult;
        
        // If no access found, deny
        if (!hasAccess || hasAccess.length === 0) {
          return res.status(403).json({
            success: false,
            message: 'You do not have permission to access this screen'
          });
        }
      }
    } else {
      // Guest user (not authenticated) - check if screen has role restrictions
      const roleRestrictionsResult = await db.query(
        'SELECT id FROM screen_role_access WHERE screen_id = ? AND app_id = ? LIMIT 1',
        [screenId, appId]
      );
      
      const restrictions = Array.isArray(roleRestrictionsResult) && Array.isArray(roleRestrictionsResult[0]) 
        ? roleRestrictionsResult[0] 
        : roleRestrictionsResult;
      
      // If role restrictions exist, deny access to guest
      if (restrictions && restrictions.length > 0) {
        return res.status(403).json({
          success: false,
          message: 'Authentication required to access this screen'
        });
      }
    }

    // Get screen details
    const screenResult = await db.query(
      `SELECT id, name, description, category, icon
       FROM app_screens
       WHERE id = ? AND is_active = 1`,
      [screenId]
    );

    const screenData = Array.isArray(screenResult) && Array.isArray(screenResult[0]) 
      ? screenResult[0] 
      : screenResult;

    if (!screenData || screenData.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Screen not found'
      });
    }

    const screen = screenData[0];

    // Get master elements with saved content
    const masterElementsResult = await db.query(
      `SELECT 
        sei.id as element_instance_id,
        sei.element_id,
        sei.field_key,
        sei.label as master_label,
        sei.placeholder as master_placeholder,
        sei.default_value as master_default_value,
        sei.validation_rules as master_validation_rules,
        sei.is_required as master_is_required,
        sei.display_order as master_display_order,
        sei.config as master_config,
        se.name as element_name,
        se.element_type,
        se.category as element_category,
        se.icon as element_icon,
        content.content_value,
        content.options as content_options
       FROM screen_element_instances sei
       JOIN screen_elements se ON sei.element_id = se.id
       LEFT JOIN app_screen_content content ON content.element_instance_id = sei.id 
              AND content.app_id = ? AND content.screen_id = ?
       WHERE sei.screen_id = ?
       ORDER BY sei.display_order`,
      [appId, screenId, screenId]
    );

    const masterElements = Array.isArray(masterElementsResult) && Array.isArray(masterElementsResult[0]) 
      ? masterElementsResult[0] 
      : masterElementsResult;

    const safeMasterElements = masterElements || [];

    // Get overrides
    const overridesResult = await db.query(
      `SELECT 
        element_instance_id,
        is_hidden,
        is_required_override,
        custom_label,
        custom_placeholder,
        custom_default_value,
        custom_validation_rules,
        custom_display_order,
        custom_config
       FROM app_screen_element_overrides
       WHERE app_id = ? AND screen_id = ?`,
      [appId, screenId]
    );

    const overrides = Array.isArray(overridesResult) && Array.isArray(overridesResult[0]) 
      ? overridesResult[0] 
      : overridesResult;

    const safeOverrides = overrides || [];

    // Get custom elements
    const customElementsResult = await db.query(
      `SELECT 
        acse.id as custom_element_id,
        acse.element_id,
        acse.field_key,
        acse.label,
        acse.placeholder,
        acse.default_value,
        acse.validation_rules,
        acse.is_required,
        acse.display_order,
        acse.config,
        se.name as element_name,
        se.element_type,
        se.category as element_category,
        se.icon as element_icon
       FROM app_custom_screen_elements acse
       JOIN screen_elements se ON acse.element_id = se.id
       WHERE acse.app_id = ? AND acse.screen_id = ?
       ORDER BY acse.display_order`,
      [appId, screenId]
    );

    const customElements = Array.isArray(customElementsResult) && Array.isArray(customElementsResult[0]) 
      ? customElementsResult[0] 
      : customElementsResult;

    const safeCustomElements = customElements || [];

    // Create override map
    const overrideMap = {};
    safeOverrides.forEach(override => {
      overrideMap[override.element_instance_id] = override;
    });

    // Merge master elements with overrides (exclude hidden)
    const mergedElements = safeMasterElements
      .map(element => {
        const override = overrideMap[element.element_instance_id];
        
        // Skip hidden elements
        if (override && override.is_hidden) {
          return null;
        }

        // Skip auto-hidden elements (if auto-sync is off and no override)
        const shouldAutoHide = !assignment[0].auto_sync_enabled && !override;
        if (shouldAutoHide) {
          return null;
        }

        // Clean label by removing trailing "0" or " 0"
        let label = override?.custom_label || element.master_label || '';
        if (label && label.length > 1) {
          // Remove trailing " 0" or "0" that follows a letter/space
          while (label.endsWith(' 0') || (label.endsWith('0') && label.length > 1 && /[a-zA-Z\s]/.test(label[label.length - 2]))) {
            if (label.endsWith(' 0')) {
              label = label.slice(0, -2).trim();
            } else if (label.endsWith('0')) {
              label = label.slice(0, -1).trim();
            }
          }
        }

        // Parse config - it might be a JSON string or object
        let parsedConfig = {};
        try {
          const configSource = override?.custom_config || element.master_config;
          if (configSource) {
            parsedConfig = typeof configSource === 'object' ? configSource : JSON.parse(configSource);
          }
        } catch (e) {
          console.error(`Failed to parse config for element ${element.element_instance_id}:`, e.message);
        }

        return {
          element_instance_id: element.element_instance_id,
          field_key: element.field_key,
          label: label,
          placeholder: override?.custom_placeholder || element.master_placeholder,
          default_value: override?.custom_default_value || element.master_default_value,
          validation_rules: override?.custom_validation_rules || element.master_validation_rules,
          is_required: override && override.is_required_override !== null ? override.is_required_override : element.master_is_required,
          display_order: override?.custom_display_order || element.master_display_order,
          element_type: element.element_type,
          element_name: element.element_name,
          element_category: element.element_category,
          element_icon: element.element_icon,
          config: parsedConfig,
          content_value: element.content_value, // Include saved content
          content_options: element.content_options, // Include saved content options
          is_custom: false
        };
      })
      .filter(element => element !== null);

    // Format custom elements
    const customElementsFormatted = safeCustomElements.map(element => {
      // Clean label by removing trailing "0" or " 0"
      let label = element.label || '';
      if (label && label.length > 1) {
        while (label.endsWith(' 0') || (label.endsWith('0') && label.length > 1 && /[a-zA-Z\s]/.test(label[label.length - 2]))) {
          if (label.endsWith(' 0')) {
            label = label.slice(0, -2).trim();
          } else if (label.endsWith('0')) {
            label = label.slice(0, -1).trim();
          }
        }
      }

      return {
        custom_element_id: element.custom_element_id,
        field_key: element.field_key,
        label: label,
        placeholder: element.placeholder,
        default_value: element.default_value,
        validation_rules: element.validation_rules,
        is_required: element.is_required,
        display_order: element.display_order,
        element_type: element.element_type,
        element_name: element.element_name,
        element_category: element.element_category,
        element_icon: element.element_icon,
        config: element.config,
        is_custom: true
      };
    });

    // Combine and sort by display_order
    const allElements = [...mergedElements, ...customElementsFormatted]
      .sort((a, b) => a.display_order - b.display_order);

    // Get modules assigned to this screen
    const modulesResult = await db.query(
      `SELECT 
        sma.id as assignment_id,
        sma.config as screen_config,
        m.id as module_id,
        m.name as module_name,
        m.module_type,
        m.description,
        m.default_config
       FROM screen_module_assignments sma
       JOIN app_modules m ON sma.module_id = m.id
       WHERE sma.screen_id = ? AND sma.is_active = 1 AND m.is_active = 1
       ORDER BY m.module_type`,
      [screenId]
    );

    const modules = Array.isArray(modulesResult) && Array.isArray(modulesResult[0]) 
      ? modulesResult[0] 
      : modulesResult;

    const safeModules = (modules || []).map(module => ({
      module_id: module.module_id,
      name: module.module_name,
      module_type: module.module_type,
      description: module.description,
      config: {
        ...module.default_config,
        ...(module.screen_config || {})
      }
    }));

    // Load latest submission data for this user (for profile screens)
    let submissionData = null;
    const currentUserId = req.user?.id;
    console.log(`[Screen ${screenId}] Loading submission for user ${currentUserId}`);
    
    if (currentUserId) {
      const submissionResult = await db.query(
        `SELECT submission_data 
         FROM screen_submissions 
         WHERE app_id = ? AND screen_id = ? AND user_id = ?
         ORDER BY created_at DESC 
         LIMIT 1`,
        [appId, screenId, currentUserId]
      );
      
      const submissions = Array.isArray(submissionResult) && Array.isArray(submissionResult[0]) 
        ? submissionResult[0] 
        : submissionResult;
      
      console.log(`[Screen ${screenId}] Found ${submissions?.length || 0} submissions`);
      
      if (submissions && submissions.length > 0 && submissions[0].submission_data) {
        try {
          submissionData = typeof submissions[0].submission_data === 'string' 
            ? JSON.parse(submissions[0].submission_data)
            : submissions[0].submission_data;
          console.log(`[Screen ${screenId}] Loaded submission data:`, Object.keys(submissionData));
        } catch (e) {
          console.error('Failed to parse submission data:', e);
        }
      }
    } else {
      console.log(`[Screen ${screenId}] No user authenticated`);
    }

    // Merge submission data into elements
    const elementsWithData = allElements.map(element => {
      if (submissionData && element.field_key && submissionData[element.field_key]) {
        return {
          ...element,
          content_value: submissionData[element.field_key]
        };
      }
      return element;
    });

    res.json({
      success: true,
      data: {
        screen: {
          id: screen.id,
          name: screen.name,
          description: screen.description,
          category: screen.category,
          icon: screen.icon
        },
        elements: elementsWithData,
        modules: safeModules,
        total_elements: elementsWithData.length
      }
    });
  } catch (error) {
    console.error('Error fetching screen with elements:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching screen details',
      error: error.message
    });
  }
};

/**
 * Submit form data from mobile app
 * Stores the submission in the database
 */
exports.submitScreenData = async (req, res) => {
  try {
    const { appId, screenId } = req.params;
    const { submission_data, device_info } = req.body;
    const userId = req.user?.id || null; // From JWT auth middleware (if user is logged in)
    const ipAddress = req.ip || req.connection.remoteAddress;

    // Validate submission_data
    if (!submission_data || typeof submission_data !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Invalid submission data'
      });
    }

    // Check if screen is published
    const assignmentResult = await db.query(
      `SELECT is_published 
       FROM app_screen_assignments 
       WHERE app_id = ? AND screen_id = ? AND is_active = 1`,
      [appId, screenId]
    );

    const assignment = Array.isArray(assignmentResult) && Array.isArray(assignmentResult[0]) 
      ? assignmentResult[0] 
      : assignmentResult;

    if (!assignment || assignment.length === 0 || !assignment[0].is_published) {
      return res.status(403).json({
        success: false,
        message: 'Screen is not available for submissions'
      });
    }

    // Insert submission
    const insertResult = await db.query(
      `INSERT INTO screen_submissions 
       (app_id, screen_id, user_id, submission_data, device_info, ip_address)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        appId,
        screenId,
        userId,
        JSON.stringify(submission_data),
        device_info || null,
        ipAddress
      ]
    );

    const result = Array.isArray(insertResult) && Array.isArray(insertResult[0]) 
      ? insertResult[0] 
      : insertResult;

    res.status(201).json({
      success: true,
      message: 'Submission received successfully',
      data: {
        submission_id: result.insertId,
        submitted_at: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error submitting screen data:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing submission',
      error: error.message
    });
  }
};

/**
 * Get all menus for an app (for mobile app)
 * Returns all active menus with their items
 */
exports.getAppMenus = async (req, res) => {
  try {
    const { appId } = req.params;

    // Get all menus for the app
    const menusQuery = `
      SELECT 
        m.id,
        m.name,
        m.menu_type,
        m.description,
        m.icon
      FROM app_menus m
      WHERE m.app_id = ? 
        AND m.is_active = 1
      ORDER BY m.menu_type
    `;

    const menusResult = await db.query(menusQuery, [appId]);
    const menus = Array.isArray(menusResult) && Array.isArray(menusResult[0]) 
      ? menusResult[0] 
      : menusResult;

    // For each menu, get its items
    const menusWithItems = await Promise.all(
      (menus || []).map(async (menu) => {
        const itemsQuery = `
          SELECT 
            mi.id,
            mi.screen_id,
            mi.display_order,
            mi.label,
            mi.icon,
            s.name as screen_name,
            s.screen_key,
            s.category as screen_category
          FROM menu_items mi
          JOIN app_screens s ON mi.screen_id = s.id
          WHERE mi.menu_id = ? AND mi.is_active = 1
          ORDER BY mi.display_order
        `;

        const itemsResult = await db.query(itemsQuery, [menu.id]);
        const items = Array.isArray(itemsResult) && Array.isArray(itemsResult[0]) 
          ? itemsResult[0] 
          : itemsResult;

        return {
          ...menu,
          items: items || []
        };
      })
    );

    res.json({
      success: true,
      data: menusWithItems
    });
  } catch (error) {
    console.error('Error fetching app menus:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching app menus',
      error: error.message
    });
  }
};

/**
 * Get menus assigned to a screen (for mobile app)
 * Returns all active menus that should display on this screen
 */
exports.getScreenMenus = async (req, res) => {
  try {
    const { appId, screenId } = req.params;

    // Get all menus assigned to this screen
    const query = `
      SELECT 
        m.id,
        m.name,
        m.menu_type,
        m.description
      FROM screen_menu_assignments sma
      JOIN app_menus m ON sma.menu_id = m.id
      WHERE sma.screen_id = ? 
        AND m.app_id = ?
        AND m.is_active = 1
      ORDER BY m.menu_type
    `;

    const menusResult = await db.query(query, [screenId, appId]);
    const menus = Array.isArray(menusResult) && Array.isArray(menusResult[0]) 
      ? menusResult[0] 
      : menusResult;

    // For each menu, get its items
    const menusWithItems = await Promise.all(
      (menus || []).map(async (menu) => {
        const itemsQuery = `
          SELECT 
            mi.id,
            mi.screen_id,
            mi.display_order,
            mi.label,
            mi.icon,
            s.name as screen_name,
            s.category as screen_category
          FROM menu_items mi
          JOIN app_screens s ON mi.screen_id = s.id
          WHERE mi.menu_id = ? AND mi.is_active = 1
          ORDER BY mi.display_order
        `;

        const itemsResult = await db.query(itemsQuery, [menu.id]);
        const items = Array.isArray(itemsResult) && Array.isArray(itemsResult[0]) 
          ? itemsResult[0] 
          : itemsResult;

        return {
          ...menu,
          items: items || []
        };
      })
    );

    res.json({
      success: true,
      data: menusWithItems
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
