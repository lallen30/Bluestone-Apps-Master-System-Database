-- ============================================
-- Service Matching App Template
-- Migration: 009
-- Created: Nov 7, 2025
-- Description: Complete template for service matching platforms
--              (like TaskRabbit, Thumbtack, Fiverr, Upwork)
-- ============================================

-- Create the Service Matching App Template
INSERT INTO app_templates (name, description, category, icon, is_active, created_at, updated_at) VALUES
('Service Matching Platform', 'Complete template for service matching platforms connecting customers with service providers. Includes dual user roles, booking, payments, reviews, and messaging.', 'Marketplace', 'Briefcase', 1, NOW(), NOW());

SET @template_id = LAST_INSERT_ID();

-- ============================================
-- AUTHENTICATION & ONBOARDING SCREENS
-- ============================================

-- 1. Splash Screen
INSERT INTO app_template_screens (template_id, screen_id, display_order, is_home_screen, created_at, updated_at)
SELECT @template_id, id, 1, 0, NOW(), NOW()
FROM app_screens WHERE name = 'Splash Screen' LIMIT 1;

-- 2. Onboarding
INSERT INTO app_template_screens (template_id, screen_id, display_order, is_home_screen, created_at, updated_at)
SELECT @template_id, id, 2, 0, NOW(), NOW()
FROM app_screens WHERE name = 'Onboarding' LIMIT 1;

-- 3. Login Screen
INSERT INTO app_template_screens (template_id, screen_id, display_order, is_home_screen, created_at, updated_at)
SELECT @template_id, id, 3, 0, NOW(), NOW()
FROM app_screens WHERE name = 'Login Screen' LIMIT 1;

-- 4. Sign Up
INSERT INTO app_template_screens (template_id, screen_id, display_order, is_home_screen, created_at, updated_at)
SELECT @template_id, id, 4, 0, NOW(), NOW()
FROM app_screens WHERE name = 'Sign Up' LIMIT 1;

-- 5. Email Verification
INSERT INTO app_template_screens (template_id, screen_id, display_order, is_home_screen, created_at, updated_at)
SELECT @template_id, id, 5, 0, NOW(), NOW()
FROM app_screens WHERE name = 'Email Verification' LIMIT 1;

-- ============================================
-- NEW SCREENS FOR SERVICE MATCHING
-- ============================================

-- 6. Profile Setup (New)
INSERT INTO app_screens (name, screen_key, description, icon, category, display_order, created_at, updated_at) VALUES
('Profile Setup', 'profile_setup', 'Complete profile after signup - choose role and add details', 'UserPlus', 'Onboarding', 106, NOW(), NOW());
SET @profile_setup_id = LAST_INSERT_ID();

INSERT INTO app_template_screens (template_id, screen_id, display_order, is_home_screen, created_at, updated_at)
VALUES (@template_id, @profile_setup_id, 6, 0, NOW(), NOW());

-- Add elements to Profile Setup
INSERT INTO app_template_screen_elements (template_screen_id, element_id, display_order, created_at, updated_at)
SELECT 
    (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_id = @profile_setup_id),
    id,
    ROW_NUMBER() OVER (ORDER BY display_order)
FROM screen_elements 
WHERE type IN ('heading', 'paragraph', 'radio_button', 'text_field', 'phone_input', 'text_area', 'image_upload', 'button')
LIMIT 8;

-- 7. Home/Dashboard
INSERT INTO app_screens (name, screen_key, description, icon, category, display_order, created_at, updated_at) VALUES
('Service Dashboard', 'service_dashboard', 'Main dashboard showing services or requests based on user role', 'Home', 'Navigation', 107, NOW(), NOW());
SET @dashboard_id = LAST_INSERT_ID();

INSERT INTO app_template_screens (template_id, screen_id, display_order, is_home_screen, created_at, updated_at)
VALUES (@template_id, @dashboard_id, 7, 1, NOW(), NOW());

-- 8. Search Services
INSERT INTO app_screens (name, screen_key, description, icon, category, display_order, created_at, updated_at) VALUES
('Search Services', 'search_services', 'Search and filter service providers', 'Search', 'Discovery', 108, NOW(), NOW());
SET @search_services_id = LAST_INSERT_ID();

