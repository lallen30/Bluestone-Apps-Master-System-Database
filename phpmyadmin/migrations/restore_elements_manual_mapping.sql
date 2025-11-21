-- ============================================================================
-- Restore Elements with Manual Mapping
-- Copy elements from specific old screens to specific new screens
-- ============================================================================

USE multi_site_manager;

-- ============================================================================
-- Manual mapping of old screen IDs to new screen IDs
-- ============================================================================

-- About Us: 65 -> 109
INSERT INTO screen_element_instances (screen_id, element_id, field_key, label, placeholder, default_value, is_required, is_readonly, display_order, config, validation_rules, created_at)
SELECT 109, element_id, field_key, label, placeholder, default_value, is_required, is_readonly, display_order, config, validation_rules, NOW()
FROM screen_element_instances WHERE screen_id = 65;

-- Contact Us: 64 (Contact Form) -> 108
INSERT INTO screen_element_instances (screen_id, element_id, field_key, label, placeholder, default_value, is_required, is_readonly, display_order, config, validation_rules, created_at)
SELECT 108, element_id, field_key, label, placeholder, default_value, is_required, is_readonly, display_order, config, validation_rules, NOW()
FROM screen_element_instances WHERE screen_id = 64;

-- Edit Profile: 59 -> 106
INSERT INTO screen_element_instances (screen_id, element_id, field_key, label, placeholder, default_value, is_required, is_readonly, display_order, config, validation_rules, created_at)
SELECT 106, element_id, field_key, label, placeholder, default_value, is_required, is_readonly, display_order, config, validation_rules, NOW()
FROM screen_element_instances WHERE screen_id = 59;

-- Email Verification: 49 -> 104
INSERT INTO screen_element_instances (screen_id, element_id, field_key, label, placeholder, default_value, is_required, is_readonly, display_order, config, validation_rules, created_at)
SELECT 104, element_id, field_key, label, placeholder, default_value, is_required, is_readonly, display_order, config, validation_rules, NOW()
FROM screen_element_instances WHERE screen_id = 49;

-- Forgot Password: 50 -> 103
INSERT INTO screen_element_instances (screen_id, element_id, field_key, label, placeholder, default_value, is_required, is_readonly, display_order, config, validation_rules, created_at)
SELECT 103, element_id, field_key, label, placeholder, default_value, is_required, is_readonly, display_order, config, validation_rules, NOW()
FROM screen_element_instances WHERE screen_id = 50;

-- Notifications: 60 (Notifications List) -> 107
INSERT INTO screen_element_instances (screen_id, element_id, field_key, label, placeholder, default_value, is_required, is_readonly, display_order, config, validation_rules, created_at)
SELECT 107, element_id, field_key, label, placeholder, default_value, is_required, is_readonly, display_order, config, validation_rules, NOW()
FROM screen_element_instances WHERE screen_id = 60;

-- Privacy Policy: 62 -> 110
INSERT INTO screen_element_instances (screen_id, element_id, field_key, label, placeholder, default_value, is_required, is_readonly, display_order, config, validation_rules, created_at)
SELECT 110, element_id, field_key, label, placeholder, default_value, is_required, is_readonly, display_order, config, validation_rules, NOW()
FROM screen_element_instances WHERE screen_id = 62;

-- Sign Up: 48 -> 102
INSERT INTO screen_element_instances (screen_id, element_id, field_key, label, placeholder, default_value, is_required, is_readonly, display_order, config, validation_rules, created_at)
SELECT 102, element_id, field_key, label, placeholder, default_value, is_required, is_readonly, display_order, config, validation_rules, NOW()
FROM screen_element_instances WHERE screen_id = 48;

-- Splash Screen: 46 -> 101
INSERT INTO screen_element_instances (screen_id, element_id, field_key, label, placeholder, default_value, is_required, is_readonly, display_order, config, validation_rules, created_at)
SELECT 101, element_id, field_key, label, placeholder, default_value, is_required, is_readonly, display_order, config, validation_rules, NOW()
FROM screen_element_instances WHERE screen_id = 46;

-- Terms of Service: 63 (Terms and Conditions) -> 111
INSERT INTO screen_element_instances (screen_id, element_id, field_key, label, placeholder, default_value, is_required, is_readonly, display_order, config, validation_rules, created_at)
SELECT 111, element_id, field_key, label, placeholder, default_value, is_required, is_readonly, display_order, config, validation_rules, NOW()
FROM screen_element_instances WHERE screen_id = 63;

-- User Profile: 58 -> 105
INSERT INTO screen_element_instances (screen_id, element_id, field_key, label, placeholder, default_value, is_required, is_readonly, display_order, config, validation_rules, created_at)
SELECT 105, element_id, field_key, label, placeholder, default_value, is_required, is_readonly, display_order, config, validation_rules, NOW()
FROM screen_element_instances WHERE screen_id = 58;

SELECT '✅ Elements copied to new screens' as Status;

-- ============================================================================
-- Verification
-- ============================================================================

SELECT '📱 Final element counts:' as Info;

SELECT 
  s.id,
  s.name,
  s.screen_key,
  (SELECT COUNT(*) FROM screen_element_instances WHERE screen_id = s.id) as element_count
FROM app_screens s
WHERE s.is_active = 1
  AND s.id IN (101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111)
ORDER BY s.name;
