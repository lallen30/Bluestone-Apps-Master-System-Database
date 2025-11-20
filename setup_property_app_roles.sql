-- Setup Property Listing App Roles
-- App: AirPnP (ID: 28)
-- Run this script to create the recommended role structure

-- First, remove the generic default roles if they exist
DELETE FROM screen_role_access WHERE app_id = 28;
DELETE FROM app_user_role_assignments WHERE app_role_id IN (SELECT id FROM app_roles WHERE app_id = 28);
DELETE FROM app_roles WHERE app_id = 28;

-- 1. Create Guest Role (Default)
INSERT INTO app_roles (app_id, name, display_name, description, is_default)
VALUES (28, 'guest', 'Guest', 'Browse properties without booking - perfect for window shopping and research', TRUE);

SET @guest_role_id = LAST_INSERT_ID();

-- 2. Create Renter Role
INSERT INTO app_roles (app_id, name, display_name, description, is_default)
VALUES (28, 'renter', 'Renter', 'Book properties, manage reservations, and communicate with hosts', FALSE);

SET @renter_role_id = LAST_INSERT_ID();

-- 3. Create Host Role
INSERT INTO app_roles (app_id, name, display_name, description, is_default)
VALUES (28, 'host', 'Host', 'List and manage properties, handle bookings, and communicate with guests', FALSE);

SET @host_role_id = LAST_INSERT_ID();

-- 4. Create Premium Renter Role (Optional)
INSERT INTO app_roles (app_id, name, display_name, description, is_default)
VALUES (28, 'premium_renter', 'Premium Renter', 'Enhanced features, exclusive properties, and priority support', FALSE);

SET @premium_role_id = LAST_INSERT_ID();

-- 5. Create Verified User Role (Optional)
INSERT INTO app_roles (app_id, name, display_name, description, is_default)
VALUES (28, 'verified_user', 'Verified User', 'ID-verified users with instant booking privileges', FALSE);

SET @verified_role_id = LAST_INSERT_ID();

-- ============================================
-- ASSIGN SCREENS TO GUEST ROLE (Public Access)
-- ============================================

-- Public/Auth Screens
INSERT INTO screen_role_access (screen_id, role_id, app_id, can_access)
SELECT s.id, @guest_role_id, 28, TRUE
FROM app_screens s
INNER JOIN app_screen_assignments asa ON s.id = asa.screen_id
WHERE asa.app_id = 28
AND s.screen_key IN (
  'splash_10_1762287416751',
  'login',
  'signup_10_1762287416777',
  'forgot_password_10_1762287416806',
  'email_verification_10_1762287416794'
);

-- Property Browsing Screens
INSERT INTO screen_role_access (screen_id, role_id, app_id, can_access)
SELECT s.id, @guest_role_id, 28, TRUE
FROM app_screens s
INNER JOIN app_screen_assignments asa ON s.id = asa.screen_id
WHERE asa.app_id = 28
AND s.screen_key IN (
  'property_listings_17_1762456066301',
  'property_details_17_1762456066326',
  'advanced_search_17_1762456066420',
  'host_profile_17_1762456066377',
  'reviews_ratings_17_1762456066400'
);

-- Info Screens
INSERT INTO screen_role_access (screen_id, role_id, app_id, can_access)
SELECT s.id, @guest_role_id, 28, TRUE
FROM app_screens s
INNER JOIN app_screen_assignments asa ON s.id = asa.screen_id
WHERE asa.app_id = 28
AND s.screen_key IN (
  'about_10_1762287416974',
  'privacy_policy_10_1762287416933',
  'terms_of_service_21_1762543516201',
  'contact_us_27_1762974630367'
);

-- ============================================
-- ASSIGN SCREENS TO RENTER ROLE (All Guest + Booking)
-- ============================================

-- Copy all Guest screens to Renter
INSERT INTO screen_role_access (screen_id, role_id, app_id, can_access)
SELECT screen_id, @renter_role_id, app_id, can_access
FROM screen_role_access
WHERE role_id = @guest_role_id AND app_id = 28;

