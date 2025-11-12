-- Add screen_id column to app_template_screens to reference master screens
-- This allows templates to properly reference screens from the master screens list
-- instead of duplicating screen data

ALTER TABLE app_template_screens 
ADD COLUMN IF NOT EXISTS screen_id INT NULL AFTER template_id;

-- Add foreign key constraint to maintain referential integrity
-- Using ON DELETE SET NULL so if a master screen is deleted, template keeps the data
SET @exist := (SELECT COUNT(*) 
  FROM information_schema.TABLE_CONSTRAINTS 
  WHERE TABLE_SCHEMA = 'multi_site_manager' 
  AND TABLE_NAME = 'app_template_screens' 
  AND CONSTRAINT_NAME = 'fk_template_screen_master');

SET @sqlstmt := IF(@exist = 0, 
  'ALTER TABLE app_template_screens ADD CONSTRAINT fk_template_screen_master FOREIGN KEY (screen_id) REFERENCES app_screens(id) ON DELETE SET NULL', 
  'SELECT "Foreign key already exists"');

PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
