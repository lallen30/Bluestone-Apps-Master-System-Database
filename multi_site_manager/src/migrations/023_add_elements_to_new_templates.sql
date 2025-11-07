-- ============================================
-- Add Basic Elements to New Templates (14-18)
-- Migration: 023
-- ============================================

-- Add basic elements to all screens in new templates (Healthcare, Education, Event Booking, Job Search, Dating)

INSERT INTO app_template_screen_elements (template_screen_id, element_id, field_key, display_order)
SELECT ts.id, 27, CONCAT('heading_', ts.id, '_1'), 1 FROM app_template_screens ts WHERE ts.template_id IN (14, 15, 16, 17, 18) -- heading
UNION ALL
SELECT ts.id, 28, CONCAT('paragraph_', ts.id, '_2'), 2 FROM app_template_screens ts WHERE ts.template_id IN (14, 15, 16, 17, 18) -- paragraph
UNION ALL
SELECT ts.id, 33, CONCAT('button_', ts.id, '_3'), 3 FROM app_template_screens ts WHERE ts.template_id IN (14, 15, 16, 17, 18) -- button
UNION ALL
SELECT ts.id, 1, CONCAT('text_field_', ts.id, '_4'), 4 FROM app_template_screens ts WHERE ts.template_id IN (14, 15, 16, 17, 18); -- text_field

-- Verify counts
SELECT 
    t.id,
    t.name,
    COUNT(DISTINCT ts.id) as screens,
    COUNT(tse.id) as elements
FROM app_templates t
LEFT JOIN app_template_screens ts ON t.id = ts.template_id
LEFT JOIN app_template_screen_elements tse ON ts.id = tse.template_screen_id
WHERE t.id IN (14, 15, 16, 17, 18)
GROUP BY t.id, t.name
ORDER BY t.id;
