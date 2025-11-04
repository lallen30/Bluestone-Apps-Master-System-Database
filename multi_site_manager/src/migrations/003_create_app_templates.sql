-- Migration: Create App Templates System
-- Description: Tables for app templates with pre-configured screens and modules
-- Created: 2025-11-04

-- App Templates table
CREATE TABLE IF NOT EXISTS app_templates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  icon VARCHAR(50) DEFAULT 'Layout',
  preview_image VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_category (category),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- App Template Screens (screens included in the template)
CREATE TABLE IF NOT EXISTS app_template_screens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  template_id INT NOT NULL,
  screen_name VARCHAR(255) NOT NULL,
  screen_key VARCHAR(100) NOT NULL,
  screen_description TEXT,
  screen_icon VARCHAR(50) DEFAULT 'Monitor',
  screen_category VARCHAR(100),
  display_order INT DEFAULT 0,
  is_home_screen BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (template_id) REFERENCES app_templates(id) ON DELETE CASCADE,
  INDEX idx_template_id (template_id),
  INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- App Template Screen Elements (modules included in template screens)
CREATE TABLE IF NOT EXISTS app_template_screen_elements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  template_screen_id INT NOT NULL,
  element_id INT NOT NULL,
  field_key VARCHAR(100) NOT NULL,
  label VARCHAR(255),
  placeholder VARCHAR(255),
  default_value TEXT,
  is_required BOOLEAN DEFAULT FALSE,
  is_readonly BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  config JSON,
  validation_rules JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (template_screen_id) REFERENCES app_template_screens(id) ON DELETE CASCADE,
  FOREIGN KEY (element_id) REFERENCES screen_elements(id) ON DELETE CASCADE,
  INDEX idx_template_screen_id (template_screen_id),
  INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed sample app templates
INSERT INTO app_templates (name, description, category, icon, is_active, created_by) VALUES
('E-Commerce App', 'Complete e-commerce solution with product catalog, cart, and checkout', 'E-Commerce', 'ShoppingCart', TRUE, 1),
('Social Media App', 'Social networking app with profiles, posts, and messaging', 'Social', 'MessageSquare', TRUE, 1),
('Food Delivery App', 'Restaurant discovery and food ordering platform', 'Food & Drink', 'UtensilsCrossed', TRUE, 1),
('Fitness Tracker', 'Health and fitness tracking with workouts and nutrition', 'Health & Fitness', 'Activity', TRUE, 1),
('Real Estate App', 'Property listings and real estate marketplace', 'Real Estate', 'Building', TRUE, 1);

-- Seed E-Commerce App Template Screens
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen) VALUES
(1, 'Splash Screen', 'splash', 'App splash screen', 'Zap', 'Auth', 1, FALSE),
(1, 'Login Screen', 'login', 'User login', 'LogIn', 'Auth', 2, FALSE),
(1, 'Sign Up', 'signup', 'User registration', 'UserPlus', 'Auth', 3, FALSE),
(1, 'Email Verification', 'email_verification', 'Verify email address', 'Mail', 'Auth', 4, FALSE),
(1, 'Forgot Password', 'forgot_password', 'Password recovery', 'Key', 'Auth', 5, FALSE),
(1, 'Reset Password', 'reset_password', 'Reset user password', 'Lock', 'Auth', 6, FALSE),
(1, 'Home', 'home', 'Main landing page with featured products', 'Home', 'Main', 7, TRUE),
(1, 'Products', 'products', 'Browse all products', 'ShoppingCart', 'Main', 8, FALSE),
(1, 'Product Details', 'product_details', 'Detailed product information', 'Package', 'Main', 9, FALSE),
(1, 'Cart', 'cart', 'Shopping cart', 'ShoppingCart', 'Main', 10, FALSE),
(1, 'Checkout', 'checkout', 'Order checkout and payment', 'CreditCard', 'Main', 11, FALSE),
(1, 'Orders', 'orders', 'Order history', 'Package', 'Account', 12, FALSE),
(1, 'User Profile', 'user_profile', 'View user profile', 'User', 'Account', 13, FALSE),
(1, 'Edit Profile', 'edit_profile', 'Edit user profile', 'Edit', 'Account', 14, FALSE),
(1, 'Notifications List', 'notifications', 'View notifications', 'Bell', 'Account', 15, FALSE),
(1, 'Settings', 'settings', 'App settings', 'Settings', 'Account', 16, FALSE),
(1, 'Privacy Policy', 'privacy_policy', 'Privacy policy', 'Shield', 'Legal', 17, FALSE),
(1, 'Terms of Service', 'terms_of_service', 'Terms and conditions', 'FileText', 'Legal', 18, FALSE),
(1, 'Contact Form', 'contact', 'Contact support', 'MessageSquare', 'Support', 19, FALSE),
(1, 'About Us', 'about', 'About the app', 'Info', 'Support', 20, FALSE);

