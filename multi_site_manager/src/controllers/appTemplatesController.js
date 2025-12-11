const db = require('../config/database');

/**
 * Get all app templates
 * GET /api/v1/app-templates
 */
const getAllAppTemplates = async (req, res) => {
  try {
    const templates = await db.query(
      `SELECT 
        at.*,
        COUNT(DISTINCT ats.id) as screen_count,
        CONCAT(u.first_name, ' ', u.last_name) as created_by_name
       FROM app_templates at
       LEFT JOIN app_template_screens ats ON at.id = ats.template_id
       LEFT JOIN users u ON at.created_by = u.id
       GROUP BY at.id
       ORDER BY at.category, at.name`
    );

    res.json({
      success: true,
      data: templates
    });
  } catch (error) {
    console.error('Get app templates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get app templates',
      error: error.message
    });
  }
};

/**
 * Get app template by ID with screens and elements
 * GET /api/v1/app-templates/:id
 */
const getAppTemplateById = async (req, res) => {
  try {
    const { id } = req.params;

    // Get template details
    const templates = await db.query(
      'SELECT * FROM app_templates WHERE id = ?',
      [id]
    );

    if (!templates || templates.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'App template not found'
      });
    }

    const template = templates[0];

    // Get screens for this template with element counts from master screens
    const screens = await db.query(
      `SELECT 
        ats.*,
        COALESCE(
          (SELECT COUNT(*) 
           FROM screen_element_instances sei 
           WHERE sei.screen_id = ats.screen_id),
          (SELECT COUNT(*) 
           FROM app_template_screen_elements atse 
           WHERE atse.template_screen_id = ats.id)
        ) as element_count
       FROM app_template_screens ats
       WHERE ats.template_id = ? 
       ORDER BY ats.display_order`,
      [id]
    );

    // Get elements for each screen (from master screen if available, otherwise from template)
    for (let screen of screens) {
      let elements = [];
      
      // First try to get elements from master screen
      if (screen.screen_id) {
        elements = await db.query(
          `SELECT 
            sei.id,
            sei.element_id,
            sei.field_key,
            sei.label,
            sei.placeholder,
            sei.default_value,
            sei.is_required,
            sei.display_order,
            sei.config,
            se.name as element_name,
            se.element_type,
            se.category as element_category,
            se.icon as element_icon
           FROM screen_element_instances sei
           JOIN screen_elements se ON sei.element_id = se.id
           WHERE sei.screen_id = ?
           ORDER BY sei.display_order`,
          [screen.screen_id]
        );
      }
      
      // Fallback to template screen elements if master has none
      if (elements.length === 0) {
        elements = await db.query(
          `SELECT 
            atse.*,
            se.name as element_name,
            se.element_type,
            se.category as element_category,
            se.icon as element_icon
           FROM app_template_screen_elements atse
           JOIN screen_elements se ON atse.element_id = se.id
           WHERE atse.template_screen_id = ?
           ORDER BY atse.display_order`,
          [screen.id]
        );
      }
      
      screen.elements = elements;
    }

    res.json({
      success: true,
      data: {
        template: template,
        screens: screens
      }
    });
  } catch (error) {
    console.error('Get app template by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get app template',
      error: error.message
    });
  }
};

/**
 * Create app from template
 * POST /api/v1/app-templates/create-from-template
 * 
 * This creates a complete app clone including:
 * - App record
 * - Screen assignments
 * - Roles and role-screen access
 * - Menus and menu-screen assignments
 * - Custom elements and element overrides
 * - Screen content
 */
