const db = require('../config/database');

/**
 * Get all forms
 */
const getForms = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        f.id,
        f.name,
        f.form_key,
        f.description,
        f.form_type,
        f.layout,
        f.category,
        f.icon,
        f.is_active,
        f.created_at,
        COUNT(DISTINCT fe.id) as element_count,
        COUNT(DISTINCT fa.id) as app_count
      FROM app_forms f
      LEFT JOIN app_form_elements fe ON f.id = fe.form_id
      LEFT JOIN app_form_assignments fa ON f.id = fa.form_id
      GROUP BY f.id
      ORDER BY f.created_at DESC
    `);

    const forms = Array.isArray(result) && Array.isArray(result[0]) ? result[0] : result;

    res.json({
      success: true,
      data: forms || []
    });
  } catch (error) {
    console.error('Error fetching forms:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching forms',
      error: error.message
    });
  }
};

/**
 * Get form by ID with elements
 */
const getFormById = async (req, res) => {
  try {
    const { formId } = req.params;

    // Get form details
    const formResult = await db.query(
      'SELECT * FROM app_forms WHERE id = ?',
      [formId]
    );

    const forms = Array.isArray(formResult) && Array.isArray(formResult[0]) ? formResult[0] : formResult;

    if (!forms || forms.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Form not found'
      });
    }

    const form = forms[0];

    // Get form elements
    const elementsResult = await db.query(`
      SELECT 
        fe.id,
        fe.field_key,
        fe.label,
        fe.placeholder,
        fe.default_value,
        fe.help_text,
        fe.is_required,
        fe.validation_rules,
        fe.display_order,
        fe.column_span,
        fe.row_span,
        fe.show_if_field,
        fe.show_if_value,
        fe.config,
        se.id as element_id,
        se.name as element_name,
        se.element_type,
        se.category as element_category,
        se.icon as element_icon
      FROM app_form_elements fe
      JOIN screen_elements se ON fe.element_id = se.id
      WHERE fe.form_id = ?
      ORDER BY fe.display_order
    `, [formId]);

    const elements = Array.isArray(elementsResult) && Array.isArray(elementsResult[0]) 
      ? elementsResult[0] 
      : elementsResult;

    res.json({
      success: true,
      data: {
        ...form,
        elements: elements || []
      }
    });
  } catch (error) {
    console.error('Error fetching form:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching form',
      error: error.message
    });
  }
};

/**
 * Create new form
 */
const createForm = async (req, res) => {
  try {
    const {
      name,
      form_key,
      description,
      form_type = 'create',
      layout = 'single_column',
      submit_button_text = 'Submit',
      success_message,
      error_message,
      icon,
      category
    } = req.body;

    const userId = req.user?.id;

    if (!name || !form_key) {
      return res.status(400).json({
        success: false,
        message: 'Name and form_key are required'
      });
    }

    // Check if form_key already exists
    const existingResult = await db.query(
      'SELECT id FROM app_forms WHERE form_key = ?',
      [form_key]
    );

    const existing = Array.isArray(existingResult) && Array.isArray(existingResult[0]) 
      ? existingResult[0] 
      : existingResult;

    if (existing && existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Form with this key already exists'
      });
    }

    const result = await db.query(
      `INSERT INTO app_forms 
       (name, form_key, description, form_type, layout, submit_button_text, 
        success_message, error_message, icon, category, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, form_key, description, form_type, layout, submit_button_text,
       success_message, error_message, icon, category, userId]
    );

    const insertResult = Array.isArray(result) ? result[0] : result;

    res.json({
      success: true,
      form_id: insertResult.insertId,
      message: 'Form created successfully'
    });
  } catch (error) {
    console.error('Error creating form:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating form',
      error: error.message
    });
  }
};

/**
 * Update form
 */
