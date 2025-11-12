const db = require('../config/database');

/**
 * Get all elements for an app's screen (master + overrides + custom)
 * This merges master elements with app-specific overrides and custom elements
 */
const getAppScreenElements = async (req, res) => {
  try {
    const { appId, screenId } = req.params;

    console.log(`[getAppScreenElements] Fetching elements for app ${appId}, screen ${screenId}`);

    // Check if auto-sync is enabled for this app-screen
    const autoSyncResult = await db.query(
      `SELECT auto_sync_enabled FROM app_screen_assignments WHERE app_id = ? AND screen_id = ?`,
      [appId, screenId]
    );
    const autoSyncData = Array.isArray(autoSyncResult) && Array.isArray(autoSyncResult[0]) 
      ? autoSyncResult[0] 
      : autoSyncResult;
    const autoSyncEnabled = autoSyncData && autoSyncData.length > 0 ? autoSyncData[0].auto_sync_enabled : true;
    
    console.log(`[getAppScreenElements] Auto-sync enabled: ${autoSyncEnabled}`);

    // Get master elements for this screen
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

    console.log(`[getAppScreenElements] Query result type:`, Array.isArray(masterElementsResult) ? 'array' : typeof masterElementsResult);
    console.log(`[getAppScreenElements] Query result length:`, masterElementsResult?.length);
    
    // db.query returns [rows, fields], so we need the first element
    const masterElements = Array.isArray(masterElementsResult) && Array.isArray(masterElementsResult[0]) 
      ? masterElementsResult[0] 
      : masterElementsResult;
    
    console.log(`[getAppScreenElements] Found ${masterElements ? masterElements.length : 0} master elements`);

    // Ensure masterElements is an array
    const safeMasterElements = masterElements || [];

    // Get overrides for this app
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

    console.log(`[getAppScreenElements] Found ${overrides ? overrides.length : 0} overrides`);

    // Ensure overrides is an array
    const safeOverrides = overrides || [];

    // Get custom elements added by this app
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
        acse.is_visible,
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

    // Ensure customElements is an array
    const safeCustomElements = customElements || [];

    // Create override map for quick lookup
    const overrideMap = {};
    safeOverrides.forEach(override => {
      overrideMap[override.element_instance_id] = override;
    });

    // Merge master elements with overrides
    const hiddenElements = [];
    const mergedElements = safeMasterElements
      .map(element => {
        const override = overrideMap[element.element_instance_id];
        
        // If auto-sync is disabled and there's no override, this is a new element - hide it automatically
        const shouldAutoHide = !autoSyncEnabled && !override;
        
        const formattedElement = {
          element_instance_id: element.element_instance_id,
          element_id: element.element_id,
          element_name: element.element_name,
          element_type: element.element_type,
          element_category: element.element_category,
          element_icon: element.element_icon,
          field_key: element.field_key,
          label: override?.custom_label || element.master_label,
          placeholder: override?.custom_placeholder || element.master_placeholder,
          default_value: override?.custom_default_value || element.master_default_value,
          validation_rules: override?.custom_validation_rules || element.master_validation_rules,
          is_required: override && override.is_required_override !== null ? override.is_required_override : element.master_is_required,
          display_order: override?.custom_display_order || element.master_display_order,
          config: override?.custom_config || {},
          is_custom: false,
          has_override: !!override,
          is_hidden: (override?.is_hidden || shouldAutoHide) ? true : false
        };
        
        // Hide if explicitly hidden OR if auto-sync is off and it's a new element
        if ((override && override.is_hidden) || shouldAutoHide) {
          hiddenElements.push(formattedElement);
          return null; // Skip hidden elements from main list
        }

        return formattedElement;
      })
      .filter(element => element !== null); // Remove hidden elements

    // Format custom elements
    const customElementsFormatted = safeCustomElements.map(element => ({
      custom_element_id: element.custom_element_id,
      element_id: element.element_id,
      element_name: element.element_name,
      element_type: element.element_type,
      element_category: element.element_category,
      element_icon: element.element_icon,
      field_key: element.field_key,
      label: element.label,
      placeholder: element.placeholder,
      default_value: element.default_value,
      validation_rules: element.validation_rules,
      is_required: element.is_required,
      is_visible: element.is_visible,
      display_order: element.display_order,
      config: element.config,
      is_custom: true,
      has_override: false
    }));

    // Combine and sort by display order
    const allElements = [...mergedElements, ...customElementsFormatted]
      .sort((a, b) => a.display_order - b.display_order);

    console.log(`[getAppScreenElements] Returning ${allElements.length} total elements, ${hiddenElements.length} hidden`);

    res.json({
      success: true,
      elements: allElements,
      hiddenElements: hiddenElements,
      counts: {
        master: safeMasterElements.length,
        overridden: safeOverrides.length,
        custom: safeCustomElements.length,
        total: allElements.length,
        hidden: hiddenElements.length
      }
    });

  } catch (error) {
    console.error('[getAppScreenElements] Error:', error);
    console.error('[getAppScreenElements] Stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve screen elements',
      error: error.message
    });
  }
};