const createAppFromTemplate = async (req, res) => {
  try {
    const { template_id, app_name, app_domain, created_by, source_app_id } = req.body;

    // Validate required fields
    if (!template_id || !app_name || !created_by) {
      return res.status(400).json({
        success: false,
        message: 'Template ID, app name, and created_by are required'
      });
    }

    // Get template with screens and elements
    const templates = await db.query(
      'SELECT * FROM app_templates WHERE id = ?',
      [template_id]
    );

    if (!templates || templates.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'App template not found'
      });
    }

    const template = templates[0];

    // Generate domain from app name if not provided
    let domain = app_domain;
    if (!domain) {
      const baseDomain = app_name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      // Add timestamp to ensure uniqueness
      const timestamp = Date.now();
      domain = `${baseDomain}-${timestamp}.app`;
    }

    // Create the app with template_id reference
    const appResult = await db.query(
      `INSERT INTO apps (name, domain, description, template_id, is_active, created_by)
       VALUES (?, ?, ?, ?, TRUE, ?)`,
      [app_name, domain, template.description, template_id, created_by]
    );

    const newAppId = appResult.insertId;
    
    // Track cloning stats
    const stats = {
      screens: 0,
      roles: 0,
      roleAccess: 0,
      menus: 0,
      menuAssignments: 0,
      customElements: 0,
      elementOverrides: 0,
      screenContent: 0
    };

    // If source_app_id provided, clone from existing app instead of template
    // This enables full app cloning with all customizations
    const cloneFromAppId = source_app_id || null;

    // ========================================
    // STEP 1: Clone Roles
    // ========================================
    if (cloneFromAppId) {
      const sourceRoles = await db.query(
        'SELECT * FROM app_roles WHERE app_id = ?',
        [cloneFromAppId]
      );
      
      // Map old role IDs to new role IDs
      const roleIdMap = {};
      
      for (const role of sourceRoles) {
        const roleResult = await db.query(
          `INSERT INTO app_roles (app_id, name, display_name, description, is_default)
           VALUES (?, ?, ?, ?, ?)`,
          [newAppId, role.name, role.display_name || role.name, role.description || null, role.is_default ?? 0]
        );
        roleIdMap[role.id] = roleResult.insertId;
        stats.roles++;
      }

      // ========================================
      // STEP 2: Clone Screen Assignments from source app
      // ========================================
      const sourceScreenAssignments = await db.query(
        'SELECT * FROM app_screen_assignments WHERE app_id = ? ORDER BY display_order',
        [cloneFromAppId]
      );

      // Map old screen assignment IDs to new ones (for content cloning)
      const screenAssignmentMap = {};

      for (const assignment of sourceScreenAssignments) {
        const assignResult = await db.query(
          `INSERT INTO app_screen_assignments (app_id, screen_id, is_active, is_published, display_order, assigned_by)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [newAppId, assignment.screen_id, assignment.is_active ?? 1, assignment.is_published ?? 0, assignment.display_order ?? 0, created_by]
        );
        screenAssignmentMap[assignment.id] = assignResult.insertId;
        stats.screens++;
      }

      // ========================================
      // STEP 3: Clone Screen Role Access
      // ========================================
      const sourceRoleAccess = await db.query(
        'SELECT * FROM screen_role_access WHERE app_id = ?',
        [cloneFromAppId]
      );

      for (const access of sourceRoleAccess) {
        const newRoleId = roleIdMap[access.role_id];
        if (newRoleId) {
          await db.query(
            `INSERT INTO screen_role_access (screen_id, role_id, app_id, can_access)
             VALUES (?, ?, ?, ?)`,
            [access.screen_id, newRoleId, newAppId, access.can_access]
          );
          stats.roleAccess++;
        }
      }

      // ========================================
      // STEP 4: Clone Menus
      // ========================================
      const sourceMenus = await db.query(
        'SELECT * FROM app_menus WHERE app_id = ?',
        [cloneFromAppId]
      );

      const menuIdMap = {};

      for (const menu of sourceMenus) {
        const menuResult = await db.query(
          `INSERT INTO app_menus (app_id, name, menu_type, icon, description, is_active)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [newAppId, menu.name, menu.menu_type, menu.icon || null, menu.description || null, menu.is_active ?? 1]
        );
        menuIdMap[menu.id] = menuResult.insertId;
        stats.menus++;
      }

      // ========================================
      // STEP 5: Clone Menu-Screen Assignments
      // ========================================
      // Get menu assignments for the source app's menus
      const sourceMenuIds = Object.keys(menuIdMap).join(',');
      if (sourceMenuIds) {
        const sourceMenuAssignments = await db.query(
          `SELECT * FROM screen_menu_assignments WHERE menu_id IN (${sourceMenuIds})`
        );

        for (const menuAssign of sourceMenuAssignments) {
          const newMenuId = menuIdMap[menuAssign.menu_id];
          if (newMenuId) {
            await db.query(
              `INSERT INTO screen_menu_assignments (screen_id, menu_id)
               VALUES (?, ?)`,
              [menuAssign.screen_id, newMenuId]
            );
            stats.menuAssignments++;
          }
        }
      }

      // ========================================
      // STEP 6: Clone Custom Screen Elements
      // ========================================
      const sourceCustomElements = await db.query(
        'SELECT * FROM app_custom_screen_elements WHERE app_id = ?',
        [cloneFromAppId]
      );

      for (const customEl of sourceCustomElements) {
        await db.query(
          `INSERT INTO app_custom_screen_elements 
           (app_id, screen_id, element_id, field_key, label, placeholder, default_value, 
            is_required, is_visible, display_order, config)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [newAppId, customEl.screen_id, customEl.element_id, customEl.field_key, customEl.label || null,
           customEl.placeholder || null, customEl.default_value || null, customEl.is_required ?? 0, customEl.is_visible ?? 1,
           customEl.display_order ?? 0, customEl.config || null]
        );
        stats.customElements++;
      }

      // ========================================
      // STEP 7: Clone Element Overrides
      // ========================================
      const sourceOverrides = await db.query(
        'SELECT * FROM app_screen_element_overrides WHERE app_id = ?',
        [cloneFromAppId]
      );

      for (const override of sourceOverrides) {
        await db.query(
          `INSERT INTO app_screen_element_overrides 
           (app_id, screen_id, element_instance_id, custom_label, custom_placeholder, 
            custom_default_value, is_required_override, is_hidden, custom_display_order, custom_config)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [newAppId, override.screen_id, override.element_instance_id, override.custom_label || null,
           override.custom_placeholder || null, override.custom_default_value || null, override.is_required_override ?? null,
           override.is_hidden ?? 0, override.custom_display_order ?? null, override.custom_config || null]
        );
        stats.elementOverrides++;
      }

      // ========================================
      // STEP 8: Clone Screen Content
      // ========================================
      const sourceContent = await db.query(
        'SELECT * FROM app_screen_content WHERE app_id = ?',
        [cloneFromAppId]
      );

      for (const content of sourceContent) {
        await db.query(
          `INSERT INTO app_screen_content 
           (app_id, screen_id, element_instance_id, content_value, options, updated_by)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [newAppId, content.screen_id, content.element_instance_id,
           content.content_value || null, content.options || null, created_by]
        );
        stats.screenContent++;
      }

      // ========================================
      // STEP 9: Clone Administrator Permissions (user_app_permissions)
      // ========================================
      const sourceAdminPermissions = await db.query(
        'SELECT * FROM user_app_permissions WHERE app_id = ?',
        [cloneFromAppId]
      );

      stats.adminPermissions = 0;
      for (const perm of sourceAdminPermissions) {
        await db.query(
          `INSERT INTO user_app_permissions 
           (user_id, app_id, can_view, can_edit, can_delete, can_publish, 
            can_manage_users, can_manage_settings, custom_permissions, granted_by)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [perm.user_id, newAppId, perm.can_view ?? 1, perm.can_edit ?? 0, 
           perm.can_delete ?? 0, perm.can_publish ?? 0, perm.can_manage_users ?? 0,
           perm.can_manage_settings ?? 0, perm.custom_permissions || null, created_by]
        );
        stats.adminPermissions++;
      }

      // ========================================
      // STEP 10: Clone App Users (mobile app users)
      // ========================================
      const sourceAppUsers = await db.query(
        'SELECT * FROM app_users WHERE app_id = ?',
        [cloneFromAppId]
      );

      // Map old app_user IDs to new app_user IDs for role assignments
      const appUserIdMap = {};
      stats.appUsers = 0;

      for (const user of sourceAppUsers) {
        const userResult = await db.query(
          `INSERT INTO app_users 
           (app_id, email, password_hash, first_name, last_name, phone, bio, avatar_url,
            date_of_birth, gender, status, email_verified, last_login_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [newAppId, user.email, user.password_hash, user.first_name || null, 
           user.last_name || null, user.phone || null, user.bio || null, user.avatar_url || null,
           user.date_of_birth || null, user.gender || null,
           user.status || 'active', user.email_verified ?? 0, user.last_login_at || null]
        );
        appUserIdMap[user.id] = userResult.insertId;
        stats.appUsers++;
      }

      // ========================================
      // STEP 11: Clone App User Role Assignments
      // ========================================
      // Get role assignments for source app's roles
      const sourceRoleIds = Object.keys(roleIdMap).join(',');
      stats.appUserRoleAssignments = 0;

      if (sourceRoleIds) {
        const sourceRoleAssignments = await db.query(
          `SELECT * FROM app_user_role_assignments WHERE app_role_id IN (${sourceRoleIds})`
        );

        for (const assignment of sourceRoleAssignments) {
          const newUserId = appUserIdMap[assignment.user_id];
          const newRoleId = roleIdMap[assignment.app_role_id];
          
          if (newUserId && newRoleId) {
            await db.query(
              `INSERT INTO app_user_role_assignments (user_id, app_role_id, assigned_by)
               VALUES (?, ?, ?)`,
              [newUserId, newRoleId, created_by]
            );
            stats.appUserRoleAssignments++;
          }
        }
      }

      // ========================================
      // STEP 12: Clone Property Listings
      // ========================================
      const sourceListings = await db.query(
        'SELECT * FROM property_listings WHERE app_id = ?',
        [cloneFromAppId]
      );

      // Map old listing IDs to new listing IDs for images/amenities
      const listingIdMap = {};
      stats.propertyListings = 0;

      for (const listing of sourceListings) {
        // Map the user_id to the new app's user
        const newUserId = appUserIdMap[listing.user_id] || listing.user_id;
        
        const listingResult = await db.query(
          `INSERT INTO property_listings 
           (app_id, user_id, title, description, property_type, 
            address_line1, address_line2, city, state, country, postal_code,
            latitude, longitude, bedrooms, bathrooms, beds, guests_max, square_feet,
            price_per_night, currency, cleaning_fee, service_fee_percentage,
            min_nights, max_nights, check_in_time, check_out_time,
            cancellation_policy, status, is_published, is_instant_book,
            house_rules, additional_info)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [newAppId, newUserId, listing.title, listing.description || null, listing.property_type || 'apartment',
           listing.address_line1 || null, listing.address_line2 || null, listing.city, listing.state || null,
           listing.country, listing.postal_code || null, listing.latitude || null, listing.longitude || null,
           listing.bedrooms ?? 0, listing.bathrooms ?? 0, listing.beds ?? 0, listing.guests_max ?? 1,
           listing.square_feet || null, listing.price_per_night, listing.currency || 'USD',
           listing.cleaning_fee ?? 0, listing.service_fee_percentage ?? 0,
           listing.min_nights ?? 1, listing.max_nights ?? 365, listing.check_in_time || '15:00:00',
           listing.check_out_time || '11:00:00', listing.cancellation_policy || 'moderate',
           listing.status || 'draft', listing.is_published ?? 0, listing.is_instant_book ?? 0,
           listing.house_rules || null, listing.additional_info || null]
        );
        listingIdMap[listing.id] = listingResult.insertId;
        stats.propertyListings++;
      }

      // ========================================
      // STEP 13: Clone Property Images
      // ========================================
      stats.propertyImages = 0;
      const sourceListingIds = Object.keys(listingIdMap).join(',');
      
      if (sourceListingIds) {
        const sourceImages = await db.query(
          `SELECT * FROM property_images WHERE listing_id IN (${sourceListingIds})`
        );

        for (const image of sourceImages) {
          const newListingId = listingIdMap[image.listing_id];
          if (newListingId) {
            await db.query(
              `INSERT INTO property_images 
               (listing_id, image_url, image_key, caption, display_order, is_primary)
               VALUES (?, ?, ?, ?, ?, ?)`,
              [newListingId, image.image_url, image.image_key || null, image.caption || null,
               image.display_order ?? 0, image.is_primary ?? 0]
            );
            stats.propertyImages++;
          }
        }

        // ========================================
        // STEP 14: Clone Property Listing Amenities
        // ========================================
        stats.propertyAmenities = 0;
        const sourceAmenities = await db.query(
          `SELECT * FROM property_listing_amenities WHERE listing_id IN (${sourceListingIds})`
        );

        for (const amenity of sourceAmenities) {
          const newListingId = listingIdMap[amenity.listing_id];
          if (newListingId) {
            await db.query(
              `INSERT INTO property_listing_amenities (listing_id, amenity_id)
               VALUES (?, ?)`,
              [newListingId, amenity.amenity_id]
            );
            stats.propertyAmenities++;
          }
        }

        // ========================================
        // STEP 14b: Clone Property Inquiries (Real Estate apps)
        // ========================================
        stats.propertyInquiries = 0;
        const sourceInquiries = await db.query(
          `SELECT * FROM property_inquiries WHERE listing_id IN (${sourceListingIds})`
        );

        for (const inquiry of sourceInquiries) {
          const newListingId = listingIdMap[inquiry.listing_id];
          const newBuyerId = appUserIdMap[inquiry.buyer_id] || inquiry.buyer_id;
          const newAgentId = inquiry.agent_id ? (appUserIdMap[inquiry.agent_id] || inquiry.agent_id) : null;
          
          if (newListingId) {
            await db.query(
              `INSERT INTO property_inquiries 
               (app_id, listing_id, buyer_id, agent_id, inquiry_type, subject, message,
                preferred_contact, status, response, responded_at, created_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [newAppId, newListingId, newBuyerId, newAgentId, inquiry.inquiry_type,
               inquiry.subject, inquiry.message, inquiry.preferred_contact,
               inquiry.status, inquiry.response, inquiry.responded_at, inquiry.created_at]
            );
            stats.propertyInquiries++;
          }
        }

        // ========================================
        // STEP 14c: Clone Property Showings (Real Estate apps)
        // ========================================
        stats.propertyShowings = 0;
        const sourceShowings = await db.query(
          `SELECT * FROM property_showings WHERE listing_id IN (${sourceListingIds})`
        );

        for (const showing of sourceShowings) {
          const newListingId = listingIdMap[showing.listing_id];
          const newBuyerId = appUserIdMap[showing.buyer_id] || showing.buyer_id;
          const newAgentId = showing.agent_id ? (appUserIdMap[showing.agent_id] || showing.agent_id) : null;
          
          if (newListingId) {
            await db.query(
              `INSERT INTO property_showings 
               (app_id, listing_id, buyer_id, agent_id, showing_date, showing_time,
                showing_type, status, buyer_notes, agent_notes, feedback, buyer_interest_level,
                created_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [newAppId, newListingId, newBuyerId, newAgentId, showing.showing_date,
               showing.showing_time, showing.showing_type, showing.status,
               showing.buyer_notes, showing.agent_notes, showing.feedback,
               showing.buyer_interest_level, showing.created_at]
            );
            stats.propertyShowings++;
          }
        }

        // ========================================
        // STEP 14d: Clone Property Offers (Real Estate apps)
        // ========================================
        stats.propertyOffers = 0;
        const sourceOffers = await db.query(
          `SELECT * FROM property_offers WHERE listing_id IN (${sourceListingIds})`
        );

        for (const offer of sourceOffers) {
          const newListingId = listingIdMap[offer.listing_id];
          const newBuyerId = appUserIdMap[offer.buyer_id] || offer.buyer_id;
          const newAgentId = offer.agent_id ? (appUserIdMap[offer.agent_id] || offer.agent_id) : null;
          
          if (newListingId) {
            await db.query(
              `INSERT INTO property_offers 
               (app_id, listing_id, buyer_id, agent_id, offer_amount, earnest_money,
                down_payment_percent, financing_type, inspection_contingency, financing_contingency,
                appraisal_contingency, sale_contingency, other_contingencies,
                closing_date, status, counter_amount, counter_terms, response_notes,
                submitted_at, created_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [newAppId, newListingId, newBuyerId, newAgentId, offer.offer_amount,
               offer.earnest_money, offer.down_payment_percent, offer.financing_type,
               offer.inspection_contingency, offer.financing_contingency,
               offer.appraisal_contingency, offer.sale_contingency, offer.other_contingencies,
               offer.closing_date, offer.status, offer.counter_amount, offer.counter_terms,
               offer.response_notes, offer.submitted_at, offer.created_at]
            );
            stats.propertyOffers++;
          }
        }
      }

      // ========================================
      // STEP 15: Clone Menu Items
      // ========================================
      stats.menuItems = 0;
      const sourceMenuIdsForItems = Object.keys(menuIdMap).join(',');
      
      if (sourceMenuIdsForItems) {
        const sourceMenuItems = await db.query(
          `SELECT * FROM menu_items WHERE menu_id IN (${sourceMenuIdsForItems}) ORDER BY display_order`
        );

        for (const item of sourceMenuItems) {
          const newMenuId = menuIdMap[item.menu_id];
          // For sidebar items, map the sidebar_menu_id to the new menu
          const newSidebarMenuId = item.sidebar_menu_id ? menuIdMap[item.sidebar_menu_id] : null;
          
          if (newMenuId) {
            await db.query(
              `INSERT INTO menu_items 
               (menu_id, screen_id, item_type, sidebar_menu_id, sidebar_position, 
                display_order, label, icon, is_active)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [newMenuId, item.screen_id || null, item.item_type || 'screen', 
               newSidebarMenuId, item.sidebar_position || null,
               item.display_order ?? 0, item.label || null, item.icon || null, 
               item.is_active ?? 1]
            );
            stats.menuItems++;
          }
        }
      }

    } else {
      // ========================================
      // Clone from template tables (self-contained templates)
      // ========================================
      
      // STEP 1: Clone Roles from template
      const templateRoles = await db.query(
        'SELECT * FROM app_template_roles WHERE template_id = ?',
        [template_id]
      );
      
      const roleIdMap = {};
      for (const role of templateRoles) {
        const roleResult = await db.query(
          `INSERT INTO app_roles (app_id, name, display_name, description, is_default)
           VALUES (?, ?, ?, ?, ?)`,
          [newAppId, role.name, role.display_name || role.name, role.description || null, role.is_default ?? 0]
        );
        roleIdMap[role.id] = roleResult.insertId;
        stats.roles++;
      }

      // STEP 2: Clone Screens from template
      const screens = await db.query(
        `SELECT * FROM app_template_screens 
         WHERE template_id = ? 
         ORDER BY display_order`,
        [template_id]
      );

      for (let templateScreen of screens) {
        // Use existing master screen if it exists
        let screenId = templateScreen.screen_id;
        
        if (screenId) {
          await db.query(
            `INSERT INTO app_screen_assignments (app_id, screen_id, is_active, display_order, is_published, published_at, assigned_by)
             VALUES (?, ?, TRUE, ?, ?, ?, ?)`,
            [newAppId, screenId, templateScreen.display_order, 
             templateScreen.is_published ?? 1, templateScreen.published_at || new Date(), created_by]
          );
          stats.screens++;
        }
      }

      // STEP 3: Clone Screen Role Access from template
      const templateScreenRoleAccess = await db.query(
        'SELECT * FROM app_template_screen_role_access WHERE template_id = ?',
        [template_id]
      );

      for (const access of templateScreenRoleAccess) {
        const newRoleId = roleIdMap[access.template_role_id];
        if (newRoleId) {
          await db.query(
            `INSERT INTO screen_role_access (screen_id, role_id, app_id, can_access)
             VALUES (?, ?, ?, ?)`,
            [access.screen_id, newRoleId, newAppId, access.can_access]
          );
          stats.roleAccess = (stats.roleAccess || 0) + 1;
        }
      }

      // STEP 4: Clone Menus from template
      const templateMenus = await db.query(
        'SELECT * FROM app_template_menus WHERE template_id = ?',
        [template_id]
      );

      const menuIdMap = {};
      for (const menu of templateMenus) {
        const menuResult = await db.query(
          `INSERT INTO app_menus (app_id, name, menu_type, icon, description, is_active)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [newAppId, menu.name, menu.menu_type, menu.icon || null, menu.description || null, menu.is_active ?? 1]
        );
        menuIdMap[menu.id] = menuResult.insertId;
        stats.menus = (stats.menus || 0) + 1;
      }

      // STEP 5: Clone Menu Items from template
      for (const templateMenu of templateMenus) {
        const templateMenuItems = await db.query(
          'SELECT * FROM app_template_menu_items WHERE template_menu_id = ? ORDER BY display_order',
          [templateMenu.id]
        );

        const newMenuId = menuIdMap[templateMenu.id];
        for (const item of templateMenuItems) {
          // Handle sidebar menu items - extract sidebar config from JSON config column
          let sidebarMenuId = null;
          let sidebarPosition = null;
          
          if (item.item_type === 'sidebar' && item.config) {
            const config = typeof item.config === 'string' ? JSON.parse(item.config) : item.config;
            // Map the template sidebar_menu_id to the new menu ID
            if (config.sidebar_menu_id) {
              sidebarMenuId = menuIdMap[config.sidebar_menu_id] || null;
            }
            sidebarPosition = config.sidebar_position || null;
          }
          
          await db.query(
            `INSERT INTO menu_items (menu_id, screen_id, item_type, sidebar_menu_id, sidebar_position, display_order, label, icon, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [newMenuId, item.screen_id || null, item.item_type || 'screen',
             sidebarMenuId, sidebarPosition,
             item.display_order ?? 0, item.label || null, item.icon || null, item.is_active ?? 1]
          );
          stats.menuItems = (stats.menuItems || 0) + 1;
        }
      }

      // STEP 6: Clone Menu Role Access from template
      const templateMenuRoleAccess = await db.query(
        `SELECT atmra.*, atm.id as template_menu_id
         FROM app_template_menu_role_access atmra
         JOIN app_template_menus atm ON atmra.template_menu_id = atm.id
         WHERE atm.template_id = ?`,
        [template_id]
      );

      for (const access of templateMenuRoleAccess) {
        const newMenuId = menuIdMap[access.template_menu_id];
        const newRoleId = roleIdMap[access.template_role_id];
        if (newMenuId && newRoleId) {
          await db.query(
            `INSERT INTO menu_role_access (menu_id, role_id, app_id)
             VALUES (?, ?, ?)`,
            [newMenuId, newRoleId, newAppId]
          );
          stats.menuRoleAccess = (stats.menuRoleAccess || 0) + 1;
        }
      }

      // STEP 6b: Clone Screen Menu Assignments from template
      const templateScreenMenuAssignments = await db.query(
        'SELECT * FROM app_template_screen_menu_assignments WHERE template_id = ?',
        [template_id]
      );

      for (const assignment of templateScreenMenuAssignments) {
        const newMenuId = menuIdMap[assignment.template_menu_id];
        if (newMenuId) {
          await db.query(
            `INSERT INTO screen_menu_assignments (screen_id, menu_id)
             VALUES (?, ?)`,
            [assignment.screen_id, newMenuId]
          );
          stats.screenMenuAssignments = (stats.screenMenuAssignments || 0) + 1;
        }
      }

      // STEP 7: Clone Users from template
      const templateUsers = await db.query(
        'SELECT * FROM app_template_users WHERE template_id = ?',
        [template_id]
      );

      const userIdMap = {};
      for (const user of templateUsers) {
        const userResult = await db.query(
          `INSERT INTO app_users 
           (app_id, email, password_hash, first_name, last_name, phone, bio, avatar_url,
            date_of_birth, gender, status, email_verified)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [newAppId, user.email, user.password_hash, user.first_name || null, 
           user.last_name || null, user.phone || null, user.bio || null, user.avatar_url || null,
           user.date_of_birth || null, user.gender || null,
           user.status || 'active', user.email_verified ?? 0]
        );
        userIdMap[user.id] = userResult.insertId;
        stats.appUsers = (stats.appUsers || 0) + 1;
      }

      // STEP 8: Clone User Role Assignments from template
      const templateUserRoleAssignments = await db.query(
        `SELECT atura.*, atu.id as template_user_id
         FROM app_template_user_role_assignments atura
         JOIN app_template_users atu ON atura.template_user_id = atu.id
         WHERE atu.template_id = ?`,
        [template_id]
      );

      for (const assignment of templateUserRoleAssignments) {
        const newUserId = userIdMap[assignment.template_user_id];
        const newRoleId = roleIdMap[assignment.template_role_id];
        if (newUserId && newRoleId) {
          await db.query(
            `INSERT INTO app_user_role_assignments (user_id, app_role_id, assigned_by)
             VALUES (?, ?, ?)`,
            [newUserId, newRoleId, created_by]
          );
          stats.appUserRoleAssignments = (stats.appUserRoleAssignments || 0) + 1;
        }
      }

      // STEP 9: Clone Property Listings from template
      const templateListings = await db.query(
        'SELECT * FROM app_template_property_listings WHERE template_id = ?',
        [template_id]
      );

      const listingIdMap = {};
      for (const listing of templateListings) {
        const newUserId = userIdMap[listing.template_user_id] || null;
        const listingResult = await db.query(
          `INSERT INTO property_listings 
           (app_id, user_id, title, description, property_type, 
            address_line1, address_line2, city, state, country, postal_code,
            latitude, longitude, bedrooms, bathrooms, beds, guests_max, square_feet,
            price_per_night, currency, cleaning_fee, service_fee_percentage,
            min_nights, max_nights, check_in_time, check_out_time,
            cancellation_policy, status, is_published, is_instant_book,
            house_rules, additional_info)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [newAppId, newUserId, listing.title, listing.description || null, listing.property_type || 'apartment',
           listing.address_line1 || null, listing.address_line2 || null, listing.city, listing.state || null,
           listing.country, listing.postal_code || null, listing.latitude || null, listing.longitude || null,
           listing.bedrooms ?? 0, listing.bathrooms ?? 0, listing.beds ?? 0, listing.guests_max ?? 1,
           listing.square_feet || null, listing.price_per_night, listing.currency || 'USD',
           listing.cleaning_fee ?? 0, listing.service_fee_percentage ?? 0,
           listing.min_nights ?? 1, listing.max_nights ?? 365, listing.check_in_time || '15:00:00',
           listing.check_out_time || '11:00:00', listing.cancellation_policy || 'moderate',
           listing.status || 'draft', listing.is_published ?? 0, listing.is_instant_book ?? 0,
           listing.house_rules || null, listing.additional_info || null]
        );
        listingIdMap[listing.id] = listingResult.insertId;
        stats.propertyListings = (stats.propertyListings || 0) + 1;
      }

      // STEP 10: Clone Property Images from template
      for (const templateListing of templateListings) {
        const templateImages = await db.query(
          'SELECT * FROM app_template_property_images WHERE template_listing_id = ?',
          [templateListing.id]
        );

        const newListingId = listingIdMap[templateListing.id];
        for (const image of templateImages) {
          await db.query(
            `INSERT INTO property_images 
             (listing_id, image_url, image_key, caption, display_order, is_primary)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [newListingId, image.image_url, image.image_key || null, image.caption || null,
             image.display_order ?? 0, image.is_primary ?? 0]
          );
          stats.propertyImages = (stats.propertyImages || 0) + 1;
        }
      }

      // STEP 11: Clone Property Amenities from template
      for (const templateListing of templateListings) {
        const templateAmenities = await db.query(
          'SELECT * FROM app_template_property_amenities WHERE template_listing_id = ?',
          [templateListing.id]
        );

        const newListingId = listingIdMap[templateListing.id];
        for (const amenity of templateAmenities) {
          await db.query(
            `INSERT INTO property_listing_amenities (listing_id, amenity_id)
             VALUES (?, ?)`,
            [newListingId, amenity.amenity_id]
          );
          stats.propertyAmenities = (stats.propertyAmenities || 0) + 1;
        }
      }

      // STEP 11b: Clone Property Inquiries from template (Real Estate apps)
      const templateInquiries = await db.query(
        'SELECT * FROM app_template_property_inquiries WHERE template_id = ?',
        [template_id]
      );

      for (const inquiry of templateInquiries) {
        const newListingId = listingIdMap[inquiry.listing_ref];
        const newBuyerId = userIdMap[inquiry.buyer_ref];
        const newAgentId = inquiry.agent_ref ? userIdMap[inquiry.agent_ref] : null;
        
        if (newListingId && newBuyerId) {
          await db.query(
            `INSERT INTO property_inquiries 
             (app_id, listing_id, buyer_id, agent_id, inquiry_type, subject, message,
              preferred_contact, status, response, responded_at, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, DATE_SUB(NOW(), INTERVAL ? DAY))`,
            [newAppId, newListingId, newBuyerId, newAgentId, inquiry.inquiry_type || 'general',
             inquiry.subject || null, inquiry.message || null, inquiry.preferred_contact || 'either',
             inquiry.status || 'new', inquiry.response || null, 
             inquiry.status === 'responded' ? new Date() : null, inquiry.days_ago || 0]
          );
          stats.propertyInquiries = (stats.propertyInquiries || 0) + 1;
        }
      }

      // STEP 11c: Clone Property Showings from template (Real Estate apps)
      const templateShowings = await db.query(
        'SELECT * FROM app_template_property_showings WHERE template_id = ?',
        [template_id]
      );

      for (const showing of templateShowings) {
        const newListingId = listingIdMap[showing.listing_ref];
        const newBuyerId = userIdMap[showing.buyer_ref];
        const newAgentId = showing.agent_ref ? userIdMap[showing.agent_ref] : null;
        
        if (newListingId && newBuyerId) {
          // Calculate showing date based on days_from_now
          const showingDate = showing.days_from_now >= 0 
            ? `DATE_ADD(CURDATE(), INTERVAL ${showing.days_from_now} DAY)`
            : `DATE_SUB(CURDATE(), INTERVAL ${Math.abs(showing.days_from_now)} DAY)`;
          
          await db.query(
            `INSERT INTO property_showings 
             (app_id, listing_id, buyer_id, agent_id, showing_date, showing_time,
              showing_type, status, buyer_notes, agent_notes, feedback, buyer_interest_level,
              created_at)
             VALUES (?, ?, ?, ?, ${showingDate}, '14:00:00', ?, ?, ?, ?, ?, ?, DATE_SUB(NOW(), INTERVAL ? DAY))`,
            [newAppId, newListingId, newBuyerId, newAgentId,
             showing.showing_type || 'in_person', showing.status || 'requested',
             showing.buyer_notes || null, showing.agent_notes || null,
             showing.feedback || null, showing.buyer_interest_level || null,
             showing.days_ago || 0]
          );
          stats.propertyShowings = (stats.propertyShowings || 0) + 1;
        }
      }

      // STEP 11d: Clone Property Offers from template (Real Estate apps)
      const templateOffers = await db.query(
        'SELECT * FROM app_template_property_offers WHERE template_id = ?',
        [template_id]
      );

      for (const offer of templateOffers) {
        const newListingId = listingIdMap[offer.listing_ref];
        const newBuyerId = userIdMap[offer.buyer_ref];
        const newAgentId = offer.agent_ref ? userIdMap[offer.agent_ref] : null;
        
        if (newListingId && newBuyerId) {
          await db.query(
            `INSERT INTO property_offers 
             (app_id, listing_id, buyer_id, agent_id, offer_amount, earnest_money,
              down_payment_percent, financing_type, inspection_contingency, financing_contingency,
              appraisal_contingency, sale_contingency, other_contingencies,
              closing_date, status, counter_amount, counter_terms, response_notes,
              submitted_at, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
                     DATE_ADD(CURDATE(), INTERVAL ? DAY), ?, ?, ?, ?, NOW(), 
                     DATE_SUB(NOW(), INTERVAL ? DAY))`,
            [newAppId, newListingId, newBuyerId, newAgentId, offer.offer_amount,
             offer.earnest_money || null, offer.down_payment_percent || null,
             offer.financing_type || 'conventional', offer.inspection_contingency ?? 1,
             offer.financing_contingency ?? 1, offer.appraisal_contingency ?? 1,
             offer.sale_contingency ?? 0, offer.other_contingencies || null,
             offer.closing_days || 45, offer.status || 'submitted',
             offer.counter_amount || null, offer.counter_terms || null,
             offer.response_notes || null, offer.days_ago || 0]
          );
          stats.propertyOffers = (stats.propertyOffers || 0) + 1;
        }
      }

      // STEP 12: Clone Screen Content from template
      const templateScreenContent = await db.query(
        'SELECT * FROM app_template_screen_content WHERE template_id = ?',
        [template_id]
      );

      for (const content of templateScreenContent) {
        // Ensure all values are properly handled - undefined should become null
        const elementInstanceId = content.element_instance_id !== undefined ? content.element_instance_id : null;
        const customElementId = content.custom_element_id !== undefined ? content.custom_element_id : null;
        const contentValue = content.content_value !== undefined && content.content_value !== null ? content.content_value : null;
        // Options must be a valid JSON string or null
        let optionsValue = null;
        if (content.options !== undefined && content.options !== null && content.options !== '') {
          optionsValue = typeof content.options === 'string' ? content.options : JSON.stringify(content.options);
        }
        
        await db.query(
          `INSERT INTO app_screen_content (app_id, screen_id, element_instance_id, custom_element_id, content_value, options, updated_by)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [newAppId, content.screen_id, elementInstanceId, customElementId, contentValue, optionsValue, created_by]
        );
        stats.screenContent = (stats.screenContent || 0) + 1;
      }

      // STEP 13: Clone Custom Screen Elements from template
      const templateCustomElements = await db.query(
        'SELECT * FROM app_template_custom_screen_elements WHERE template_id = ?',
        [template_id]
      );

      for (const element of templateCustomElements) {
        // Ensure config is properly serialized as JSON string
        let configValue = null;
        if (element.config !== undefined && element.config !== null && element.config !== '') {
          configValue = typeof element.config === 'string' ? element.config : JSON.stringify(element.config);
        }
        
        await db.query(
          `INSERT INTO app_custom_screen_elements 
           (app_id, screen_id, element_id, field_key, label, placeholder, default_value, 
            validation_rules, is_required, display_order, config)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [newAppId, element.screen_id, element.element_id, element.field_key,
           element.label || null, element.placeholder || null, element.default_value || null,
           element.validation_rules || null, element.is_required ?? 0, element.display_order ?? 0,
           configValue]
        );
        stats.customElements = (stats.customElements || 0) + 1;
      }

      // STEP 14: Clone Administrators from template with role-based permissions
      const templateAdmins = await db.query(
        'SELECT * FROM app_template_administrators WHERE template_id = ?',
        [template_id]
      );

      // Admin permission preset (role_id = 2)
      const adminScreenPermissions = {
        "18": { can_menu_config: false, can_edit_content: true, can_module_config: false, can_toggle_publish: true },
        "96": { can_menu_config: true, can_edit_content: true, can_module_config: true, can_toggle_publish: true },
        "97": { can_menu_config: false, can_edit_content: false, can_module_config: false, can_toggle_publish: false },
        "98": { can_menu_config: true, can_edit_content: true, can_module_config: true, can_toggle_publish: true },
        "99": { can_menu_config: true, can_edit_content: true, can_module_config: true, can_toggle_publish: true },
        "100": { can_menu_config: true, can_edit_content: true, can_module_config: true, can_toggle_publish: true },
        "101": { can_menu_config: false, can_edit_content: false, can_module_config: false, can_toggle_publish: false },
        "102": { can_menu_config: false, can_edit_content: true, can_module_config: false, can_toggle_publish: true },
        "103": { can_menu_config: false, can_edit_content: true, can_module_config: false, can_toggle_publish: true },
        "104": { can_menu_config: false, can_edit_content: true, can_module_config: false, can_toggle_publish: false },
        "105": { can_menu_config: true, can_edit_content: true, can_module_config: true, can_toggle_publish: true },
        "106": { can_menu_config: true, can_edit_content: true, can_module_config: true, can_toggle_publish: true },
        "107": { can_menu_config: true, can_edit_content: false, can_module_config: true, can_toggle_publish: false },
        "108": { can_menu_config: true, can_edit_content: true, can_module_config: true, can_toggle_publish: true },
        "109": { can_menu_config: true, can_edit_content: true, can_module_config: true, can_toggle_publish: true },
        "110": { can_menu_config: true, can_edit_content: true, can_module_config: true, can_toggle_publish: true },
        "111": { can_menu_config: true, can_edit_content: true, can_module_config: true, can_toggle_publish: true },
        "112": { can_menu_config: true, can_edit_content: false, can_module_config: true, can_toggle_publish: false },
        "113": { can_menu_config: true, can_edit_content: false, can_module_config: true, can_toggle_publish: true },
        "114": { can_menu_config: true, can_edit_content: false, can_module_config: true, can_toggle_publish: false },
        "115": { can_menu_config: false, can_edit_content: false, can_module_config: false, can_toggle_publish: false },
        "116": { can_menu_config: true, can_edit_content: false, can_module_config: true, can_toggle_publish: false },
        "117": { can_menu_config: false, can_edit_content: false, can_module_config: false, can_toggle_publish: false },
        "127": { can_menu_config: true, can_edit_content: false, can_module_config: true, can_toggle_publish: false },
        "128": { can_menu_config: false, can_edit_content: false, can_module_config: false, can_toggle_publish: false },
        "129": { can_menu_config: true, can_edit_content: false, can_module_config: true, can_toggle_publish: false },
        "130": { can_menu_config: true, can_edit_content: false, can_module_config: true, can_toggle_publish: false },
        "131": { can_menu_config: true, can_edit_content: false, can_module_config: true, can_toggle_publish: false },
        "132": { can_menu_config: true, can_edit_content: false, can_module_config: true, can_toggle_publish: false },
        "133": { can_menu_config: true, can_edit_content: false, can_module_config: true, can_toggle_publish: false },
        "134": { can_menu_config: true, can_edit_content: false, can_module_config: true, can_toggle_publish: false },
        "135": { can_menu_config: true, can_edit_content: false, can_module_config: true, can_toggle_publish: false },
        "137": { can_menu_config: false, can_edit_content: false, can_module_config: false, can_toggle_publish: false },
      };
      const adminMenuAccess = { property_listings: true, bookings: true, contact_submissions: true, menus: true };
      const adminCustomPermissions = JSON.stringify({ screens: adminScreenPermissions, menu_access: adminMenuAccess });

      // Editor permission preset (role_id = 3)
      const editorScreenPermissions = {
        "18": { can_menu_config: false, can_edit_content: true, can_module_config: false, can_toggle_publish: true },
        "96": { can_menu_config: false, can_edit_content: true, can_module_config: false, can_toggle_publish: true },
        "97": { can_menu_config: false, can_edit_content: false, can_module_config: false, can_toggle_publish: false },
        "98": { can_menu_config: false, can_edit_content: true, can_module_config: false, can_toggle_publish: true },
        "99": { can_menu_config: false, can_edit_content: true, can_module_config: false, can_toggle_publish: true },
        "100": { can_menu_config: false, can_edit_content: true, can_module_config: false, can_toggle_publish: true },
        "101": { can_menu_config: false, can_edit_content: false, can_module_config: false, can_toggle_publish: false },
        "102": { can_menu_config: false, can_edit_content: true, can_module_config: false, can_toggle_publish: true },
        "103": { can_menu_config: false, can_edit_content: true, can_module_config: false, can_toggle_publish: true },
        "104": { can_menu_config: false, can_edit_content: true, can_module_config: false, can_toggle_publish: true },
        "105": { can_menu_config: false, can_edit_content: true, can_module_config: false, can_toggle_publish: true },
        "106": { can_menu_config: false, can_edit_content: true, can_module_config: false, can_toggle_publish: true },
        "107": { can_menu_config: false, can_edit_content: false, can_module_config: false, can_toggle_publish: false },
        "108": { can_menu_config: false, can_edit_content: true, can_module_config: false, can_toggle_publish: true },
        "109": { can_menu_config: false, can_edit_content: true, can_module_config: false, can_toggle_publish: true },
        "110": { can_menu_config: false, can_edit_content: true, can_module_config: false, can_toggle_publish: true },
        "111": { can_menu_config: false, can_edit_content: true, can_module_config: false, can_toggle_publish: true },
        "112": { can_menu_config: false, can_edit_content: false, can_module_config: false, can_toggle_publish: false },
        "113": { can_menu_config: false, can_edit_content: false, can_module_config: false, can_toggle_publish: false },
        "114": { can_menu_config: false, can_edit_content: false, can_module_config: false, can_toggle_publish: false },
        "115": { can_menu_config: false, can_edit_content: false, can_module_config: false, can_toggle_publish: false },
        "116": { can_menu_config: false, can_edit_content: false, can_module_config: false, can_toggle_publish: false },
        "117": { can_menu_config: false, can_edit_content: false, can_module_config: false, can_toggle_publish: false },
        "127": { can_menu_config: false, can_edit_content: false, can_module_config: false, can_toggle_publish: false },
        "128": { can_menu_config: false, can_edit_content: false, can_module_config: false, can_toggle_publish: false },
        "129": { can_menu_config: false, can_edit_content: false, can_module_config: false, can_toggle_publish: false },
        "130": { can_menu_config: false, can_edit_content: false, can_module_config: false, can_toggle_publish: false },
        "131": { can_menu_config: false, can_edit_content: false, can_module_config: false, can_toggle_publish: false },
        "132": { can_menu_config: false, can_edit_content: false, can_module_config: false, can_toggle_publish: false },
        "133": { can_menu_config: false, can_edit_content: false, can_module_config: false, can_toggle_publish: false },
        "134": { can_menu_config: false, can_edit_content: false, can_module_config: false, can_toggle_publish: false },
        "135": { can_menu_config: false, can_edit_content: false, can_module_config: false, can_toggle_publish: false },
        "137": { can_menu_config: false, can_edit_content: false, can_module_config: false, can_toggle_publish: false },
      };
      const editorMenuAccess = { property_listings: false, bookings: false, contact_submissions: false, menus: false };
      const editorCustomPermissions = JSON.stringify({ screens: editorScreenPermissions, menu_access: editorMenuAccess });

      for (const admin of templateAdmins) {
        // Determine role-based permissions
        const roleId = admin.role_id || 3; // Default to Editor
        const isAdmin = roleId === 2;
        
        const customPerms = isAdmin ? adminCustomPermissions : editorCustomPermissions;
        const canManageUsers = isAdmin ? 1 : 0;
        const canManageAdmins = isAdmin ? 1 : 0;
        const canManageSettings = isAdmin ? 1 : 0;
        
        await db.query(
          `INSERT INTO user_app_permissions 
           (user_id, app_id, role_id, can_view, can_edit, can_delete, can_publish, 
            can_manage_users, can_manage_admins, can_manage_settings, custom_permissions, granted_by)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [admin.user_id, newAppId, roleId, 1, 1, 1, 1, 
           canManageUsers, canManageAdmins, canManageSettings, customPerms, created_by]
        );
        stats.administrators = (stats.administrators || 0) + 1;
      }

      // STEP 15: Clone Role Home Screens from template
      const templateRoleHomeScreens = await db.query(
        `SELECT atrhs.*, atr.id as template_role_id
         FROM app_template_role_home_screens atrhs
         JOIN app_template_roles atr ON atrhs.template_role_id = atr.id
         WHERE atr.template_id = ?`,
        [template_id]
      );

      for (const homeScreen of templateRoleHomeScreens) {
        const newRoleId = roleIdMap[homeScreen.template_role_id];
        if (newRoleId) {
          await db.query(
            `INSERT INTO role_home_screens (app_id, role_id, screen_id)
             VALUES (?, ?, ?)`,
            [newAppId, newRoleId, homeScreen.screen_id]
          );
          stats.roleHomeScreens = (stats.roleHomeScreens || 0) + 1;
        }
      }

      // STEP 16: Clone Screen Module Assignments from template (header bar configs, etc.)
      const templateScreenModules = await db.query(
        'SELECT * FROM app_template_screen_module_assignments WHERE template_id = ?',
        [template_id]
      );

      for (const moduleAssign of templateScreenModules) {
        // Check if assignment already exists (screens share module assignments)
        const existing = await db.query(
          'SELECT id FROM screen_module_assignments WHERE screen_id = ? AND module_id = ?',
          [moduleAssign.screen_id, moduleAssign.module_id]
        );
        
        if (!existing || existing.length === 0) {
          await db.query(
            `INSERT INTO screen_module_assignments (screen_id, module_id, config, is_active)
             VALUES (?, ?, ?, ?)`,
            [moduleAssign.screen_id, moduleAssign.module_id, 
             moduleAssign.config || null, moduleAssign.is_active ?? 1]
          );
        } else {
          // Update existing with template config
          await db.query(
            `UPDATE screen_module_assignments SET config = ?, is_active = ? 
             WHERE screen_id = ? AND module_id = ?`,
            [moduleAssign.config || null, moduleAssign.is_active ?? 1,
             moduleAssign.screen_id, moduleAssign.module_id]
          );
        }
        stats.screenModuleAssignments = (stats.screenModuleAssignments || 0) + 1;
      }

      // STEP 17: Clone Driver Profiles from template (for rideshare apps)
      const templateDriverProfiles = await db.query(
        'SELECT * FROM app_template_driver_profiles WHERE template_id = ?',
        [template_id]
      );

      for (const profile of templateDriverProfiles) {
        const newUserId = userIdMap[profile.template_user_id];
        if (newUserId) {
          await db.query(
            `INSERT INTO driver_profiles 
             (app_id, user_id, vehicle_make, vehicle_model, vehicle_year, vehicle_color,
              license_plate, vehicle_type, rating, total_rides, is_verified, is_online)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
            [newAppId, newUserId, profile.vehicle_make, profile.vehicle_model,
             profile.vehicle_year, profile.vehicle_color, profile.license_plate,
             profile.vehicle_type || 'sedan', profile.rating || 5.00,
             profile.total_rides || 0, profile.is_verified ? 1 : 0]
          );
          stats.driverProfiles = (stats.driverProfiles || 0) + 1;
        }
      }

      // STEP 17: Clone Rides from template (for rideshare apps)
      const templateRides = await db.query(
        'SELECT * FROM app_template_rides WHERE template_id = ?',
        [template_id]
      );

      for (const ride of templateRides) {
        const riderId = userIdMap[ride.template_rider_id];
        const driverId = userIdMap[ride.template_driver_id];
        if (riderId) {
          await db.query(
            `INSERT INTO rides 
             (app_id, rider_id, driver_id, pickup_address, pickup_latitude, pickup_longitude,
              destination_address, destination_latitude, destination_longitude,
              ride_type, status, estimated_fare, actual_fare)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [newAppId, riderId, driverId || null, ride.pickup_address,
             ride.pickup_latitude, ride.pickup_longitude, ride.destination_address,
             ride.destination_latitude, ride.destination_longitude,
             ride.ride_type || 'standard', ride.status || 'completed',
             ride.estimated_fare, ride.actual_fare]
          );
          stats.rides = (stats.rides || 0) + 1;
        }
      }

      // STEP 18: Clone Ride Pricing Rules from template (for rideshare apps)
      const templatePricing = await db.query(
        'SELECT * FROM app_template_ride_pricing WHERE template_id = ?',
        [template_id]
      );

      for (const pricing of templatePricing) {
        await db.query(
          `INSERT INTO ride_pricing_rules 
           (app_id, ride_type, base_fare, per_km_rate, per_minute_rate, minimum_fare, is_active)
           VALUES (?, ?, ?, ?, ?, ?, 1)`,
          [newAppId, pricing.ride_type, pricing.base_fare, pricing.per_km_rate,
           pricing.per_minute_rate, pricing.minimum_fare]
        );
        stats.pricingRules = (stats.pricingRules || 0) + 1;
      }
    }

    res.json({
      success: true,
      message: 'App created from template successfully',
      data: {
        app_id: newAppId,
        app_name: app_name,
        cloned_from: cloneFromAppId ? `App ID ${cloneFromAppId}` : `Template ID ${template_id}`,
        stats: stats
      }
    });
  } catch (error) {
    console.error('Create app from template error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create app from template',
      error: error.message
    });
  }
};