const updateForm = async (req, res) => {
  try {
    const { formId } = req.params;
    const {
      name,
      description,
      form_type,
      layout,
      submit_button_text,
      success_message,
      error_message,
      icon,
      category,
      is_active
    } = req.body;

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
    if (form_type !== undefined) {
      updates.push('form_type = ?');
      values.push(form_type);
    }
    if (layout !== undefined) {
      updates.push('layout = ?');
      values.push(layout);
    }
    if (submit_button_text !== undefined) {
      updates.push('submit_button_text = ?');
      values.push(submit_button_text);
    }
    if (success_message !== undefined) {
      updates.push('success_message = ?');
      values.push(success_message);
    }
    if (error_message !== undefined) {
      updates.push('error_message = ?');
      values.push(error_message);
    }
    if (icon !== undefined) {
      updates.push('icon = ?');
      values.push(icon);
    }
    if (category !== undefined) {
      updates.push('category = ?');
      values.push(category);
    }
    if (is_active !== undefined) {
      updates.push('is_active = ?');
      values.push(is_active ? 1 : 0);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    values.push(formId);

    await db.query(
      `UPDATE app_forms SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    res.json({
      success: true,
      message: 'Form updated successfully'
    });
  } catch (error) {
    console.error('Error updating form:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating form',
      error: error.message
    });
  }
};

/**
 * Delete form
 */
const deleteForm = async (req, res) => {
  try {
    const { formId } = req.params;

    // Check if form is assigned to any apps
    const assignmentsResult = await db.query(
      'SELECT COUNT(*) as count FROM app_form_assignments WHERE form_id = ?',
      [formId]
    );

    const assignments = Array.isArray(assignmentsResult) && Array.isArray(assignmentsResult[0]) 
      ? assignmentsResult[0] 
      : assignmentsResult;

    if (assignments && assignments[0]?.count > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete form that is assigned to apps. Remove assignments first.'
      });
    }

    await db.query('DELETE FROM app_forms WHERE id = ?', [formId]);

    res.json({
      success: true,
      message: 'Form deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting form:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting form',
      error: error.message
    });
  }
};

/**
 * Add element to form
 */
const addFormElement = async (req, res) => {
  try {
    const { formId } = req.params;
    const {
      element_type,
      field_key,
      label,
      placeholder,
      default_value,
      help_text,
      is_required = false,
      validation_rules,
      display_order = 0,
      column_span = 1,
      row_span = 1,
      show_if_field,
      show_if_value,
      config
    } = req.body;

    if (!element_type || !field_key) {
      return res.status(400).json({
        success: false,
        message: 'element_type and field_key are required'
      });
    }

    // Find existing element by type (REUSE!)
    const elementResult = await db.query(
      'SELECT id FROM screen_elements WHERE element_type = ? LIMIT 1',
      [element_type]
    );

    const elements = Array.isArray(elementResult) && Array.isArray(elementResult[0]) 
      ? elementResult[0] 
      : elementResult;

    if (!elements || elements.length === 0) {
      return res.status(400).json({
        success: false,
        message: `No element found with type: ${element_type}. Please create the element first.`
      });
    }

    const element_id = elements[0].id;

    // Check if field_key already exists in this form
    const existingResult = await db.query(
      'SELECT id FROM app_form_elements WHERE form_id = ? AND field_key = ?',
      [formId, field_key]
    );

    const existing = Array.isArray(existingResult) && Array.isArray(existingResult[0]) 
      ? existingResult[0] 
      : existingResult;

    if (existing && existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Field with this key already exists in this form'
      });
    }

    const result = await db.query(
      `INSERT INTO app_form_elements 
       (form_id, element_id, field_key, label, placeholder, default_value, help_text,
        is_required, validation_rules, display_order, column_span, row_span,
        show_if_field, show_if_value, config) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [formId, element_id, field_key, label, placeholder, default_value, help_text,
       is_required ? 1 : 0, JSON.stringify(validation_rules), display_order, column_span, row_span,
       show_if_field, show_if_value, JSON.stringify(config)]
    );

    const insertResult = Array.isArray(result) ? result[0] : result;

    res.json({
      success: true,
      element_id: insertResult.insertId,
      message: `Element added to form (reused existing ${element_type} element)`
    });
  } catch (error) {
    console.error('Error adding form element:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding form element',
      error: error.message
    });
  }
};

/**
 * Update form element
 */
