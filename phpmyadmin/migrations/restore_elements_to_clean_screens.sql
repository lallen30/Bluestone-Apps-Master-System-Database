-- ============================================================================
-- Restore Elements to Clean Master Screens
-- Issue: Elements are on old deactivated screens, not on new clean screens
-- Solution: Copy elements from old screens to new clean screens
-- ============================================================================

USE multi_site_manager;

-- ============================================================================
-- STEP 1: Show the mapping
-- ============================================================================

SELECT '🔍 Element migration mapping:' as Info;

SELECT 
  s_old.id as old_id,
  s_old.name as old_name,
  s_old.screen_key as old_key,
  (SELECT COUNT(*) FROM screen_element_instances WHERE screen_id = s_old.id) as old_elements,
  s_new.id as new_id,
  s_new.name as new_name,
  s_new.screen_key as new_key,
  (SELECT COUNT(*) FROM screen_element_instances WHERE screen_id = s_new.id) as new_elements
FROM app_screens s_old
JOIN app_screens s_new ON 
  s_new.name = s_old.name 
  AND s_new.is_active = 1
  AND s_new.screen_key NOT LIKE '%_%_%'
WHERE s_old.is_active = 0
  AND s_old.screen_key LIKE '%_%_%'
  AND (SELECT COUNT(*) FROM screen_element_instances WHERE screen_id = s_old.id) > 0
ORDER BY s_old.name;

-- ============================================================================
-- STEP 2: Copy elements from old screens to new screens
-- ============================================================================

INSERT INTO screen_element_instances (
  screen_id,
  element_id,
  field_key,
  label,
  placeholder,
  default_value,
  is_required,
  is_readonly,
  display_order,
  config,
  validation_rules,
  created_at
)
SELECT 
  s_new.id as screen_id,
  sei_old.element_id,
  sei_old.field_key,
  sei_old.label,
  sei_old.placeholder,
  sei_old.default_value,
  sei_old.is_required,
  sei_old.is_readonly,
  sei_old.display_order,
  sei_old.config,
  sei_old.validation_rules,
  NOW()
FROM screen_element_instances sei_old
JOIN app_screens s_old ON sei_old.screen_id = s_old.id
JOIN app_screens s_new ON 
  s_new.name = s_old.name 
  AND s_new.is_active = 1
  AND s_new.screen_key NOT LIKE '%_%_%'
WHERE s_old.is_active = 0
  AND s_old.screen_key LIKE '%_%_%'
  AND NOT EXISTS (
    SELECT 1 FROM screen_element_instances sei_check
    WHERE sei_check.screen_id = s_new.id
      AND sei_check.element_id = sei_old.element_id
      AND sei_check.display_order = sei_old.display_order
  );

SELECT '✅ Copied elements from old screens to new screens' as Status;

-- ============================================================================
-- STEP 3: Verification
-- ============================================================================

SELECT '📱 Element counts after restoration:' as Info;

SELECT 
  s.id,
  s.name,
  s.screen_key,
  (SELECT COUNT(*) FROM screen_element_instances WHERE screen_id = s.id) as element_count
FROM app_screens s
WHERE s.is_active = 1
  AND s.name IN (
    'Edit Profile', 'Terms of Service', 'Privacy Policy', 'About Us', 
    'Contact Us', 'Notifications', 'User Profile', 'Email Verification',
    'Forgot Password', 'Sign Up', 'Splash Screen'
  )
ORDER BY s.name;

SELECT '✅ Elements Restored! All screens should now have their elements back.' as Status;