/**
 * Create a new app template
 * POST /api/v1/app-templates
 */
const createAppTemplate = async (req, res) => {
  try {
    const { name, description, category, icon, is_active, created_by } = req.body;

    if (!name || !created_by) {
      return res.status(400).json({
        success: false,
        message: 'Name and created_by are required'
      });
    }

    const result = await db.query(
      `INSERT INTO app_templates (name, description, category, icon, is_active, created_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, description, category, icon, is_active !== false, created_by]
    );

    res.json({
      success: true,
      message: 'App template created successfully',
      data: {
        id: result.insertId,
        name
      }
    });
  } catch (error) {
    console.error('Create app template error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create app template',
      error: error.message
    });
  }
};

/**
 * Update an app template
 * PUT /api/v1/app-templates/:id
 */
const updateAppTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, icon, is_active } = req.body;

    // Check if template exists
    const existing = await db.query(
      'SELECT id FROM app_templates WHERE id = ?',
      [id]
    );

    if (!existing || existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    // Build update query dynamically
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
    if (category !== undefined) {
      updates.push('category = ?');
      values.push(category);
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

    values.push(id);
    await db.query(
      `UPDATE app_templates SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    res.json({
      success: true,
      message: 'App template updated successfully'
    });
  } catch (error) {
    console.error('Update app template error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update app template',
      error: error.message
    });
  }
};

