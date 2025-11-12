-- Add screen-level access control with role-based permissions

-- Table to store app-specific roles for mobile users
CREATE TABLE IF NOT EXISTS app_roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  app_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  description TEXT,
  is_default BOOLEAN DEFAULT FALSE COMMENT 'If true, assigned to new users automatically',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
  
  UNIQUE KEY unique_role_name (app_id, name),
  INDEX idx_app (app_id),
  INDEX idx_default (is_default)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table to map screens to roles (which roles can access which screens)
CREATE TABLE IF NOT EXISTS screen_role_access (
  id INT AUTO_INCREMENT PRIMARY KEY,
  screen_id INT NOT NULL,
  role_id INT NOT NULL,
  app_id INT NOT NULL,
  can_access BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (screen_id) REFERENCES app_screens(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES app_roles(id) ON DELETE CASCADE,
  FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
  
  UNIQUE KEY unique_screen_role (screen_id, role_id, app_id),
  INDEX idx_screen (screen_id),
  INDEX idx_role (role_id),
  INDEX idx_app (app_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Update app_user_role_assignments to use app_roles instead of global roles
-- First, check if we need to add app_role_id column
SET @exist := (SELECT COUNT(*) FROM information_schema.COLUMNS 
  WHERE TABLE_SCHEMA = 'multi_site_manager' 
  AND TABLE_NAME = 'app_user_role_assignments' 
  AND COLUMN_NAME = 'app_role_id');
SET @sqlstmt := IF(@exist = 0, 'ALTER TABLE app_user_role_assignments ADD COLUMN app_role_id INT NULL AFTER role_id', 'SELECT "Column app_role_id already exists"');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;

-- Add foreign key for app_role_id
SET @fk_exist := (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS 
  WHERE TABLE_SCHEMA = 'multi_site_manager' 
  AND TABLE_NAME = 'app_user_role_assignments' 
  AND CONSTRAINT_NAME = 'fk_app_user_role_assignments_app_role');
SET @sqlstmt := IF(@fk_exist = 0, 'ALTER TABLE app_user_role_assignments ADD CONSTRAINT fk_app_user_role_assignments_app_role FOREIGN KEY (app_role_id) REFERENCES app_roles(id) ON DELETE CASCADE', 'SELECT "FK already exists"');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;

-- Insert default roles for existing apps
INSERT INTO app_roles (app_id, name, display_name, description, is_default)
SELECT DISTINCT a.id, 'all_users', 'All Users', 'Default role with access to all published screens', TRUE
FROM apps a
WHERE NOT EXISTS (
  SELECT 1 FROM app_roles ar WHERE ar.app_id = a.id AND ar.name = 'all_users'
);

INSERT INTO app_roles (app_id, name, display_name, description, is_default)
SELECT DISTINCT a.id, 'premium', 'Premium Users', 'Users with premium features and exclusive screens', FALSE
FROM apps a
WHERE NOT EXISTS (
  SELECT 1 FROM app_roles ar WHERE ar.app_id = a.id AND ar.name = 'premium'
);

INSERT INTO app_roles (app_id, name, display_name, description, is_default)
SELECT DISTINCT a.id, 'admin', 'Administrators', 'Users with administrative privileges', FALSE
FROM apps a
WHERE NOT EXISTS (
  SELECT 1 FROM app_roles ar WHERE ar.app_id = a.id AND ar.name = 'admin'
);

-- Grant "all_users" role access to all published screens by default
INSERT INTO screen_role_access (screen_id, role_id, app_id, can_access)
SELECT 
  asa.screen_id,
  ar.id as role_id,
  asa.app_id,
  TRUE
FROM app_screen_assignments asa
JOIN app_roles ar ON ar.app_id = asa.app_id AND ar.name = 'all_users'
WHERE asa.is_published = 1
AND NOT EXISTS (
  SELECT 1 FROM screen_role_access sra 
  WHERE sra.screen_id = asa.screen_id 
  AND sra.role_id = ar.id 
  AND sra.app_id = asa.app_id
);

-- Make role_id nullable in app_user_role_assignments if needed
SET @exist := (SELECT IS_NULLABLE FROM information_schema.COLUMNS 
  WHERE TABLE_SCHEMA = 'multi_site_manager' 
  AND TABLE_NAME = 'app_user_role_assignments' 
  AND COLUMN_NAME = 'role_id');
SET @sqlstmt := IF(@exist = 'NO', 'ALTER TABLE app_user_role_assignments MODIFY role_id INT NULL', 'SELECT "role_id is already nullable"');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;

-- Assign all existing mobile users to default "all_users" role
INSERT INTO app_user_role_assignments (user_id, role_id, app_role_id)
SELECT 
  au.id as user_id,
  NULL as role_id,
  ar.id as app_role_id
FROM app_users au
JOIN app_roles ar ON ar.app_id = au.app_id AND ar.is_default = TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM app_user_role_assignments aura 
  WHERE aura.user_id = au.id 
  AND aura.app_role_id = ar.id
);
