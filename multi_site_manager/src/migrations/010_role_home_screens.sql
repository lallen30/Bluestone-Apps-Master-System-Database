-- Migration: Role-based Home Screens
-- Description: Allow different roles to have different home screens
-- Created: 2025-11-26

-- Role Home Screens (which screen is the home screen for each role)
CREATE TABLE IF NOT EXISTS role_home_screens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  app_id INT NOT NULL,
  role_id INT NOT NULL,
  screen_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (screen_id) REFERENCES app_screens(id) ON DELETE CASCADE,
  UNIQUE KEY unique_app_role (app_id, role_id),
  INDEX idx_app_id (app_id),
  INDEX idx_role_id (role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add requires_login field to app_screens for screens that can be accessed without authentication
ALTER TABLE app_screens ADD COLUMN requires_login BOOLEAN DEFAULT TRUE AFTER is_active;
