-- Migration: Copy data from App 28 to Template 9
-- This makes Template 9 self-contained
-- Date: 2025-11-30

-- Set collation for session to avoid collation mismatches
SET NAMES utf8mb4 ;

-- ========================================
-- Copy Roles from App 28 to Template 9 (skip if already exists)
-- ========================================
INSERT IGNORE INTO app_template_roles (template_id, name, display_name, description, is_default)
SELECT 9, name, display_name, description, is_default
FROM app_roles WHERE app_id = 28;

-- ========================================
-- Copy Menus from App 28 to Template 9 (skip if already exists)
-- ========================================
INSERT IGNORE INTO app_template_menus (template_id, name, menu_type, icon, description, is_active)
SELECT 9, name, menu_type, icon, description, is_active
FROM app_menus WHERE app_id = 28;

-- ========================================
-- Copy Menu Items
-- ========================================
INSERT INTO app_template_menu_items (template_menu_id, screen_id, label, icon, item_type, display_order, is_active)
SELECT 
    atm.id,
    mi.screen_id,
    mi.label,
    mi.icon,
    mi.item_type,
    mi.display_order,
    mi.is_active
FROM menu_items mi
JOIN app_menus am ON mi.menu_id = am.id
JOIN app_template_menus atm ON atm.template_id = 9 AND atm.name  = am.name  AND atm.menu_type = am.menu_type
WHERE am.app_id = 28;

-- ========================================
-- Copy Menu Role Access
-- ========================================
INSERT INTO app_template_menu_role_access (template_menu_id, template_role_id)
SELECT 
    atm.id,
    atr.id
FROM menu_role_access mra
JOIN app_menus am ON mra.menu_id = am.id
JOIN app_roles ar ON mra.role_id = ar.id
JOIN app_template_menus atm ON atm.template_id = 9 AND atm.name  = am.name  AND atm.menu_type = am.menu_type
JOIN app_template_roles atr ON atr.template_id = 9 AND atr.name  = ar.name WHERE am.app_id = 28;

-- ========================================
-- Copy Screen Role Access
-- ========================================
INSERT INTO app_template_screen_role_access (template_id, screen_id, template_role_id, can_access)
SELECT 
    9,
    sra.screen_id,
    atr.id,
    sra.can_access
FROM screen_role_access sra
JOIN app_roles ar ON sra.role_id = ar.id
JOIN app_template_roles atr ON atr.template_id = 9 AND atr.name  = ar.name WHERE sra.app_id = 28;

-- ========================================
-- Copy Role Home Screens
-- ========================================
INSERT INTO app_template_role_home_screens (template_role_id, screen_id)
SELECT 
    atr.id,
    rhs.screen_id
FROM role_home_screens rhs
JOIN app_roles ar ON rhs.role_id = ar.id
JOIN app_template_roles atr ON atr.template_id = 9 AND atr.name  = ar.name WHERE ar.app_id = 28;

-- ========================================
-- Copy Users from App 28 to Template 9
-- ========================================
INSERT INTO app_template_users (template_id, email, password_hash, first_name, last_name, phone, bio, avatar_url, date_of_birth, gender, status, email_verified)
SELECT 9, email, password_hash, first_name, last_name, phone, bio, avatar_url, date_of_birth, gender, status, email_verified
FROM app_users WHERE app_id = 28;

-- ========================================
-- Copy User Role Assignments
-- ========================================
INSERT INTO app_template_user_role_assignments (template_user_id, template_role_id)
SELECT 
    atu.id,
    atr.id
FROM app_user_role_assignments aura
JOIN app_users au ON aura.user_id = au.id
JOIN app_roles ar ON aura.app_role_id = ar.id
JOIN app_template_users atu ON atu.template_id = 9 AND atu.email  = au.email JOIN app_template_roles atr ON atr.template_id = 9 AND atr.name  = ar.name WHERE au.app_id = 28;

-- ========================================
-- Copy Property Listings
-- ========================================
INSERT INTO app_template_property_listings (
    template_id, template_user_id, title, description, property_type,
    address_line1, address_line2, city, state, country, postal_code,
    latitude, longitude, bedrooms, bathrooms, beds, guests_max, square_feet,
    price_per_night, currency, cleaning_fee, service_fee_percentage,
    min_nights, max_nights, check_in_time, check_out_time,
    cancellation_policy, status, is_published, is_instant_book,
    house_rules, additional_info
)
SELECT 
    9,
    atu.id,
    pl.title, pl.description, pl.property_type,
    pl.address_line1, pl.address_line2, pl.city, pl.state, pl.country, pl.postal_code,
    pl.latitude, pl.longitude, pl.bedrooms, pl.bathrooms, pl.beds, pl.guests_max, pl.square_feet,
    pl.price_per_night, pl.currency, pl.cleaning_fee, pl.service_fee_percentage,
    pl.min_nights, pl.max_nights, pl.check_in_time, pl.check_out_time,
    pl.cancellation_policy, pl.status, pl.is_published, pl.is_instant_book,
    pl.house_rules, pl.additional_info
FROM property_listings pl
LEFT JOIN app_users au ON pl.user_id = au.id
LEFT JOIN app_template_users atu ON atu.template_id = 9 AND atu.email  = au.email WHERE pl.app_id = 28;

-- ========================================
-- Copy Property Images
-- ========================================
INSERT INTO app_template_property_images (template_listing_id, image_url, image_key, caption, display_order, is_primary)
SELECT 
    atpl.id,
    pi.image_url,
    pi.image_key,
    pi.caption,
    pi.display_order,
    pi.is_primary
FROM property_images pi
JOIN property_listings pl ON pi.listing_id = pl.id
JOIN app_template_property_listings atpl ON atpl.template_id = 9 AND atpl.title  = pl.title  AND atpl.city  = pl.city WHERE pl.app_id = 28;

-- ========================================
-- Copy Property Amenities
-- ========================================
INSERT INTO app_template_property_amenities (template_listing_id, amenity_id)
SELECT 
    atpl.id,
    pla.amenity_id
FROM property_listing_amenities pla
JOIN property_listings pl ON pla.listing_id = pl.id
JOIN app_template_property_listings atpl ON atpl.template_id = 9 AND atpl.title  = pl.title  AND atpl.city  = pl.city WHERE pl.app_id = 28;

-- ========================================
-- Copy Screen Content
-- ========================================
INSERT INTO app_template_screen_content (template_id, screen_id, element_instance_id, custom_element_id, content_value, options)
SELECT 
    9,
    screen_id,
    element_instance_id,
    custom_element_id,
    content_value,
    options
FROM app_screen_content WHERE app_id = 28;

-- ========================================
-- Copy Custom Screen Elements
-- ========================================
INSERT INTO app_template_custom_screen_elements (template_id, screen_id, element_id, field_key, label, placeholder, default_value, validation_rules, is_required, display_order, config)
SELECT 
    9,
    screen_id,
    element_id,
    field_key,
    label,
    placeholder,
    default_value,
    validation_rules,
    is_required,
    display_order,
    config
FROM app_custom_screen_elements WHERE app_id = 28;
