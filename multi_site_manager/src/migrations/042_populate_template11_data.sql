-- Migration: Populate Template 11 (Rideshare) with roles, menus, users, and sample data
-- Date: 2025-12-03

-- ========================================
-- STEP 1: Create Roles
-- ========================================
INSERT INTO app_template_roles (template_id, name, display_name, description, is_default)
VALUES 
    (11, 'rider', 'Rider', 'Passenger who requests rides', 1),
    (11, 'driver', 'Driver', 'Driver who provides rides', 0);

-- ========================================
-- STEP 2: Create Menus
-- ========================================

-- Rider Tab Bar
INSERT INTO app_template_menus (template_id, name, menu_type, icon, description, is_active)
VALUES (11, 'Rider Tab Bar', 'tabbar', 'Navigation', 'Bottom navigation for riders', 1);

SET @rider_tab_menu_id = LAST_INSERT_ID();

-- Driver Tab Bar
INSERT INTO app_template_menus (template_id, name, menu_type, icon, description, is_active)
VALUES (11, 'Driver Tab Bar', 'tabbar', 'Navigation', 'Bottom navigation for drivers', 1);

SET @driver_tab_menu_id = LAST_INSERT_ID();

-- Rider Sidebar
INSERT INTO app_template_menus (template_id, name, menu_type, icon, description, is_active)
VALUES (11, 'Rider Sidebar', 'sidebar_left', 'Menu', 'Side menu for riders', 1);

SET @rider_sidebar_id = LAST_INSERT_ID();

-- Driver Sidebar
INSERT INTO app_template_menus (template_id, name, menu_type, icon, description, is_active)
VALUES (11, 'Driver Sidebar', 'sidebar_left', 'Menu', 'Side menu for drivers', 1);

SET @driver_sidebar_id = LAST_INSERT_ID();

-- ========================================
-- STEP 3: Create Menu Items
-- ========================================

-- Rider Tab Bar Items
INSERT INTO app_template_menu_items (template_menu_id, screen_id, label, icon, item_type, display_order, is_active)
VALUES 
    (@rider_tab_menu_id, (SELECT id FROM app_screens WHERE screen_key = 'request_ride' LIMIT 1), 'Home', 'Home', 'screen', 1, 1),
    (@rider_tab_menu_id, (SELECT id FROM app_screens WHERE screen_key = 'ride_history' LIMIT 1), 'Rides', 'History', 'screen', 2, 1),
    (@rider_tab_menu_id, (SELECT id FROM app_screens WHERE screen_key = 'payment_methods' LIMIT 1), 'Payment', 'CreditCard', 'screen', 3, 1),
    (@rider_tab_menu_id, (SELECT id FROM app_screens WHERE screen_key = 'user_profile' LIMIT 1), 'Profile', 'User', 'screen', 4, 1);

-- Driver Tab Bar Items
INSERT INTO app_template_menu_items (template_menu_id, screen_id, label, icon, item_type, display_order, is_active)
VALUES 
    (@driver_tab_menu_id, (SELECT id FROM app_screens WHERE screen_key = 'driver_dashboard' LIMIT 1), 'Home', 'Home', 'screen', 1, 1),
    (@driver_tab_menu_id, (SELECT id FROM app_screens WHERE screen_key = 'driver_rides' LIMIT 1), 'Rides', 'List', 'screen', 2, 1),
    (@driver_tab_menu_id, (SELECT id FROM app_screens WHERE screen_key = 'driver_earnings' LIMIT 1), 'Earnings', 'DollarSign', 'screen', 3, 1),
    (@driver_tab_menu_id, (SELECT id FROM app_screens WHERE screen_key = 'user_profile' LIMIT 1), 'Profile', 'User', 'screen', 4, 1);

