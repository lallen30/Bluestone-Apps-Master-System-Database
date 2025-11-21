-- ============================================================================
-- Remove Old Duplicate Master Screens
-- Issue: Old screens with timestamps in keys exist alongside new clean screens
-- Solution: Deactivate old screens, keep only the new clean ones
-- ============================================================================

USE multi_site_manager;

-- ============================================================================
-- STEP 1: Identify duplicate screens
-- ============================================================================

SELECT '🔍 Old duplicate screens to remove:' as Info;

SELECT 
  s.id,
  s.name,
  s.screen_key,
  (SELECT COUNT(*) FROM screen_element_instances WHERE screen_id = s.id) as elements,
  DATE_FORMAT(s.created_at, '%Y-%m-%d') as created
FROM app_screens s
WHERE s.is_active = 1
  AND (
    s.screen_key LIKE '%_10_%'
    OR s.screen_key LIKE '%_13_%'
    OR s.screen_key LIKE '%_16_%'
    OR s.screen_key LIKE '%_17_%'
    OR s.screen_key LIKE '%_19_%'
    OR s.screen_key LIKE '%_21_%'
    OR s.screen_key LIKE '%_27_%'
  )
ORDER BY s.name;

-- ============================================================================
-- STEP 2: Deactivate old screens with timestamps
-- ============================================================================

UPDATE app_screens
SET is_active = 0
WHERE is_active = 1
  AND (
    screen_key LIKE '%_10_%'
    OR screen_key LIKE '%_13_%'
    OR screen_key LIKE '%_16_%'
    OR screen_key LIKE '%_17_%'
    OR screen_key LIKE '%_19_%'
    OR screen_key LIKE '%_21_%'
    OR screen_key LIKE '%_27_%'
  );

SELECT '✅ Deactivated old duplicate screens' as Status;

-- ============================================================================
-- STEP 3: Verification - Show remaining active screens
-- ============================================================================

SELECT '📱 Active screens after cleanup:' as Info;

SELECT 
  s.id,
  s.name,
  s.screen_key,
  s.category,
  (SELECT COUNT(*) FROM screen_element_instances WHERE screen_id = s.id) as elements
FROM app_screens s
WHERE s.is_active = 1
ORDER BY s.name;

SELECT '✅ Cleanup Complete! Only clean screens remain.' as Status;
