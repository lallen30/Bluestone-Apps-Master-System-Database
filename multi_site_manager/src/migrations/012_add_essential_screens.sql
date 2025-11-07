-- Add missing essential screens to all templates
-- Migration 012

-- E-Commerce App (ID: 1) - Missing: Splash, Sign Up, Contact, About
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen) VALUES
(1, 'Splash Screen', 'splash_screen', 'App logo and branding', 'Zap', 'Onboarding', 0, 0),
(1, 'Sign Up', 'sign_up', 'Create new account', 'UserPlus', 'Authentication', 4, 0),
(1, 'Contact Us', 'contact_us', 'Contact form', 'Mail', 'Information', 100, 0),
(1, 'About Us', 'about_us', 'Company information', 'Info', 'Information', 101, 0);

-- Social Media App (ID: 2) - Missing: Splash, Sign Up, Contact, About
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen) VALUES
(2, 'Splash Screen', 'splash_screen', 'App logo and branding', 'Zap', 'Onboarding', 0, 0),
(2, 'Sign Up', 'sign_up', 'Create new account', 'UserPlus', 'Authentication', 4, 0),
(2, 'Contact Us', 'contact_us', 'Contact form', 'Mail', 'Information', 100, 0),
(2, 'About Us', 'about_us', 'Company information', 'Info', 'Information', 101, 0);

-- Food Delivery App (ID: 3) - Missing: Splash, Sign Up, Contact, About
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen) VALUES
(3, 'Splash Screen', 'splash_screen', 'App logo and branding', 'Zap', 'Onboarding', 0, 0),
(3, 'Sign Up', 'sign_up', 'Create new account', 'UserPlus', 'Authentication', 4, 0),
(3, 'Contact Us', 'contact_us', 'Contact form', 'Mail', 'Information', 100, 0),
(3, 'About Us', 'about_us', 'Company information', 'Info', 'Information', 101, 0);

-- Fitness Tracker (ID: 4) - Missing: Splash, Sign Up, Contact, About
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen) VALUES
(4, 'Splash Screen', 'splash_screen', 'App logo and branding', 'Zap', 'Onboarding', 0, 0),
(4, 'Sign Up', 'sign_up', 'Create new account', 'UserPlus', 'Authentication', 4, 0),
(4, 'Contact Us', 'contact_us', 'Contact form', 'Mail', 'Information', 100, 0),
(4, 'About Us', 'about_us', 'Company information', 'Info', 'Information', 101, 0);

-- Real Estate App (ID: 5) - Missing: Splash, Sign Up, Contact, About
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen) VALUES
(5, 'Splash Screen', 'splash_screen', 'App logo and branding', 'Zap', 'Onboarding', 0, 0),
(5, 'Sign Up', 'sign_up', 'Create new account', 'UserPlus', 'Authentication', 4, 0),
(5, 'Contact Us', 'contact_us', 'Contact form', 'Mail', 'Information', 100, 0),
(5, 'About Us', 'about_us', 'Company information', 'Info', 'Information', 101, 0);

-- Finance & Banking App (ID: 8) - Missing ALL
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen) VALUES
(8, 'Splash Screen', 'splash_screen', 'App logo', 'Zap', 'Onboarding', 0, 0),
(8, 'Login', 'login', 'Login screen', 'LogIn', 'Authentication', 1, 0),
(8, 'Sign Up', 'sign_up', 'Create account', 'UserPlus', 'Authentication', 2, 0),
(8, 'Forgot Password', 'forgot_password', 'Reset password', 'Key', 'Authentication', 3, 0),
(8, 'Email Verification', 'email_verification', 'Verify email', 'Mail', 'Authentication', 4, 0),
(8, 'User Profile', 'user_profile', 'View profile', 'User', 'Profile', 50, 0),
(8, 'Edit Profile', 'edit_profile', 'Edit profile', 'Edit', 'Profile', 51, 0),
(8, 'Notifications', 'notifications', 'Notifications', 'Bell', 'Notifications', 60, 0),
(8, 'Contact Us', 'contact_us', 'Contact form', 'Mail', 'Information', 100, 0),
(8, 'About Us', 'about_us', 'About', 'Info', 'Information', 101, 0),
(8, 'Privacy Policy', 'privacy_policy', 'Privacy', 'Shield', 'Legal', 102, 0),
(8, 'Terms of Service', 'terms_of_service', 'Terms', 'FileText', 'Legal', 103, 0);