-- Rider Sidebar Items
INSERT INTO app_template_menu_items (template_menu_id, screen_id, label, icon, item_type, display_order, is_active)
VALUES 
    (@rider_sidebar_id, (SELECT id FROM app_screens WHERE screen_key = 'request_ride' LIMIT 1), 'Request Ride', 'MapPin', 'screen', 1, 1),
    (@rider_sidebar_id, (SELECT id FROM app_screens WHERE screen_key = 'ride_history' LIMIT 1), 'Ride History', 'History', 'screen', 2, 1),
    (@rider_sidebar_id, (SELECT id FROM app_screens WHERE screen_key = 'payment_methods' LIMIT 1), 'Payment Methods', 'CreditCard', 'screen', 3, 1),
    (@rider_sidebar_id, (SELECT id FROM app_screens WHERE screen_key = 'saved_addresses' LIMIT 1), 'Saved Addresses', 'MapPin', 'screen', 4, 1),
    (@rider_sidebar_id, (SELECT id FROM app_screens WHERE screen_key = 'become_driver' LIMIT 1), 'Become a Driver', 'Car', 'screen', 5, 1),
    (@rider_sidebar_id, (SELECT id FROM app_screens WHERE screen_key = 'notifications' LIMIT 1), 'Notifications', 'Bell', 'screen', 6, 1),
    (@rider_sidebar_id, (SELECT id FROM app_screens WHERE screen_key = 'user_profile' LIMIT 1), 'Profile', 'User', 'screen', 7, 1),
    (@rider_sidebar_id, (SELECT id FROM app_screens WHERE screen_key = 'contact_us' LIMIT 1), 'Help & Support', 'HelpCircle', 'screen', 8, 1),
    (@rider_sidebar_id, (SELECT id FROM app_screens WHERE screen_key = 'about_us' LIMIT 1), 'About', 'Info', 'screen', 9, 1),
    (@rider_sidebar_id, (SELECT id FROM app_screens WHERE screen_key = 'logout' LIMIT 1), 'Logout', 'LogOut', 'screen', 10, 1);

-- Driver Sidebar Items
INSERT INTO app_template_menu_items (template_menu_id, screen_id, label, icon, item_type, display_order, is_active)
VALUES 
    (@driver_sidebar_id, (SELECT id FROM app_screens WHERE screen_key = 'driver_dashboard' LIMIT 1), 'Dashboard', 'LayoutDashboard', 'screen', 1, 1),
    (@driver_sidebar_id, (SELECT id FROM app_screens WHERE screen_key = 'driver_rides' LIMIT 1), 'My Rides', 'List', 'screen', 2, 1),
    (@driver_sidebar_id, (SELECT id FROM app_screens WHERE screen_key = 'driver_earnings' LIMIT 1), 'Earnings', 'DollarSign', 'screen', 3, 1),
    (@driver_sidebar_id, (SELECT id FROM app_screens WHERE screen_key = 'notifications' LIMIT 1), 'Notifications', 'Bell', 'screen', 4, 1),
    (@driver_sidebar_id, (SELECT id FROM app_screens WHERE screen_key = 'user_profile' LIMIT 1), 'Profile', 'User', 'screen', 5, 1),
    (@driver_sidebar_id, (SELECT id FROM app_screens WHERE screen_key = 'contact_us' LIMIT 1), 'Help & Support', 'HelpCircle', 'screen', 6, 1),
    (@driver_sidebar_id, (SELECT id FROM app_screens WHERE screen_key = 'logout' LIMIT 1), 'Logout', 'LogOut', 'screen', 7, 1);

-- ========================================
-- STEP 4: Create Menu Role Access
-- ========================================

-- Get role IDs
SET @rider_role_id = (SELECT id FROM app_template_roles WHERE template_id = 11 AND name = 'rider' LIMIT 1);
SET @driver_role_id = (SELECT id FROM app_template_roles WHERE template_id = 11 AND name = 'driver' LIMIT 1);

