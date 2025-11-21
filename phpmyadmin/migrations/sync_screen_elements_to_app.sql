-- ============================================================================
-- Sync Template Screen Elements to App Screen Instances
-- Issue: Tab bar screens have no elements in screen_element_instances
-- Solution: Copy elements from template screens to master screens
-- ============================================================================

USE multi_site_manager;

SET @app_id = 28;
SET @template_id = 9;

-- ============================================================================
-- STEP 1: Show current state
-- ============================================================================

SELECT '🔍 Current screen elements status:' as Info;

SELECT 
  s.id,
  s.name,
  s.screen_key,
  (SELECT COUNT(*) FROM screen_element_instances WHERE screen_id = s.id) as instance_count,
  ats.id as template_screen_id,
  (SELECT COUNT(*) FROM app_template_screen_elements WHERE template_screen_id = ats.id) as template_element_count
FROM app_screens s
LEFT JOIN app_template_screens ats ON ats.screen_id = s.id AND ats.template_id = @template_id
WHERE s.id IN (112, 114, 116)
ORDER BY s.id;

-- ============================================================================
-- STEP 2: Copy elements from template to master screens
-- ============================================================================

-- For each template screen element, create a screen_element_instance
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
  AND ats.screen_id IN (112, 114, 116)
  AND NOT EXISTS (
    SELECT 1 FROM screen_element_instances sei
    WHERE sei.screen_id = ats.screen_id 
      AND sei.element_id = atse.element_id
      AND sei.display_order = atse.display_order
  );

SELECT '✅ Synced template elements to master screens' as Status;

-- ============================================================================
-- STEP 3: Verification
-- ============================================================================

SELECT '📱 Screen elements after sync:' as Info;

SELECT 
  s.id,
  s.name,
  s.screen_key,
  se.element_type,
  se.name as element_name,
  sei.display_order
FROM app_screens s
JOIN screen_element_instances sei ON sei.screen_id = s.id
JOIN screen_elements se ON sei.element_id = se.id
WHERE s.id IN (112, 114, 116)
ORDER BY s.id, sei.display_order;

SELECT '✅ Sync Complete! Reload the mobile app to see content.' as Status;
