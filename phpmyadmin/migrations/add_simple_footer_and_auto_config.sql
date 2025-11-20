-- Migration: Smart Auto-Configuration System
-- Date: November 18, 2025
-- Purpose: Add Simple Footer Bar module and deprecate "Header Bar with Sidebar Icons"
--          This enables smart auto-configuration where sidebar menus automatically
--          trigger header bar icons, and tab bars automatically assign footer bars.

-- ============================================================================
-- STEP 1: Add Simple Footer Bar Module
-- ============================================================================

INSERT INTO `app_modules` (`id`, `name`, `module_type`, `description`, `default_config`, `is_active`)
VALUES (
  3,
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
-- STEP 2: Add "Header Bar with Back Button" Module
-- ============================================================================

INSERT INTO `app_modules` (`id`, `name`, `module_type`, `description`, `default_config`, `is_active`)
VALUES (
  4,
  'Header Bar with Back Button',
  'header_bar',
  'Header bar with back navigation button',
  JSON_OBJECT(
    'showTitle', true,
    'backgroundColor', '#FFFFFF',
    'textColor', '#000000',
    'leftIconType', 'back',
    'showLeftIcon', true,
    'showRightIcon', false,
    'elevation', 2
  ),
  1
) ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description),
  default_config = VALUES(default_config),
  is_active = VALUES(is_active);

-- ============================================================================
-- STEP 3: Deprecate "Header Bar with Sidebar Icons" (id=1)
-- ============================================================================
-- This module is no longer needed because sidebar icons are now
-- automatically configured when sidebar menus are assigned to screens.

UPDATE `app_modules` 
SET 
  is_active = 0,
  description = CONCAT(description, ' [DEPRECATED - Sidebar icons now auto-configured when menus are assigned]')
WHERE id = 1;

-- ============================================================================
-- STEP 4: Migrate existing "Header Bar with Sidebar Icons" assignments
-- ============================================================================
-- Convert all screens using module id=1 to use "Simple Header Bar" (id=2)
-- and preserve their showLeftIcon/showRightIcon configuration

UPDATE `screen_module_assignments`
SET module_id = 2
WHERE module_id = 1;

-- Note: The config JSON is preserved, so showLeftIcon/showRightIcon settings
-- will continue to work. The auto-configuration logic will override these
-- when menus are reassigned.

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Run these to verify the migration was successful:

-- Check all active modules
-- SELECT id, name, module_type, is_active FROM app_modules ORDER BY id;

-- Check screens that had the old module
-- SELECT s.id, s.name, sma.module_id, m.name as module_name
-- FROM app_screens s
-- JOIN screen_module_assignments sma ON s.id = sma.screen_id
-- JOIN app_modules m ON sma.module_id = m.id
-- WHERE m.module_type = 'header_bar';

-- ============================================================================
-- ROLLBACK INSTRUCTIONS (if needed)
-- ============================================================================
-- To rollback this migration:
-- 
-- UPDATE app_modules SET is_active = 1 WHERE id = 1;
-- UPDATE screen_module_assignments SET module_id = 1 WHERE module_id = 2;
-- DELETE FROM app_modules WHERE id = 3;
-- DELETE FROM app_modules WHERE id = 4;
