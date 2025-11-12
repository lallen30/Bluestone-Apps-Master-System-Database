-- Add version control and publishing workflow tables

-- Table to track screen versions (snapshots)
CREATE TABLE IF NOT EXISTS screen_versions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  screen_id INT NOT NULL,
  version_number INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  icon VARCHAR(50),
  snapshot_data JSON NOT NULL COMMENT 'Full snapshot of screen and elements at this version',
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (screen_id) REFERENCES app_screens(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  
  INDEX idx_screen_version (screen_id, version_number),
  INDEX idx_created_at (created_at),
  UNIQUE KEY unique_screen_version (screen_id, version_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table to track app-screen version assignments
CREATE TABLE IF NOT EXISTS app_screen_version_assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  app_id INT NOT NULL,
  screen_id INT NOT NULL,
  version_id INT NULL COMMENT 'NULL means using latest',
  is_preview_mode BOOLEAN DEFAULT FALSE COMMENT 'If true, shows preview to admins only',
  locked BOOLEAN DEFAULT FALSE COMMENT 'If true, prevents updates until unlocked',
  locked_by INT NULL,
  locked_at TIMESTAMP NULL,
  notes TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
  FOREIGN KEY (screen_id) REFERENCES app_screens(id) ON DELETE CASCADE,
  FOREIGN KEY (version_id) REFERENCES screen_versions(id) ON DELETE SET NULL,
  FOREIGN KEY (locked_by) REFERENCES users(id) ON DELETE SET NULL,
  
  UNIQUE KEY unique_app_screen (app_id, screen_id),
  INDEX idx_preview (is_preview_mode),
  INDEX idx_locked (locked)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table to track publishing history
CREATE TABLE IF NOT EXISTS publish_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  app_id INT NOT NULL,
  screen_id INT NOT NULL,
  version_id INT NULL,
  action ENUM('published', 'unpublished', 'reverted') NOT NULL,
  published_by INT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
  FOREIGN KEY (screen_id) REFERENCES app_screens(id) ON DELETE CASCADE,
  FOREIGN KEY (version_id) REFERENCES screen_versions(id) ON DELETE SET NULL,
  FOREIGN KEY (published_by) REFERENCES users(id) ON DELETE SET NULL,
  
  INDEX idx_app_screen (app_id, screen_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add columns to app_screen_assignments (will fail silently if already exists)
-- Preview mode column
SET @exist := (SELECT COUNT(*) FROM information_schema.COLUMNS 
  WHERE TABLE_SCHEMA = 'multi_site_manager' 
  AND TABLE_NAME = 'app_screen_assignments' 
  AND COLUMN_NAME = 'is_preview_mode');
SET @sqlstmt := IF(@exist = 0, 'ALTER TABLE app_screen_assignments ADD COLUMN is_preview_mode BOOLEAN DEFAULT FALSE AFTER is_published', 'SELECT "Column is_preview_mode already exists"');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;

-- Version tracking column
SET @exist := (SELECT COUNT(*) FROM information_schema.COLUMNS 
  WHERE TABLE_SCHEMA = 'multi_site_manager' 
  AND TABLE_NAME = 'app_screen_assignments' 
  AND COLUMN_NAME = 'current_version_id');
SET @sqlstmt := IF(@exist = 0, 'ALTER TABLE app_screen_assignments ADD COLUMN current_version_id INT NULL AFTER is_preview_mode', 'SELECT "Column current_version_id already exists"');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;

-- Publish notes column
SET @exist := (SELECT COUNT(*) FROM information_schema.COLUMNS 
  WHERE TABLE_SCHEMA = 'multi_site_manager' 
  AND TABLE_NAME = 'app_screen_assignments' 
  AND COLUMN_NAME = 'publish_notes');
SET @sqlstmt := IF(@exist = 0, 'ALTER TABLE app_screen_assignments ADD COLUMN publish_notes TEXT AFTER published_at', 'SELECT "Column publish_notes already exists"');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
