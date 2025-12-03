const db = require('../config/database');

// Get all report screens for an app (screens with is_report = true)
exports.getReportScreens = async (req, res) => {
  try {
    const { app_id } = req.params;
    
    console.log('[getReportScreens] Fetching report screens for app:', app_id);
    
    // Get all screens assigned to this app that have is_report = true
    const result = await db.query(`
      SELECT 
        s.id,
        s.name,
        s.screen_key,
        s.description,
        s.icon,
        s.category,
        rc.id as config_id,
        rc.report_name,
        rc.is_active as config_active,
        rc.allowed_roles,
        rc.edit_roles,
        (SELECT COUNT(*) FROM screen_submissions ss 
         WHERE ss.app_id = ? AND ss.screen_id = s.id) as submission_count
      FROM app_screens s
      INNER JOIN app_screen_assignments asa ON s.id = asa.screen_id AND asa.app_id = ?
      LEFT JOIN app_report_configs rc ON s.id = rc.screen_id AND rc.app_id = ?
      WHERE s.is_report = 1
      ORDER BY s.name
    `, [app_id, app_id, app_id]);
    
    // Handle both array and array-of-arrays result formats
    const screens = Array.isArray(result) && Array.isArray(result[0]) ? result[0] : result;
    
    // Parse allowed_roles and edit_roles JSON for each screen
    const screensWithParsedRoles = (Array.isArray(screens) ? screens : []).map(screen => {
      let allowedRoles = [];
      let editRoles = [];
      if (screen.allowed_roles) {
        try {
          allowedRoles = typeof screen.allowed_roles === 'string' 
            ? JSON.parse(screen.allowed_roles) 
            : screen.allowed_roles;
        } catch (e) {
          allowedRoles = [];
        }
      }
      if (screen.edit_roles) {
        try {
          editRoles = typeof screen.edit_roles === 'string' 
            ? JSON.parse(screen.edit_roles) 
            : screen.edit_roles;
        } catch (e) {
          editRoles = [];
        }
      }
      return { ...screen, allowed_roles: allowedRoles, edit_roles: editRoles };
    });
    
    console.log('[getReportScreens] Found screens:', screensWithParsedRoles.length);
    
    res.json({
      success: true,
      data: screensWithParsedRoles
    });
  } catch (error) {
    console.error('Error fetching report screens:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching report screens'
    });
  }
};

// Get report config for a specific screen
exports.getReportConfig = async (req, res) => {
  try {
    const { app_id, screen_id } = req.params;
    
    // Get the screen details with its elements
    const screensResult = await db.query(`
      SELECT 
        s.id,
        s.name,
        s.screen_key,
        s.description,
        s.icon
      FROM app_screens s
      INNER JOIN app_screen_assignments asa ON s.id = asa.screen_id AND asa.app_id = ?
      WHERE s.id = ? AND s.is_report = 1
    `, [app_id, screen_id]);
    
    const screens = Array.isArray(screensResult) && Array.isArray(screensResult[0]) 
      ? screensResult[0] 
      : screensResult;
    
    if (!screens || screens.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Report screen not found'
      });
    }
    
    const screen = screens[0];
    
    // Get screen elements (available fields for columns/filters)
    const elementsResult = await db.query(`
      SELECT 
        sei.id,
        sei.field_key,
        sei.label,
        se.name as element_name,
        se.element_type,
        se.category
      FROM screen_element_instances sei
      INNER JOIN screen_elements se ON sei.element_id = se.id
      WHERE sei.screen_id = ?
      ORDER BY sei.display_order
    `, [screen_id]);
    
    const elements = Array.isArray(elementsResult) && Array.isArray(elementsResult[0]) 
      ? elementsResult[0] 
      : elementsResult;
    
    // Get existing config if any
    const configsResult = await db.query(`
      SELECT * FROM app_report_configs
      WHERE app_id = ? AND screen_id = ?
    `, [app_id, screen_id]);
    
    const configs = Array.isArray(configsResult) && Array.isArray(configsResult[0]) 
      ? configsResult[0] 
      : configsResult;
    
    const config = configs && configs.length > 0 ? configs[0] : null;
    
    // Parse JSON fields if config exists
    if (config) {
      // Helper to safely parse JSON (handles both string and already-parsed values)
      const safeParseJSON = (val, defaultVal) => {
        if (!val) return defaultVal;
        if (typeof val === 'object') return val; // Already parsed
        try {
          return JSON.parse(val);
        } catch (e) {
          return defaultVal;
        }
      };
      
      config.display_columns = safeParseJSON(config.display_columns, []);
      config.filter_fields = safeParseJSON(config.filter_fields, []);
      config.action_buttons = safeParseJSON(config.action_buttons, ['view']);
      config.view_fields = safeParseJSON(config.view_fields, []);
      config.edit_fields = safeParseJSON(config.edit_fields, []);
      config.allowed_roles = safeParseJSON(config.allowed_roles, []);
      config.edit_roles = safeParseJSON(config.edit_roles, []);
    }
    
    res.json({
      success: true,
      data: {
        screen,
        elements,
        config
      }
    });
  } catch (error) {
    console.error('Error fetching report config:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching report config'
    });
  }
};

