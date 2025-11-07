-- ============================================
-- Remove Duplicate Screens from Templates
-- Migration: 016
-- ============================================

-- Remove old duplicate screens (keep the standardized ones from migration 012)
-- Delete screens with old keys: splash, signup, about (keep splash_screen, sign_up, about_us)

-- Delete elements associated with duplicate screens first
DELETE tse FROM app_template_screen_elements tse
JOIN app_template_screens ts ON tse.template_screen_id = ts.id
WHERE ts.screen_key IN ('splash', 'signup', 'about', 'contact');

-- Delete the duplicate screens
DELETE FROM app_template_screens 
WHERE screen_key IN ('splash', 'signup', 'about', 'contact');

-- Verify cleanup
SELECT 
    t.id,
    t.name,
    COUNT(DISTINCT ts.id) as screen_count,
    COUNT(DISTINCT tse.id) as element_count
FROM app_templates t
LEFT JOIN app_template_screens ts ON t.id = ts.template_id
LEFT JOIN app_template_screen_elements tse ON ts.id = tse.template_screen_id
WHERE t.is_active = 1
GROUP BY t.id, t.name
ORDER BY t.id;
