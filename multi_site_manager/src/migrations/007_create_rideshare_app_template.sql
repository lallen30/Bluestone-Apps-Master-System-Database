-- Ride Share App Template Migration
-- Creates a comprehensive ride-sharing app template with 6 screens

-- Insert Ride Share App Template
INSERT INTO app_templates (name, description, category, icon, is_active, created_at)
VALUES (
  'Ride Share',
  'Complete ride-sharing solution with booking, tracking, and payment features',
  'Transportation',
  'Car',
  1,
  NOW()
);

SET @template_id = LAST_INSERT_ID();

-- ============================================
-- SCREEN 1: Request Ride (Home Screen)
-- ============================================
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at)
VALUES (
  @template_id,
  'Request Ride',
  'request_ride',
  'Main screen to request a ride with pickup and destination selection',
  'MapPin',
  'Booking',
  1,
  1,
  NOW()
);

SET @screen_id = LAST_INSERT_ID();

-- Request Ride Elements
INSERT INTO app_template_screen_elements (template_screen_id, element_id, field_key, label, placeholder, default_value, is_required, is_readonly, display_order, config, created_at)
VALUES
  -- Header
  (@screen_id, 27, 'request_title', 'Page Title', '', 'Where to?', 0, 1, 1, '{"level": "h1"}', NOW()),
  (@screen_id, 28, 'request_subtitle', 'Subtitle', '', 'Enter your destination to get started', 0, 1, 2, '{}', NOW()),
  
  -- Location Inputs
  (@screen_id, 1, 'pickup_location', 'Pickup Location', 'Enter pickup address', '', 1, 0, 3, '{"icon": "MapPin"}', NOW()),
  (@screen_id, 1, 'destination', 'Destination', 'Where are you going?', '', 1, 0, 4, '{"icon": "Navigation"}', NOW()),
  
  -- Ride Type Selection
  (@screen_id, 27, 'ride_type_heading', 'Ride Type', '', 'Choose Your Ride', 0, 1, 5, '{"level": "h3"}', NOW()),
  (@screen_id, 10, 'ride_type', 'Ride Type', 'Select ride type', 'standard', 1, 0, 6, '{"options": [{"label": "Standard", "value": "standard", "description": "Affordable rides"}, {"label": "Premium", "value": "premium", "description": "Comfortable sedans"}, {"label": "XL", "value": "xl", "description": "6 seats"}, {"label": "Luxury", "value": "luxury", "description": "High-end vehicles"}]}', NOW()),
  
  -- Ride Details
  (@screen_id, 27, 'ride_details_heading', 'Trip Details', '', 'Trip Details', 0, 1, 7, '{"level": "h3"}', NOW()),
  (@screen_id, 8, 'estimated_fare', 'Estimated Fare', '', '0.00', 0, 1, 8, '{"prefix": "$", "decimals": 2}', NOW()),
  (@screen_id, 28, 'estimated_time', 'Estimated Time', '', 'Calculating...', 0, 1, 9, '{}', NOW()),
  (@screen_id, 28, 'distance', 'Distance', '', 'Calculating...', 0, 1, 10, '{}', NOW()),
  
  -- Additional Options
  (@screen_id, 1, 'promo_code', 'Promo Code', 'Enter promo code', '', 0, 0, 11, '{}', NOW()),
  (@screen_id, 1, 'ride_notes', 'Special Instructions', 'Add notes for driver', '', 0, 0, 12, '{}', NOW()),
  
  -- Action Button
  (@screen_id, 33, 'request_ride_button', 'Request Ride', '', 'Request Ride', 0, 0, 13, '{"variant": "primary", "action": "submit", "size": "large"}', NOW());

-- ============================================
-- SCREEN 2: Ride Tracking
-- ============================================
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at)
VALUES (
  @template_id,
  'Ride Tracking',
  'ride_tracking',
  'Track your current ride in real-time with driver location and ETA',
  'Navigation',
  'Booking',
  2,
  0,
  NOW()
);