-- Rider has access to rider menus
INSERT INTO app_template_menu_role_access (template_menu_id, template_role_id)
VALUES 
    (@rider_tab_menu_id, @rider_role_id),
    (@rider_sidebar_id, @rider_role_id);

-- Driver has access to driver menus
INSERT INTO app_template_menu_role_access (template_menu_id, template_role_id)
VALUES 
    (@driver_tab_menu_id, @driver_role_id),
    (@driver_sidebar_id, @driver_role_id);

-- ========================================
-- STEP 5: Create Screen Role Access
-- ========================================

-- Rider screens
INSERT INTO app_template_screen_role_access (template_id, screen_id, template_role_id, can_access)
SELECT 11, id, @rider_role_id, 1 FROM app_screens 
WHERE screen_key IN ('request_ride', 'ride_tracking', 'ride_history', 'ride_details', 'payment_methods', 
                     'driver_profile_view', 'saved_addresses', 'rate_ride', 'become_driver',
                     'user_profile', 'edit_profile', 'notifications', 'contact_us', 'about_us', 
                     'privacy_policy', 'terms_of_service', 'logout', 'splash_screen', 'login', 
                     'sign_up', 'forgot_password', 'email_verification');

-- Driver screens
INSERT INTO app_template_screen_role_access (template_id, screen_id, template_role_id, can_access)
SELECT 11, id, @driver_role_id, 1 FROM app_screens 
WHERE screen_key IN ('driver_dashboard', 'driver_rides', 'driver_earnings', 'ride_tracking', 'ride_details',
                     'user_profile', 'edit_profile', 'notifications', 'contact_us', 'about_us',
                     'privacy_policy', 'terms_of_service', 'logout', 'splash_screen', 'login',
                     'sign_up', 'forgot_password', 'email_verification');

-- ========================================
-- STEP 6: Create Role Home Screens
-- ========================================
INSERT INTO app_template_role_home_screens (template_role_id, screen_id)
VALUES 
    (@rider_role_id, (SELECT id FROM app_screens WHERE screen_key = 'request_ride' LIMIT 1)),
    (@driver_role_id, (SELECT id FROM app_screens WHERE screen_key = 'driver_dashboard' LIMIT 1));

-- ========================================
-- STEP 7: Create Sample Users
-- ========================================

-- Password hash for 'password123' using bcrypt
SET @password_hash = '$2b$10$rQZ8K.5YxQZ8K.5YxQZ8KeQZ8K.5YxQZ8K.5YxQZ8K.5YxQZ8K.5Y';

INSERT INTO app_template_users (template_id, email, password_hash, first_name, last_name, phone, status, email_verified)
VALUES 
    (11, 'rider@example.com', @password_hash, 'John', 'Rider', '+1234567890', 'active', 1),
    (11, 'rider2@example.com', @password_hash, 'Jane', 'Passenger', '+1234567891', 'active', 1),
    (11, 'driver@example.com', @password_hash, 'Mike', 'Driver', '+1234567892', 'active', 1),
    (11, 'driver2@example.com', @password_hash, 'Sarah', 'Wheels', '+1234567893', 'active', 1);

-- ========================================
-- STEP 8: Create User Role Assignments
-- ========================================

-- Get user IDs
SET @rider1_id = (SELECT id FROM app_template_users WHERE template_id = 11 AND email = 'rider@example.com' LIMIT 1);
SET @rider2_id = (SELECT id FROM app_template_users WHERE template_id = 11 AND email = 'rider2@example.com' LIMIT 1);
SET @driver1_id = (SELECT id FROM app_template_users WHERE template_id = 11 AND email = 'driver@example.com' LIMIT 1);
SET @driver2_id = (SELECT id FROM app_template_users WHERE template_id = 11 AND email = 'driver2@example.com' LIMIT 1);

