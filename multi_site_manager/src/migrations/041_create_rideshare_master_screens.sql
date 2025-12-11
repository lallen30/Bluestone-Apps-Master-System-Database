-- Migration: Create Rideshare Master Screens and Link to Template 11
-- Date: 2025-12-03

-- ========================================
-- Create Master Screens for Rideshare
-- ========================================

-- Insert Rideshare-specific screens using INSERT IGNORE to skip duplicates
INSERT IGNORE INTO app_screens (name, screen_key, description, icon, category, is_active, is_report, created_by)
VALUES 
    ('Request Ride', 'request_ride', 'Main screen to request a ride with pickup and destination selection', 'MapPin', 'Booking', 1, 0, 1),
    ('Ride Tracking', 'ride_tracking', 'Track your current ride in real-time with driver location and ETA', 'Navigation', 'Booking', 1, 0, 1),
    ('Ride History', 'ride_history', 'View all past rides with details and receipts', 'History', 'Account', 1, 0, 1),
    ('Ride Details', 'ride_details', 'View details of a specific ride', 'FileText', 'Booking', 1, 0, 1),
    ('Payment Methods', 'payment_methods', 'Manage credit cards, debit cards, and digital wallets', 'CreditCard', 'Account', 1, 0, 1),
    ('Driver Profile View', 'driver_profile_view', 'View detailed driver information, ratings, and reviews', 'User', 'Booking', 1, 0, 1),
    ('Driver Dashboard', 'driver_dashboard', 'Driver home screen with earnings and ride requests', 'LayoutDashboard', 'Driver', 1, 0, 1),
    ('Driver Earnings', 'driver_earnings', 'View earnings summary and payout history', 'DollarSign', 'Driver', 1, 0, 1),
    ('Become a Driver', 'become_driver', 'Register as a driver and submit documents', 'Car', 'Driver', 1, 0, 1),
    ('Driver Rides', 'driver_rides', 'View and manage ride requests as a driver', 'List', 'Driver', 1, 0, 1),
    ('Saved Addresses', 'saved_addresses', 'Manage saved home, work, and favorite addresses', 'MapPin', 'Account', 1, 0, 1),
    ('Rate Ride', 'rate_ride', 'Rate your ride and driver', 'Star', 'Booking', 1, 0, 1);

-- ========================================
-- Update Template 11 Screens with screen_id links
-- ========================================

-- Link existing template screens to master screens by screen_key
UPDATE app_template_screens ats
JOIN app_screens s ON s.screen_key = ats.screen_key
SET ats.screen_id = s.id
WHERE ats.template_id = 11 AND ats.screen_id IS NULL;

-- For screens that don't have matching screen_key, try matching by similar name
UPDATE app_template_screens ats
JOIN app_screens s ON LOWER(REPLACE(s.name, ' ', '_')) = LOWER(ats.screen_key)
SET ats.screen_id = s.id
WHERE ats.template_id = 11 AND ats.screen_id IS NULL;

-- Map driver_profile to driver_profile_view
UPDATE app_template_screens 
SET screen_id = (SELECT id FROM app_screens WHERE screen_key = 'driver_profile_view' LIMIT 1)
WHERE template_id = 11 AND screen_key = 'driver_profile' AND screen_id IS NULL;

-- ========================================
-- Add missing screens to template
-- ========================================

-- Add Ride Details screen if not exists
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, screen_id)
SELECT 11, 'Ride Details', 'ride_details', 'View details of a specific ride', 'FileText', 'Booking', 7, 0, 
    (SELECT id FROM app_screens WHERE screen_key = 'ride_details' LIMIT 1)
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM app_template_screens WHERE template_id = 11 AND screen_key = 'ride_details');

-- Add Driver Dashboard screen
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, screen_id)
SELECT 11, 'Driver Dashboard', 'driver_dashboard', 'Driver home screen with earnings and ride requests', 'LayoutDashboard', 'Driver', 20, 0,
    (SELECT id FROM app_screens WHERE screen_key = 'driver_dashboard' LIMIT 1)
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM app_template_screens WHERE template_id = 11 AND screen_key = 'driver_dashboard');

-- Add Driver Earnings screen
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, screen_id)
SELECT 11, 'Driver Earnings', 'driver_earnings', 'View earnings summary and payout history', 'DollarSign', 'Driver', 21, 0,
    (SELECT id FROM app_screens WHERE screen_key = 'driver_earnings' LIMIT 1)
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM app_template_screens WHERE template_id = 11 AND screen_key = 'driver_earnings');

-- Add Become a Driver screen
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, screen_id)
SELECT 11, 'Become a Driver', 'become_driver', 'Register as a driver and submit documents', 'Car', 'Driver', 22, 0,
    (SELECT id FROM app_screens WHERE screen_key = 'become_driver' LIMIT 1)
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM app_template_screens WHERE template_id = 11 AND screen_key = 'become_driver');

-- Add Driver Rides screen
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, screen_id)
SELECT 11, 'Driver Rides', 'driver_rides', 'View and manage ride requests as a driver', 'List', 'Driver', 23, 0,
    (SELECT id FROM app_screens WHERE screen_key = 'driver_rides' LIMIT 1)
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM app_template_screens WHERE template_id = 11 AND screen_key = 'driver_rides');

-- Add Saved Addresses screen
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, screen_id)
SELECT 11, 'Saved Addresses', 'saved_addresses', 'Manage saved home, work, and favorite addresses', 'MapPin', 'Account', 8, 0,
    (SELECT id FROM app_screens WHERE screen_key = 'saved_addresses' LIMIT 1)
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM app_template_screens WHERE template_id = 11 AND screen_key = 'saved_addresses');

-- Add Rate Ride screen
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, screen_id)
SELECT 11, 'Rate Ride', 'rate_ride', 'Rate your ride and driver', 'Star', 'Booking', 9, 0,
    (SELECT id FROM app_screens WHERE screen_key = 'rate_ride' LIMIT 1)
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM app_template_screens WHERE template_id = 11 AND screen_key = 'rate_ride');

-- Add Logout screen
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, screen_id)
SELECT 11, 'Logout', 'logout', 'Logout from the app', 'LogOut', 'Auth', 99, 0,
    (SELECT id FROM app_screens WHERE screen_key = 'logout' LIMIT 1)
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM app_template_screens WHERE template_id = 11 AND screen_key = 'logout');

-- Show results
SELECT 'Template 11 Screens Status:' AS Info;
SELECT id, screen_name, screen_key, screen_id, display_order 
FROM app_template_screens 
WHERE template_id = 11 
ORDER BY display_order;

SELECT '✅ Rideshare master screens created and linked!' AS Result;