INSERT INTO app_template_screens (template_id, screen_id, display_order, is_home_screen, created_at, updated_at)
VALUES (@template_id, @search_services_id, 8, 0, NOW(), NOW());

-- 9. Service Categories
INSERT INTO app_screens (name, screen_key, description, icon, category, display_order, created_at, updated_at) VALUES
('Service Categories', 'service_categories', 'Browse services by category', 'Grid', 'Discovery', 109, NOW(), NOW());
SET @categories_id = LAST_INSERT_ID();

INSERT INTO app_template_screens (template_id, screen_id, display_order, is_home_screen, created_at, updated_at)
VALUES (@template_id, @categories_id, 9, 0, NOW(), NOW());

-- 10. Service Provider Profile
INSERT INTO app_screens (name, screen_key, description, icon, category, display_order, created_at, updated_at) VALUES
('Service Provider Profile', 'provider_profile', 'View service provider details, ratings, and portfolio', 'User', 'Profile', 110, NOW(), NOW());
SET @provider_profile_id = LAST_INSERT_ID();

INSERT INTO app_template_screens (template_id, screen_id, display_order, is_home_screen, created_at, updated_at)
VALUES (@template_id, @provider_profile_id, 10, 0, NOW(), NOW());

-- Add elements to Provider Profile
INSERT INTO app_template_screen_elements (template_screen_id, element_id, display_order, created_at, updated_at)
SELECT 
    (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_id = @provider_profile_id),
    id,
    ROW_NUMBER() OVER (ORDER BY display_order)
FROM screen_elements 
WHERE type IN ('image_display', 'heading', 'star_rating_display', 'badge_display', 'paragraph', 'button')
LIMIT 6;

-- 11. Service Details
INSERT INTO app_screens (name, screen_key, description, icon, category, display_order, created_at, updated_at) VALUES
('Service Details', 'service_details', 'Detailed view of a specific service offering', 'FileText', 'Content', 111, NOW(), NOW());
SET @service_details_id = LAST_INSERT_ID();

INSERT INTO app_template_screens (template_id, screen_id, display_order, is_home_screen, created_at, updated_at)
VALUES (@template_id, @service_details_id, 11, 0, NOW(), NOW());

-- Add elements to Service Details
INSERT INTO app_template_screen_elements (template_screen_id, element_id, display_order, created_at, updated_at)
SELECT 
    (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_id = @service_details_id),
    id,
    ROW_NUMBER() OVER (ORDER BY display_order)
FROM screen_elements 
WHERE type IN ('service_card', 'heading', 'paragraph', 'currency_input', 'star_rating_display', 'button')
LIMIT 6;

-- 12. Request Service Form
INSERT INTO app_screens (name, screen_key, description, icon, category, display_order, created_at, updated_at) VALUES
('Request Service', 'request_service', 'Form to request a service from providers', 'MessageSquare', 'Booking', 112, NOW(), NOW());
SET @request_service_id = LAST_INSERT_ID();

INSERT INTO app_template_screens (template_id, screen_id, display_order, is_home_screen, created_at, updated_at)
VALUES (@template_id, @request_service_id, 12, 0, NOW(), NOW());

-- Add elements to Request Service
INSERT INTO app_template_screen_elements (template_screen_id, element_id, display_order, created_at, updated_at)
SELECT 
    (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_id = @request_service_id),
    id,
    ROW_NUMBER() OVER (ORDER BY display_order)
FROM screen_elements 
WHERE type IN ('heading', 'dropdown', 'text_area', 'location_picker', 'date_picker', 'time_picker', 'image_upload', 'button')
LIMIT 8;

-- 13. Service Request Details
INSERT INTO app_screens (name, screen_key, description, icon, category, display_order, created_at, updated_at) VALUES
('Request Details', 'request_details', 'View service request with received quotes', 'Eye', 'Booking', 113, NOW(), NOW());
SET @request_details_id = LAST_INSERT_ID();

INSERT INTO app_template_screens (template_id, screen_id, display_order, is_home_screen, created_at, updated_at)
VALUES (@template_id, @request_details_id, 13, 0, NOW(), NOW());