/**
 * Create or update an override for a master element
 */
const createOrUpdateOverride = async (req, res) => {
  try {
    const { appId, screenId, elementInstanceId } = req.params;
    const overrideData = req.body;

    // Check if override already exists
    const existingResult = await db.query(
      `SELECT id FROM app_screen_element_overrides 
       WHERE app_id = ? AND element_instance_id = ?`,
      [appId, elementInstanceId]
    );
    
    const existing = Array.isArray(existingResult) && Array.isArray(existingResult[0]) 
      ? existingResult[0] 
      : existingResult;

    if (existing && existing.length > 0) {
      // Update existing override
      const updates = [];
      const values = [];

      if (overrideData.is_hidden !== undefined) {
        updates.push('is_hidden = ?');
        values.push(overrideData.is_hidden);
      }
      if (overrideData.is_required !== undefined) {
        updates.push('is_required_override = ?');
        values.push(overrideData.is_required);
      }
      if (overrideData.custom_label !== undefined) {
        updates.push('custom_label = ?');
        values.push(overrideData.custom_label);
      }
      if (overrideData.custom_placeholder !== undefined) {
        updates.push('custom_placeholder = ?');
        values.push(overrideData.custom_placeholder);
      }
      if (overrideData.custom_default_value !== undefined) {
        updates.push('custom_default_value = ?');
        values.push(overrideData.custom_default_value);
      }
      if (overrideData.custom_validation_rules !== undefined) {
        updates.push('custom_validation_rules = ?');
        values.push(JSON.stringify(overrideData.custom_validation_rules));
      }
      if (overrideData.custom_display_order !== undefined) {
        updates.push('custom_display_order = ?');
        values.push(overrideData.custom_display_order);
      }
      if (overrideData.custom_config !== undefined) {
        updates.push('custom_config = ?');
        values.push(JSON.stringify(overrideData.custom_config));
      }

      if (updates.length > 0) {
        values.push(existing[0].id);
        await db.query(
          `UPDATE app_screen_element_overrides 
           SET ${updates.join(', ')} 
           WHERE id = ?`,
          values
        );
      }

      res.json({
        success: true,
        message: 'Override updated successfully',
        override_id: existing[0].id
      });

    } else {
      // Create new override
      await db.query(
        `INSERT INTO app_screen_element_overrides 
         (app_id, screen_id, element_instance_id, is_hidden, is_required_override, 
          custom_label, custom_placeholder, custom_default_value, 
          custom_validation_rules, custom_display_order, custom_config)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          appId,
          screenId,
          elementInstanceId,
          overrideData.is_hidden || false,
          overrideData.is_required !== undefined ? overrideData.is_required : null,
          overrideData.custom_label || null,
          overrideData.custom_placeholder || null,
          overrideData.custom_default_value || null,
          overrideData.custom_validation_rules ? JSON.stringify(overrideData.custom_validation_rules) : null,
          overrideData.custom_display_order || null,
          overrideData.custom_config ? JSON.stringify(overrideData.custom_config) : null
        ]
      );

      res.status(201).json({
        success: true,
        message: 'Override created successfully'
      });
    }

  } catch (error) {
    console.error('Create/update override error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create/update override'
    });
  }
};

/**
 * Delete an override (revert to master element)
 */
const deleteOverride = async (req, res) => {
  try {
    const { appId, elementInstanceId } = req.params;

    await db.query(
      `DELETE FROM app_screen_element_overrides 
       WHERE app_id = ? AND element_instance_id = ?`,
      [appId, elementInstanceId]
    );

    res.json({
      success: true,
      message: 'Override deleted successfully (reverted to master)'
    });

  } catch (error) {
    console.error('Delete override error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete override'
    });
  }
};

/**
 * Add a custom element to an app's screen
 */
const addCustomElement = async (req, res) => {
  try {
    const { appId, screenId } = req.params;
    const elementData = req.body;

    // Validate required fields
    if (!elementData.element_id || !elementData.field_key) {
      return res.status(400).json({
        success: false,
        message: 'element_id and field_key are required'
      });
    }

    const resultData = await db.query(
      `INSERT INTO app_custom_screen_elements 
       (app_id, screen_id, element_id, field_key, label, placeholder, 
        default_value, validation_rules, is_required, is_visible, 
        display_order, config)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        appId,
        screenId,
        elementData.element_id,
        elementData.field_key,
        elementData.label || null,
        elementData.placeholder || null,
        elementData.default_value || null,
        elementData.validation_rules ? JSON.stringify(elementData.validation_rules) : null,
        elementData.is_required || false,
        elementData.is_visible !== undefined ? elementData.is_visible : true,
        elementData.display_order || 999,
        elementData.config ? JSON.stringify(elementData.config) : null
      ]
    );
    
    const result = Array.isArray(resultData) && Array.isArray(resultData[0]) 
      ? resultData[0] 
      : resultData;

    res.status(201).json({
      success: true,
      message: 'Custom element added successfully',
      custom_element_id: result.insertId
    });

  } catch (error) {
    console.error('Add custom element error:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'An element with this field_key already exists for this screen'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to add custom element'
    });
  }
};