SET @screen_id = LAST_INSERT_ID();

-- Ride Tracking Elements
INSERT INTO app_template_screen_elements (template_screen_id, element_id, field_key, label, placeholder, default_value, is_required, is_readonly, display_order, config, created_at)
VALUES
  -- Status Header
  (@screen_id, 27, 'tracking_title', 'Page Title', '', 'Your Ride', 0, 1, 1, '{}', NOW()),
  (@screen_id, 28, 'ride_status', 'Ride Status', '', 'Driver is on the way', 0, 1, 2, '{"type": "status"}', NOW()),
  
  -- Driver Info
  (@screen_id, 27, 'driver_info_heading', 'Driver Information', '', 'Your Driver', 0, 1, 3, '{"level": "h3"}', NOW()),
  (@screen_id, 28, 'driver_name', 'Driver Name', '', 'John Doe', 0, 1, 4, '{}', NOW()),
  (@screen_id, 28, 'driver_rating', 'Driver Rating', '', '4.8 ⭐', 0, 1, 5, '{}', NOW()),
  (@screen_id, 28, 'vehicle_info', 'Vehicle Info', '', 'Toyota Camry - ABC 123', 0, 1, 6, '{}', NOW()),
  
  -- Trip Progress
  (@screen_id, 27, 'trip_progress_heading', 'Trip Progress', '', 'Trip Details', 0, 1, 7, '{"level": "h3"}', NOW()),
  (@screen_id, 28, 'eta', 'Estimated Arrival', '', '5 minutes', 0, 1, 8, '{"icon": "Clock"}', NOW()),
  (@screen_id, 28, 'current_location', 'Current Location', '', 'Updating...', 0, 1, 9, '{"icon": "MapPin"}', NOW()),
  (@screen_id, 28, 'destination_display', 'Destination', '', '', 0, 1, 10, '{"icon": "Navigation"}', NOW()),
  
  -- Actions
  (@screen_id, 33, 'call_driver_button', 'Call Driver', '', 'Call Driver', 0, 0, 11, '{"variant": "secondary", "icon": "Phone"}', NOW()),
  (@screen_id, 33, 'message_driver_button', 'Message Driver', '', 'Message', 0, 0, 12, '{"variant": "secondary", "icon": "MessageCircle"}', NOW()),
  (@screen_id, 33, 'cancel_ride_button', 'Cancel Ride', '', 'Cancel Ride', 0, 0, 13, '{"variant": "danger"}', NOW()),
  
  -- Safety Features
  (@screen_id, 27, 'safety_heading', 'Safety', '', 'Safety Features', 0, 1, 14, '{"level": "h3"}', NOW()),
  (@screen_id, 33, 'share_trip_button', 'Share Trip', '', 'Share Trip Status', 0, 0, 15, '{"variant": "secondary"}', NOW()),
  (@screen_id, 33, 'emergency_button', 'Emergency', '', 'Emergency', 0, 0, 16, '{"variant": "danger"}', NOW());

-- ============================================
-- SCREEN 3: Ride History
-- ============================================
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at)
VALUES (
  @template_id,
  'Ride History',
  'ride_history',
  'View all past rides with details and receipts',
  'History',
  'Account',
  3,
  0,
  NOW()
);

SET @screen_id = LAST_INSERT_ID();