-- Property Rental App (ID: 9) - Missing ALL
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen) VALUES
(9, 'Splash Screen', 'splash_screen', 'App logo', 'Zap', 'Onboarding', 0, 0),
(9, 'Login', 'login', 'Login screen', 'LogIn', 'Authentication', 1, 0),
(9, 'Sign Up', 'sign_up', 'Create account', 'UserPlus', 'Authentication', 2, 0),
(9, 'Forgot Password', 'forgot_password', 'Reset password', 'Key', 'Authentication', 3, 0),
(9, 'Email Verification', 'email_verification', 'Verify email', 'Mail', 'Authentication', 4, 0),
(9, 'User Profile', 'user_profile', 'View profile', 'User', 'Profile', 50, 0),
(9, 'Edit Profile', 'edit_profile', 'Edit profile', 'Edit', 'Profile', 51, 0),
(9, 'Notifications', 'notifications', 'Notifications', 'Bell', 'Notifications', 60, 0),
(9, 'Contact Us', 'contact_us', 'Contact form', 'Mail', 'Information', 100, 0),
(9, 'About Us', 'about_us', 'About', 'Info', 'Information', 101, 0),
(9, 'Privacy Policy', 'privacy_policy', 'Privacy', 'Shield', 'Legal', 102, 0),
(9, 'Terms of Service', 'terms_of_service', 'Terms', 'FileText', 'Legal', 103, 0);

-- Video Streaming Platform (ID: 10) - Missing ALL
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen) VALUES
(10, 'Splash Screen', 'splash_screen', 'App logo', 'Zap', 'Onboarding', 0, 0),
(10, 'Login', 'login', 'Login screen', 'LogIn', 'Authentication', 1, 0),
(10, 'Sign Up', 'sign_up', 'Create account', 'UserPlus', 'Authentication', 2, 0),
(10, 'Forgot Password', 'forgot_password', 'Reset password', 'Key', 'Authentication', 3, 0),
(10, 'Email Verification', 'email_verification', 'Verify email', 'Mail', 'Authentication', 4, 0),
(10, 'User Profile', 'user_profile', 'View profile', 'User', 'Profile', 50, 0),
(10, 'Edit Profile', 'edit_profile', 'Edit profile', 'Edit', 'Profile', 51, 0),
(10, 'Notifications', 'notifications', 'Notifications', 'Bell', 'Notifications', 60, 0),
(10, 'Contact Us', 'contact_us', 'Contact form', 'Mail', 'Information', 100, 0),
(10, 'About Us', 'about_us', 'About', 'Info', 'Information', 101, 0),
(10, 'Privacy Policy', 'privacy_policy', 'Privacy', 'Shield', 'Legal', 102, 0),
(10, 'Terms of Service', 'terms_of_service', 'Terms', 'FileText', 'Legal', 103, 0);

-- Ride Share (ID: 11) - Missing most
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen) VALUES
(11, 'Splash Screen', 'splash_screen', 'App logo', 'Zap', 'Onboarding', 0, 0),
(11, 'Login', 'login', 'Login screen', 'LogIn', 'Authentication', 1, 0),
(11, 'Sign Up', 'sign_up', 'Create account', 'UserPlus', 'Authentication', 2, 0),
(11, 'Forgot Password', 'forgot_password', 'Reset password', 'Key', 'Authentication', 3, 0),
(11, 'Email Verification', 'email_verification', 'Verify email', 'Mail', 'Authentication', 4, 0),
(11, 'Edit Profile', 'edit_profile', 'Edit profile', 'Edit', 'Profile', 51, 0),
(11, 'Notifications', 'notifications', 'Notifications', 'Bell', 'Notifications', 60, 0),
(11, 'Contact Us', 'contact_us', 'Contact form', 'Mail', 'Information', 100, 0),
(11, 'About Us', 'about_us', 'About', 'Info', 'Information', 101, 0),
(11, 'Privacy Policy', 'privacy_policy', 'Privacy', 'Shield', 'Legal', 102, 0),
(11, 'Terms of Service', 'terms_of_service', 'Terms', 'FileText', 'Legal', 103, 0);

-- Service Matching Platform (ID: 12) - Missing Forgot Password
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen) VALUES
(12, 'Forgot Password', 'forgot_password', 'Reset password', 'Key', 'Authentication', 3, 0);

-- Money Transfer App (ID: 13) - Missing Forgot Password, Contact
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen) VALUES
(13, 'Forgot Password', 'forgot_password', 'Reset password', 'Key', 'Authentication', 3, 0),
(13, 'Contact Us', 'contact_us', 'Contact form', 'Mail', 'Information', 100, 0);

SELECT 'Essential screens added to all templates!' as message;
