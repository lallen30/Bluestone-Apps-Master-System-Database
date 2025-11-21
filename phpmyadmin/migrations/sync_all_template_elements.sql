-- ============================================================================
-- Sync ALL Template Screen Elements to Master Screens
-- Issue: Many master screens have 0 elements even though template has elements
-- Solution: Copy all elements from template screens to their master screens
-- ============================================================================

USE multi_site_manager;

SET @template_id = 9;

-- ============================================================================
-- STEP 1: Show screens that need syncing
-- ============================================================================

SELECT '🔍 Screens that need element syncing:' as Info;

SELECT 
  ats.screen_id as master_screen_id,
  s.name as master_name,
  (SELECT COUNT(*) FROM app_template_screen_elements WHERE template_screen_id = ats.id) as template_elements,
  (SELECT COUNT(*) FROM screen_element_instances WHERE screen_id = ats.screen_id) as master_elements,
  CASE 
    WHEN (SELECT COUNT(*) FROM app_template_screen_elements WHERE template_screen_id = ats.id) > 
         (SELECT COUNT(*) FROM screen_element_instances WHERE screen_id = ats.screen_id)
    THEN '⚠️ Needs Sync'
    ELSE '✅ OK'
  END as status
FROM app_template_screens ats
JOIN app_screens s ON ats.screen_id = s.id
WHERE ats.template_id = @template_id
  AND ats.screen_id IS NOT NULL
  AND (SELECT COUNT(*) FROM app_template_screen_elements WHERE template_screen_id = ats.id) > 0
ORDER BY ats.screen_id;

-- ============================================================================
-- STEP 2: Sync all elements from template to master screens
-- ============================================================================

INSERT INTO screen_element_instances (
  screen_id,
  element_id,
  display_order,
  field_key,
  label,
  placeholder,
  default_value,
  is_required,
  is_readonly,
  validation_rules,
  config,
  created_at
)
SELECT 
  ats.screen_id as screen_id,
  atse.element_id,
  atse.display_order,
  COALESCE(atse.field_key, CONCAT(se.element_type, '_', atse.id)) as field_key,
  COALESCE(atse.label, se.name) as label,
  atse.placeholder,
  atse.default_value,
  COALESCE(atse.is_required, 0) as is_required,
  0 as is_readonly,
  atse.validation_rules,
  atse.config,
  NOW()
FROM app_template_screen_elements atse
JOIN app_template_screens ats ON atse.template_screen_id = ats.id
JOIN screen_elements se ON atse.element_id = se.id
WHERE ats.template_id = @template_id
  AND ats.screen_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM screen_element_instances sei
    WHERE sei.screen_id = ats.screen_id 
      AND sei.element_id = atse.element_id
      AND sei.display_order = atse.display_order
  );

SELECT '✅ Synced all template elements to master screens' as Status;

-- ============================================================================
-- STEP 3: Verification - Show synced screens
-- ============================================================================

SELECT '📱 Screens after sync:' as Info;

SELECT 
  s.id,
  s.name,
  s.screen_key,
  s.category,
  (SELECT COUNT(*) FROM screen_element_instances WHERE screen_id = s.id) as element_count
FROM app_screens s
WHERE s.id IN (
  SELECT DISTINCT screen_id 
  FROM app_template_screens 
  WHERE template_id = @template_id 
    AND screen_id IS NOT NULL
)
ORDER BY s.name;

SELECT '✅ Sync Complete! All template elements are now in master screens.' as Status;
