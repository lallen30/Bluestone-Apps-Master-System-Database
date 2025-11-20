-- Migration: Smart Auto-Configuration System (FIXED for existing data)
-- Date: November 18, 2025
-- Purpose: Add Simple Footer Bar module and enable smart auto-configuration
--          Works with existing app_modules data

-- ============================================================================
-- STEP 1: Add Simple Footer Bar Module (use id=4 since id=3 exists)
-- ============================================================================

INSERT INTO `app_modules` (`id`, `name`, `module_type`, `description`, `default_config`, `is_active`)
VALUES (
  4,
  'Simple Footer Bar',
  'footer_bar',
  'Basic footer bar for displaying tab navigation',
  JSON_OBJECT(
    'backgroundColor', '#FFFFFF',
    'borderTopColor', '#E5E5E5',
    'borderTopWidth', 1,
    'elevation', 8
  ),
  1
) ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description),
  default_config = VALUES(default_config),
  is_active = VALUES(is_active);

-- ============================================================================
-- STEP 2: Deprecate "Header Bar with Sidebar Icons" (id=1)
-- ============================================================================
-- This module is no longer needed because sidebar icons are now
-- automatically configured when sidebar menus are assigned to screens.

UPDATE `app_modules` 
SET 
  is_active = 0,
  description = CONCAT(description, ' [DEPRECATED - Sidebar icons now auto-configured when menus are assigned]')
WHERE id = 1 AND is_active = 1;

-- ============================================================================
-- STEP 3: Migrate existing "Header Bar with Sidebar Icons" assignments
-- ============================================================================
-- Convert all screens using module id=1 to use "Simple Header Bar" (id=2)
-- and preserve their showLeftIcon/showRightIcon configuration

UPDATE `screen_module_assignments`
SET module_id = 2
WHERE module_id = 1;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Run these to verify the migration was successful:

-- Check all active modules
SELECT id, name, module_type, is_active FROM app_modules ORDER BY id;

-- Expected:
-- 1 | Header Bar with Sidebar Icons (DEPRECATED) | header_bar | 0
-- 2 | Simple Header Bar                          | header_bar | 1
-- 3 | Header Bar with Back Button                | header_bar | 1
-- 4 | Simple Footer Bar                          | footer_bar | 1

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================
SELECT 'Migration completed successfully! Simple Footer Bar added as id=4' as status;