/**
 * Delete an app template
 * DELETE /api/v1/app-templates/:id
 */
const deleteAppTemplate = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if template exists
    const existing = await db.query(
      'SELECT id, name FROM app_templates WHERE id = ?',
      [id]
    );

    if (!existing || existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    // Delete template (cascade will handle screens and elements)
    await db.query('DELETE FROM app_templates WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'App template deleted successfully'
    });
  } catch (error) {
    console.error('Delete app template error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete app template',
      error: error.message
    });
  }
};

/**
 * Add screen to app template
 * POST /api/v1/app-templates/:templateId/screens
 */
const addScreenToTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;
    const { screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen } = req.body;

    if (!screen_name || !screen_key) {
      return res.status(400).json({
        success: false,
        message: 'Screen name and key are required'
      });
    }

    const result = await db.query(
      `INSERT INTO app_template_screens 
       (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [templateId, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order || 0, is_home_screen || false]
    );

    res.json({
      success: true,
      message: 'Screen added to template successfully',
      data: {
        id: result.insertId,
        screen_name
      }
    });
  } catch (error) {
    console.error('Add screen to template error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add screen to template',
      error: error.message
    });
  }
};

/**
 * Add screen from master screens list
 * POST /api/v1/app-templates/:templateId/screens/from-master
 */
const addScreenFromMaster = async (req, res) => {
  try {
    const { templateId } = req.params;
    const { screen_id } = req.body;

    if (!screen_id) {
      return res.status(400).json({
        success: false,
        message: 'screen_id is required'
      });
    }

    // Get screen details from master screens
    const screenResult = await db.query(
      `SELECT id, name, description, category, icon FROM app_screens WHERE id = ?`,
      [screen_id]
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

    // Get next display order
    const orderResult = await db.query(
      `SELECT MAX(display_order) as max_order FROM app_template_screens WHERE template_id = ?`,
      [templateId]
    );
    const orderData = Array.isArray(orderResult) && Array.isArray(orderResult[0]) 
      ? orderResult[0] 
      : orderResult;
    const nextOrder = (orderData && orderData[0]?.max_order || 0) + 1;

    // Add screen to template
    const result = await db.query(
      `INSERT INTO app_template_screens 
       (template_id, screen_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [templateId, screen_id, screen.name, screen.name.toLowerCase().replace(/\s+/g, '_'), screen.description, screen.icon, screen.category, nextOrder]
    );

    res.json({
      success: true,
      message: 'Screen added to template successfully',
      data: {
        id: result.insertId,
        screen_name: screen.name
      }
    });
  } catch (error) {
    console.error('Add screen from master error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add screen to template',
      error: error.message
    });
  }
};