-- 14. Quote/Proposal
INSERT INTO app_screens (name, screen_key, description, icon, category, display_order, created_at, updated_at) VALUES
('Send Quote', 'send_quote', 'Provider sends quote/proposal to customer', 'DollarSign', 'Booking', 114, NOW(), NOW());
SET @send_quote_id = LAST_INSERT_ID();

INSERT INTO app_template_screens (template_id, screen_id, display_order, is_home_screen, created_at, updated_at)
VALUES (@template_id, @send_quote_id, 14, 0, NOW(), NOW());

-- Add elements to Send Quote
INSERT INTO app_template_screen_elements (template_screen_id, element_id, display_order, created_at, updated_at)
SELECT 
    (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_id = @send_quote_id),
    id,
    ROW_NUMBER() OVER (ORDER BY display_order)
FROM screen_elements 
WHERE type IN ('heading', 'quote_builder', 'text_area', 'button')
LIMIT 4;

-- 15. Schedule/Calendar
INSERT INTO app_template_screens (template_id, screen_id, display_order, is_home_screen, created_at, updated_at)
SELECT @template_id, id, 15, 0, NOW(), NOW()
FROM app_screens WHERE screen_key = 'booking_form' LIMIT 1;

-- 16. Booking Confirmation
INSERT INTO app_screens (name, screen_key, description, icon, category, display_order, created_at, updated_at) VALUES
('Booking Confirmation', 'booking_confirmation', 'Confirm service booking details', 'CheckCircle', 'Booking', 115, NOW(), NOW());
SET @booking_confirm_id = LAST_INSERT_ID();

INSERT INTO app_template_screens (template_id, screen_id, display_order, is_home_screen, created_at, updated_at)
VALUES (@template_id, @booking_confirm_id, 16, 0, NOW(), NOW());

-- 17. Messages/Chat
INSERT INTO app_template_screens (template_id, screen_id, display_order, is_home_screen, created_at, updated_at)
SELECT @template_id, id, 17, 0, NOW(), NOW()
FROM app_screens WHERE name = 'Chat' LIMIT 1;

-- 18. Notifications
INSERT INTO app_template_screens (template_id, screen_id, display_order, is_home_screen, created_at, updated_at)
SELECT @template_id, id, 18, 0, NOW(), NOW()
FROM app_screens WHERE name = 'Notifications List' LIMIT 1;

-- 19. Active Jobs
INSERT INTO app_screens (name, screen_key, description, icon, category, display_order, created_at, updated_at) VALUES
('Active Jobs', 'active_jobs', 'View current ongoing services', 'Briefcase', 'Jobs', 116, NOW(), NOW());
SET @active_jobs_id = LAST_INSERT_ID();

INSERT INTO app_template_screens (template_id, screen_id, display_order, is_home_screen, created_at, updated_at)
VALUES (@template_id, @active_jobs_id, 19, 0, NOW(), NOW());

-- 20. Job Details
INSERT INTO app_screens (name, screen_key, description, icon, category, display_order, created_at, updated_at) VALUES
('Job Details', 'job_details', 'Detailed view of a specific job', 'FileText', 'Jobs', 117, NOW(), NOW());
SET @job_details_id = LAST_INSERT_ID();

INSERT INTO app_template_screens (template_id, screen_id, display_order, is_home_screen, created_at, updated_at)
VALUES (@template_id, @job_details_id, 20, 0, NOW(), NOW());

-- Add elements to Job Details
INSERT INTO app_template_screen_elements (template_screen_id, element_id, display_order, created_at, updated_at)
SELECT 
    (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_id = @job_details_id),
    id,
    ROW_NUMBER() OVER (ORDER BY display_order)
FROM screen_elements 
WHERE type IN ('heading', 'job_status_badge', 'paragraph', 'location_picker', 'date_picker', 'currency_input', 'button')
LIMIT 7;

-- 21. Job History
INSERT INTO app_screens (name, screen_key, description, icon, category, display_order, created_at, updated_at) VALUES
('Job History', 'job_history', 'View past completed jobs', 'Clock', 'Jobs', 118, NOW(), NOW());
SET @job_history_id = LAST_INSERT_ID();

INSERT INTO app_template_screens (template_id, screen_id, display_order, is_home_screen, created_at, updated_at)
VALUES (@template_id, @job_history_id, 21, 0, NOW(), NOW());

