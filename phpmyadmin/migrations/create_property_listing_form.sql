-- ============================================================================
-- Create Property Listing Form
-- ============================================================================
-- This creates a complete Property Listing Form using the Forms system
-- and links it to the Create Listing screen (ID: 127)
-- ============================================================================

-- 1. Create the form
INSERT INTO app_forms (
  name, 
  form_key, 
  description, 
  form_type, 
  layout, 
  submit_button_text, 
  success_message,
  icon, 
  category, 
  created_by
) VALUES (
  'Property Listing Form',
  'property_listing_form',
  'Complete form for creating and editing property listings with all necessary fields including location, pricing, amenities, and booking rules',
  'create',
  'single_column',
  'Create Listing',
  'Property listing created successfully! Your listing is now live.',
  'home',
  'real_estate',
  1
);

SET @form_id = LAST_INSERT_ID();

-- 2. Add form elements (reusing existing screen elements)

-- Basic Information Section
INSERT INTO app_form_elements (form_id, element_id, field_key, label, placeholder, is_required, display_order, help_text, config) VALUES
(@form_id, (SELECT id FROM screen_elements WHERE element_type = 'text_field' LIMIT 1), 'title', 'Property Title', 'e.g., Cozy Downtown Apartment', 1, 1, 'Give your property a catchy title', JSON_OBJECT('maxLength', 255)),
(@form_id, (SELECT id FROM screen_elements WHERE element_type = 'text_area' LIMIT 1), 'description', 'Description', 'Describe your property...', 1, 2, 'Detailed description of your property', JSON_OBJECT('rows', 5, 'maxLength', 2000)),
(@form_id, (SELECT id FROM screen_elements WHERE element_type = 'dropdown' LIMIT 1), 'property_type', 'Property Type', 'Select type', 1, 3, 'What type of property is this?', JSON_OBJECT('options', JSON_ARRAY(
  JSON_OBJECT('value', 'house', 'label', 'House'),
  JSON_OBJECT('value', 'apartment', 'label', 'Apartment'),
  JSON_OBJECT('value', 'condo', 'label', 'Condo'),
  JSON_OBJECT('value', 'villa', 'label', 'Villa'),
  JSON_OBJECT('value', 'cabin', 'label', 'Cabin'),
  JSON_OBJECT('value', 'cottage', 'label', 'Cottage'),
  JSON_OBJECT('value', 'townhouse', 'label', 'Townhouse'),
  JSON_OBJECT('value', 'loft', 'label', 'Loft'),
  JSON_OBJECT('value', 'other', 'label', 'Other')
)));

-- Location Section
INSERT INTO app_form_elements (form_id, element_id, field_key, label, placeholder, is_required, display_order, help_text, config) VALUES
(@form_id, (SELECT id FROM screen_elements WHERE element_type = 'text_field' LIMIT 1), 'address_line1', 'Street Address', '123 Main St', 1, 10, 'Street address of the property', NULL),
(@form_id, (SELECT id FROM screen_elements WHERE element_type = 'text_field' LIMIT 1), 'address_line2', 'Address Line 2', 'Apt, Suite, Unit (optional)', 0, 11, 'Apartment, suite, or unit number', NULL),
(@form_id, (SELECT id FROM screen_elements WHERE element_type = 'text_field' LIMIT 1), 'city', 'City', 'New York', 1, 12, 'City where the property is located', NULL),
(@form_id, (SELECT id FROM screen_elements WHERE element_type = 'text_field' LIMIT 1), 'state', 'State/Province', 'NY', 0, 13, 'State or province', NULL),
(@form_id, (SELECT id FROM screen_elements WHERE element_type = 'country_selector' LIMIT 1), 'country', 'Country', 'Select country', 1, 14, 'Country where the property is located', NULL),
(@form_id, (SELECT id FROM screen_elements WHERE element_type = 'text_field' LIMIT 1), 'postal_code', 'Zip/Postal Code', '10001', 0, 15, 'Postal or ZIP code', NULL);

-- Property Details Section
INSERT INTO app_form_elements (form_id, element_id, field_key, label, placeholder, is_required, display_order, help_text, config) VALUES
(@form_id, (SELECT id FROM screen_elements WHERE element_type = 'number_input' LIMIT 1), 'bedrooms', 'Bedrooms', '2', 1, 20, 'Number of bedrooms', JSON_OBJECT('min', 0, 'step', 1)),
(@form_id, (SELECT id FROM screen_elements WHERE element_type = 'number_input' LIMIT 1), 'bathrooms', 'Bathrooms', '1', 1, 21, 'Number of bathrooms', JSON_OBJECT('min', 0, 'step', 0.5)),
(@form_id, (SELECT id FROM screen_elements WHERE element_type = 'number_input' LIMIT 1), 'beds', 'Beds', '2', 0, 22, 'Total number of beds', JSON_OBJECT('min', 0, 'step', 1)),
(@form_id, (SELECT id FROM screen_elements WHERE element_type = 'number_input' LIMIT 1), 'guests_max', 'Maximum Guests', '4', 1, 23, 'Maximum number of guests allowed', JSON_OBJECT('min', 1, 'step', 1)),
(@form_id, (SELECT id FROM screen_elements WHERE element_type = 'number_input' LIMIT 1), 'square_feet', 'Square Feet', '1000', 0, 24, 'Total square footage', JSON_OBJECT('min', 0, 'step', 1));