/**
 * Update template screen
 * PUT /api/v1/app-templates/:templateId/screens/:screenId
 */
const updateTemplateScreen = async (req, res) => {
  try {
    const { templateId, screenId } = req.params;
    const { screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen } = req.body;

    // Check if screen exists
    const existing = await db.query(
      'SELECT id FROM app_template_screens WHERE id = ? AND template_id = ?',
      [screenId, templateId]
    );

    if (!existing || existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Screen not found'
      });
    }

    // Build update query dynamically
    const updates = [];
    const values = [];

    if (screen_name !== undefined) {
      updates.push('screen_name = ?');
      values.push(screen_name);
    }
    if (screen_key !== undefined) {
      updates.push('screen_key = ?');
      values.push(screen_key);
    }
    if (screen_description !== undefined) {
      updates.push('screen_description = ?');
      values.push(screen_description);
    }
    if (screen_icon !== undefined) {
      updates.push('screen_icon = ?');
      values.push(screen_icon);
    }
    if (screen_category !== undefined) {
      updates.push('screen_category = ?');
      values.push(screen_category);
    }
    if (display_order !== undefined) {
      updates.push('display_order = ?');
      values.push(display_order);
    }
    if (is_home_screen !== undefined) {
      updates.push('is_home_screen = ?');
      values.push(is_home_screen);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    values.push(screenId);
    values.push(templateId);
    await db.query(
      `UPDATE app_template_screens SET ${updates.join(', ')} WHERE id = ? AND template_id = ?`,
      values
    );

    res.json({
      success: true,
      message: 'Screen updated successfully'
    });
  } catch (error) {
    console.error('Update template screen error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update screen',
      error: error.message
    });
  }
};

