-- ============================================================================
-- FORMS SYSTEM - Database Schema
-- ============================================================================
-- This creates a Forms system where forms are first-class containers of elements,
-- similar to how screens contain elements. Forms can be reused across apps and screens.
-- ============================================================================

-- ============================================================================
-- 1. MASTER FORMS TABLE
-- ============================================================================
-- Defines reusable form templates (like property form, booking form, etc.)
CREATE TABLE IF NOT EXISTS app_forms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  form_key VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  form_type ENUM('create', 'edit', 'search', 'filter', 'multi_step', 'wizard') DEFAULT 'create',
  layout ENUM('single_column', 'two_column', 'grid', 'wizard') DEFAULT 'single_column',
  submit_button_text VARCHAR(50) DEFAULT 'Submit',
  success_message TEXT,
  error_message TEXT,
  icon VARCHAR(50),
  category VARCHAR(50),
  is_active TINYINT(1) DEFAULT 1,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_form_key (form_key),
  INDEX idx_category (category),
  INDEX idx_active (is_active),
  FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 2. FORM ELEMENTS (Links forms to screen elements)
-- ============================================================================
-- Defines which elements belong to a form and their configuration
CREATE TABLE IF NOT EXISTS app_form_elements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  form_id INT NOT NULL,
  element_id INT NOT NULL,
  field_key VARCHAR(100) NOT NULL,
  label VARCHAR(255),
  placeholder VARCHAR(255),
  default_value TEXT,
  help_text TEXT,
  
  -- Validation
  is_required TINYINT(1) DEFAULT 0,
  validation_rules JSON,
  
  -- Layout
  display_order INT DEFAULT 0,
  column_span INT DEFAULT 1, -- For grid layouts (1-12)
  row_span INT DEFAULT 1,
  
  -- Conditional logic
  show_if_field VARCHAR(100), -- Show this field only if another field meets condition
  show_if_value VARCHAR(255), -- The value that triggers showing this field
  
  -- Configuration
  config JSON,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_form_id (form_id),
  INDEX idx_element_id (element_id),
  INDEX idx_display_order (display_order),
  UNIQUE KEY unique_form_field (form_id, field_key),
  FOREIGN KEY (form_id) REFERENCES app_forms(id) ON DELETE CASCADE,
  FOREIGN KEY (element_id) REFERENCES screen_elements(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 3. APP FORM ASSIGNMENTS
-- ============================================================================
-- Assigns forms to specific apps (with optional customization)
CREATE TABLE IF NOT EXISTS app_form_assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  app_id INT NOT NULL,
  form_id INT NOT NULL,
  
  -- Customization
  custom_name VARCHAR(100), -- Override form name for this app
  custom_submit_text VARCHAR(50), -- Override submit button text
  custom_success_message TEXT,
  custom_config JSON, -- App-specific form configuration
  
  -- API Configuration
  submit_endpoint VARCHAR(255), -- Where to POST form data
  submit_method ENUM('POST', 'PUT', 'PATCH') DEFAULT 'POST',
  
  -- Status
  is_active TINYINT(1) DEFAULT 1,
  assigned_by INT,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_app_id (app_id),
  INDEX idx_form_id (form_id),
  INDEX idx_active (is_active),
  UNIQUE KEY unique_app_form (app_id, form_id),
  FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
  FOREIGN KEY (form_id) REFERENCES app_forms(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 4. FORM ELEMENT OVERRIDES (App-specific customization)
-- ============================================================================
-- Allows apps to override form element properties without changing the master form
CREATE TABLE IF NOT EXISTS app_form_element_overrides (
  id INT AUTO_INCREMENT PRIMARY KEY,
  app_id INT NOT NULL,
  form_id INT NOT NULL,
  form_element_id INT NOT NULL, -- References app_form_elements.id
  
  -- Overridable properties
  custom_label VARCHAR(255),
  custom_placeholder VARCHAR(255),
  custom_default_value TEXT,
  custom_help_text TEXT,
  is_required_override TINYINT(1),
  custom_validation_rules JSON,
  custom_config JSON,
  is_hidden TINYINT(1) DEFAULT 0,
  custom_display_order INT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_app_form (app_id, form_id),
  INDEX idx_form_element (form_element_id),
  UNIQUE KEY unique_app_form_element (app_id, form_id, form_element_id),
  FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
  FOREIGN KEY (form_id) REFERENCES app_forms(id) ON DELETE CASCADE,
  FOREIGN KEY (form_element_id) REFERENCES app_form_elements(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 5. FORM SUBMISSIONS (Optional - for tracking form submissions)
-- ============================================================================
-- Stores form submission data for analytics and review
CREATE TABLE IF NOT EXISTS app_form_submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  app_id INT NOT NULL,
  form_id INT NOT NULL,
  user_id INT, -- NULL if guest submission
  
  -- Submission data
  form_data JSON NOT NULL,
  submission_ip VARCHAR(45),
  user_agent TEXT,
  
  -- Status
  status ENUM('pending', 'processing', 'completed', 'failed', 'rejected') DEFAULT 'pending',
  error_message TEXT,
  
  -- Timestamps
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMP NULL,
  
  INDEX idx_app_form (app_id, form_id),
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_submitted_at (submitted_at),
  FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
  FOREIGN KEY (form_id) REFERENCES app_forms(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 6. UPDATE screen_element_instances to support form references
-- ============================================================================
-- Add form_id column to link screen elements to forms
ALTER TABLE screen_element_instances 
ADD COLUMN form_id INT NULL AFTER element_id,
ADD INDEX idx_form_id (form_id),
ADD CONSTRAINT fk_screen_element_form 
  FOREIGN KEY (form_id) REFERENCES app_forms(id) ON DELETE SET NULL;

-- ============================================================================
-- SEED DATA: Create Property Listing Form
-- ============================================================================

-- Insert the Property Listing Form
INSERT INTO app_forms (
  name, form_key, description, form_type, layout, 
  submit_button_text, success_message, icon, category, created_by
) VALUES (
  'Property Listing Form',
  'property_listing_form',
  'Complete form for creating and editing property listings with all necessary fields',
  'create',
  'single_column',
  'Create Listing',
  'Property listing created successfully!',
  'home',
  'real_estate',
  1
);

SET @form_id = LAST_INSERT_ID();

-- Add form elements (using existing screen_elements)
-- Basic Information Section
INSERT INTO app_form_elements (form_id, element_id, field_key, label, placeholder, is_required, display_order, config) VALUES
(@form_id, (SELECT id FROM screen_elements WHERE element_type = 'text_input' LIMIT 1), 'title', 'Property Title', 'e.g., Cozy Downtown Apartment', 1, 1, JSON_OBJECT('maxLength', 255)),
(@form_id, (SELECT id FROM screen_elements WHERE element_type = 'textarea' LIMIT 1), 'description', 'Description', 'Describe your property...', 1, 2, JSON_OBJECT('rows', 4, 'maxLength', 2000)),
(@form_id, (SELECT id FROM screen_elements WHERE element_type = 'select' LIMIT 1), 'property_type', 'Property Type', 'Select type', 1, 3, JSON_OBJECT('options', JSON_ARRAY(
  JSON_OBJECT('value', 'apartment', 'label', 'Apartment'),
  JSON_OBJECT('value', 'house', 'label', 'House'),
  JSON_OBJECT('value', 'condo', 'label', 'Condo'),
  JSON_OBJECT('value', 'villa', 'label', 'Villa'),
  JSON_OBJECT('value', 'studio', 'label', 'Studio'),
  JSON_OBJECT('value', 'loft', 'label', 'Loft')
)));

-- Pricing Section
INSERT INTO app_form_elements (form_id, element_id, field_key, label, placeholder, is_required, display_order, config) VALUES
(@form_id, (SELECT id FROM screen_elements WHERE element_type = 'number_input' LIMIT 1), 'price_per_night', 'Price per Night ($)', '0.00', 1, 10, JSON_OBJECT('min', 0, 'step', 0.01, 'prefix', '$')),
(@form_id, (SELECT id FROM screen_elements WHERE element_type = 'number_input' LIMIT 1), 'cleaning_fee', 'Cleaning Fee ($)', '0.00', 0, 11, JSON_OBJECT('min', 0, 'step', 0.01, 'prefix', '$'));

-- Location Section
INSERT INTO app_form_elements (form_id, element_id, field_key, label, placeholder, is_required, display_order, config) VALUES
(@form_id, (SELECT id FROM screen_elements WHERE element_type = 'text_input' LIMIT 1), 'address', 'Street Address', '123 Main St', 1, 20, NULL),
(@form_id, (SELECT id FROM screen_elements WHERE element_type = 'text_input' LIMIT 1), 'city', 'City', 'New York', 1, 21, NULL),
(@form_id, (SELECT id FROM screen_elements WHERE element_type = 'text_input' LIMIT 1), 'state', 'State/Province', 'NY', 0, 22, NULL),
(@form_id, (SELECT id FROM screen_elements WHERE element_type = 'text_input' LIMIT 1), 'country', 'Country', 'United States', 1, 23, NULL),
(@form_id, (SELECT id FROM screen_elements WHERE element_type = 'text_input' LIMIT 1), 'zip_code', 'Zip/Postal Code', '10001', 0, 24, NULL);

-- Property Details Section
INSERT INTO app_form_elements (form_id, element_id, field_key, label, placeholder, is_required, display_order, config) VALUES
(@form_id, (SELECT id FROM screen_elements WHERE element_type = 'number_input' LIMIT 1), 'bedrooms', 'Bedrooms', '1', 1, 30, JSON_OBJECT('min', 0, 'step', 1)),
(@form_id, (SELECT id FROM screen_elements WHERE element_type = 'number_input' LIMIT 1), 'bathrooms', 'Bathrooms', '1', 1, 31, JSON_OBJECT('min', 0, 'step', 0.5)),
(@form_id, (SELECT id FROM screen_elements WHERE element_type = 'number_input' LIMIT 1), 'guests_max', 'Maximum Guests', '2', 1, 32, JSON_OBJECT('min', 1, 'step', 1));

-- Booking Rules Section
INSERT INTO app_form_elements (form_id, element_id, field_key, label, placeholder, is_required, display_order, config) VALUES
(@form_id, (SELECT id FROM screen_elements WHERE element_type = 'number_input' LIMIT 1), 'min_nights', 'Minimum Nights', '1', 0, 40, JSON_OBJECT('min', 1, 'step', 1, 'default', 1)),
(@form_id, (SELECT id FROM screen_elements WHERE element_type = 'number_input' LIMIT 1), 'max_nights', 'Maximum Nights', '365', 0, 41, JSON_OBJECT('min', 1, 'step', 1, 'default', 365));

-- Assign form to Property Rental App (ID: 28)
INSERT INTO app_form_assignments (
  app_id, form_id, submit_endpoint, submit_method, assigned_by
) VALUES (
  28, @form_id, '/apps/28/listings', 'POST', 1
);

-- Update the Create Listing screen to use the form
UPDATE screen_element_instances 
SET form_id = @form_id 
WHERE screen_id = 127 AND element_id = 114;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

SELECT '=== FORMS CREATED ===' as status;
SELECT id, name, form_key, form_type FROM app_forms;

SELECT '=== FORM ELEMENTS ===' as status;
SELECT COUNT(*) as element_count FROM app_form_elements WHERE form_id = @form_id;

SELECT '=== FORM ASSIGNMENTS ===' as status;
SELECT app_id, form_id, submit_endpoint FROM app_form_assignments WHERE form_id = @form_id;

SELECT '=== SCREEN ELEMENT UPDATED ===' as status;
SELECT id, screen_id, element_id, form_id FROM screen_element_instances WHERE screen_id = 127;
