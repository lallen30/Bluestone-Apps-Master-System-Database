-- Migration: Create Core Screen Tables
-- Description: Base tables for screens and screen elements system
-- Created: 2025-11-13

-- Screen Elements (UI components/modules)
CREATE TABLE IF NOT EXISTS screen_elements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  category VARCHAR(100),
  description TEXT,
  icon VARCHAR(50),
  config_schema JSON,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_type (type),
  INDEX idx_category (category),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- App Screens (screens that can be added to apps)
CREATE TABLE IF NOT EXISTS app_screens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  screen_key VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  category VARCHAR(100),
  icon VARCHAR(50) DEFAULT 'Monitor',
  preview_image VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  is_template BOOLEAN DEFAULT FALSE,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_category (category),
  INDEX idx_is_active (is_active),
  INDEX idx_screen_key (screen_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- App Screen Assignments (which screens are used in which apps)
CREATE TABLE IF NOT EXISTS app_screen_assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  app_id INT NOT NULL,
  screen_id INT NOT NULL,
  display_order INT DEFAULT 0,
  is_home_screen BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
  FOREIGN KEY (screen_id) REFERENCES app_screens(id) ON DELETE CASCADE,
  UNIQUE KEY unique_app_screen (app_id, screen_id),
  INDEX idx_app_id (app_id),
  INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Screen Element Instances (elements placed on screens)
CREATE TABLE IF NOT EXISTS screen_element_instances (
  id INT AUTO_INCREMENT PRIMARY KEY,
  screen_id INT NOT NULL,
  element_id INT NOT NULL,
  field_key VARCHAR(100) NOT NULL,
  label VARCHAR(255),
  placeholder VARCHAR(255),
  default_value TEXT,
  is_required BOOLEAN DEFAULT FALSE,
  is_readonly BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  config JSON,
  validation_rules JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (screen_id) REFERENCES app_screens(id) ON DELETE CASCADE,
  FOREIGN KEY (element_id) REFERENCES screen_elements(id) ON DELETE CASCADE,
  INDEX idx_screen_id (screen_id),
  INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed some basic screen elements
INSERT INTO screen_elements (name, type, category, description, icon, is_active, display_order) VALUES
('Text Input', 'input', 'Form', 'Single-line text input field', 'Type', TRUE, 1),
('Text Area', 'textarea', 'Form', 'Multi-line text input', 'AlignLeft', TRUE, 2),
('Button', 'button', 'Action', 'Clickable button', 'MousePointer', TRUE, 3),
('Image', 'image', 'Media', 'Image display', 'Image', TRUE, 4),
('Label', 'label', 'Display', 'Text label', 'Tag', TRUE, 5),
('List', 'list', 'Display', 'Scrollable list', 'List', TRUE, 6),
('Card', 'card', 'Layout', 'Card container', 'Square', TRUE, 7),
('Grid', 'grid', 'Layout', 'Grid layout', 'Grid', TRUE, 8);

SELECT 'Core tables created successfully!' as message;
