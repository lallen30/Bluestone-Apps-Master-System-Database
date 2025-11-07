-- ============================================
-- Event Booking App Template
-- Migration: 020
-- Created: Nov 7, 2025
-- Description: Complete template for event discovery and ticket booking apps
--              (like Eventbrite, Ticketmaster, Meetup, StubHub)
-- ============================================

-- Create the Event Booking App Template
INSERT INTO app_templates (name, description, category, icon, is_active, created_at) VALUES
('Event Booking & Ticketing', 'Complete template for event discovery and ticket booking applications. Includes event browsing, ticket purchasing, QR codes, check-in, and event management.', 'Entertainment', 'Calendar', 1, NOW());

SET @template_id = LAST_INSERT_ID();

-- ============================================
-- ADD SCREENS TO TEMPLATE
-- ============================================

-- AUTHENTICATION & ONBOARDING (6 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Splash Screen', 'splash_screen', 'App logo', 'Zap', 'Onboarding', 1, 0, NOW()),
(@template_id, 'Onboarding', 'onboarding', 'Event app introduction', 'BookOpen', 'Onboarding', 2, 0, NOW()),
(@template_id, 'Login', 'login', 'User login', 'LogIn', 'Authentication', 3, 0, NOW()),
(@template_id, 'Sign Up', 'sign_up', 'Create account', 'UserPlus', 'Authentication', 4, 0, NOW()),
(@template_id, 'Forgot Password', 'forgot_password', 'Password recovery', 'Key', 'Authentication', 5, 0, NOW()),
(@template_id, 'Email Verification', 'email_verification', 'Verify email', 'Mail', 'Authentication', 6, 0, NOW());

-- MAIN NAVIGATION (2 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Home', 'home', 'Main event feed', 'Home', 'Navigation', 7, 1, NOW()),
(@template_id, 'Search Events', 'search_events', 'Search and filter events', 'Search', 'Navigation', 8, 0, NOW());

-- EVENT DISCOVERY (6 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Browse Events', 'browse_events', 'Explore all events', 'Grid', 'Discovery', 9, 0, NOW()),
(@template_id, 'Event Categories', 'event_categories', 'Browse by category', 'Folder', 'Discovery', 10, 0, NOW()),
(@template_id, 'Nearby Events', 'nearby_events', 'Events near you', 'MapPin', 'Discovery', 11, 0, NOW()),
(@template_id, 'Featured Events', 'featured_events', 'Highlighted events', 'Star', 'Discovery', 12, 0, NOW()),
(@template_id, 'Trending Events', 'trending_events', 'Popular events', 'TrendingUp', 'Discovery', 13, 0, NOW()),
(@template_id, 'For You', 'for_you', 'Personalized recommendations', 'Heart', 'Discovery', 14, 0, NOW());

-- EVENT DETAILS (5 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Event Details', 'event_details', 'Full event information', 'FileText', 'Events', 15, 0, NOW()),
(@template_id, 'Event Gallery', 'event_gallery', 'Event photos and videos', 'Image', 'Events', 16, 0, NOW()),
(@template_id, 'Venue Information', 'venue_information', 'Venue details and map', 'MapPin', 'Events', 17, 0, NOW()),
(@template_id, 'Organizer Profile', 'organizer_profile', 'Event organizer info', 'User', 'Events', 18, 0, NOW()),
(@template_id, 'Event Reviews', 'event_reviews', 'Attendee reviews', 'Star', 'Events', 19, 0, NOW());

-- TICKET BOOKING (7 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Select Tickets', 'select_tickets', 'Choose ticket types and quantity', 'Ticket', 'Booking', 20, 0, NOW()),
(@template_id, 'Seat Selection', 'seat_selection', 'Choose seats (for seated events)', 'Grid', 'Booking', 21, 0, NOW()),
(@template_id, 'Attendee Information', 'attendee_information', 'Enter attendee details', 'Users', 'Booking', 22, 0, NOW()),
(@template_id, 'Checkout', 'checkout', 'Review and pay', 'ShoppingCart', 'Booking', 23, 0, NOW()),
(@template_id, 'Payment', 'payment', 'Payment processing', 'CreditCard', 'Booking', 24, 0, NOW()),
(@template_id, 'Booking Confirmation', 'booking_confirmation', 'Purchase confirmation', 'CheckCircle', 'Booking', 25, 0, NOW()),
(@template_id, 'Add to Calendar', 'add_to_calendar', 'Save event to calendar', 'Calendar', 'Booking', 26, 0, NOW());

-- MY TICKETS (5 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'My Tickets', 'my_tickets', 'All purchased tickets', 'Ticket', 'Tickets', 27, 0, NOW()),
(@template_id, 'Ticket Details', 'ticket_details', 'Individual ticket information', 'FileText', 'Tickets', 28, 0, NOW()),
(@template_id, 'QR Code Ticket', 'qr_code_ticket', 'Digital ticket with QR code', 'QrCode', 'Tickets', 29, 0, NOW()),
(@template_id, 'Transfer Ticket', 'transfer_ticket', 'Transfer ticket to someone', 'Send', 'Tickets', 30, 0, NOW()),
(@template_id, 'Refund Request', 'refund_request', 'Request ticket refund', 'RefreshCw', 'Tickets', 31, 0, NOW());

-- CHECK-IN (2 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Check-In', 'check_in', 'Event check-in screen', 'CheckCircle', 'CheckIn', 32, 0, NOW()),
(@template_id, 'Scan QR Code', 'scan_qr_code', 'Scan ticket QR code', 'Camera', 'CheckIn', 33, 0, NOW());

-- SOCIAL & COMMUNITY (4 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Event Feed', 'event_feed', 'Social feed for event', 'MessageCircle', 'Social', 34, 0, NOW()),
(@template_id, 'Attendees', 'attendees', 'See who else is going', 'Users', 'Social', 35, 0, NOW()),
(@template_id, 'Share Event', 'share_event', 'Share with friends', 'Share', 'Social', 36, 0, NOW()),
(@template_id, 'Invite Friends', 'invite_friends', 'Invite contacts', 'UserPlus', 'Social', 37, 0, NOW());

-- FAVORITES & INTERESTS (3 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Favorites', 'favorites', 'Saved events', 'Heart', 'Favorites', 38, 0, NOW()),
(@template_id, 'Interests', 'interests', 'Select event interests', 'Tag', 'Favorites', 39, 0, NOW()),
(@template_id, 'Following', 'following', 'Followed organizers and venues', 'Bell', 'Favorites', 40, 0, NOW());

-- CALENDAR & REMINDERS (2 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Event Calendar', 'event_calendar', 'Calendar view of events', 'Calendar', 'Calendar', 41, 0, NOW()),
(@template_id, 'Reminders', 'reminders', 'Event reminders', 'Bell', 'Calendar', 42, 0, NOW());

-- NOTIFICATIONS (1 screen)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Notifications', 'notifications', 'All notifications', 'Bell', 'Notifications', 43, 0, NOW());

-- PROFILE & SETTINGS (4 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'User Profile', 'user_profile', 'View profile', 'User', 'Profile', 44, 0, NOW()),
(@template_id, 'Edit Profile', 'edit_profile', 'Update profile', 'Edit', 'Profile', 45, 0, NOW()),
(@template_id, 'Settings', 'settings', 'App preferences', 'Settings', 'Settings', 46, 0, NOW()),
(@template_id, 'Payment Methods', 'payment_methods', 'Manage payment options', 'CreditCard', 'Settings', 47, 0, NOW());

-- SUPPORT & INFORMATION (3 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Help Center', 'help_center', 'FAQ and support', 'HelpCircle', 'Support', 48, 0, NOW()),
(@template_id, 'Contact Us', 'contact_us', 'Contact support', 'Mail', 'Support', 49, 0, NOW()),
(@template_id, 'About Us', 'about_us', 'App information', 'Info', 'Information', 50, 0, NOW()),
(@template_id, 'Terms of Service', 'terms_of_service', 'Legal terms', 'FileText', 'Legal', 51, 0, NOW()),
(@template_id, 'Privacy Policy', 'privacy_policy', 'Privacy policy', 'Shield', 'Legal', 52, 0, NOW());

-- ============================================
-- VERIFICATION
-- ============================================

SELECT 
    t.id,
    t.name,
    t.category,
    COUNT(ts.id) as screen_count
FROM app_templates t
LEFT JOIN app_template_screens ts ON t.id = ts.template_id
WHERE t.id = @template_id
GROUP BY t.id, t.name, t.category;

SELECT 'Event Booking & Ticketing Template created successfully!' as message,
       @template_id as template_id,
       COUNT(*) as total_screens
FROM app_template_screens
WHERE template_id = @template_id;