-- Seed Social Media App Template Screens
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen) VALUES
(2, 'Splash Screen', 'splash', 'App splash screen', 'Zap', 'Auth', 1, FALSE),
(2, 'Login Screen', 'login', 'User login', 'LogIn', 'Auth', 2, FALSE),
(2, 'Sign Up', 'signup', 'User registration', 'UserPlus', 'Auth', 3, FALSE),
(2, 'Email Verification', 'email_verification', 'Verify email address', 'Mail', 'Auth', 4, FALSE),
(2, 'Forgot Password', 'forgot_password', 'Password recovery', 'Key', 'Auth', 5, FALSE),
(2, 'Reset Password', 'reset_password', 'Reset user password', 'Lock', 'Auth', 6, FALSE),
(2, 'Feed', 'feed', 'Social media feed', 'Home', 'Main', 7, TRUE),
(2, 'Search', 'search', 'Search users and posts', 'Search', 'Main', 8, FALSE),
(2, 'Messages', 'messages', 'Direct messages', 'MessageSquare', 'Main', 9, FALSE),
(2, 'User Profile', 'user_profile', 'View user profile', 'User', 'Account', 10, FALSE),
(2, 'Edit Profile', 'edit_profile', 'Edit user profile', 'Edit', 'Account', 11, FALSE),
(2, 'Notifications List', 'notifications', 'View notifications', 'Bell', 'Account', 12, FALSE),
(2, 'Settings', 'settings', 'App settings', 'Settings', 'Account', 13, FALSE),
(2, 'Privacy Policy', 'privacy_policy', 'Privacy policy', 'Shield', 'Legal', 14, FALSE),
(2, 'Terms of Service', 'terms_of_service', 'Terms and conditions', 'FileText', 'Legal', 15, FALSE),
(2, 'Contact Form', 'contact', 'Contact support', 'MessageSquare', 'Support', 16, FALSE),
(2, 'About Us', 'about', 'About the app', 'Info', 'Support', 17, FALSE);

-- Seed Food Delivery App Template Screens
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen) VALUES
(3, 'Splash Screen', 'splash', 'App splash screen', 'Zap', 'Auth', 1, FALSE),
(3, 'Login Screen', 'login', 'User login', 'LogIn', 'Auth', 2, FALSE),
(3, 'Sign Up', 'signup', 'User registration', 'UserPlus', 'Auth', 3, FALSE),
(3, 'Email Verification', 'email_verification', 'Verify email address', 'Mail', 'Auth', 4, FALSE),
(3, 'Forgot Password', 'forgot_password', 'Password recovery', 'Key', 'Auth', 5, FALSE),
(3, 'Reset Password', 'reset_password', 'Reset user password', 'Lock', 'Auth', 6, FALSE),
(3, 'Home', 'home', 'Restaurant discovery', 'Home', 'Main', 7, TRUE),
(3, 'Restaurant Menu', 'restaurant_menu', 'Browse restaurant menu', 'UtensilsCrossed', 'Main', 8, FALSE),
(3, 'Cart', 'cart', 'Food cart', 'ShoppingCart', 'Main', 9, FALSE),
(3, 'Checkout', 'checkout', 'Order checkout', 'CreditCard', 'Main', 10, FALSE),
(3, 'Track Order', 'track_order', 'Live order tracking', 'MapPin', 'Main', 11, FALSE),
(3, 'Order History', 'order_history', 'Past orders', 'Clock', 'Account', 12, FALSE),
(3, 'User Profile', 'user_profile', 'View user profile', 'User', 'Account', 13, FALSE),
(3, 'Edit Profile', 'edit_profile', 'Edit user profile', 'Edit', 'Account', 14, FALSE),
(3, 'Notifications List', 'notifications', 'View notifications', 'Bell', 'Account', 15, FALSE),
(3, 'Settings', 'settings', 'App settings', 'Settings', 'Account', 16, FALSE),
(3, 'Privacy Policy', 'privacy_policy', 'Privacy policy', 'Shield', 'Legal', 17, FALSE),
(3, 'Terms of Service', 'terms_of_service', 'Terms and conditions', 'FileText', 'Legal', 18, FALSE),
(3, 'Contact Form', 'contact', 'Contact support', 'MessageSquare', 'Support', 19, FALSE),
(3, 'About Us', 'about', 'About the app', 'Info', 'Support', 20, FALSE);

