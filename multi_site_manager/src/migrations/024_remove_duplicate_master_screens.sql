-- ============================================
-- Remove Duplicate Master Screens
-- Migration: 024
-- Created: Nov 7, 2025
-- Description: Remove duplicate screens with 0 modules from app_screens table
-- ============================================

-- First, let's see what we're dealing with
SELECT 'Duplicate screens to be removed:' as message;
SELECT id, name, screen_key, 
       (SELECT COUNT(*) FROM screen_element_instances WHERE screen_id = app_screens.id) as modules,
       (SELECT COUNT(*) FROM app_screen_assignments WHERE screen_id = app_screens.id) as assignments
FROM app_screens 
WHERE id IN (90, 91, 92)
ORDER BY name;

-- Check if any apps are using these duplicate screens
SELECT 'Apps using duplicate screens (should be 0):' as message;
SELECT asa.app_id, asa.screen_id, s.name as screen_name
FROM app_screen_assignments asa
JOIN app_screens s ON asa.screen_id = s.id
WHERE asa.screen_id IN (90, 91, 92);

-- Remove assignments if any exist (there shouldn't be any)
DELETE FROM app_screen_assignments 
WHERE screen_id IN (90, 91, 92);

-- Remove the duplicate screens with 0 modules
DELETE FROM app_screens 
WHERE id IN (90, 91, 92);

-- Verify the correct screens remain
SELECT 'Remaining screens (should have modules):' as message;
SELECT id, name, screen_key,
       (SELECT COUNT(*) FROM screen_element_instances WHERE screen_id = app_screens.id) as modules
FROM app_screens 
WHERE name IN ('Contact Us', 'Login', 'Notifications', 'Terms of Service')
   OR name LIKE '%Login%'
   OR name LIKE '%Notification%'
   OR name LIKE '%Contact%'
   OR name LIKE '%Terms%'
ORDER BY name, modules DESC;

-- Show summary
SELECT 'Cleanup complete!' as message;
SELECT 
    (SELECT COUNT(*) FROM app_screens) as total_screens,
    (SELECT COUNT(*) FROM app_screens WHERE (SELECT COUNT(*) FROM screen_element_instances WHERE screen_id = app_screens.id) = 0) as screens_with_no_modules;
