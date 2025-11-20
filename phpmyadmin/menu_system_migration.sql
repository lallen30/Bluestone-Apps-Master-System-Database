-- Menu System Migration
-- This creates a flexible menu management system where menus are created separately
-- and can be assigned to specific screens

-- Drop existing tables if they exist (for clean migration)
DROP TABLE IF EXISTS screen_menu_assignments;
DROP TABLE IF EXISTS menu_items;
DROP TABLE IF EXISTS app_menus;

-- Menus table (tab bars, left sidebar, right sidebar)
CREATE TABLE app_menus (
  id INT PRIMARY KEY AUTO_INCREMENT,
  app_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  menu_type ENUM('tabbar', 'sidebar_left', 'sidebar_right') NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
  INDEX idx_app_id (app_id),
  INDEX idx_menu_type (menu_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Menu items (screens assigned to menus with their display properties)
CREATE TABLE menu_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  menu_id INT NOT NULL,
  screen_id INT NOT NULL,
  display_order INT DEFAULT 0,
  label VARCHAR(100),  -- Override screen name if needed
  icon VARCHAR(50),    -- Icon name (MaterialIcons)
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (menu_id) REFERENCES app_menus(id) ON DELETE CASCADE,
  FOREIGN KEY (screen_id) REFERENCES app_screens(id) ON DELETE CASCADE,
  UNIQUE KEY unique_menu_screen (menu_id, screen_id),
  INDEX idx_menu_id (menu_id),
  INDEX idx_screen_id (screen_id),
  INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Screen-Menu assignments (which menus appear on which screens)
-- A screen can display multiple menus (e.g., both tabbar and sidebar)
CREATE TABLE screen_menu_assignments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  screen_id INT NOT NULL,
  menu_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (screen_id) REFERENCES app_screens(id) ON DELETE CASCADE,
  FOREIGN KEY (menu_id) REFERENCES app_menus(id) ON DELETE CASCADE,
  UNIQUE KEY unique_screen_menu (screen_id, menu_id),
  INDEX idx_screen_id (screen_id),
  INDEX idx_menu_id (menu_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample data for App 28 (Property Listings)
-- Create a main tab bar menu
INSERT INTO app_menus (app_id, name, menu_type, description) VALUES
(28, 'Main Navigation', 'tabbar', 'Primary bottom tab bar navigation');

SET @main_menu_id = LAST_INSERT_ID();

-- Add screens to the main tab bar (migrating from existing show_in_tabbar configuration)
INSERT INTO menu_items (menu_id, screen_id, display_order, label, icon, is_active)
SELECT 
  @main_menu_id,
  s.id,
  COALESCE(asa.tabbar_order, asa.display_order, 0),
  COALESCE(asa.tabbar_label, s.name),
  COALESCE(asa.tabbar_icon, 'article'),
  1
FROM app_screen_assignments asa
JOIN app_screens s ON asa.screen_id = s.id
WHERE asa.app_id = 28 
  AND asa.show_in_tabbar = 1 
  AND asa.is_published = 1
  AND asa.is_active = 1;

-- Assign the main menu to all screens that currently show the tabbar
-- (For now, we'll assign it to the screens that are IN the tabbar)
INSERT INTO screen_menu_assignments (screen_id, menu_id)
SELECT DISTINCT screen_id, @main_menu_id
FROM menu_items
WHERE menu_id = @main_menu_id;

-- Note: The old columns (show_in_tabbar, show_in_sidebar, etc.) in app_screen_assignments
-- can be kept for backward compatibility or removed in a future migration
