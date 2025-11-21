-- Add property_form element type to screen_elements
INSERT INTO screen_elements (name, element_type, category, icon, description, default_config, created_at)
VALUES (
  'Property Form',
  'property_form',
  'forms',
  'home',
  'Form for creating and editing property listings with all necessary fields',
  JSON_OBJECT(
    'mode', 'create',
    'show_amenities', true,
    'show_photos', true,
    'show_availability', true,
    'require_photos', true,
    'min_photos', 3,
    'max_photos', 10,
    'success_navigation', 'MyListings',
    'enable_draft', true
  ),
  NOW()
);

-- Create "Create Listing" master screen
INSERT INTO app_screens (name, screen_key, screen_type, description, is_active, created_at)
VALUES (
  'Create Listing',
  'create_listing',
  'form',
  'Screen for hosts to create new property listings',
  1,
  NOW()
);

-- Get the IDs we just created
SET @property_form_element_id = LAST_INSERT_ID();
SET @create_listing_screen_id = (SELECT id FROM app_screens WHERE screen_key = 'create_listing' ORDER BY id DESC LIMIT 1);

-- Add property_form element to the Create Listing screen
INSERT INTO screen_element_instances (
  screen_id,
  element_id,
  field_key,
  label,
  display_order,
  config,
  created_at
)
VALUES (
  @create_listing_screen_id,
  @property_form_element_id,
  'property_form',
  'Property Details',
  1,
  JSON_OBJECT(
    'mode', 'create',
    'show_amenities', true,
    'show_photos', true,
    'require_photos', true,
    'min_photos', 3
  ),
  NOW()
);

-- Assign the Create Listing screen to App 28 (Property Rental App)
INSERT INTO app_screen_assignments (app_id, screen_id, is_active, created_at)
VALUES (28, @create_listing_screen_id, 1, NOW());

-- Verification queries
SELECT 'Created property_form element:' as status;
SELECT id, name, element_type FROM screen_elements WHERE element_type = 'property_form';

SELECT 'Created Create Listing screen:' as status;
SELECT id, name, screen_key FROM app_screens WHERE screen_key = 'create_listing';

SELECT 'Screen has elements:' as status;
SELECT COUNT(*) as element_count FROM screen_element_instances WHERE screen_id = @create_listing_screen_id;

SELECT 'Screen assigned to app:' as status;
SELECT app_id, screen_id FROM app_screen_assignments WHERE screen_id = @create_listing_screen_id;