-- Seed Fitness Tracker Template Screens
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen) VALUES
(4, 'Splash Screen', 'splash', 'App splash screen', 'Zap', 'Auth', 1, FALSE),
(4, 'Login Screen', 'login', 'User login', 'LogIn', 'Auth', 2, FALSE),
(4, 'Sign Up', 'signup', 'User registration', 'UserPlus', 'Auth', 3, FALSE),
(4, 'Email Verification', 'email_verification', 'Verify email address', 'Mail', 'Auth', 4, FALSE),
(4, 'Forgot Password', 'forgot_password', 'Password recovery', 'Key', 'Auth', 5, FALSE),
(4, 'Reset Password', 'reset_password', 'Reset user password', 'Lock', 'Auth', 6, FALSE),
(4, 'Dashboard', 'dashboard', 'Fitness dashboard', 'LayoutDashboard', 'Main', 7, TRUE),
(4, 'Workouts', 'workouts', 'Workout library', 'Activity', 'Main', 8, FALSE),
(4, 'Nutrition', 'nutrition', 'Meal tracking', 'Apple', 'Main', 9, FALSE),
(4, 'Progress', 'progress', 'Track your progress', 'TrendingUp', 'Main', 10, FALSE),
(4, 'User Profile', 'user_profile', 'View user profile', 'User', 'Account', 11, FALSE),
(4, 'Edit Profile', 'edit_profile', 'Edit user profile', 'Edit', 'Account', 12, FALSE),
(4, 'Notifications List', 'notifications', 'View notifications', 'Bell', 'Account', 13, FALSE),
(4, 'Settings', 'settings', 'App settings', 'Settings', 'Account', 14, FALSE),
(4, 'Privacy Policy', 'privacy_policy', 'Privacy policy', 'Shield', 'Legal', 15, FALSE),
(4, 'Terms of Service', 'terms_of_service', 'Terms and conditions', 'FileText', 'Legal', 16, FALSE),
(4, 'Contact Form', 'contact', 'Contact support', 'MessageSquare', 'Support', 17, FALSE),
(4, 'About Us', 'about', 'About the app', 'Info', 'Support', 18, FALSE);

-- Seed Real Estate App Template Screens
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen) VALUES
(5, 'Splash Screen', 'splash', 'App splash screen', 'Zap', 'Auth', 1, FALSE),
(5, 'Login Screen', 'login', 'User login', 'LogIn', 'Auth', 2, FALSE),
(5, 'Sign Up', 'signup', 'User registration', 'UserPlus', 'Auth', 3, FALSE),
(5, 'Email Verification', 'email_verification', 'Verify email address', 'Mail', 'Auth', 4, FALSE),
(5, 'Forgot Password', 'forgot_password', 'Password recovery', 'Key', 'Auth', 5, FALSE),
(5, 'Reset Password', 'reset_password', 'Reset user password', 'Lock', 'Auth', 6, FALSE),
(5, 'Home', 'home', 'Property search', 'Home', 'Main', 7, TRUE),
(5, 'Property Listings', 'property_listings', 'Browse properties', 'Building', 'Main', 8, FALSE),
(5, 'Property Details', 'property_details', 'Property information', 'Building2', 'Main', 9, FALSE),
(5, 'Favorites', 'favorites', 'Saved properties', 'Heart', 'Main', 10, FALSE),
(5, 'Map View', 'map_view', 'Properties on map', 'MapPin', 'Main', 11, FALSE),
(5, 'User Profile', 'user_profile', 'View user profile', 'User', 'Account', 12, FALSE),
(5, 'Edit Profile', 'edit_profile', 'Edit user profile', 'Edit', 'Account', 13, FALSE),
(5, 'Notifications List', 'notifications', 'View notifications', 'Bell', 'Account', 14, FALSE),
(5, 'Settings', 'settings', 'App settings', 'Settings', 'Account', 15, FALSE),
(5, 'Privacy Policy', 'privacy_policy', 'Privacy policy', 'Shield', 'Legal', 16, FALSE),
(5, 'Terms of Service', 'terms_of_service', 'Terms and conditions', 'FileText', 'Legal', 17, FALSE),
(5, 'Contact Form', 'contact', 'Contact support', 'MessageSquare', 'Support', 18, FALSE),
(5, 'About Us', 'about', 'About the app', 'Info', 'Support', 19, FALSE);