const updateFormElement = async (req, res) => {
  try {
    const { formId, elementId } = req.params;
    const {
      label,
      placeholder,
      default_value,
      help_text,
      is_required,
      validation_rules,
      display_order,
      column_span,
      row_span,
      show_if_field,
      show_if_value,
      config
    } = req.body;

    const updates = [];
    const values = [];

    if (label !== undefined) {
      updates.push('label = ?');
      values.push(label);
    }
    if (placeholder !== undefined) {
      updates.push('placeholder = ?');
      values.push(placeholder);
    }
    if (default_value !== undefined) {
      updates.push('default_value = ?');
      values.push(default_value);
    }
    if (help_text !== undefined) {
      updates.push('help_text = ?');
      values.push(help_text);
    }
    if (is_required !== undefined) {
      updates.push('is_required = ?');
      values.push(is_required ? 1 : 0);
    }
    if (validation_rules !== undefined) {
      updates.push('validation_rules = ?');
      values.push(JSON.stringify(validation_rules));
    }
    if (display_order !== undefined) {
      updates.push('display_order = ?');
      values.push(display_order);
    }
    if (column_span !== undefined) {
      updates.push('column_span = ?');
      values.push(column_span);
    }
    if (row_span !== undefined) {
      updates.push('row_span = ?');
      values.push(row_span);
    }
    if (show_if_field !== undefined) {
      updates.push('show_if_field = ?');
      values.push(show_if_field);
    }
    if (show_if_value !== undefined) {
      updates.push('show_if_value = ?');
      values.push(show_if_value);
    }
    if (config !== undefined) {
      updates.push('config = ?');
      values.push(JSON.stringify(config));
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    values.push(elementId, formId);

    await db.query(
      `UPDATE app_form_elements SET ${updates.join(', ')} WHERE id = ? AND form_id = ?`,
      values
    );

    res.json({
      success: true,
      message: 'Form element updated successfully'
    });
  } catch (error) {
    console.error('Error updating form element:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating form element',
      error: error.message
    });
  }
};

/**
 * Delete form element
 */
const deleteFormElement = async (req, res) => {
  try {
    const { formId, elementId } = req.params;

    await db.query(
      'DELETE FROM app_form_elements WHERE id = ? AND form_id = ?',
      [elementId, formId]
    );

    res.json({
      success: true,
      message: 'Form element removed successfully'
    });
  } catch (error) {
    console.error('Error deleting form element:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting form element',
      error: error.message
    });
  }
};

/**
 * Get available elements for forms
 */
const getAvailableElements = async (req, res) => {
  try {
    const { category } = req.query;

    // Only input/selection elements are suitable for forms
    const formElementTypes = [
      'text_field', 'text_area', 'email_input', 'phone_input', 'url_input', 'password_input',
      'number_input', 'currency_input', 'dropdown', 'multi_select', 'radio_button', 'checkbox',
      'switch_toggle', 'date_picker', 'time_picker', 'datetime_picker', 'calendar',
      'file_upload', 'image_upload', 'video_upload', 'address_input', 'location_picker',
      'color_picker', 'tags_input', 'rating', 'range_slider', 'star_rating_input',
      'country_selector', 'language_selector', 'currency_selector'
    ];

    let query = `
      SELECT id, name, element_type, category, icon, description
      FROM screen_elements
      WHERE element_type IN (${formElementTypes.map(() => '?').join(',')})
    `;

    const params = [...formElementTypes];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY category, name';

    const result = await db.query(query, params);
    const elements = Array.isArray(result) && Array.isArray(result[0]) ? result[0] : result;

    // Group by category
    const grouped = {};
    (elements || []).forEach(element => {
      if (!grouped[element.category]) {
        grouped[element.category] = [];
      }
      grouped[element.category].push(element);
    });

    res.json({
      success: true,
      elements: elements || [],
      grouped
    });
  } catch (error) {
    console.error('Error fetching available elements:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching available elements',
      error: error.message
    });
  }
};

module.exports = {
  getForms,
  getFormById,
  createForm,
  updateForm,
  deleteForm,
  addFormElement,
  updateFormElement,
  deleteFormElement,
  getAvailableElements
};
