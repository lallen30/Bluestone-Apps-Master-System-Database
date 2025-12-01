-- Migration: Create template-specific data tables
-- This allows templates to be self-contained without relying on a source app
-- Date: 2025-11-30

-- ========================================
-- Template Roles
-- ========================================
CREATE TABLE IF NOT EXISTS app_template_roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    template_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_default TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (template_id) REFERENCES app_templates(id) ON DELETE CASCADE,
    UNIQUE KEY unique_template_role (template_id, name)
);

-- ========================================
-- Template Menus
-- ========================================
CREATE TABLE IF NOT EXISTS app_template_menus (
    id INT AUTO_INCREMENT PRIMARY KEY,
    template_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    menu_type ENUM('sidebar_left', 'sidebar_right', 'tabbar', 'header', 'footer') NOT NULL,
    icon VARCHAR(50),
    description TEXT,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (template_id) REFERENCES app_templates(id) ON DELETE CASCADE
);

-- ========================================
-- Template Menu Items
-- ========================================
CREATE TABLE IF NOT EXISTS app_template_menu_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    template_menu_id INT NOT NULL,
    screen_id INT,
    label VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    item_type ENUM('screen', 'url', 'action', 'divider', 'logout') DEFAULT 'screen',
    url VARCHAR(255),
    action_type VARCHAR(50),
    display_order INT DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    config JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (template_menu_id) REFERENCES app_template_menus(id) ON DELETE CASCADE,
    FOREIGN KEY (screen_id) REFERENCES app_screens(id) ON DELETE SET NULL
);

-- ========================================
-- Template Menu Role Access
-- ========================================
CREATE TABLE IF NOT EXISTS app_template_menu_role_access (
    id INT AUTO_INCREMENT PRIMARY KEY,
    template_menu_id INT NOT NULL,
    template_role_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (template_menu_id) REFERENCES app_template_menus(id) ON DELETE CASCADE,
    FOREIGN KEY (template_role_id) REFERENCES app_template_roles(id) ON DELETE CASCADE,
    UNIQUE KEY unique_menu_role (template_menu_id, template_role_id)
);

-- ========================================
-- Template Screen Role Access
-- ========================================
CREATE TABLE IF NOT EXISTS app_template_screen_role_access (
    id INT AUTO_INCREMENT PRIMARY KEY,
    template_id INT NOT NULL,
    screen_id INT NOT NULL,
    template_role_id INT NOT NULL,
    can_access TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (template_id) REFERENCES app_templates(id) ON DELETE CASCADE,
    FOREIGN KEY (screen_id) REFERENCES app_screens(id) ON DELETE CASCADE,
    FOREIGN KEY (template_role_id) REFERENCES app_template_roles(id) ON DELETE CASCADE,
    UNIQUE KEY unique_screen_role (template_id, screen_id, template_role_id)
);

-- ========================================
-- Template Role Home Screens
-- ========================================
CREATE TABLE IF NOT EXISTS app_template_role_home_screens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    template_role_id INT NOT NULL,
    screen_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (template_role_id) REFERENCES app_template_roles(id) ON DELETE CASCADE,
    FOREIGN KEY (screen_id) REFERENCES app_screens(id) ON DELETE CASCADE,
    UNIQUE KEY unique_role_home (template_role_id)
);

-- ========================================
-- Template Users (sample users for demo/testing)
-- ========================================
CREATE TABLE IF NOT EXISTS app_template_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    template_id INT NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    bio TEXT,
    avatar_url VARCHAR(500),
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other', 'prefer_not_to_say'),
    status ENUM('active', 'inactive', 'suspended', 'pending_verification') DEFAULT 'active',
    email_verified TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (template_id) REFERENCES app_templates(id) ON DELETE CASCADE,
    UNIQUE KEY unique_template_user (template_id, email)
);

-- ========================================
-- Template User Role Assignments
-- ========================================
CREATE TABLE IF NOT EXISTS app_template_user_role_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    template_user_id INT NOT NULL,
    template_role_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (template_user_id) REFERENCES app_template_users(id) ON DELETE CASCADE,
    FOREIGN KEY (template_role_id) REFERENCES app_template_roles(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_role (template_user_id, template_role_id)
);

