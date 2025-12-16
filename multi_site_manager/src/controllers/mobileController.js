const db = require('../config/database');

// Get all active screens for an app (mobile-friendly format)
exports.getAppScreens = async (req, res) => {
  try {
    const { app_id } = req.params;
    
    const screens = await db.query(
      `SELECT 
        s.id,
        s.name,
        s.screen_key,
        s.description,
        s.icon,
        s.category,
        asa.display_order,
        asa.is_active as assigned_active,
        asa.is_published,
        (SELECT COUNT(*) FROM screen_element_instances sei WHERE sei.screen_id = s.id) as element_count
       FROM app_screens s
       JOIN app_screen_assignments asa ON s.id = asa.screen_id
       WHERE asa.app_id = ? AND asa.is_active = 1 AND asa.is_published = 1 AND s.is_active = 1
       ORDER BY asa.display_order, s.name`,
      [app_id]
    );
    
    res.json({
      success: true,
      data: {
        app_id: parseInt(app_id),
        screens: screens,
        total: screens.length
      }
    });
  } catch (error) {
    console.error('Error fetching app screens for mobile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching screens'
    });
  }
};

// Get screen content with all elements (mobile-friendly format)
exports.getScreenContent = async (req, res) => {
  try {
    const { app_id, screen_id } = req.params;
    
    // Get screen details
    const screens = await db.query(
      `SELECT s.*, asa.display_order, asa.is_published
       FROM app_screens s
       JOIN app_screen_assignments asa ON s.id = asa.screen_id
       WHERE asa.app_id = ? AND s.id = ? AND asa.is_active = 1 AND asa.is_published = 1 AND s.is_active = 1`,
      [app_id, screen_id]
    );
    
    if (screens.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Screen not found, not assigned to this app, or not published'
      });
    }
    
    // Get elements with content and app-specific overrides
    const elementsResult = await db.query(
      `SELECT 
        sei.id as instance_id,
        sei.element_id,
        sei.field_key,
        COALESCE(ovr.custom_label, sei.label) as label,
        COALESCE(ovr.custom_placeholder, sei.placeholder) as placeholder,
        COALESCE(ovr.custom_default_value, sei.default_value) as default_value,
        COALESCE(ovr.is_required_override, sei.is_required) as is_required,
        sei.is_readonly,
        COALESCE(ovr.custom_display_order, sei.display_order) as display_order,
        CAST(COALESCE(ovr.custom_config, sei.config) AS CHAR) as config,
        se.name as element_name,
        se.element_type,
        se.category,
        se.icon,
        se.has_options,
        se.is_content_field,
        se.is_input_field,
        se.is_editable_by_app_admin,
        content.content_value,
        content.options as content_options,
        COALESCE(ovr.is_hidden, 0) as is_hidden
       FROM screen_element_instances sei
       JOIN screen_elements se ON sei.element_id = se.id
       LEFT JOIN app_screen_content content ON content.element_instance_id = sei.id 
              AND content.app_id = ? AND content.screen_id = ?
       LEFT JOIN app_screen_element_overrides ovr ON ovr.element_instance_id = sei.id 
              AND ovr.app_id = ? AND ovr.screen_id = ?
       WHERE sei.screen_id = ? AND se.is_active = 1
         AND COALESCE(ovr.is_hidden, 0) = 0
       ORDER BY COALESCE(ovr.custom_display_order, sei.display_order)`,
      [app_id, screen_id, app_id, screen_id, screen_id]
    );
    
    const elements = Array.isArray(elementsResult) && Array.isArray(elementsResult[0]) 
      ? elementsResult[0] 
      : elementsResult;
    
    console.log(`Found ${elements.length} elements for screen ${screen_id}`);
    
    // Format elements for mobile
    const formattedElements = (elements || []).map(el => {
      // Debug log for gender field
      if (el.field_key === 'gender') {
        console.log('=== GENDER ELEMENT DEBUG ===');
        console.log('Raw element:', JSON.stringify(el, null, 2));
        console.log('Config exists:', !!el.config);
        console.log('Config type:', typeof el.config);
        console.log('Config value:', el.config);
      }
      
      let parsedConfig = {};
      try {
        if (el.config) {
          // If config is already an object, use it directly
          parsedConfig = typeof el.config === 'object' ? el.config : JSON.parse(el.config);
        }
      } catch (e) {
        console.error(`Failed to parse config for element ${el.instance_id}:`, e.message);
        parsedConfig = {};
      }
      
      return {
        id: el.instance_id,
        element_id: el.element_id,
        element_type: el.element_type,
        field_name: el.field_key,
        label: el.label,
        value: el.content_value || el.default_value || '',
        placeholder: el.placeholder,
        is_required: Boolean(el.is_required),
        is_readonly: Boolean(el.is_readonly),
        is_input: Boolean(el.is_input_field),
        display_order: el.display_order,
        config: parsedConfig,
        options: el.content_options ? JSON.parse(el.content_options) : null
      };
    });
    
    res.json({
      success: true,
      data: {
        screen: {
          id: screens[0].id,
          name: screens[0].name,
          screen_key: screens[0].screen_key,
          description: screens[0].description,
          icon: screens[0].icon,
          category: screens[0].category,
          display_order: screens[0].display_order
        },
        elements: formattedElements,
        total_elements: formattedElements.length
      }
    });
  } catch (error) {
    console.error('Error fetching screen content for mobile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching screen content'
    });
  }
};

// Get screen by key (alternative lookup method)
exports.getScreenByKey = async (req, res) => {
  try {
    const { app_id, screen_key } = req.params;
    
    // Get screen by key
    const screens = await db.query(
      `SELECT s.id
       FROM app_screens s
       JOIN app_screen_assignments asa ON s.id = asa.screen_id
       WHERE asa.app_id = ? AND s.screen_key = ? AND asa.is_active = 1 AND s.is_active = 1`,
      [app_id, screen_key]
    );
    
    if (screens.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Screen not found'
      });
    }
    
    // Reuse getScreenContent logic
    req.params.screen_id = screens[0].id;
    return exports.getScreenContent(req, res);
  } catch (error) {
    console.error('Error fetching screen by key:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching screen'
    });
  }
};