-- Add Renter-specific screens
INSERT INTO screen_role_access (screen_id, role_id, app_id, can_access)
SELECT s.id, @renter_role_id, 28, TRUE
FROM app_screens s
INNER JOIN app_screen_assignments asa ON s.id = asa.screen_id
WHERE asa.app_id = 28
AND s.screen_key IN (
  'booking_form_17_1762456066353',
  'user_profile_10_1762287416864',
  'edit_profile_10_1762287416880',
  'messages_21_1762543516193',
  'notifications_27_1762974630364'
);

-- ============================================
-- ASSIGN SCREENS TO HOST ROLE (All Renter + Host Features)
-- ============================================

-- Copy all Renter screens to Host
INSERT INTO screen_role_access (screen_id, role_id, app_id, can_access)
SELECT screen_id, @host_role_id, app_id, can_access
FROM screen_role_access
WHERE role_id = @renter_role_id AND app_id = 28;

-- Note: Add host-specific screens here when they're created
-- Example:
-- INSERT INTO screen_role_access (screen_id, role_id, app_id, can_access)
-- SELECT s.id, @host_role_id, 28, TRUE
-- FROM app_screens s
-- WHERE s.screen_key IN ('host_dashboard', 'property_management', 'booking_requests');

-- ============================================
-- ASSIGN SCREENS TO PREMIUM RENTER ROLE (All Renter + Premium)
-- ============================================

-- Copy all Renter screens to Premium
INSERT INTO screen_role_access (screen_id, role_id, app_id, can_access)
SELECT screen_id, @premium_role_id, app_id, can_access
FROM screen_role_access
WHERE role_id = @renter_role_id AND app_id = 28;

-- Note: Add premium-specific screens here when they're created

-- ============================================
-- ASSIGN SCREENS TO VERIFIED USER ROLE (All Renter + Verified)
-- ============================================

-- Copy all Renter screens to Verified
INSERT INTO screen_role_access (screen_id, role_id, app_id, can_access)
SELECT screen_id, @verified_role_id, app_id, can_access
FROM screen_role_access
WHERE role_id = @renter_role_id AND app_id = 28;

-- Note: Add verified-specific screens here when they're created

-- ============================================
-- ASSIGN DEFAULT ROLE TO EXISTING USERS
-- ============================================

-- Assign Guest role to all existing users who don't have any roles
INSERT INTO app_user_role_assignments (user_id, app_role_id, assigned_by)
SELECT au.id, @guest_role_id, NULL
FROM app_users au
WHERE au.app_id = 28
AND NOT EXISTS (
  SELECT 1 FROM app_user_role_assignments aura
  WHERE aura.user_id = au.id
);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Show created roles
SELECT 
  'Roles Created' as check_type,
  id,
  name,
  display_name,
  is_default,
  (SELECT COUNT(*) FROM screen_role_access WHERE role_id = app_roles.id) as screen_count,
  (SELECT COUNT(*) FROM app_user_role_assignments WHERE app_role_id = app_roles.id) as user_count
FROM app_roles
WHERE app_id = 28
ORDER BY is_default DESC, name;

-- Show screen assignments per role
SELECT 
  ar.name as role_name,
  COUNT(sra.id) as screens_assigned
FROM app_roles ar
LEFT JOIN screen_role_access sra ON ar.id = sra.role_id
WHERE ar.app_id = 28
GROUP BY ar.id, ar.name
ORDER BY ar.name;

-- Show which screens each role can access
SELECT 
  ar.display_name as role,
  s.name as screen,
  s.screen_key,
  sra.can_access
FROM app_roles ar
INNER JOIN screen_role_access sra ON ar.id = sra.role_id
INNER JOIN app_screens s ON sra.screen_id = s.id
WHERE ar.app_id = 28
ORDER BY ar.name, s.name;
