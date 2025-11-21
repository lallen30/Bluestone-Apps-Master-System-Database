-- ============================================================================
-- Remove Duplicate Screen Assignments from App 28
-- Issue: Old screens with timestamp keys are still assigned to the app
-- Solution: Remove assignments for old screens, keep only new clean-key screens
-- ============================================================================

USE multi_site_manager;

SET @app_id = 28;

-- ============================================================================
-- STEP 1: Identify old duplicate screens to remove
-- ============================================================================

SELECT '🔍 Old duplicate screens to be removed:' as Info;

SELECT 
  s.id,
  s.name,
  s.screen_key,
  asa.display_order
FROM app_screen_assignments asa
JOIN app_screens s ON asa.screen_id = s.id
WHERE asa.app_id = @app_id 
  AND asa.is_active = 1
  AND (
    s.screen_key LIKE '%_10_%' 
    OR s.screen_key LIKE '%_17_%' 
    OR s.screen_key LIKE '%_19_%'
    OR s.screen_key LIKE '%_21_%'
  )
ORDER BY s.name;

-- ============================================================================
-- STEP 2: Remove old screen assignments (keep screens, just unassign from app)
-- ============================================================================

-- Deactivate assignments for old screens with timestamps in keys
UPDATE app_screen_assignments asa
JOIN app_screens s ON asa.screen_id = s.id
SET asa.is_active = 0
WHERE asa.app_id = @app_id 
  AND asa.is_active = 1
  AND (
    s.screen_key LIKE '%_10_%' 
    OR s.screen_key LIKE '%_17_%' 
    OR s.screen_key LIKE '%_19_%'
    OR s.screen_key LIKE '%_21_%'
    OR s.screen_key LIKE '%_27_%'
  );

SELECT '✅ Removed old duplicate screen assignments' as Status;

-- ============================================================================
-- STEP 3: Verification - Show remaining screens
-- ============================================================================

SELECT '📱 Remaining screens assigned to App 28:' as Info;

SELECT 
  s.id,
  s.name,
  s.screen_key,
  s.category,
  asa.is_published,
  asa.display_order
FROM app_screen_assignments asa
JOIN app_screens s ON asa.screen_id = s.id
WHERE asa.app_id = @app_id 
  AND asa.is_active = 1
ORDER BY asa.display_order;

SELECT '📊 Summary:' as Info;

SELECT 
  COUNT(*) as total_active_screens,
  SUM(CASE WHEN asa.is_published = 1 THEN 1 ELSE 0 END) as published_screens,
  SUM(CASE WHEN asa.show_in_tabbar = 1 THEN 1 ELSE 0 END) as tabbar_screens
FROM app_screen_assignments asa
WHERE asa.app_id = @app_id AND asa.is_active = 1;

SELECT '✅ Cleanup Complete! Refresh the admin portal to see changes.' as Status;