-- 22. Job Tracking
INSERT INTO app_screens (name, screen_key, description, icon, category, display_order, created_at, updated_at) VALUES
('Job Tracking', 'job_tracking', 'Track job progress and status', 'MapPin', 'Jobs', 119, NOW(), NOW());
SET @job_tracking_id = LAST_INSERT_ID();

INSERT INTO app_template_screens (template_id, screen_id, display_order, is_home_screen, created_at, updated_at)
VALUES (@template_id, @job_tracking_id, 22, 0, NOW(), NOW());

-- 23. Payment Method
INSERT INTO app_template_screens (template_id, screen_id, display_order, is_home_screen, created_at, updated_at)
SELECT @template_id, id, 23, 0, NOW(), NOW()
FROM app_screens WHERE name = 'Payment Method' LIMIT 1;

-- 24. Payment
INSERT INTO app_screens (name, screen_key, description, icon, category, display_order, created_at, updated_at) VALUES
('Make Payment', 'make_payment', 'Pay for service', 'CreditCard', 'Payment', 120, NOW(), NOW());
SET @make_payment_id = LAST_INSERT_ID();

INSERT INTO app_template_screens (template_id, screen_id, display_order, is_home_screen, created_at, updated_at)
VALUES (@template_id, @make_payment_id, 24, 0, NOW(), NOW());

-- Add elements to Make Payment
INSERT INTO app_template_screen_elements (template_screen_id, element_id, display_order, created_at, updated_at)
SELECT 
    (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_id = @make_payment_id),
    id,
    ROW_NUMBER() OVER (ORDER BY display_order)
FROM screen_elements 
WHERE type IN ('heading', 'payment_method_card', 'currency_input', 'number_input', 'button')
LIMIT 5;

-- 25. Payment Confirmation
INSERT INTO app_template_screens (template_id, screen_id, display_order, is_home_screen, created_at, updated_at)
SELECT @template_id, id, 25, 0, NOW(), NOW()
FROM app_screens WHERE name = 'Order Confirmation' LIMIT 1;

-- 26. Earnings (Provider)
INSERT INTO app_screens (name, screen_key, description, icon, category, display_order, created_at, updated_at) VALUES
('Earnings', 'earnings', 'View earnings and payout history', 'DollarSign', 'Payment', 121, NOW(), NOW());
SET @earnings_id = LAST_INSERT_ID();

INSERT INTO app_template_screens (template_id, screen_id, display_order, is_home_screen, created_at, updated_at)
VALUES (@template_id, @earnings_id, 26, 0, NOW(), NOW());

-- 27. Payout Settings
INSERT INTO app_screens (name, screen_key, description, icon, category, display_order, created_at, updated_at) VALUES
('Payout Settings', 'payout_settings', 'Configure bank account for payouts', 'Settings', 'Payment', 122, NOW(), NOW());
SET @payout_settings_id = LAST_INSERT_ID();

INSERT INTO app_template_screens (template_id, screen_id, display_order, is_home_screen, created_at, updated_at)
VALUES (@template_id, @payout_settings_id, 27, 0, NOW(), NOW());

-- 28. Write Review
INSERT INTO app_template_screens (template_id, screen_id, display_order, is_home_screen, created_at, updated_at)
SELECT @template_id, id, 28, 0, NOW(), NOW()
FROM app_screens WHERE name = 'Write Review' LIMIT 1;

-- 29. Reviews List
INSERT INTO app_screens (name, screen_key, description, icon, category, display_order, created_at, updated_at) VALUES
('Reviews', 'reviews_list', 'View all reviews for a provider', 'Star', 'Reviews', 123, NOW(), NOW());
SET @reviews_list_id = LAST_INSERT_ID();

INSERT INTO app_template_screens (template_id, screen_id, display_order, is_home_screen, created_at, updated_at)
VALUES (@template_id, @reviews_list_id, 29, 0, NOW(), NOW());

-- Add elements to Reviews List
INSERT INTO app_template_screen_elements (template_screen_id, element_id, display_order, created_at, updated_at)
SELECT 
    (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_id = @reviews_list_id),
    id,
    ROW_NUMBER() OVER (ORDER BY display_order)
