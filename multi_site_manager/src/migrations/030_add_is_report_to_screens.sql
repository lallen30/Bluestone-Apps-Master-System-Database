-- Migration: Add is_report column to app_screens table
-- Description: Adds a boolean flag to mark screens as report screens
-- Created: 2025-12-01

-- Add is_report column to app_screens table (if it doesn't exist)
SET @dbname = DATABASE();
SET @tablename = 'app_screens';
SET @columnname = 'is_report';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = @dbname
    AND TABLE_NAME = @tablename
    AND COLUMN_NAME = @columnname
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' BOOLEAN DEFAULT FALSE AFTER is_active')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

SELECT 'Added is_report column to app_screens table' as message;