-- Pricing Section
INSERT INTO app_form_elements (form_id, element_id, field_key, label, placeholder, is_required, display_order, help_text, config) VALUES
(@form_id, (SELECT id FROM screen_elements WHERE element_type = 'currency_input' LIMIT 1), 'price_per_night', 'Price per Night', '100.00', 1, 30, 'Nightly rate for your property', JSON_OBJECT('min', 0, 'step', 0.01, 'currency', 'USD')),
(@form_id, (SELECT id FROM screen_elements WHERE element_type = 'currency_input' LIMIT 1), 'cleaning_fee', 'Cleaning Fee', '50.00', 0, 31, 'One-time cleaning fee', JSON_OBJECT('min', 0, 'step', 0.01, 'currency', 'USD')),
(@form_id, (SELECT id FROM screen_elements WHERE element_type = 'currency_selector' LIMIT 1), 'currency', 'Currency', 'USD', 0, 32, 'Currency for pricing', JSON_OBJECT('default', 'USD'));

-- Booking Rules Section
INSERT INTO app_form_elements (form_id, element_id, field_key, label, placeholder, is_required, display_order, help_text, config) VALUES
(@form_id, (SELECT id FROM screen_elements WHERE element_type = 'number_input' LIMIT 1), 'min_nights', 'Minimum Nights', '1', 0, 40, 'Minimum stay requirement', JSON_OBJECT('min', 1, 'step', 1, 'default', 1)),
(@form_id, (SELECT id FROM screen_elements WHERE element_type = 'number_input' LIMIT 1), 'max_nights', 'Maximum Nights', '365', 0, 41, 'Maximum stay allowed', JSON_OBJECT('min', 1, 'step', 1, 'default', 365)),
(@form_id, (SELECT id FROM screen_elements WHERE element_type = 'time_picker' LIMIT 1), 'check_in_time', 'Check-in Time', '3:00 PM', 0, 42, 'Standard check-in time', JSON_OBJECT('default', '15:00')),
(@form_id, (SELECT id FROM screen_elements WHERE element_type = 'time_picker' LIMIT 1), 'check_out_time', 'Check-out Time', '11:00 AM', 0, 43, 'Standard check-out time', JSON_OBJECT('default', '11:00')),
(@form_id, (SELECT id FROM screen_elements WHERE element_type = 'dropdown' LIMIT 1), 'cancellation_policy', 'Cancellation Policy', 'Select policy', 0, 44, 'Cancellation terms for guests', JSON_OBJECT('options', JSON_ARRAY(
  JSON_OBJECT('value', 'flexible', 'label', 'Flexible - Full refund up to 24 hours before'),
  JSON_OBJECT('value', 'moderate', 'label', 'Moderate - Full refund up to 5 days before'),
  JSON_OBJECT('value', 'strict', 'label', 'Strict - 50% refund up to 7 days before'),
  JSON_OBJECT('value', 'super_strict', 'label', 'Super Strict - 50% refund up to 30 days before')
), 'default', 'moderate')),
(@form_id, (SELECT id FROM screen_elements WHERE element_type = 'switch_toggle' LIMIT 1), 'is_instant_book', 'Instant Book', NULL, 0, 45, 'Allow guests to book instantly without approval', JSON_OBJECT('default', false));

-- Additional Information Section
INSERT INTO app_form_elements (form_id, element_id, field_key, label, placeholder, is_required, display_order, help_text, config) VALUES
(@form_id, (SELECT id FROM screen_elements WHERE element_type = 'text_area' LIMIT 1), 'house_rules', 'House Rules', 'No smoking, No pets, etc.', 0, 50, 'Rules guests must follow', JSON_OBJECT('rows', 4)),
(@form_id, (SELECT id FROM screen_elements WHERE element_type = 'text_area' LIMIT 1), 'additional_info', 'Additional Information', 'Parking, WiFi, etc.', 0, 51, 'Any other important details', JSON_OBJECT('rows', 4));

-- 3. Assign form to Property Rental App (ID: 28)
INSERT INTO app_form_assignments (
  app_id, 
  form_id, 
  submit_endpoint, 
  submit_method,
  custom_submit_text,
  custom_success_message,
  assigned_by
) VALUES (
  28, 
  @form_id, 
  '/apps/28/listings', 
  'POST',
  'Create Listing',
  'Your property listing has been created successfully!',
  1
);

-- 4. Update the Create Listing screen element to reference this form
UPDATE screen_element_instances 
SET form_id = @form_id 
WHERE screen_id = 127 
  AND element_id = (SELECT id FROM screen_elements WHERE element_type = 'property_form' LIMIT 1);

-- 5. Update the property_form element to have proper config
UPDATE screen_elements 
SET default_config = JSON_OBJECT(
  'mode', 'create',
  'show_amenities', true,
  'show_photos', true,
  'show_location_map', true
)
WHERE element_type = 'property_form';

-- ============================================================================
-- VERIFICATION
-- ============================================================================

SELECT '=== FORM CREATED ===' as status;
SELECT id, name, form_key, form_type FROM app_forms WHERE id = @form_id;

SELECT '=== FORM ELEMENTS ===' as status;
SELECT COUNT(*) as total_fields FROM app_form_elements WHERE form_id = @form_id;

SELECT '=== FORM ASSIGNMENT ===' as status;
SELECT app_id, form_id, submit_endpoint FROM app_form_assignments WHERE form_id = @form_id;

SELECT '=== SCREEN ELEMENT UPDATED ===' as status;
SELECT id, screen_id, element_id, form_id FROM screen_element_instances WHERE screen_id = 127;

SELECT '=== FORM FIELDS SUMMARY ===' as status;
SELECT 
  fe.field_key,
  fe.label,
  se.element_type,
  fe.is_required,
  fe.display_order
FROM app_form_elements fe
JOIN screen_elements se ON fe.element_id = se.id
WHERE fe.form_id = @form_id
ORDER BY fe.display_order;
