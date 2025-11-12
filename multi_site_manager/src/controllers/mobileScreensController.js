const db = require('../config/database');

/**
 * Get all published screens for an app
 * Mobile apps use this to fetch available screens
 * Filters by user's assigned roles
 */
exports.getPublishedScreens = async (req, res) => {
  try {
    const { appId } = req.params;
    const userId = req.user?.id; // From JWT auth middleware (optional)

    let query, params;

    if (userId) {
      // Authenticated user - filter by role permissions
      query = `SELECT DISTINCT
        s.id,
        s.name,
        s.description,
        s.category,
        s.icon,
        asa.display_order,
        asa.published_at,
        (SELECT COUNT(*) FROM screen_element_instances WHERE screen_id = s.id) as element_count
       FROM app_screen_assignments asa
       JOIN app_screens s ON asa.screen_id = s.id
       LEFT JOIN screen_role_access sra ON sra.screen_id = s.id AND sra.app_id = asa.app_id
       LEFT JOIN app_user_role_assignments aura ON aura.app_role_id = sra.role_id
       WHERE asa.app_id = ? 
         AND asa.is_published = 1 
         AND asa.is_active = 1
         AND s.is_active = 1
         AND aura.user_id = ?
         AND sra.can_access = 1
       ORDER BY asa.display_order`;
      params = [appId, userId];
    } else {
      // Unauthenticated - return all published screens (for preview/demo)
      query = `SELECT 
        s.id,
        s.name,
        s.description,
        s.category,
        s.icon,
        asa.display_order,
        asa.published_at,
        (SELECT COUNT(*) FROM screen_element_instances WHERE screen_id = s.id) as element_count
       FROM app_screen_assignments asa
       JOIN app_screens s ON asa.screen_id = s.id
       WHERE asa.app_id = ? 
         AND asa.is_published = 1 
         AND asa.is_active = 1
         AND s.is_active = 1
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
    const userId = req.user?.id; // From JWT auth middleware (optional)

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

    // Check if user has role-based access to this screen
    if (userId) {
      const accessResult = await db.query(
        `SELECT sra.can_access
         FROM screen_role_access sra
         JOIN app_user_role_assignments aura ON aura.app_role_id = sra.role_id
         WHERE sra.screen_id = ? 
           AND sra.app_id = ?
           AND aura.user_id = ?
           AND sra.can_access = 1
         LIMIT 1`,
        [screenId, appId, userId]
      );

      const access = Array.isArray(accessResult) && Array.isArray(accessResult[0]) 
        ? accessResult[0] 
        : accessResult;

      if (!access || access.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to access this screen'
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

    // Get master elements
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
        se.name as element_name,
        se.element_type,
        se.category as element_category,
        se.icon as element_icon
       FROM screen_element_instances sei
       JOIN screen_elements se ON sei.element_id = se.id
       WHERE sei.screen_id = ?
       ORDER BY sei.display_order`,
      [screenId]
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

        return {
          element_instance_id: element.element_instance_id,
          field_key: element.field_key,
          label: override?.custom_label || element.master_label,
          placeholder: override?.custom_placeholder || element.master_placeholder,
          default_value: override?.custom_default_value || element.master_default_value,
          validation_rules: override?.custom_validation_rules || element.master_validation_rules,
          is_required: override && override.is_required_override !== null ? override.is_required_override : element.master_is_required,
          display_order: override?.custom_display_order || element.master_display_order,
          element_type: element.element_type,
          element_name: element.element_name,
          element_category: element.element_category,
          element_icon: element.element_icon,
          config: override?.custom_config || {},
          is_custom: false
        };
      })
      .filter(element => element !== null);

    // Format custom elements
    const customElementsFormatted = safeCustomElements.map(element => ({
      custom_element_id: element.custom_element_id,
      field_key: element.field_key,
      label: element.label,
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
    }));

    // Combine and sort by display_order
    const allElements = [...mergedElements, ...customElementsFormatted]
      .sort((a, b) => a.display_order - b.display_order);

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
        elements: allElements,
        total_elements: allElements.length
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