-- Ride History Elements
INSERT INTO app_template_screen_elements (template_screen_id, element_id, field_key, label, placeholder, default_value, is_required, is_readonly, display_order, config, created_at)
VALUES
  -- Header
  (@screen_id, 27, 'history_title', 'Page Title', '', 'Ride History', 0, 1, 1, '{}', NOW()),
  (@screen_id, 28, 'history_description', 'Description', '', 'View all your past rides', 0, 1, 2, '{}', NOW()),
  
  -- Filters
  (@screen_id, 17, 'start_date', 'Start Date', 'From date', '', 0, 0, 3, '{}', NOW()),
  (@screen_id, 17, 'end_date', 'End Date', 'To date', '', 0, 0, 4, '{}', NOW()),
  (@screen_id, 10, 'ride_status_filter', 'Status', 'All Rides', '', 0, 0, 5, '{"options": [{"label": "All Rides", "value": "all"}, {"label": "Completed", "value": "completed"}, {"label": "Cancelled", "value": "cancelled"}]}', NOW()),
  (@screen_id, 33, 'apply_filters_button', 'Apply Filters', '', 'Apply', 0, 0, 6, '{"variant": "primary"}', NOW()),
  
  -- Ride List
  (@screen_id, 27, 'rides_list_heading', 'Your Rides', '', 'Past Rides', 0, 1, 7, '{"level": "h3"}', NOW()),
  (@screen_id, 28, 'rides_list', 'Rides List', '', 'Your ride history will appear here.', 0, 1, 8, '{"type": "list"}', NOW()),
  
  -- Summary Stats
  (@screen_id, 27, 'stats_heading', 'Statistics', '', 'Your Stats', 0, 1, 9, '{"level": "h3"}', NOW()),
  (@screen_id, 28, 'total_rides', 'Total Rides', '', '0 rides', 0, 1, 10, '{}', NOW()),
  (@screen_id, 28, 'total_spent', 'Total Spent', '', '$0.00', 0, 1, 11, '{}', NOW());

-- ============================================
-- SCREEN 4: Payment Methods
-- ============================================
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at)
VALUES (
  @template_id,
  'Payment Methods',
  'payment_methods',
  'Manage credit cards, debit cards, and digital wallets',
  'CreditCard',
  'Account',
  4,
  0,
  NOW()
);

SET @screen_id = LAST_INSERT_ID();

-- Payment Methods Elements
INSERT INTO app_template_screen_elements (template_screen_id, element_id, field_key, label, placeholder, default_value, is_required, is_readonly, display_order, config, created_at)
VALUES
  -- Header
  (@screen_id, 27, 'payment_title', 'Page Title', '', 'Payment Methods', 0, 1, 1, '{}', NOW()),
  (@screen_id, 28, 'payment_description', 'Description', '', 'Manage your payment options', 0, 1, 2, '{}', NOW()),
  
  -- Saved Payment Methods
  (@screen_id, 27, 'saved_methods_heading', 'Saved Methods', '', 'Your Payment Methods', 0, 1, 3, '{"level": "h3"}', NOW()),
  (@screen_id, 28, 'payment_methods_list', 'Payment Methods', '', 'Your saved payment methods will appear here.', 0, 1, 4, '{"type": "list"}', NOW()),
  
  -- Add New Payment Method
  (@screen_id, 27, 'add_payment_heading', 'Add New Payment', '', 'Add Payment Method', 0, 1, 5, '{"level": "h3"}', NOW()),
  (@screen_id, 10, 'payment_type', 'Payment Type', 'Select type', '', 0, 0, 6, '{"options": [{"label": "Credit Card", "value": "credit"}, {"label": "Debit Card", "value": "debit"}, {"label": "PayPal", "value": "paypal"}, {"label": "Apple Pay", "value": "apple_pay"}, {"label": "Google Pay", "value": "google_pay"}]}', NOW()),
  (@screen_id, 1, 'card_number', 'Card Number', 'Enter card number', '', 0, 0, 7, '{"type": "number"}', NOW()),
  (@screen_id, 1, 'card_name', 'Cardholder Name', 'Name on card', '', 0, 0, 8, '{}', NOW()),
  (@screen_id, 17, 'expiry_date', 'Expiry Date', 'MM/YY', '', 0, 0, 9, '{}', NOW()),
  (@screen_id, 1, 'cvv', 'CVV', 'CVV', '', 0, 0, 10, '{"type": "password", "maxLength": 4}', NOW()),
  
  -- Actions
  (@screen_id, 33, 'add_payment_button', 'Add Payment', '', 'Add Payment Method', 0, 0, 11, '{"variant": "primary"}', NOW()),
  
  -- Default Payment
  (@screen_id, 27, 'default_payment_heading', 'Default Payment', '', 'Default Payment Method', 0, 1, 12, '{"level": "h3"}', NOW()),
  (@screen_id, 28, 'default_payment_info', 'Default Payment', '', 'Set your preferred payment method for rides', 0, 1, 13, '{}', NOW());

