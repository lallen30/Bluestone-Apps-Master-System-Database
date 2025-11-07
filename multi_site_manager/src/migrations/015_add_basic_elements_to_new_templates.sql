-- ============================================
-- Add Basic Elements to Service Matching & Money Transfer Templates
-- Migration: 015
-- ============================================

-- Service Matching Platform (Template ID: 12)
-- Add basic elements to all screens

INSERT INTO app_template_screen_elements (template_screen_id, element_id, field_key, display_order)
SELECT ts.id, 27, CONCAT('heading_', ts.id, '_1'), 1 FROM app_template_screens ts WHERE ts.template_id = 12 -- heading
UNION ALL
SELECT ts.id, 28, CONCAT('paragraph_', ts.id, '_2'), 2 FROM app_template_screens ts WHERE ts.template_id = 12 -- paragraph
UNION ALL
SELECT ts.id, 33, CONCAT('button_', ts.id, '_3'), 3 FROM app_template_screens ts WHERE ts.template_id = 12 -- button
UNION ALL
SELECT ts.id, 1, CONCAT('text_field_', ts.id, '_4'), 4 FROM app_template_screens ts WHERE ts.template_id = 12; -- text_field

-- Money Transfer App (Template ID: 13)
-- Add basic elements to all screens

INSERT INTO app_template_screen_elements (template_screen_id, element_id, field_key, display_order)
SELECT ts.id, 27, CONCAT('heading_', ts.id, '_1'), 1 FROM app_template_screens ts WHERE ts.template_id = 13 -- heading
UNION ALL
SELECT ts.id, 28, CONCAT('paragraph_', ts.id, '_2'), 2 FROM app_template_screens ts WHERE ts.template_id = 13 -- paragraph
UNION ALL
SELECT ts.id, 33, CONCAT('button_', ts.id, '_3'), 3 FROM app_template_screens ts WHERE ts.template_id = 13 -- button
UNION ALL
SELECT ts.id, 1, CONCAT('text_field_', ts.id, '_4'), 4 FROM app_template_screens ts WHERE ts.template_id = 13; -- text_field

-- Verify counts
SELECT 
    t.id,
    t.name,
    COUNT(tse.id) as element_count
FROM app_templates t
LEFT JOIN app_template_screens ts ON t.id = ts.template_id
LEFT JOIN app_template_screen_elements tse ON ts.id = tse.template_screen_id
WHERE t.id IN (12, 13)
GROUP BY t.id, t.name;
