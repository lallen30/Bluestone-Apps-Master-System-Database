-- ============================================
-- Service Matching App Template
-- Migration: 009 (Corrected Version)
-- Created: Nov 7, 2025
-- Description: Complete template for service matching platforms
-- ============================================

-- Create the Service Matching App Template
INSERT INTO app_templates (name, description, category, icon, is_active, created_at) VALUES
('Service Matching Platform', 'Complete template for service matching platforms connecting customers with service providers. Includes dual user roles, booking, payments, reviews, and messaging.', 'Marketplace', 'Briefcase', 1, NOW());

SET @template_id = LAST_INSERT_ID();

-- ============================================
-- ADD SCREENS TO TEMPLATE
-- ============================================

-- 1. Splash Screen
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Splash Screen', 'splash_screen', 'App logo and branding while loading', 'Zap', 'Onboarding', 1, 0, NOW());

-- 2. Onboarding
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Onboarding', 'onboarding', 'Tutorial slides introducing the app', 'BookOpen', 'Onboarding', 2, 0, NOW());

-- 3. Login Screen
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Login Screen', 'login', 'Email/username and password login', 'LogIn', 'Authentication', 3, 0, NOW());

-- 4. Sign Up
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Sign Up', 'sign_up', 'Create new account - choose role (Customer or Provider)', 'UserPlus', 'Authentication', 4, 0, NOW());

-- 5. Email Verification
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Email Verification', 'email_verification', 'Verify email with code', 'Mail', 'Authentication', 5, 0, NOW());

-- 6. Profile Setup
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Profile Setup', 'profile_setup', 'Complete profile after signup - choose role and add details', 'UserPlus', 'Onboarding', 6, 0, NOW());

-- 7. Service Dashboard (HOME SCREEN)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Service Dashboard', 'service_dashboard', 'Main dashboard showing services or requests based on user role', 'Home', 'Navigation', 7, 1, NOW());

-- 8. Search Services
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Search Services', 'search_services', 'Search and filter service providers', 'Search', 'Discovery', 8, 0, NOW());

-- 9. Service Categories
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Service Categories', 'service_categories', 'Browse services by category', 'Grid', 'Discovery', 9, 0, NOW());

-- 10. Service Provider Profile
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Service Provider Profile', 'provider_profile', 'View service provider details, ratings, and portfolio', 'User', 'Profile', 10, 0, NOW());

-- 11. Service Details
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Service Details', 'service_details', 'Detailed view of a specific service offering', 'FileText', 'Content', 11, 0, NOW());

-- 12. Request Service
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Request Service', 'request_service', 'Form to request a service from providers', 'MessageSquare', 'Booking', 12, 0, NOW());

-- 13. Request Details
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Request Details', 'request_details', 'View service request with received quotes', 'Eye', 'Booking', 13, 0, NOW());

-- 14. Send Quote
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Send Quote', 'send_quote', 'Provider sends quote/proposal to customer', 'DollarSign', 'Booking', 14, 0, NOW());

-- 15. Schedule Booking
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Schedule Booking', 'schedule_booking', 'Pick date and time for service', 'Calendar', 'Booking', 15, 0, NOW());

-- 16. Booking Confirmation
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Booking Confirmation', 'booking_confirmation', 'Confirm service booking details', 'CheckCircle', 'Booking', 16, 0, NOW());

-- 17. Messages/Chat
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Messages', 'messages', 'Direct messaging between customers and providers', 'MessageCircle', 'Communication', 17, 0, NOW());

-- 18. Notifications
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Notifications', 'notifications', 'Job alerts, messages, and updates', 'Bell', 'Communication', 18, 0, NOW());

-- 19. Active Jobs
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Active Jobs', 'active_jobs', 'View current ongoing services', 'Briefcase', 'Jobs', 19, 0, NOW());

-- 20. Job Details
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Job Details', 'job_details', 'Detailed view of a specific job', 'FileText', 'Jobs', 20, 0, NOW());

-- 21. Job History
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Job History', 'job_history', 'View past completed jobs', 'Clock', 'Jobs', 21, 0, NOW());

-- 22. Job Tracking
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Job Tracking', 'job_tracking', 'Track job progress and status', 'MapPin', 'Jobs', 22, 0, NOW());

-- 23. Payment Methods
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Payment Methods', 'payment_methods', 'Manage saved payment methods', 'CreditCard', 'Payment', 23, 0, NOW());

-- 24. Make Payment
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Make Payment', 'make_payment', 'Pay for service', 'CreditCard', 'Payment', 24, 0, NOW());

-- 25. Payment Confirmation
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Payment Confirmation', 'payment_confirmation', 'Payment receipt and confirmation', 'CheckCircle', 'Payment', 25, 0, NOW());

-- 26. Earnings (Provider)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Earnings', 'earnings', 'View earnings and payout history', 'DollarSign', 'Payment', 26, 0, NOW());

-- 27. Payout Settings
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Payout Settings', 'payout_settings', 'Configure bank account for payouts', 'Settings', 'Payment', 27, 0, NOW());

-- 28. Write Review
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Write Review', 'write_review', 'Rate and review service provider', 'Star', 'Reviews', 28, 0, NOW());

-- 29. Reviews List
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Reviews', 'reviews_list', 'View all reviews for a provider', 'Star', 'Reviews', 29, 0, NOW());

-- 30. User Profile
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'User Profile', 'user_profile', 'View own profile', 'User', 'Profile', 30, 0, NOW());

-- 31. Edit Profile
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Edit Profile', 'edit_profile', 'Update profile information', 'Edit', 'Profile', 31, 0, NOW());

-- 32. Settings
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Settings', 'settings', 'App preferences and account settings', 'Settings', 'Profile', 32, 0, NOW());

-- 33. Become a Provider
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Become a Provider', 'become_provider', 'Switch from customer to service provider', 'UserPlus', 'Profile', 33, 0, NOW());

-- 34. About Us
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'About Us', 'about_us', 'Company information', 'Info', 'Information', 34, 0, NOW());

-- 35. Contact Us
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Contact Us', 'contact_us', 'Contact form for support', 'Mail', 'Information', 35, 0, NOW());

-- 36. Terms of Service
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Terms of Service', 'terms_of_service', 'Legal terms and conditions', 'FileText', 'Legal', 36, 0, NOW());

-- 37. Privacy Policy
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Privacy Policy', 'privacy_policy', 'Privacy policy and data usage', 'Shield', 'Legal', 37, 0, NOW());

-- ============================================
-- VERIFICATION
-- ============================================

-- Show template info
SELECT 
    t.id,
    t.name,
    t.category,
    t.icon,
    COUNT(ts.id) as screen_count
FROM app_templates t
LEFT JOIN app_template_screens ts ON t.id = ts.template_id
WHERE t.id = @template_id
GROUP BY t.id, t.name, t.category, t.icon;

-- Show all screens in template
SELECT 
    display_order,
    screen_name,
    screen_key,
    screen_category,
    is_home_screen
FROM app_template_screens
WHERE template_id = @template_id
ORDER BY display_order;

-- Success message
SELECT 'Service Matching App Template created successfully!' as message,
       @template_id as template_id,
       COUNT(*) as total_screens
FROM app_template_screens
WHERE template_id = @template_id;