-- ============================================
-- SCREEN 5: Driver Profile
-- ============================================
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at)
VALUES (
  @template_id,
  'Driver Profile',
  'driver_profile',
  'View detailed driver information, ratings, and reviews',
  'User',
  'Booking',
  5,
  0,
  NOW()
);

SET @screen_id = LAST_INSERT_ID();

-- Driver Profile Elements
INSERT INTO app_template_screen_elements (template_screen_id, element_id, field_key, label, placeholder, default_value, is_required, is_readonly, display_order, config, created_at)
VALUES
  -- Header
  (@screen_id, 27, 'driver_profile_title', 'Page Title', '', 'Driver Profile', 0, 1, 1, '{}', NOW()),
  
  -- Driver Info
  (@screen_id, 28, 'driver_photo', 'Driver Photo', '', 'Driver photo placeholder', 0, 1, 2, '{"type": "image"}', NOW()),
  (@screen_id, 27, 'driver_name_display', 'Driver Name', '', 'John Doe', 0, 1, 3, '{"level": "h2"}', NOW()),
  (@screen_id, 28, 'driver_rating_display', 'Rating', '', '4.8 ⭐ (1,234 rides)', 0, 1, 4, '{}', NOW()),
  (@screen_id, 28, 'member_since', 'Member Since', '', 'Member since: Jan 2023', 0, 1, 5, '{}', NOW()),
  
  -- Vehicle Information
  (@screen_id, 27, 'vehicle_heading', 'Vehicle', '', 'Vehicle Information', 0, 1, 6, '{"level": "h3"}', NOW()),
  (@screen_id, 28, 'vehicle_make_model', 'Vehicle', '', 'Toyota Camry 2023', 0, 1, 7, '{}', NOW()),
  (@screen_id, 28, 'vehicle_color', 'Color', '', 'Silver', 0, 1, 8, '{}', NOW()),
  (@screen_id, 28, 'license_plate', 'License Plate', '', 'ABC 123', 0, 1, 9, '{}', NOW()),
  
  -- Driver Stats
  (@screen_id, 27, 'stats_heading', 'Statistics', '', 'Driver Stats', 0, 1, 10, '{"level": "h3"}', NOW()),
  (@screen_id, 28, 'total_trips', 'Total Trips', '', '1,234 trips', 0, 1, 11, '{}', NOW()),
  (@screen_id, 28, 'acceptance_rate', 'Acceptance Rate', '', '98%', 0, 1, 12, '{}', NOW()),
  (@screen_id, 28, 'cancellation_rate', 'Cancellation Rate', '', '2%', 0, 1, 13, '{}', NOW()),
  
  -- Reviews Section
  (@screen_id, 27, 'reviews_heading', 'Reviews', '', 'Recent Reviews', 0, 1, 14, '{"level": "h3"}', NOW()),
  (@screen_id, 28, 'reviews_list', 'Reviews', '', 'Driver reviews will appear here.', 0, 1, 15, '{"type": "list"}', NOW()),
  
  -- Actions
  (@screen_id, 33, 'contact_driver_button', 'Contact Driver', '', 'Contact Driver', 0, 0, 16, '{"variant": "primary"}', NOW()),
  (@screen_id, 33, 'report_driver_button', 'Report Issue', '', 'Report Issue', 0, 0, 17, '{"variant": "secondary"}', NOW());

-- ============================================
-- SCREEN 6: User Profile
-- ============================================
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at)
VALUES (
  @template_id,
  'User Profile',
  'user_profile',
  'Manage your account settings, preferences, and personal information',
  'Settings',
  'Account',
  6,
  0,
  NOW()
);

