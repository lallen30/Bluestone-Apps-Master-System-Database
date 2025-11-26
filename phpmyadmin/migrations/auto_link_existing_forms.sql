-- Auto-link existing property_form elements to appropriate forms
-- This migration links property_form elements that don't have a form_id set

-- Update property_form elements on screens with "listing" in the name
UPDATE screen_element_instances sei
JOIN app_screens s ON sei.screen_id = s.id
JOIN screen_elements se ON sei.element_id = se.id
JOIN forms f ON (
  LOWER(s.name) LIKE '%listing%' AND 
  (LOWER(f.name) LIKE '%listing%' OR LOWER(f.form_key) LIKE '%listing%')
)
SET sei.form_id = f.id
WHERE se.element_type = 'property_form'
  AND sei.form_id IS NULL
  AND LOWER(s.name) LIKE '%listing%'
LIMIT 1;

-- Update property_form elements on screens with "property" in the name
UPDATE screen_element_instances sei
JOIN app_screens s ON sei.screen_id = s.id
JOIN screen_elements se ON sei.element_id = se.id
JOIN forms f ON (
  LOWER(s.name) LIKE '%property%' AND 
  (LOWER(f.name) LIKE '%property%' OR LOWER(f.form_key) LIKE '%property%')
)
SET sei.form_id = f.id
WHERE se.element_type = 'property_form'
  AND sei.form_id IS NULL
  AND LOWER(s.name) LIKE '%property%'
  AND sei.form_id IS NULL
LIMIT 1;

-- Update property_form elements on screens with "profile" in the name
UPDATE screen_element_instances sei
JOIN app_screens s ON sei.screen_id = s.id
JOIN screen_elements se ON sei.element_id = se.id
JOIN forms f ON (
  LOWER(s.name) LIKE '%profile%' AND 
  (LOWER(f.name) LIKE '%profile%' OR LOWER(f.form_key) LIKE '%profile%')
)
SET sei.form_id = f.id
WHERE se.element_type = 'property_form'
  AND sei.form_id IS NULL
  AND LOWER(s.name) LIKE '%profile%'
LIMIT 1;

-- Update property_form elements on screens with "contact" in the name
UPDATE screen_element_instances sei
JOIN app_screens s ON sei.screen_id = s.id
JOIN screen_elements se ON sei.element_id = se.id
JOIN forms f ON (
  LOWER(s.name) LIKE '%contact%' AND 
  (LOWER(f.name) LIKE '%contact%' OR LOWER(f.form_key) LIKE '%contact%')
)
SET sei.form_id = f.id
WHERE se.element_type = 'property_form'
  AND sei.form_id IS NULL
  AND LOWER(s.name) LIKE '%contact%'
LIMIT 1;

-- Update property_form elements on screens with "booking" in the name
UPDATE screen_element_instances sei
JOIN app_screens s ON sei.screen_id = s.id
JOIN screen_elements se ON sei.element_id = se.id
JOIN forms f ON (
  LOWER(s.name) LIKE '%booking%' AND 
  (LOWER(f.name) LIKE '%booking%' OR LOWER(f.form_key) LIKE '%booking%')
)
SET sei.form_id = f.id
WHERE se.element_type = 'property_form'
  AND sei.form_id IS NULL
  AND LOWER(s.name) LIKE '%booking%'
LIMIT 1;

-- Fallback: If there's only one form in the system, link all remaining unlinked property_form elements to it
UPDATE screen_element_instances sei
JOIN screen_elements se ON sei.element_id = se.id
CROSS JOIN (
  SELECT id FROM forms LIMIT 1
) f
SET sei.form_id = f.id
WHERE se.element_type = 'property_form'
  AND sei.form_id IS NULL
  AND (SELECT COUNT(*) FROM forms) = 1;

-- Show results
SELECT 
  s.name AS screen_name,
  sei.label AS element_label,
  f.name AS linked_form,
  'Auto-linked' AS status
FROM screen_element_instances sei
JOIN app_screens s ON sei.screen_id = s.id
JOIN screen_elements se ON sei.element_id = se.id
LEFT JOIN forms f ON sei.form_id = f.id
WHERE se.element_type = 'property_form'
ORDER BY s.name;
