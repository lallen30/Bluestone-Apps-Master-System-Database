-- ============================================
-- Add Basic Elements to Empty Master Screens
-- Migration: 025
-- Created: Nov 7, 2025
-- Description: Add basic elements to all master screens that have 0 modules
-- ============================================

-- Show screens with 0 modules
SELECT 'Screens with 0 modules:' as message;
SELECT id, name, screen_key,
       (SELECT COUNT(*) FROM screen_element_instances WHERE screen_id = app_screens.id) as modules,
       (SELECT COUNT(*) FROM app_screen_assignments WHERE screen_id = app_screens.id) as apps_using
FROM app_screens 
WHERE (SELECT COUNT(*) FROM screen_element_instances WHERE screen_id = app_screens.id) = 0
ORDER BY apps_using DESC, name;

-- Add basic elements (heading, paragraph, button, text_field) to all screens with 0 modules
-- Element IDs: 27=heading, 28=paragraph, 33=button, 1=text_field

INSERT INTO screen_element_instances (screen_id, element_id, field_key, label, display_order)
SELECT 
    s.id as screen_id,
    27 as element_id,
    CONCAT('heading_', s.id, '_1') as field_key,
    CONCAT(s.name, ' Title') as label,
    1 as display_order
FROM app_screens s
WHERE (SELECT COUNT(*) FROM screen_element_instances WHERE screen_id = s.id) = 0;

INSERT INTO screen_element_instances (screen_id, element_id, field_key, label, display_order)
SELECT 
    s.id as screen_id,
    28 as element_id,
    CONCAT('paragraph_', s.id, '_2') as field_key,
    CONCAT(s.name, ' Description') as label,
    2 as display_order
FROM app_screens s
WHERE (SELECT COUNT(*) FROM screen_element_instances WHERE screen_id = s.id) = 0;

INSERT INTO screen_element_instances (screen_id, element_id, field_key, label, display_order)
SELECT 
    s.id as screen_id,
    33 as element_id,
    CONCAT('button_', s.id, '_3') as field_key,
    'Action Button' as label,
    3 as display_order
FROM app_screens s
WHERE (SELECT COUNT(*) FROM screen_element_instances WHERE screen_id = s.id) = 0;

INSERT INTO screen_element_instances (screen_id, element_id, field_key, label, placeholder, display_order)
SELECT 
    s.id as screen_id,
    1 as element_id,
    CONCAT('text_field_', s.id, '_4') as field_key,
    'Input Field' as label,
    'Enter text' as placeholder,
    4 as display_order
FROM app_screens s
WHERE (SELECT COUNT(*) FROM screen_element_instances WHERE screen_id = s.id) = 0;

-- Verify all screens now have modules
SELECT 'After adding elements:' as message;
SELECT 
    COUNT(*) as total_screens,
    SUM(CASE WHEN module_count = 0 THEN 1 ELSE 0 END) as screens_with_no_modules,
    SUM(CASE WHEN module_count > 0 THEN 1 ELSE 0 END) as screens_with_modules
FROM (
    SELECT s.id, 
           (SELECT COUNT(*) FROM screen_element_instances WHERE screen_id = s.id) as module_count
    FROM app_screens s
) as screen_stats;

-- Show updated screens
SELECT 'Updated screens:' as message;
SELECT id, name, screen_key,
       (SELECT COUNT(*) FROM screen_element_instances WHERE screen_id = app_screens.id) as modules
FROM app_screens 
WHERE id IN (52, 53, 54, 56, 57, 66, 68, 86, 88)
ORDER BY name;