SET @screen_id = LAST_INSERT_ID();

-- User Profile Elements
INSERT INTO app_template_screen_elements (template_screen_id, element_id, field_key, label, placeholder, default_value, is_required, is_readonly, display_order, config, created_at)
VALUES
  -- Header
  (@screen_id, 27, 'profile_title', 'Page Title', '', 'My Profile', 0, 1, 1, '{}', NOW()),
  (@screen_id, 28, 'profile_description', 'Description', '', 'Manage your account settings', 0, 1, 2, '{}', NOW()),
  
  -- Personal Information
  (@screen_id, 27, 'personal_info_heading', 'Personal Info', '', 'Personal Information', 0, 1, 3, '{"level": "h3"}', NOW()),
  (@screen_id, 1, 'first_name', 'First Name', 'Enter first name', '', 1, 0, 4, '{}', NOW()),
  (@screen_id, 1, 'last_name', 'Last Name', 'Enter last name', '', 1, 0, 5, '{}', NOW()),
  (@screen_id, 1, 'email', 'Email', 'Enter email', '', 1, 0, 6, '{"type": "email"}', NOW()),
  (@screen_id, 1, 'phone', 'Phone Number', 'Enter phone number', '', 1, 0, 7, '{"type": "tel"}', NOW()),
  
  -- Home Address
  (@screen_id, 27, 'home_address_heading', 'Home Address', '', 'Saved Addresses', 0, 1, 8, '{"level": "h3"}', NOW()),
  (@screen_id, 1, 'home_address', 'Home Address', 'Enter home address', '', 0, 0, 9, '{}', NOW()),
  (@screen_id, 1, 'work_address', 'Work Address', 'Enter work address', '', 0, 0, 10, '{}', NOW()),
  
  -- Preferences
  (@screen_id, 27, 'preferences_heading', 'Preferences', '', 'Ride Preferences', 0, 1, 11, '{"level": "h3"}', NOW()),
  (@screen_id, 10, 'preferred_ride_type', 'Preferred Ride Type', 'Select default', '', 0, 0, 12, '{"options": [{"label": "Standard", "value": "standard"}, {"label": "Premium", "value": "premium"}, {"label": "XL", "value": "xl"}, {"label": "Luxury", "value": "luxury"}]}', NOW()),
  (@screen_id, 10, 'language', 'Language', 'Select language', 'en', 0, 0, 13, '{"options": [{"label": "English", "value": "en"}, {"label": "Spanish", "value": "es"}, {"label": "French", "value": "fr"}]}', NOW()),
  
  -- Notifications
  (@screen_id, 27, 'notifications_heading', 'Notifications', '', 'Notification Settings', 0, 1, 14, '{"level": "h3"}', NOW()),
  (@screen_id, 28, 'push_notifications', 'Push Notifications', '', 'Enabled', 0, 1, 15, '{}', NOW()),
  (@screen_id, 28, 'email_notifications', 'Email Notifications', '', 'Enabled', 0, 1, 16, '{}', NOW()),
  (@screen_id, 28, 'sms_notifications', 'SMS Notifications', '', 'Enabled', 0, 1, 17, '{}', NOW()),
  
  -- Actions
  (@screen_id, 33, 'save_profile_button', 'Save Changes', '', 'Save Changes', 0, 0, 18, '{"variant": "primary", "action": "submit"}', NOW()),
  (@screen_id, 33, 'logout_button', 'Logout', '', 'Logout', 0, 0, 19, '{"variant": "secondary"}', NOW()),
  (@screen_id, 33, 'delete_account_button', 'Delete Account', '', 'Delete Account', 0, 0, 20, '{"variant": "danger"}', NOW());

-- Success message
SELECT CONCAT('✅ Ride Share app template created successfully! Template ID: ', @template_id) AS Result;
SELECT 'Created 6 screens: Request Ride, Ride Tracking, Ride History, Payment Methods, Driver Profile, User Profile' AS Screens;
