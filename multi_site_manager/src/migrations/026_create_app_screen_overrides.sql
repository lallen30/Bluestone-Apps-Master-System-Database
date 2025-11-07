-- ============================================
-- Create App Screen Override System
-- Migration: 026
-- Created: Nov 7, 2025
-- Description: Implement shared screens with app-specific overrides
--              Allows apps to customize screens without affecting other apps
-- ============================================

-- Table: app_screen_element_overrides
-- Purpose: Store app-specific customizations for screen elements
-- Each app can override element properties without affecting the master element
CREATE TABLE IF NOT EXISTS app_screen_element_overrides (
  id INT PRIMARY KEY AUTO_INCREMENT,
  app_id INT NOT NULL,
  screen_id INT NOT NULL,
  element_instance_id INT NOT NULL,
  
  -- Override flags
  is_hidden BOOLEAN DEFAULT FALSE,
  is_required_override BOOLEAN NULL,  -- NULL = use master, TRUE/FALSE = override
  
  -- Override values
  custom_label VARCHAR(255) NULL,
  custom_placeholder VARCHAR(255) NULL,
  custom_default_value TEXT NULL,
  custom_validation_rules JSON NULL,
  custom_display_order INT NULL,
  
  -- Additional customizations
  custom_config JSON NULL,  -- For element-specific configurations
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Foreign keys
  FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
  FOREIGN KEY (screen_id) REFERENCES app_screens(id) ON DELETE CASCADE,
  FOREIGN KEY (element_instance_id) REFERENCES screen_element_instances(id) ON DELETE CASCADE,
  
  -- Ensure one override per app per element
  UNIQUE KEY unique_app_element_override (app_id, element_instance_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: app_custom_screen_elements
-- Purpose: Store completely new elements added by apps to existing screens
-- These are app-specific elements that don't exist in the master screen
CREATE TABLE IF NOT EXISTS app_custom_screen_elements (
  id INT PRIMARY KEY AUTO_INCREMENT,
  app_id INT NOT NULL,
  screen_id INT NOT NULL,
  element_id INT NOT NULL,  -- References screen_elements (element type)
  
  -- Element properties
  field_key VARCHAR(255) NOT NULL,
  label VARCHAR(255),
  placeholder VARCHAR(255),
  default_value TEXT,
  validation_rules JSON,
  is_required BOOLEAN DEFAULT FALSE,
  is_visible BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 999,  -- Default to end
  
  -- Additional configuration
  config JSON,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Foreign keys
  FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
  FOREIGN KEY (screen_id) REFERENCES app_screens(id) ON DELETE CASCADE,
  FOREIGN KEY (element_id) REFERENCES screen_elements(id),
  
  -- Ensure unique field keys per app per screen
  UNIQUE KEY unique_app_screen_field (app_id, screen_id, field_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add indexes for performance
CREATE INDEX idx_override_app_screen ON app_screen_element_overrides(app_id, screen_id);
CREATE INDEX idx_override_element ON app_screen_element_overrides(element_instance_id);
CREATE INDEX idx_custom_element_app_screen ON app_custom_screen_elements(app_id, screen_id);
CREATE INDEX idx_custom_element_display_order ON app_custom_screen_elements(display_order);

-- Show created tables
SELECT 'Tables created successfully!' as message;
SHOW TABLES LIKE '%override%';
SHOW TABLES LIKE '%custom_screen%';

-- Show table structures
SELECT 'app_screen_element_overrides structure:' as message;
DESCRIBE app_screen_element_overrides;

SELECT 'app_custom_screen_elements structure:' as message;
DESCRIBE app_custom_screen_elements;