/**
 * Delete template screen
 * DELETE /api/v1/app-templates/:templateId/screens/:screenId
 */
const deleteTemplateScreen = async (req, res) => {
  try {
    const { templateId, screenId } = req.params;

    // Check if screen exists
    const existing = await db.query(
      'SELECT id, screen_name FROM app_template_screens WHERE id = ? AND template_id = ?',
      [screenId, templateId]
    );

    if (!existing || existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Screen not found'
      });
    }

    // Delete screen (cascade will handle elements)
    await db.query('DELETE FROM app_template_screens WHERE id = ? AND template_id = ?', [screenId, templateId]);

    res.json({
      success: true,
      message: 'Screen deleted successfully'
    });
  } catch (error) {
    console.error('Delete template screen error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete screen',
      error: error.message
    });
  }
};

/**
 * Add element to template screen
 * POST /api/v1/app-templates/:templateId/screens/:screenId/elements
 */
const addElementToTemplateScreen = async (req, res) => {
  try {
    const { templateId, screenId } = req.params;
    const { element_id, field_key, label, placeholder, default_value, is_required, is_readonly, display_order, config } = req.body;

    if (!element_id || !field_key) {
      return res.status(400).json({
        success: false,
        message: 'Element ID and field key are required'
      });
    }

    const result = await db.query(
      `INSERT INTO app_template_screen_elements 
       (template_screen_id, element_id, field_key, label, placeholder, default_value, is_required, is_readonly, display_order, config)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [screenId, element_id, field_key, label, placeholder, default_value, is_required || false, is_readonly || false, display_order || 0, config ? JSON.stringify(config) : null]
    );

    res.json({
      success: true,
      message: 'Element added to screen successfully',
      data: {
        id: result.insertId
      }
    });
  } catch (error) {
    console.error('Add element to template screen error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add element to screen',
      error: error.message
    });
  }
};

/**
 * Update element in template screen
 * PUT /api/v1/app-templates/:templateId/screens/:screenId/elements/:elementId
 */
const updateElementInTemplateScreen = async (req, res) => {
  try {
    const { templateId, screenId, elementId } = req.params;
    const { label, placeholder, default_value, is_required, is_readonly, display_order, config } = req.body;

    // Check if element exists
    const existing = await db.query(
      'SELECT id FROM app_template_screen_elements WHERE id = ? AND template_screen_id = ?',
      [elementId, screenId]
    );

    if (!existing || existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Element not found'
      });
    }

    // Build update query dynamically
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
    if (is_required !== undefined) {
      updates.push('is_required = ?');
      values.push(is_required);
    }
    if (is_readonly !== undefined) {
      updates.push('is_readonly = ?');
      values.push(is_readonly);
    }
    if (display_order !== undefined) {
      updates.push('display_order = ?');
      values.push(display_order);
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

    values.push(elementId, screenId);

    await db.query(
      `UPDATE app_template_screen_elements SET ${updates.join(', ')} WHERE id = ? AND template_screen_id = ?`,
      values
    );

    res.json({
      success: true,
      message: 'Element updated successfully'
    });
  } catch (error) {
    console.error('Update element in template screen error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update element',
      error: error.message
    });
  }
};

/**
 * Delete element from template screen
 * DELETE /api/v1/app-templates/:templateId/screens/:screenId/elements/:elementId
 */
const deleteElementFromTemplateScreen = async (req, res) => {
  try {
    const { templateId, screenId, elementId } = req.params;

    // Check if element exists
    const existing = await db.query(
      'SELECT id FROM app_template_screen_elements WHERE id = ? AND template_screen_id = ?',
      [elementId, screenId]
    );

    if (!existing || existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Element not found'
      });
    }

    // Delete element
    await db.query('DELETE FROM app_template_screen_elements WHERE id = ? AND template_screen_id = ?', [elementId, screenId]);

    res.json({
      success: true,
      message: 'Element deleted successfully'
    });
  } catch (error) {
    console.error('Delete element from template screen error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete element',
      error: error.message
    });
  }
};

/**
 * Duplicate app template
 * POST /api/v1/app-templates/:id/duplicate
 */
const duplicateAppTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, created_by } = req.body;

    if (!name || !created_by) {
      return res.status(400).json({
        success: false,
        message: 'Name and created_by are required'
      });
    }

    // Get original template
    const originalTemplate = await db.query(
      'SELECT * FROM app_templates WHERE id = ?',
      [id]
    );

    if (!originalTemplate || originalTemplate.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    const template = originalTemplate[0];

    // Create new template
    const newTemplateResult = await db.query(
      `INSERT INTO app_templates (name, description, category, icon, is_active, created_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, template.description, template.category, template.icon, template.is_active, created_by]
    );

    const newTemplateId = newTemplateResult.insertId;

    // Get all screens from original template
    const screens = await db.query(
      'SELECT * FROM app_template_screens WHERE template_id = ? ORDER BY display_order',
      [id]
    );

    // Copy each screen
    for (const screen of screens) {
      const newScreenResult = await db.query(
        `INSERT INTO app_template_screens 
         (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [newTemplateId, screen.screen_name, screen.screen_key, screen.screen_description, screen.screen_icon, screen.screen_category, screen.display_order, screen.is_home_screen]
      );

      const newScreenId = newScreenResult.insertId;

      // Get all elements from original screen
      const elements = await db.query(
        'SELECT * FROM app_template_screen_elements WHERE template_screen_id = ? ORDER BY display_order',
        [screen.id]
      );

      // Copy each element
      for (const element of elements) {
        await db.query(
          `INSERT INTO app_template_screen_elements 
           (template_screen_id, element_id, field_key, label, placeholder, default_value, is_required, is_readonly, display_order, config)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [newScreenId, element.element_id, element.field_key, element.label, element.placeholder, element.default_value, element.is_required, element.is_readonly, element.display_order, element.config]
        );
      }
    }

    res.json({
      success: true,
      message: 'Template duplicated successfully',
      data: {
        id: newTemplateId,
        name: name
      }
    });
  } catch (error) {
    console.error('Duplicate app template error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to duplicate template',
      error: error.message
    });
  }
};

module.exports = {
  getAllAppTemplates,
  getAppTemplateById,
  createAppTemplate,
  updateAppTemplate,
  deleteAppTemplate,
  duplicateAppTemplate,
  addScreenToTemplate,
  addScreenFromMaster,
  updateTemplateScreen,
  deleteTemplateScreen,
  addElementToTemplateScreen,
  updateElementInTemplateScreen,
  deleteElementFromTemplateScreen,
  createAppFromTemplate
};
