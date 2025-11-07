-- ============================================
-- Dating/Social App Template
-- Migration: 022
-- Created: Nov 7, 2025
-- Description: Complete template for dating and social connection apps
--              (like Tinder, Bumble, Hinge, Match, OkCupid)
-- ============================================

-- Create the Dating App Template
INSERT INTO app_templates (name, description, category, icon, is_active, created_at) VALUES
('Dating & Social Connection', 'Complete template for dating and social connection applications. Includes profile matching, swiping, messaging, video calls, and safety features.', 'Social', 'Heart', 1, NOW());

SET @template_id = LAST_INSERT_ID();

-- ============================================
-- ADD SCREENS TO TEMPLATE
-- ============================================

-- AUTHENTICATION & ONBOARDING (8 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Splash Screen', 'splash_screen', 'App logo', 'Zap', 'Onboarding', 1, 0, NOW()),
(@template_id, 'Onboarding', 'onboarding', 'Dating app introduction', 'BookOpen', 'Onboarding', 2, 0, NOW()),
(@template_id, 'Login', 'login', 'User login', 'LogIn', 'Authentication', 3, 0, NOW()),
(@template_id, 'Sign Up', 'sign_up', 'Create account', 'UserPlus', 'Authentication', 4, 0, NOW()),
(@template_id, 'Phone Verification', 'phone_verification', 'Verify phone number', 'Smartphone', 'Authentication', 5, 0, NOW()),
(@template_id, 'Email Verification', 'email_verification', 'Verify email', 'Mail', 'Authentication', 6, 0, NOW()),
(@template_id, 'Profile Creation', 'profile_creation', 'Build your profile', 'User', 'Onboarding', 7, 0, NOW()),
(@template_id, 'Photo Upload', 'photo_upload', 'Add profile photos', 'Image', 'Onboarding', 8, 0, NOW());

-- MAIN DISCOVERY (3 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Discover', 'discover', 'Swipe through profiles', 'Users', 'Discovery', 9, 1, NOW()),
(@template_id, 'Profile Card', 'profile_card', 'View profile details', 'User', 'Discovery', 10, 0, NOW()),
(@template_id, 'Filters', 'filters', 'Set discovery preferences', 'SlidersHorizontal', 'Discovery', 11, 0, NOW());

-- MATCHES (4 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Matches', 'matches', 'Your matches', 'Heart', 'Matches', 12, 0, NOW()),
(@template_id, 'New Match', 'new_match', 'Match notification', 'Sparkles', 'Matches', 13, 0, NOW()),
(@template_id, 'Match Profile', 'match_profile', 'View match details', 'User', 'Matches', 14, 0, NOW()),
(@template_id, 'Icebreakers', 'icebreakers', 'Conversation starters', 'MessageCircle', 'Matches', 15, 0, NOW());

-- MESSAGING (5 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Messages', 'messages', 'All conversations', 'MessageCircle', 'Messaging', 16, 0, NOW()),
(@template_id, 'Chat', 'chat', 'One-on-one chat', 'MessageSquare', 'Messaging', 17, 0, NOW()),
(@template_id, 'Voice Call', 'voice_call', 'Audio call', 'Phone', 'Messaging', 18, 0, NOW()),
(@template_id, 'Video Call', 'video_call', 'Video call', 'Video', 'Messaging', 19, 0, NOW()),
(@template_id, 'Send Gift', 'send_gift', 'Send virtual gift', 'Gift', 'Messaging', 20, 0, NOW());

-- LIKES & ACTIVITY (3 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Likes You', 'likes_you', 'See who liked you', 'Heart', 'Activity', 21, 0, NOW()),
(@template_id, 'Your Likes', 'your_likes', 'People you liked', 'ThumbsUp', 'Activity', 22, 0, NOW()),
(@template_id, 'Activity Feed', 'activity_feed', 'Recent activity', 'Activity', 'Activity', 23, 0, NOW());

-- PROFILE MANAGEMENT (6 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'My Profile', 'my_profile', 'View your profile', 'User', 'Profile', 24, 0, NOW()),
(@template_id, 'Edit Profile', 'edit_profile', 'Update profile information', 'Edit', 'Profile', 25, 0, NOW()),
(@template_id, 'Edit Photos', 'edit_photos', 'Manage profile photos', 'Image', 'Profile', 26, 0, NOW()),
(@template_id, 'Profile Preview', 'profile_preview', 'See how others see you', 'Eye', 'Profile', 27, 0, NOW()),
(@template_id, 'Profile Verification', 'profile_verification', 'Verify your profile', 'CheckCircle', 'Profile', 28, 0, NOW()),
(@template_id, 'Profile Prompts', 'profile_prompts', 'Answer profile questions', 'MessageSquare', 'Profile', 29, 0, NOW());

-- PREFERENCES (3 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Dating Preferences', 'dating_preferences', 'Set match criteria', 'Heart', 'Preferences', 30, 0, NOW()),
(@template_id, 'Location Settings', 'location_settings', 'Set search radius', 'MapPin', 'Preferences', 31, 0, NOW()),
(@template_id, 'Deal Breakers', 'deal_breakers', 'Set must-haves and deal breakers', 'X', 'Preferences', 32, 0, NOW());

-- PREMIUM FEATURES (4 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Premium Plans', 'premium_plans', 'Subscription options', 'Star', 'Premium', 33, 0, NOW()),
(@template_id, 'Boost Profile', 'boost_profile', 'Increase visibility', 'TrendingUp', 'Premium', 34, 0, NOW()),
(@template_id, 'Super Likes', 'super_likes', 'Stand out with super likes', 'Sparkles', 'Premium', 35, 0, NOW()),
(@template_id, 'Rewind', 'rewind', 'Undo last swipe', 'RotateCcw', 'Premium', 36, 0, NOW());

-- SAFETY & REPORTING (4 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Safety Center', 'safety_center', 'Safety tips and resources', 'Shield', 'Safety', 37, 0, NOW()),
(@template_id, 'Report User', 'report_user', 'Report inappropriate behavior', 'AlertTriangle', 'Safety', 38, 0, NOW()),
(@template_id, 'Block User', 'block_user', 'Block and unmatch', 'Ban', 'Safety', 39, 0, NOW()),
(@template_id, 'Safety Tips', 'safety_tips', 'Dating safety guidelines', 'Info', 'Safety', 40, 0, NOW());

-- EVENTS & SOCIAL (3 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Events', 'events', 'Local dating events', 'Calendar', 'Social', 41, 0, NOW()),
(@template_id, 'Group Activities', 'group_activities', 'Group meetups', 'Users', 'Social', 42, 0, NOW()),
(@template_id, 'Date Ideas', 'date_ideas', 'Suggested date activities', 'Lightbulb', 'Social', 43, 0, NOW());

-- NOTIFICATIONS (1 screen)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Notifications', 'notifications', 'All notifications', 'Bell', 'Notifications', 44, 0, NOW());

-- SETTINGS (5 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Settings', 'settings', 'App settings', 'Settings', 'Settings', 45, 0, NOW()),
(@template_id, 'Notification Settings', 'notification_settings', 'Manage notifications', 'Bell', 'Settings', 46, 0, NOW()),
(@template_id, 'Privacy Settings', 'privacy_settings', 'Control privacy', 'Lock', 'Settings', 47, 0, NOW()),
(@template_id, 'Account Settings', 'account_settings', 'Manage account', 'User', 'Settings', 48, 0, NOW()),
(@template_id, 'Subscription Management', 'subscription_management', 'Manage subscription', 'CreditCard', 'Settings', 49, 0, NOW());

-- SUPPORT & INFORMATION (4 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Help Center', 'help_center', 'FAQ and support', 'HelpCircle', 'Support', 50, 0, NOW()),
(@template_id, 'Contact Us', 'contact_us', 'Contact support', 'Mail', 'Support', 51, 0, NOW()),
(@template_id, 'About Us', 'about_us', 'App information', 'Info', 'Information', 52, 0, NOW()),
(@template_id, 'Terms of Service', 'terms_of_service', 'Legal terms', 'FileText', 'Legal', 53, 0, NOW()),
(@template_id, 'Privacy Policy', 'privacy_policy', 'Privacy policy', 'Shield', 'Legal', 54, 0, NOW());

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

SELECT 'Dating & Social Connection Template created successfully!' as message,
       @template_id as template_id,
       COUNT(*) as total_screens
FROM app_template_screens
WHERE template_id = @template_id;