// Save/update report config
exports.saveReportConfig = async (req, res) => {
  try {
    const { app_id, screen_id } = req.params;
    const {
      report_name,
      description,
      display_columns,
      filter_fields,
      action_buttons,
      view_fields,
      edit_fields,
      default_sort_field,
      default_sort_order,
      rows_per_page,
      allowed_roles,
      edit_roles,
      is_active
    } = req.body;
    
    const created_by = req.user?.id || 1;
    
    // Check if config exists
    const existingResult = await db.query(
      'SELECT id FROM app_report_configs WHERE app_id = ? AND screen_id = ?',
      [app_id, screen_id]
    );
    
    const existing = Array.isArray(existingResult) && Array.isArray(existingResult[0]) 
      ? existingResult[0] 
      : existingResult;
    
    if (existing && existing.length > 0) {
      // Update existing config
      await db.query(`
        UPDATE app_report_configs SET
          report_name = ?,
          description = ?,
          display_columns = ?,
          filter_fields = ?,
          action_buttons = ?,
          view_fields = ?,
          edit_fields = ?,
          default_sort_field = ?,
          default_sort_order = ?,
          rows_per_page = ?,
          allowed_roles = ?,
          edit_roles = ?,
          is_active = ?
        WHERE app_id = ? AND screen_id = ?
      `, [
        report_name,
        description,
        JSON.stringify(display_columns || []),
        JSON.stringify(filter_fields || []),
        JSON.stringify(action_buttons || ['view']),
        JSON.stringify(view_fields || []),
        JSON.stringify(edit_fields || []),
        default_sort_field,
        default_sort_order || 'desc',
        rows_per_page || 25,
        JSON.stringify(allowed_roles || []),
        JSON.stringify(edit_roles || []),
        is_active !== undefined ? is_active : true,
        app_id,
        screen_id
      ]);
      
      res.json({
        success: true,
        message: 'Report config updated successfully'
      });
    } else {
      // Create new config
      await db.query(`
        INSERT INTO app_report_configs (
          app_id, screen_id, report_name, description,
          display_columns, filter_fields, action_buttons,
          view_fields, edit_fields,
          default_sort_field, default_sort_order, rows_per_page,
          allowed_roles, edit_roles, is_active, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        app_id,
        screen_id,
        report_name,
        description,
        JSON.stringify(display_columns || []),
        JSON.stringify(filter_fields || []),
        JSON.stringify(action_buttons || ['view']),
        JSON.stringify(view_fields || []),
        JSON.stringify(edit_fields || []),
        default_sort_field,
        default_sort_order || 'desc',
        rows_per_page || 25,
        JSON.stringify(allowed_roles || []),
        JSON.stringify(edit_roles || []),
        is_active !== undefined ? is_active : true,
        created_by
      ]);
      
      res.json({
        success: true,
        message: 'Report config created successfully'
      });
    }
  } catch (error) {
    console.error('Error saving report config:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving report config'
    });
  }
};

// Get report data (actual submissions)
exports.getReportData = async (req, res) => {
  try {
    const { app_id, screen_id } = req.params;
    const { 
      page = 1, 
      limit = 25, 
      sort_field, 
      sort_order = 'desc',
      ...filters 
    } = req.query;
    
    console.log('[getReportData] Fetching data for app:', app_id, 'screen:', screen_id);
    
    // Get the report config
    const configResult = await db.query(
      'SELECT * FROM app_report_configs WHERE app_id = ? AND screen_id = ?',
      [app_id, screen_id]
    );
    
    const configs = Array.isArray(configResult) && Array.isArray(configResult[0]) 
      ? configResult[0] 
      : configResult;
    
    const config = configs && configs.length > 0 ? configs[0] : null;
    
    // Helper to safely parse JSON
    const safeParseJSON = (val, defaultVal) => {
      if (!val) return defaultVal;
      if (typeof val === 'object') return val;
      try {
        return JSON.parse(val);
      } catch (e) {
        return defaultVal;
      }
    };
    
    // Parse config
    const displayColumns = safeParseJSON(config?.display_columns, []);
    const filterFields = safeParseJSON(config?.filter_fields, []);
    const rowsPerPage = config?.rows_per_page || parseInt(limit);
    
    // Get screen element instances for field mapping
    const elementsResult = await db.query(`
      SELECT sei.id, sei.field_key, sei.label
      FROM screen_element_instances sei
      WHERE sei.screen_id = ?
    `, [screen_id]);
    
    const elements = Array.isArray(elementsResult) && Array.isArray(elementsResult[0]) 
      ? elementsResult[0] 
      : elementsResult;
    
    const offset = (parseInt(page) - 1) * rowsPerPage;
    
    // Query from screen_submissions table (where mobile app saves data)
    const submissionsResult = await db.query(`
      SELECT 
        ss.id,
        ss.app_id,
        ss.screen_id,
        ss.user_id,
        ss.submission_data,
        ss.ip_address,
        ss.created_at,
        ss.updated_at,
        u.email as user_email,
        u.first_name,
        u.last_name
      FROM screen_submissions ss
      LEFT JOIN app_users u ON ss.user_id = u.id
      WHERE ss.app_id = ? AND ss.screen_id = ?
      ORDER BY ss.created_at ${sort_order === 'asc' ? 'ASC' : 'DESC'}
    `, [app_id, screen_id]);
    
    const submissions = Array.isArray(submissionsResult) && Array.isArray(submissionsResult[0]) 
      ? submissionsResult[0] 
      : submissionsResult;
    
    console.log('[getReportData] Found submissions:', submissions?.length || 0);
    
    // Transform submissions - submission_data is already JSON
    let dataArray = (submissions || []).map(row => {
      let fields = {};
      try {
        fields = typeof row.submission_data === 'string' 
          ? JSON.parse(row.submission_data) 
          : row.submission_data || {};
      } catch (e) {
        console.error('Error parsing submission_data:', e);
      }
      
      return {
        id: row.id,
        created_at: row.created_at,
        updated_at: row.updated_at,
        user_email: row.user_email,
        user_name: row.first_name && row.last_name 
          ? `${row.first_name} ${row.last_name}` 
          : row.user_email || 'Anonymous',
        fields
      };
    });
    
    const totalCount = dataArray.length;
    
    // Apply filters
    Object.keys(filters).forEach(filterKey => {
      if (filters[filterKey] && filterFields.includes(filterKey)) {
        dataArray = dataArray.filter(item => {
          const fieldValue = item.fields[filterKey] || '';
          return fieldValue.toString().toLowerCase().includes(filters[filterKey].toLowerCase());
        });
      }
    });
    
    // Paginate
    const paginatedData = dataArray.slice(offset, offset + rowsPerPage);
    
    res.json({
      success: true,
      data: {
        submissions: paginatedData,
        pagination: {
          page: parseInt(page),
          limit: rowsPerPage,
          total: totalCount,
          totalPages: Math.ceil(totalCount / rowsPerPage)
        },
        config: {
          display_columns: displayColumns,
          filter_fields: filterFields,
          action_buttons: safeParseJSON(config?.action_buttons, ['view']),
          view_fields: safeParseJSON(config?.view_fields, []),
          edit_fields: safeParseJSON(config?.edit_fields, [])
        }
      }
    });
  } catch (error) {
    console.error('Error fetching report data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching report data'
    });
  }
};

// Get single submission detail
exports.getSubmissionDetail = async (req, res) => {
  try {
    const { app_id, screen_id, submission_id } = req.params;
    
    // Get all content for this submission
    const [content] = await db.query(`
      SELECT 
        asc1.id,
        asc1.content_value,
        asc1.options,
        asc1.created_at,
        asc1.updated_at,
        sei.field_key,
        sei.label,
        se.type as element_type
      FROM app_screen_content asc1
      INNER JOIN screen_element_instances sei ON asc1.element_instance_id = sei.id
      INNER JOIN screen_elements se ON sei.element_id = se.id
      WHERE asc1.app_id = ? AND asc1.screen_id = ? AND asc1.id = ?
    `, [app_id, screen_id, submission_id]);
    
    if (content.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }
    
    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Error fetching submission detail:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching submission detail'
    });
  }
};

// Update a submission
exports.updateSubmission = async (req, res) => {
  try {
    const { app_id, screen_id, submission_id } = req.params;
    const { submission_data } = req.body;
    
    if (!submission_data) {
      return res.status(400).json({
        success: false,
        message: 'submission_data is required'
      });
    }
    
    // Update the submission in screen_submissions table
    await db.query(
      'UPDATE screen_submissions SET submission_data = ?, updated_at = NOW() WHERE id = ? AND app_id = ? AND screen_id = ?',
      [JSON.stringify(submission_data), submission_id, app_id, screen_id]
    );
    
    res.json({
      success: true,
      message: 'Submission updated successfully'
    });
  } catch (error) {
    console.error('Error updating submission:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating submission'
    });
  }
};

// Delete a submission
exports.deleteSubmission = async (req, res) => {
  try {
    const { app_id, screen_id, submission_id } = req.params;
    
    // Delete from screen_submissions table (where mobile app saves data)
    await db.query(
      'DELETE FROM screen_submissions WHERE id = ? AND app_id = ? AND screen_id = ?',
      [submission_id, app_id, screen_id]
    );
    
    res.json({
      success: true,
      message: 'Submission deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting submission:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting submission'
    });
  }
};

// Export report data as CSV
exports.exportReportData = async (req, res) => {
  try {
    const { app_id, screen_id } = req.params;
    
    // Get config
    const configResult = await db.query(
      'SELECT * FROM app_report_configs WHERE app_id = ? AND screen_id = ?',
      [app_id, screen_id]
    );
    const configs = Array.isArray(configResult) && Array.isArray(configResult[0]) 
      ? configResult[0] 
      : configResult;
    
    const config = configs && configs.length > 0 ? configs[0] : null;
    
    // Safe parse display columns
    let displayColumns = [];
    if (config?.display_columns) {
      try {
        displayColumns = typeof config.display_columns === 'string' 
          ? JSON.parse(config.display_columns) 
          : config.display_columns;
      } catch (e) {
        displayColumns = [];
      }
    }
    
    // Get screen elements for field labels
    const elementsResult = await db.query(`
      SELECT sei.field_key, sei.label
      FROM screen_element_instances sei
      WHERE sei.screen_id = ?
    `, [screen_id]);
    const elements = Array.isArray(elementsResult) && Array.isArray(elementsResult[0]) 
      ? elementsResult[0] 
      : elementsResult;
    
    // Create field key to label map
    const fieldLabels = {};
    (elements || []).forEach(el => {
      fieldLabels[el.field_key] = el.label || el.field_key;
    });
    
    // Get all submissions from screen_submissions table
    const submissionsResult = await db.query(`
      SELECT 
        ss.id,
        ss.submission_data,
        ss.created_at,
        au.first_name,
        au.last_name,
        au.email as user_email
      FROM screen_submissions ss
      LEFT JOIN app_users au ON ss.user_id = au.id
      WHERE ss.app_id = ? AND ss.screen_id = ?
      ORDER BY ss.created_at DESC
    `, [app_id, screen_id]);
    const submissions = Array.isArray(submissionsResult) && Array.isArray(submissionsResult[0]) 
      ? submissionsResult[0] 
      : submissionsResult;
    
    if (!submissions || submissions.length === 0) {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=report_${screen_id}_${Date.now()}.csv`);
      return res.send('No data to export');
    }
    
    // Parse submission data and collect all fields
    const allFields = new Set();
    const parsedSubmissions = submissions.map(sub => {
      let data = {};
      if (sub.submission_data) {
        try {
          data = typeof sub.submission_data === 'string' 
            ? JSON.parse(sub.submission_data) 
            : sub.submission_data;
        } catch (e) {
          data = {};
        }
      }
      Object.keys(data).forEach(key => allFields.add(key));
      return {
        id: sub.id,
        created_at: sub.created_at,
        user_name: sub.first_name && sub.last_name 
          ? `${sub.first_name} ${sub.last_name}` 
          : (sub.user_email || 'Anonymous'),
        fields: data
      };
    });
    
    // Determine fields to export
    const fieldsToExport = displayColumns.length > 0 
      ? displayColumns 
      : Array.from(allFields);
    
    // Build CSV with proper escaping
    const escapeCSV = (value) => {
      if (value === null || value === undefined) return '';
      const str = String(value);
      if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };
    
    // Headers: ID, Created At, Submitted By, then field labels
    const headers = [
      'ID',
      'Created At',
      'Submitted By',
      ...fieldsToExport.map(key => fieldLabels[key] || key)
    ];
    
    let csv = headers.map(escapeCSV).join(',') + '\n';
    
    parsedSubmissions.forEach(submission => {
      const row = [
        submission.id,
        submission.created_at ? new Date(submission.created_at).toISOString() : '',
        submission.user_name,
        ...fieldsToExport.map(field => escapeCSV(submission.fields[field] || ''))
      ];
      csv += row.join(',') + '\n';
    });
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=report_${screen_id}_${Date.now()}.csv`);
    res.send(csv);
  } catch (error) {
    console.error('Error exporting report data:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting report data'
    });
  }
};
