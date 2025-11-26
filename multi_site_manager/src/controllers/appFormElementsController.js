const db = require('../config/database');

/**
 * Create or update a form element override for an app
 */
const createOrUpdateOverride = async (req, res) => {
  try {
    const { appId, formId, elementId } = req.params;
    const {
      custom_label,
      custom_placeholder,
      custom_default_value,
      custom_help_text,
      is_required_override,
      is_hidden,
      custom_display_order,
      custom_validation_rules,
      custom_config
    } = req.body;

    console.log(`[createOrUpdateOverride] App ${appId}, Form ${formId}, Element ${elementId}`);

    // Check if override already exists
    const existing = await db.query(
      `SELECT id FROM app_form_element_overrides 
       WHERE app_id = ? AND form_id = ? AND form_element_id = ?`,
      [appId, formId, elementId]
    );

    if (existing && existing.length > 0) {
      // Update existing override
      await db.query(
        `UPDATE app_form_element_overrides 
         SET custom_label = ?, 
             custom_placeholder = ?, 
             custom_default_value = ?,
             custom_help_text = ?,
             is_required_override = ?,
             is_hidden = ?,
             custom_display_order = ?,
             custom_validation_rules = ?,
             custom_config = ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE app_id = ? AND form_id = ? AND form_element_id = ?`,
        [
          custom_label || null,
          custom_placeholder || null,
          custom_default_value || null,
          custom_help_text || null,
          is_required_override !== undefined ? is_required_override : null,
          is_hidden || false,
          custom_display_order || null,
          custom_validation_rules ? JSON.stringify(custom_validation_rules) : null,
          custom_config ? JSON.stringify(custom_config) : null,
          appId,
          formId,
          elementId
        ]
      );

      console.log(`[createOrUpdateOverride] Updated override ${existing[0].id}`);
    } else {
      // Create new override
      await db.query(
        `INSERT INTO app_form_element_overrides 
         (app_id, form_id, form_element_id, custom_label, custom_placeholder, 
          custom_default_value, custom_help_text, is_required_override, is_hidden, 
          custom_display_order, custom_validation_rules, custom_config)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          appId,
          formId,
          elementId,
          custom_label || null,
          custom_placeholder || null,
          custom_default_value || null,
          custom_help_text || null,
          is_required_override !== undefined ? is_required_override : null,
          is_hidden || false,
          custom_display_order || null,
          custom_validation_rules ? JSON.stringify(custom_validation_rules) : null,
          custom_config ? JSON.stringify(custom_config) : null
        ]
      );

      console.log(`[createOrUpdateOverride] Created new override`);
    }

    res.json({
      success: true,
      message: 'Form element override saved successfully'
    });

  } catch (error) {
    console.error('[createOrUpdateOverride] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save form element override',
      error: error.message
    });
  }
};

/**
 * Delete a form element override (revert to master)
 */
const deleteOverride = async (req, res) => {
  try {
    const { appId, formId, elementId } = req.params;

    console.log(`[deleteOverride] App ${appId}, Form ${formId}, Element ${elementId}`);

    await db.query(
      `DELETE FROM app_form_element_overrides 
       WHERE app_id = ? AND form_id = ? AND form_element_id = ?`,
      [appId, formId, elementId]
    );

    res.json({
      success: true,
      message: 'Form element override deleted successfully'
    });

  } catch (error) {
    console.error('[deleteOverride] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete form element override',
      error: error.message
    });
  }
};

/**
 * Toggle visibility of a form element
 */
const toggleVisibility = async (req, res) => {
  try {
    const { appId, formId, elementId } = req.params;

    console.log(`[toggleVisibility] App ${appId}, Form ${formId}, Element ${elementId}`);

    // Check if override exists
    const existing = await db.query(
      `SELECT id, is_hidden FROM app_form_element_overrides 
       WHERE app_id = ? AND form_id = ? AND form_element_id = ?`,
      [appId, formId, elementId]
    );

    if (existing && existing.length > 0) {
      // Toggle existing override
      const newVisibility = !existing[0].is_hidden;
      await db.query(
        `UPDATE app_form_element_overrides 
         SET is_hidden = ?, updated_at = CURRENT_TIMESTAMP
         WHERE app_id = ? AND form_id = ? AND form_element_id = ?`,
        [newVisibility, appId, formId, elementId]
      );
    } else {
      // Create new override with hidden = true
      await db.query(
        `INSERT INTO app_form_element_overrides 
         (app_id, form_id, form_element_id, is_hidden)
         VALUES (?, ?, ?, ?)`,
        [appId, formId, elementId, true]
      );
    }

    res.json({
      success: true,
      message: 'Form element visibility toggled successfully'
    });

  } catch (error) {
    console.error('[toggleVisibility] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle form element visibility',
      error: error.message
    });
  }
};

/**
 * Get form elements with app-specific overrides merged
 */
const getAppFormElements = async (req, res) => {
  try {
    const { appId, formId } = req.params;

    console.log(`[getAppFormElements] App ${appId}, Form ${formId}`);
    console.log(`[getAppFormElements] appId type:`, typeof appId, 'value:', appId);
    console.log(`[getAppFormElements] formId type:`, typeof formId, 'value:', formId);

    if (!appId || !formId) {
      return res.status(400).json({
        success: false,
        message: 'Missing appId or formId'
      });
    }

    // Get form elements with overrides
    const elements = await db.query(
      `SELECT 
        afe.id,
        afe.form_id,
        afe.element_id,
        se.element_type,
        se.name as element_name,
        afe.field_key,
        afe.label,
        afe.placeholder,
        afe.default_value,
        afe.help_text,
        afe.is_required,
        afe.display_order,
        afe.validation_rules,
        afe.config,
        afo.id as override_id,
        afo.custom_label,
        afo.custom_placeholder,
        afo.custom_default_value,
        afo.custom_help_text,
        afo.is_required_override,
        afo.is_hidden,
        afo.custom_display_order,
        afo.custom_validation_rules,
        afo.custom_config,
        CASE WHEN afo.id IS NOT NULL THEN 1 ELSE 0 END as has_override
       FROM app_form_elements afe
       JOIN screen_elements se ON afe.element_id = se.id
       LEFT JOIN app_form_element_overrides afo 
         ON afe.id = afo.form_element_id 
         AND afo.app_id = ? 
         AND afo.form_id = ?
       WHERE afe.form_id = ?
       ORDER BY COALESCE(afo.custom_display_order, afe.display_order)`,
      [appId, formId, formId]
    );

    res.json({
      success: true,
      elements: elements || []
    });

  } catch (error) {
    console.error('[getAppFormElements] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get form elements',
      error: error.message
    });
  }
};

module.exports = {
  createOrUpdateOverride,
  deleteOverride,
  toggleVisibility,
  getAppFormElements
};