-- ========================================
-- Template Property Listings (sample data)
-- ========================================
CREATE TABLE IF NOT EXISTS app_template_property_listings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    template_id INT NOT NULL,
    template_user_id INT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    property_type ENUM('apartment', 'house', 'condo', 'townhouse', 'villa', 'cabin', 'cottage', 'loft', 'studio', 'other') DEFAULT 'apartment',
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    country VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    bedrooms INT DEFAULT 0,
    bathrooms DECIMAL(3,1) DEFAULT 0,
    beds INT DEFAULT 0,
    guests_max INT DEFAULT 1,
    square_feet INT,
    price_per_night DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    cleaning_fee DECIMAL(10, 2) DEFAULT 0,
    service_fee_percentage DECIMAL(5, 2) DEFAULT 0,
    min_nights INT DEFAULT 1,
    max_nights INT DEFAULT 365,
    check_in_time TIME DEFAULT '15:00:00',
    check_out_time TIME DEFAULT '11:00:00',
    cancellation_policy ENUM('flexible', 'moderate', 'strict', 'super_strict') DEFAULT 'moderate',
    status ENUM('draft', 'pending_review', 'active', 'inactive', 'archived') DEFAULT 'draft',
    is_published TINYINT(1) DEFAULT 0,
    is_instant_book TINYINT(1) DEFAULT 0,
    house_rules TEXT,
    additional_info TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (template_id) REFERENCES app_templates(id) ON DELETE CASCADE,
    FOREIGN KEY (template_user_id) REFERENCES app_template_users(id) ON DELETE SET NULL
);

-- ========================================
-- Template Property Images
-- ========================================
CREATE TABLE IF NOT EXISTS app_template_property_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    template_listing_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    image_key VARCHAR(255),
    caption VARCHAR(255),
    display_order INT DEFAULT 0,
    is_primary TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (template_listing_id) REFERENCES app_template_property_listings(id) ON DELETE CASCADE
);

-- ========================================
-- Template Property Amenities
-- ========================================
CREATE TABLE IF NOT EXISTS app_template_property_amenities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    template_listing_id INT NOT NULL,
    amenity_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (template_listing_id) REFERENCES app_template_property_listings(id) ON DELETE CASCADE,
    FOREIGN KEY (amenity_id) REFERENCES property_amenities(id) ON DELETE CASCADE,
    UNIQUE KEY unique_listing_amenity (template_listing_id, amenity_id)
);

-- ========================================
-- Template Screen Content (element content values)
-- ========================================
CREATE TABLE IF NOT EXISTS app_template_screen_content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    template_id INT NOT NULL,
    screen_id INT NOT NULL,
    element_instance_id INT,
    custom_element_id INT,
    content_value TEXT,
    options JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (template_id) REFERENCES app_templates(id) ON DELETE CASCADE,
    FOREIGN KEY (screen_id) REFERENCES app_screens(id) ON DELETE CASCADE,
    UNIQUE KEY unique_template_element_content (template_id, screen_id, element_instance_id, custom_element_id)
);

-- ========================================
-- Template Custom Screen Elements
-- ========================================
CREATE TABLE IF NOT EXISTS app_template_custom_screen_elements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    template_id INT NOT NULL,
    screen_id INT NOT NULL,
    element_id INT NOT NULL,
    field_key VARCHAR(100) NOT NULL,
    label VARCHAR(255),
    placeholder VARCHAR(255),
    default_value TEXT,
    validation_rules JSON,
    is_required TINYINT(1) DEFAULT 0,
    display_order INT DEFAULT 0,
    config JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (template_id) REFERENCES app_templates(id) ON DELETE CASCADE,
    FOREIGN KEY (screen_id) REFERENCES app_screens(id) ON DELETE CASCADE,
    FOREIGN KEY (element_id) REFERENCES screen_elements(id) ON DELETE CASCADE
);

-- Add indexes for performance
CREATE INDEX idx_template_roles_template ON app_template_roles(template_id);
CREATE INDEX idx_template_menus_template ON app_template_menus(template_id);
CREATE INDEX idx_template_menu_items_menu ON app_template_menu_items(template_menu_id);
CREATE INDEX idx_template_users_template ON app_template_users(template_id);
CREATE INDEX idx_template_listings_template ON app_template_property_listings(template_id);