INSERT INTO app_template_user_role_assignments (template_user_id, template_role_id)
VALUES 
    (@rider1_id, @rider_role_id),
    (@rider2_id, @rider_role_id),
    (@driver1_id, @driver_role_id),
    (@driver2_id, @driver_role_id);

-- ========================================
-- STEP 9: Create Sample Driver Profiles
-- ========================================
INSERT INTO app_template_driver_profiles (template_id, template_user_id, vehicle_make, vehicle_model, vehicle_year, vehicle_color, license_plate, vehicle_type, rating, total_rides, is_verified)
VALUES 
    (11, @driver1_id, 'Toyota', 'Camry', 2023, 'Silver', 'ABC 123', 'sedan', 4.85, 156, 1),
    (11, @driver2_id, 'Honda', 'Accord', 2022, 'Black', 'XYZ 789', 'sedan', 4.92, 243, 1);

-- ========================================
-- STEP 10: Create Sample Rides (completed)
-- ========================================
INSERT INTO app_template_rides (template_id, template_rider_id, template_driver_id, pickup_address, pickup_latitude, pickup_longitude, destination_address, destination_latitude, destination_longitude, ride_type, status, estimated_fare, actual_fare)
VALUES 
    (11, @rider1_id, @driver1_id, '123 Main St, New York, NY', 40.7128, -74.0060, '456 Broadway, New York, NY', 40.7589, -73.9851, 'standard', 'completed', 15.50, 16.25),
    (11, @rider1_id, @driver2_id, '789 Park Ave, New York, NY', 40.7649, -73.9724, 'JFK Airport, Queens, NY', 40.6413, -73.7781, 'premium', 'completed', 45.00, 52.75),
    (11, @rider2_id, @driver1_id, 'Times Square, New York, NY', 40.7580, -73.9855, 'Central Park, New York, NY', 40.7829, -73.9654, 'standard', 'completed', 12.00, 11.50);

-- ========================================
-- STEP 11: Create Administrators
-- ========================================
INSERT INTO app_template_administrators (template_id, user_id, role_id, granted_by)
VALUES (11, 1, 2, 1);

-- ========================================
-- STEP 12: Create Screen Menu Assignments
-- ========================================

-- Assign rider screens to rider sidebar
INSERT INTO app_template_screen_menu_assignments (template_id, screen_id, template_menu_id)
SELECT 11, id, @rider_sidebar_id FROM app_screens 
WHERE screen_key IN ('request_ride', 'ride_history', 'payment_methods', 'saved_addresses', 
                     'become_driver', 'notifications', 'user_profile', 'contact_us', 'about_us');

-- Assign driver screens to driver sidebar
INSERT INTO app_template_screen_menu_assignments (template_id, screen_id, template_menu_id)
SELECT 11, id, @driver_sidebar_id FROM app_screens 
WHERE screen_key IN ('driver_dashboard', 'driver_rides', 'driver_earnings', 'notifications', 
                     'user_profile', 'contact_us');

-- Show summary
SELECT 'Template 11 Data Summary:' AS Info;
SELECT 'Roles' AS Type, COUNT(*) AS Count FROM app_template_roles WHERE template_id = 11
UNION ALL
SELECT 'Menus', COUNT(*) FROM app_template_menus WHERE template_id = 11
UNION ALL
SELECT 'Menu Items', COUNT(*) FROM app_template_menu_items WHERE template_menu_id IN (SELECT id FROM app_template_menus WHERE template_id = 11)
UNION ALL
SELECT 'Users', COUNT(*) FROM app_template_users WHERE template_id = 11
UNION ALL
SELECT 'Driver Profiles', COUNT(*) FROM app_template_driver_profiles WHERE template_id = 11
UNION ALL
SELECT 'Sample Rides', COUNT(*) FROM app_template_rides WHERE template_id = 11
UNION ALL
SELECT 'Administrators', COUNT(*) FROM app_template_administrators WHERE template_id = 11;

SELECT '✅ Template 11 data populated successfully!' AS Result;