FROM screen_elements 
WHERE type IN ('heading', 'star_rating_display', 'review_card')
LIMIT 3;

-- 30. User Profile
INSERT INTO app_template_screens (template_id, screen_id, display_order, is_home_screen, created_at, updated_at)
SELECT @template_id, id, 30, 0, NOW(), NOW()
FROM app_screens WHERE name = 'User Profile' LIMIT 1;

-- 31. Edit Profile
INSERT INTO app_template_screens (template_id, screen_id, display_order, is_home_screen, created_at, updated_at)
SELECT @template_id, id, 31, 0, NOW(), NOW()
FROM app_screens WHERE name = 'Edit Profile' LIMIT 1;

-- 32. Settings
INSERT INTO app_template_screens (template_id, screen_id, display_order, is_home_screen, created_at, updated_at)
SELECT @template_id, id, 32, 0, NOW(), NOW()
FROM app_screens WHERE name = 'Settings' LIMIT 1;

-- 33. Become a Provider
INSERT INTO app_screens (name, screen_key, description, icon, category, display_order, created_at, updated_at) VALUES
('Become a Provider', 'become_provider', 'Switch from customer to service provider', 'UserPlus', 'Profile', 124, NOW(), NOW());
SET @become_provider_id = LAST_INSERT_ID();

INSERT INTO app_template_screens (template_id, screen_id, display_order, is_home_screen, created_at, updated_at)
VALUES (@template_id, @become_provider_id, 33, 0, NOW(), NOW());

-- Add elements to Become a Provider
INSERT INTO app_template_screen_elements (template_screen_id, element_id, display_order, created_at, updated_at)
SELECT 
    (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_id = @become_provider_id),
    id,
    ROW_NUMBER() OVER (ORDER BY display_order)
FROM screen_elements 
WHERE type IN ('heading', 'paragraph', 'text_field', 'text_area', 'dropdown', 'availability_grid', 'file_upload', 'button')
LIMIT 8;

-- 34. About Us
INSERT INTO app_template_screens (template_id, screen_id, display_order, is_home_screen, created_at, updated_at)
SELECT @template_id, id, 34, 0, NOW(), NOW()
FROM app_screens WHERE name = 'About Us' LIMIT 1;

-- 35. Contact Form
INSERT INTO app_template_screens (template_id, screen_id, display_order, is_home_screen, created_at, updated_at)
SELECT @template_id, id, 35, 0, NOW(), NOW()
FROM app_screens WHERE name = 'Contact Form' LIMIT 1;

-- 36. Terms of Service
INSERT INTO app_template_screens (template_id, screen_id, display_order, is_home_screen, created_at, updated_at)
SELECT @template_id, id, 36, 0, NOW(), NOW()
FROM app_screens WHERE name = 'Terms of Service' LIMIT 1;

-- 37. Privacy Policy
INSERT INTO app_template_screens (template_id, screen_id, display_order, is_home_screen, created_at, updated_at)
SELECT @template_id, id, 37, 0, NOW(), NOW()
FROM app_screens WHERE name = 'Privacy Policy' LIMIT 1;

-- ============================================
-- VERIFICATION
-- ============================================

-- Verify template creation
SELECT 
    t.id,
    t.name,
    t.category,
    COUNT(ts.id) as screen_count
FROM app_templates t
LEFT JOIN app_template_screens ts ON t.id = ts.template_id
WHERE t.id = @template_id
GROUP BY t.id;

-- Show all screens in template
SELECT 
    ts.display_order,
    s.name as screen_name,
    s.screen_key,
    s.category,
    ts.is_home_screen,
    COUNT(tse.id) as element_count
FROM app_template_screens ts
JOIN app_screens s ON ts.screen_id = s.id
LEFT JOIN app_template_screen_elements tse ON ts.id = tse.template_screen_id
WHERE ts.template_id = @template_id
GROUP BY ts.id, ts.display_order, s.name, s.screen_key, s.category, ts.is_home_screen
ORDER BY ts.display_order;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
SELECT 'Service Matching App Template created successfully!' as message,
       @template_id as template_id,
       COUNT(*) as total_screens
FROM app_template_screens
WHERE template_id = @template_id;
