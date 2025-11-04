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
(1, 'Home', 'home', 'Main landing page with featured products', 'Home', 'Main', 1, TRUE),
(1, 'Products', 'products', 'Browse all products', 'ShoppingCart', 'Main', 2, FALSE),
(1, 'Product Details', 'product_details', 'Detailed product information', 'Package', 'Main', 3, FALSE),
(1, 'Cart', 'cart', 'Shopping cart', 'ShoppingCart', 'Main', 4, FALSE),
(1, 'Checkout', 'checkout', 'Order checkout and payment', 'CreditCard', 'Main', 5, FALSE),
(1, 'Profile', 'profile', 'User profile and settings', 'User', 'Account', 6, FALSE),
(1, 'Orders', 'orders', 'Order history', 'Package', 'Account', 7, FALSE);

-- Seed Social Media App Template Screens
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen) VALUES
(2, 'Feed', 'feed', 'Social media feed', 'Home', 'Main', 1, TRUE),
(2, 'Profile', 'profile', 'User profile', 'User', 'Main', 2, FALSE),
(2, 'Messages', 'messages', 'Direct messages', 'MessageSquare', 'Main', 3, FALSE),
(2, 'Notifications', 'notifications', 'Activity notifications', 'Bell', 'Main', 4, FALSE),
(2, 'Search', 'search', 'Search users and posts', 'Search', 'Main', 5, FALSE),
(2, 'Settings', 'settings', 'App settings', 'Settings', 'Account', 6, FALSE);

-- Seed Food Delivery App Template Screens
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen) VALUES
(3, 'Home', 'home', 'Restaurant discovery', 'Home', 'Main', 1, TRUE),
(3, 'Restaurant Menu', 'restaurant_menu', 'Browse restaurant menu', 'UtensilsCrossed', 'Main', 2, FALSE),
(3, 'Cart', 'cart', 'Food cart', 'ShoppingCart', 'Main', 3, FALSE),
(3, 'Checkout', 'checkout', 'Order checkout', 'CreditCard', 'Main', 4, FALSE),
(3, 'Track Order', 'track_order', 'Live order tracking', 'MapPin', 'Main', 5, FALSE),
(3, 'Order History', 'order_history', 'Past orders', 'Clock', 'Account', 6, FALSE),
(3, 'Profile', 'profile', 'User profile', 'User', 'Account', 7, FALSE);

-- Seed Fitness Tracker Template Screens
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen) VALUES
(4, 'Dashboard', 'dashboard', 'Fitness dashboard', 'LayoutDashboard', 'Main', 1, TRUE),
(4, 'Workouts', 'workouts', 'Workout library', 'Activity', 'Main', 2, FALSE),
(4, 'Nutrition', 'nutrition', 'Meal tracking', 'Apple', 'Main', 3, FALSE),
(4, 'Progress', 'progress', 'Track your progress', 'TrendingUp', 'Main', 4, FALSE),
(4, 'Profile', 'profile', 'User profile', 'User', 'Account', 5, FALSE);

-- Seed Real Estate App Template Screens
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen) VALUES
(5, 'Home', 'home', 'Property search', 'Home', 'Main', 1, TRUE),
(5, 'Property Listings', 'property_listings', 'Browse properties', 'Building', 'Main', 2, FALSE),
(5, 'Property Details', 'property_details', 'Property information', 'Building2', 'Main', 3, FALSE),
(5, 'Favorites', 'favorites', 'Saved properties', 'Heart', 'Main', 4, FALSE),
(5, 'Map View', 'map_view', 'Properties on map', 'MapPin', 'Main', 5, FALSE),
(5, 'Profile', 'profile', 'User profile', 'User', 'Account', 6, FALSE);