/**
 * Update a custom element
 */
const updateCustomElement = async (req, res) => {
  try {
    const { appId, customElementId } = req.params;
    const elementData = req.body;

    const updates = [];
    const values = [];

    if (elementData.label !== undefined) {
      updates.push('label = ?');
      values.push(elementData.label);
    }
    if (elementData.placeholder !== undefined) {
      updates.push('placeholder = ?');
      values.push(elementData.placeholder);
    }
    if (elementData.default_value !== undefined) {
      updates.push('default_value = ?');
      values.push(elementData.default_value);
    }
    if (elementData.validation_rules !== undefined) {
      updates.push('validation_rules = ?');
      values.push(JSON.stringify(elementData.validation_rules));
    }
    if (elementData.is_required !== undefined) {
      updates.push('is_required = ?');
      values.push(elementData.is_required);
    }
    if (elementData.is_visible !== undefined) {
      updates.push('is_visible = ?');
      values.push(elementData.is_visible);
    }
    if (elementData.display_order !== undefined) {
      updates.push('display_order = ?');
      values.push(elementData.display_order);
    }
    if (elementData.config !== undefined) {
      updates.push('config = ?');
      values.push(JSON.stringify(elementData.config));
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    values.push(customElementId);
    values.push(appId);

    await db.query(
      `UPDATE app_custom_screen_elements 
       SET ${updates.join(', ')} 
       WHERE id = ? AND app_id = ?`,
      values
    );

    res.json({
      success: true,
      message: 'Custom element updated successfully'
    });

  } catch (error) {
    console.error('Update custom element error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update custom element'
    });
  }
};

/**
 * Delete a custom element
 */
const deleteCustomElement = async (req, res) => {
  try {
    const { appId, customElementId } = req.params;

    await db.query(
      `DELETE FROM app_custom_screen_elements 
       WHERE id = ? AND app_id = ?`,
      [customElementId, appId]
    );

    res.json({
      success: true,
      message: 'Custom element deleted successfully'
    });

  } catch (error) {
    console.error('Delete custom element error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete custom element'
    });
  }
};

module.exports = {
  getAppScreenElements,
  createOrUpdateOverride,
  deleteOverride,
  addCustomElement,
  updateCustomElement,
  deleteCustomElement
};
