-- Migration: Populate Real Estate App Template (ID: 5)
-- Makes Template 5 fully functional like Template 9 (Property Rental)
-- Date: 2025-12-09

-- ========================================
-- STEP 1: Update Template Metadata
-- ========================================
UPDATE app_templates SET 
  description = 'Complete real estate marketplace for buying, selling, and renting properties with agent profiles, property listings, inquiry management, and virtual tours',
  icon = 'Building',
  updated_at = NOW()
WHERE id = 5;

-- ========================================
-- STEP 2: Create Roles
-- ========================================
INSERT INTO app_template_roles (template_id, name, display_name, description, is_default, created_at) VALUES
(5, 'buyer', 'Buyer', 'Browse properties, save favorites, schedule showings, and submit inquiries', 1, NOW()),
(5, 'seller', 'Seller', 'List properties for sale or rent, manage inquiries, and track interest', 0, NOW()),
(5, 'agent', 'Agent', 'Real estate agent - manage listings, connect buyers and sellers, handle transactions', 0, NOW());

-- Store role IDs for later use
SET @buyer_role_id = (SELECT id FROM app_template_roles WHERE template_id = 5 AND name = 'buyer');
SET @seller_role_id = (SELECT id FROM app_template_roles WHERE template_id = 5 AND name = 'seller');
SET @agent_role_id = (SELECT id FROM app_template_roles WHERE template_id = 5 AND name = 'agent');

-- ========================================
-- STEP 3: Create Menus
-- ========================================
INSERT INTO app_template_menus (template_id, name, menu_type, icon, description, is_active, created_at) VALUES
(5, 'Buyer Tab Bar', 'tabbar', 'menu', 'Bottom navigation for property browsing', 1, NOW()),
(5, 'Buyer Menu', 'sidebar_left', 'menu', 'Buyer sidebar menu', 1, NOW()),
(5, 'Agent Menu', 'sidebar_left', 'menu', 'Agent and seller sidebar menu', 1, NOW()),
(5, 'Legal', 'sidebar_right', 'menu', 'Legal pages sidebar', 1, NOW());

-- Store menu IDs for later use
SET @buyer_tabbar_id = (SELECT id FROM app_template_menus WHERE template_id = 5 AND name = 'Buyer Tab Bar');
SET @buyer_sidebar_id = (SELECT id FROM app_template_menus WHERE template_id = 5 AND name = 'Buyer Menu');
SET @agent_sidebar_id = (SELECT id FROM app_template_menus WHERE template_id = 5 AND name = 'Agent Menu');
SET @legal_sidebar_id = (SELECT id FROM app_template_menus WHERE template_id = 5 AND name = 'Legal');

-- ========================================
-- STEP 4: Update Existing Screens with screen_id
-- Link template screens to master screens
-- ========================================

-- Authentication & Onboarding screens
UPDATE app_template_screens SET screen_id = 101, screen_category = 'Onboarding' WHERE template_id = 5 AND screen_key = 'splash_screen';
UPDATE app_template_screens SET screen_id = 18, screen_category = 'Authentication' WHERE template_id = 5 AND screen_key = 'login';
UPDATE app_template_screens SET screen_id = 102, screen_category = 'Authentication' WHERE template_id = 5 AND screen_key = 'sign_up';
UPDATE app_template_screens SET screen_id = 104, screen_category = 'Authentication' WHERE template_id = 5 AND screen_key = 'email_verification';
UPDATE app_template_screens SET screen_id = 103, screen_category = 'Authentication' WHERE template_id = 5 AND screen_key = 'forgot_password';

-- Main screens
UPDATE app_template_screens SET screen_id = 112, screen_name = 'Search Properties', screen_category = 'Search' WHERE template_id = 5 AND screen_key = 'home';
UPDATE app_template_screens SET screen_id = 96, screen_category = 'Property' WHERE template_id = 5 AND screen_key = 'property_listings';
UPDATE app_template_screens SET screen_id = 97, screen_category = 'Property' WHERE template_id = 5 AND screen_key = 'property_details';
UPDATE app_template_screens SET screen_id = 135, screen_category = 'Favorites' WHERE template_id = 5 AND screen_key = 'favorites';

-- Profile screens
UPDATE app_template_screens SET screen_id = 105, screen_category = 'Profile' WHERE template_id = 5 AND screen_key = 'user_profile';
UPDATE app_template_screens SET screen_id = 106, screen_category = 'Profile' WHERE template_id = 5 AND screen_key = 'edit_profile';

-- Notifications
UPDATE app_template_screens SET screen_id = 107, screen_category = 'Notifications' WHERE template_id = 5 AND screen_key = 'notifications';

-- Legal & Info screens
UPDATE app_template_screens SET screen_id = 110, screen_category = 'Legal' WHERE template_id = 5 AND screen_key = 'privacy_policy';
UPDATE app_template_screens SET screen_id = 111, screen_category = 'Legal' WHERE template_id = 5 AND screen_key = 'terms_of_service';
UPDATE app_template_screens SET screen_id = 108, screen_category = 'Information' WHERE template_id = 5 AND screen_key = 'contact_us';
UPDATE app_template_screens SET screen_id = 109, screen_category = 'Information' WHERE template_id = 5 AND screen_key = 'about_us';

-- Remove screens that don't have master screen equivalents (will add proper ones)
DELETE FROM app_template_screens WHERE template_id = 5 AND screen_key IN ('reset_password', 'map_view', 'settings');

-- ========================================
-- STEP 5: Add Additional Screens
-- Reusing master screens from Template 9
-- ========================================

-- Get current max display_order
SET @max_order = (SELECT COALESCE(MAX(display_order), 20) FROM app_template_screens WHERE template_id = 5);

INSERT INTO app_template_screens (template_id, screen_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
-- Communication screens
(5, 116, 'Messages', 'messages', 'View your conversations with agents and sellers', 'MessageSquare', 'Communication', @max_order + 1, 0, NOW()),
(5, 117, 'Chat', 'chat', 'Chat with agents and sellers', 'MessageCircle', 'Communication', @max_order + 2, 0, NOW()),

-- Agent/Seller screens
(5, 131, 'Agent Dashboard', 'agent_dashboard', 'Overview of listings, inquiries, and activity', 'LayoutDashboard', 'Agent', @max_order + 3, 0, NOW()),
(5, 129, 'My Listings', 'my_listings', 'Manage your property listings', 'Building', 'Agent', @max_order + 4, 0, NOW()),
(5, 127, 'Create Listing', 'create_listing', 'Create a new property listing', 'PlusCircle', 'Agent', @max_order + 5, 0, NOW()),
(5, 130, 'Edit Listing', 'edit_listing', 'Edit property listing details', 'Edit', 'Agent', @max_order + 6, 0, NOW()),
(5, 132, 'Property Inquiries', 'property_inquiries', 'Manage inquiries from potential buyers', 'ClipboardList', 'Agent', @max_order + 7, 0, NOW()),
(5, 133, 'Earnings', 'earnings', 'View commission and earnings', 'DollarSign', 'Agent', @max_order + 8, 0, NOW()),

-- Buyer screens
(5, 114, 'Saved Properties', 'saved_properties', 'Properties you have saved', 'Heart', 'Buyer', @max_order + 9, 0, NOW()),
(5, 113, 'Schedule Showing', 'schedule_showing', 'Request a property showing', 'Calendar', 'Buyer', @max_order + 10, 0, NOW()),
(5, 115, 'My Inquiries', 'my_inquiries', 'Track your property inquiries', 'FileText', 'Buyer', @max_order + 11, 0, NOW()),

-- Agent Profile
(5, 98, 'Agent Profile', 'agent_profile', 'View agent information and listings', 'User', 'Profile', @max_order + 12, 0, NOW()),

-- Logout
(5, 128, 'Logout', 'logout', 'Sign out of your account', 'LogOut', 'Authentication', @max_order + 13, 0, NOW()),

-- Additional info screens
(5, 139, 'Customer Service', 'customer_service', 'Get help and support', 'Headphones', 'Information', @max_order + 14, 0, NOW());

-- ========================================
-- STEP 6: Create Menu Items
-- ========================================

-- Buyer Tab Bar Items
INSERT INTO app_template_menu_items (template_menu_id, screen_id, label, icon, item_type, display_order, is_active, created_at) VALUES
(@buyer_tabbar_id, 112, '__NO_LABEL__', 'home-outline', 'screen', 1, 1, NOW()),
(@buyer_tabbar_id, 135, '__NO_LABEL__', 'heart-outline', 'screen', 2, 1, NOW()),
(@buyer_tabbar_id, 116, '__NO_LABEL__', 'email-outline', 'screen', 3, 1, NOW()),
(@buyer_tabbar_id, 105, '__NO_LABEL__', 'account-outline', 'screen', 4, 1, NOW()),
(@buyer_tabbar_id, NULL, '__NO_LABEL__', 'menu', 'sidebar', 5, 1, NOW());

-- Buyer Sidebar Items
INSERT INTO app_template_menu_items (template_menu_id, screen_id, label, icon, item_type, display_order, is_active, created_at) VALUES
(@buyer_sidebar_id, 112, 'Search', 'magnify', 'screen', 1, 1, NOW()),
(@buyer_sidebar_id, 96, 'Browse Listings', 'home-city-outline', 'screen', 2, 1, NOW()),
(@buyer_sidebar_id, 135, 'Favorites', 'heart-outline', 'screen', 3, 1, NOW()),
(@buyer_sidebar_id, 105, 'Profile', 'account-outline', 'screen', 4, 1, NOW()),
(@buyer_sidebar_id, 107, 'Notifications', 'bell-outline', 'screen', 5, 1, NOW()),
(@buyer_sidebar_id, 116, 'Messages', 'email-outline', 'screen', 6, 1, NOW()),
(@buyer_sidebar_id, 109, 'About Us', 'information-outline', 'screen', 7, 1, NOW()),
(@buyer_sidebar_id, 108, 'Contact Us', 'phone-outline', 'screen', 8, 1, NOW()),
(@buyer_sidebar_id, 139, 'Customer Service', 'headphones', 'screen', 9, 1, NOW()),
(@buyer_sidebar_id, 110, 'Privacy Policy', 'shield-check-outline', 'screen', 10, 1, NOW()),
(@buyer_sidebar_id, 111, 'Terms of Service', 'file-document-outline', 'screen', 11, 1, NOW()),
(@buyer_sidebar_id, 128, 'Logout', 'logout', 'screen', 12, 1, NOW());

-- Agent Sidebar Items
INSERT INTO app_template_menu_items (template_menu_id, screen_id, label, icon, item_type, display_order, is_active, created_at) VALUES
(@agent_sidebar_id, 131, 'Dashboard', 'view-dashboard', 'screen', 1, 1, NOW()),
(@agent_sidebar_id, 129, 'My Listings', 'home-group', 'screen', 2, 1, NOW()),
(@agent_sidebar_id, 127, 'Create Listing', 'plus-circle-outline', 'screen', 3, 1, NOW()),
(@agent_sidebar_id, 132, 'Inquiries', 'clipboard-list-outline', 'screen', 4, 1, NOW()),
(@agent_sidebar_id, 133, 'Earnings', 'cash-multiple', 'screen', 5, 1, NOW()),
(@agent_sidebar_id, 112, 'Search', 'magnify', 'screen', 6, 1, NOW()),
(@agent_sidebar_id, 105, 'Profile', 'account-outline', 'screen', 7, 1, NOW()),
(@agent_sidebar_id, 107, 'Notifications', 'bell-outline', 'screen', 8, 1, NOW()),
(@agent_sidebar_id, 116, 'Messages', 'email-outline', 'screen', 9, 1, NOW()),
(@agent_sidebar_id, 108, 'Contact Us', 'phone-outline', 'screen', 10, 1, NOW()),
(@agent_sidebar_id, 109, 'About Us', 'information-outline', 'screen', 11, 1, NOW()),
(@agent_sidebar_id, 128, 'Logout', 'logout', 'screen', 12, 1, NOW());

-- Legal Sidebar Items
INSERT INTO app_template_menu_items (template_menu_id, screen_id, label, icon, item_type, display_order, is_active, created_at) VALUES
(@legal_sidebar_id, 110, 'Privacy Policy', 'shield-check', 'screen', 1, 1, NOW()),
(@legal_sidebar_id, 111, 'Terms of Service', 'file-document', 'screen', 2, 1, NOW());

-- ========================================
-- STEP 7: Create Menu Role Access
-- ========================================
INSERT INTO app_template_menu_role_access (template_menu_id, template_role_id, created_at) VALUES
-- Buyer Tab Bar - accessible by buyer
(@buyer_tabbar_id, @buyer_role_id, NOW()),
-- Buyer Sidebar - accessible by buyer
(@buyer_sidebar_id, @buyer_role_id, NOW()),
-- Agent Sidebar - accessible by seller and agent
(@agent_sidebar_id, @seller_role_id, NOW()),
(@agent_sidebar_id, @agent_role_id, NOW()),
-- Legal - accessible by all
(@legal_sidebar_id, @buyer_role_id, NOW()),
(@legal_sidebar_id, @seller_role_id, NOW()),
(@legal_sidebar_id, @agent_role_id, NOW());

-- ========================================
-- STEP 8: Create Screen Role Access
-- ========================================
INSERT INTO app_template_screen_role_access (template_id, screen_id, template_role_id, can_access, created_at) VALUES
-- Public screens (all roles)
(5, 101, @buyer_role_id, 1, NOW()),  -- Splash
(5, 112, @buyer_role_id, 1, NOW()),  -- Search Properties
(5, 112, @seller_role_id, 1, NOW()),
(5, 112, @agent_role_id, 1, NOW()),
(5, 96, @buyer_role_id, 1, NOW()),   -- Property Listings
(5, 96, @seller_role_id, 1, NOW()),
(5, 96, @agent_role_id, 1, NOW()),
(5, 97, @buyer_role_id, 1, NOW()),   -- Property Details
(5, 97, @seller_role_id, 1, NOW()),
(5, 97, @agent_role_id, 1, NOW()),
(5, 135, @buyer_role_id, 1, NOW()),  -- Favorites
(5, 135, @seller_role_id, 1, NOW()),
(5, 135, @agent_role_id, 1, NOW()),

-- Communication (buyer, seller, agent)
(5, 116, @buyer_role_id, 1, NOW()),  -- Messages
(5, 116, @seller_role_id, 1, NOW()),
(5, 116, @agent_role_id, 1, NOW()),
(5, 117, @buyer_role_id, 1, NOW()),  -- Chat
(5, 117, @seller_role_id, 1, NOW()),
(5, 117, @agent_role_id, 1, NOW()),

-- Buyer-specific screens
(5, 113, @buyer_role_id, 1, NOW()),  -- Schedule Showing
(5, 114, @buyer_role_id, 1, NOW()),  -- Saved Properties
(5, 115, @buyer_role_id, 1, NOW()),  -- My Inquiries

-- Agent/Seller screens
(5, 131, @seller_role_id, 1, NOW()), -- Agent Dashboard
(5, 131, @agent_role_id, 1, NOW()),
(5, 129, @seller_role_id, 1, NOW()), -- My Listings
(5, 129, @agent_role_id, 1, NOW()),
(5, 127, @seller_role_id, 1, NOW()), -- Create Listing
(5, 127, @agent_role_id, 1, NOW()),
(5, 130, @seller_role_id, 1, NOW()), -- Edit Listing
(5, 130, @agent_role_id, 1, NOW()),
(5, 132, @seller_role_id, 1, NOW()), -- Property Inquiries
(5, 132, @agent_role_id, 1, NOW()),
(5, 133, @agent_role_id, 1, NOW()),  -- Earnings (agent only)

-- Logout (all authenticated)
(5, 128, @buyer_role_id, 1, NOW()),
(5, 128, @seller_role_id, 1, NOW()),
(5, 128, @agent_role_id, 1, NOW());

-- ========================================
-- STEP 9: Create Screen Menu Assignments
-- ========================================
INSERT INTO app_template_screen_menu_assignments (template_id, screen_id, template_menu_id, created_at) VALUES
-- Buyer screens with buyer menus
(5, 112, @buyer_tabbar_id, NOW()),  -- Search
(5, 112, @buyer_sidebar_id, NOW()),
(5, 96, @buyer_tabbar_id, NOW()),   -- Property Listings
(5, 96, @buyer_sidebar_id, NOW()),
(5, 97, @buyer_tabbar_id, NOW()),   -- Property Details
(5, 97, @buyer_sidebar_id, NOW()),
(5, 135, @buyer_tabbar_id, NOW()),  -- Favorites
(5, 135, @buyer_sidebar_id, NOW()),
(5, 105, @buyer_tabbar_id, NOW()),  -- User Profile
(5, 105, @buyer_sidebar_id, NOW()),
(5, 105, @agent_sidebar_id, NOW()),
(5, 105, @legal_sidebar_id, NOW()),
(5, 107, @buyer_sidebar_id, NOW()), -- Notifications
(5, 107, @agent_sidebar_id, NOW()),
(5, 116, @buyer_tabbar_id, NOW()),  -- Messages
(5, 116, @buyer_sidebar_id, NOW()),
(5, 116, @agent_sidebar_id, NOW()),
(5, 108, @buyer_sidebar_id, NOW()), -- Contact Us
(5, 108, @agent_sidebar_id, NOW()),
(5, 109, @buyer_sidebar_id, NOW()), -- About Us
(5, 109, @agent_sidebar_id, NOW()),
(5, 110, @buyer_sidebar_id, NOW()), -- Privacy Policy
(5, 110, @agent_sidebar_id, NOW()),
(5, 111, @buyer_sidebar_id, NOW()), -- Terms of Service
(5, 111, @agent_sidebar_id, NOW()),

-- Agent screens with agent menu
(5, 131, @agent_sidebar_id, NOW()), -- Agent Dashboard
(5, 129, @agent_sidebar_id, NOW()), -- My Listings
(5, 127, @agent_sidebar_id, NOW()), -- Create Listing
(5, 132, @agent_sidebar_id, NOW()), -- Property Inquiries
(5, 133, @agent_sidebar_id, NOW()); -- Earnings

-- ========================================
-- STEP 10: Create Sample Users
-- ========================================
INSERT INTO app_template_users (template_id, email, password_hash, first_name, last_name, phone, bio, status, email_verified, created_at) VALUES
-- Buyers
(5, 'buyer1@realestate.com', '$2b$10$example_hash_buyer1', 'John', 'Smith', '555-0101', 'Looking for my dream home in the suburbs', 'active', 1, NOW()),
(5, 'buyer2@realestate.com', '$2b$10$example_hash_buyer2', 'Sarah', 'Johnson', '555-0102', 'First-time homebuyer interested in condos', 'active', 1, NOW()),
-- Sellers
(5, 'seller1@realestate.com', '$2b$10$example_hash_seller1', 'Michael', 'Williams', '555-0201', 'Property owner with multiple listings', 'active', 1, NOW()),
(5, 'seller2@realestate.com', '$2b$10$example_hash_seller2', 'Emily', 'Brown', '555-0202', 'Selling family home after relocation', 'active', 1, NOW()),
-- Agents
(5, 'agent1@realestate.com', '$2b$10$example_hash_agent1', 'David', 'Miller', '555-0301', 'Licensed real estate agent with 10 years experience', 'active', 1, NOW()),
(5, 'agent2@realestate.com', '$2b$10$example_hash_agent2', 'Jennifer', 'Davis', '555-0302', 'Specializing in luxury properties and commercial real estate', 'active', 1, NOW());

-- ========================================
-- STEP 11: Create User Role Assignments
-- ========================================
SET @buyer1_id = (SELECT id FROM app_template_users WHERE template_id = 5 AND email = 'buyer1@realestate.com');
SET @buyer2_id = (SELECT id FROM app_template_users WHERE template_id = 5 AND email = 'buyer2@realestate.com');
SET @seller1_id = (SELECT id FROM app_template_users WHERE template_id = 5 AND email = 'seller1@realestate.com');
SET @seller2_id = (SELECT id FROM app_template_users WHERE template_id = 5 AND email = 'seller2@realestate.com');
SET @agent1_id = (SELECT id FROM app_template_users WHERE template_id = 5 AND email = 'agent1@realestate.com');
SET @agent2_id = (SELECT id FROM app_template_users WHERE template_id = 5 AND email = 'agent2@realestate.com');

INSERT INTO app_template_user_role_assignments (template_user_id, template_role_id, created_at) VALUES
(@buyer1_id, @buyer_role_id, NOW()),
(@buyer2_id, @buyer_role_id, NOW()),
(@seller1_id, @seller_role_id, NOW()),
(@seller2_id, @seller_role_id, NOW()),
(@agent1_id, @agent_role_id, NOW()),
(@agent2_id, @agent_role_id, NOW());

-- ========================================
-- STEP 12: Create Sample Property Listings
-- Using existing property_listings structure but for sale/rent
-- ========================================
INSERT INTO app_template_property_listings (
  template_id, template_user_id, title, description, property_type,
  address_line1, city, state, country, postal_code,
  latitude, longitude, bedrooms, bathrooms, beds, guests_max, square_feet,
  price_per_night, currency, status, is_published, created_at
) VALUES
-- Properties for sale (using price_per_night as sale price / 1000 for demo)
(5, @agent1_id, 'Modern Downtown Condo with City Views', 'Stunning 2-bedroom condo in the heart of downtown with panoramic city views, modern finishes, and premium amenities.', 'condo',
 '123 Main Street', 'Knoxville', 'TN', 'USA', '37902',
 35.9606, -83.9207, 2, 2, 0, 0, 1200,
 325.00, 'USD', 'active', 1, NOW()),

(5, @agent1_id, 'Spacious Family Home in West Knoxville', 'Beautiful 4-bedroom family home with large backyard, updated kitchen, and excellent school district.', 'house',
 '456 Oak Avenue', 'Knoxville', 'TN', 'USA', '37919',
 35.9456, -84.0287, 4, 3, 0, 0, 2800,
 485.00, 'USD', 'active', 1, NOW()),

(5, @agent2_id, 'Luxury Waterfront Estate', 'Magnificent 5-bedroom estate on the Tennessee River with private dock, infinity pool, and breathtaking views.', 'villa',
 '789 Riverfront Drive', 'Knoxville', 'TN', 'USA', '37920',
 35.9356, -83.8907, 5, 4, 0, 0, 5500,
 1250.00, 'USD', 'active', 1, NOW()),

(5, @agent2_id, 'Charming Historic Bungalow', 'Beautifully restored 1920s bungalow in Fourth & Gill with original hardwood floors and modern updates.', 'house',
 '321 Luttrell Street', 'Knoxville', 'TN', 'USA', '37917',
 35.9756, -83.9107, 3, 2, 0, 0, 1800,
 295.00, 'USD', 'active', 1, NOW()),

(5, @seller1_id, 'Investment Property - Duplex', 'Well-maintained duplex with two 2-bedroom units, great rental history, and positive cash flow.', 'townhouse',
 '555 Investment Lane', 'Knoxville', 'TN', 'USA', '37916',
 35.9506, -83.9307, 4, 2, 0, 0, 2200,
 275.00, 'USD', 'active', 1, NOW()),

(5, @seller2_id, 'Cozy Starter Home', 'Perfect starter home with 3 bedrooms, updated bathroom, and fenced backyard. Move-in ready!', 'house',
 '888 Starter Street', 'Knoxville', 'TN', 'USA', '37918',
 35.9656, -83.9407, 3, 1, 0, 0, 1400,
 185.00, 'USD', 'active', 1, NOW()),

(5, @agent1_id, 'Luxury High-Rise Apartment', 'Premium penthouse apartment with floor-to-ceiling windows, concierge service, and rooftop access.', 'apartment',
 '100 Tower Place', 'Knoxville', 'TN', 'USA', '37902',
 35.9626, -83.9187, 2, 2, 0, 0, 1600,
 425.00, 'USD', 'active', 1, NOW()),

(5, @agent2_id, 'Mountain View Cabin', 'Rustic yet modern cabin in the Smoky Mountain foothills with stunning views and complete privacy.', 'cabin',
 '999 Mountain Road', 'Sevierville', 'TN', 'USA', '37862',
 35.8656, -83.5607, 3, 2, 0, 0, 2000,
 375.00, 'USD', 'active', 1, NOW());

-- ========================================
-- STEP 13: Create Property Images
-- ========================================
SET @listing1_id = (SELECT id FROM app_template_property_listings WHERE template_id = 5 AND title LIKE 'Modern Downtown Condo%' LIMIT 1);
SET @listing2_id = (SELECT id FROM app_template_property_listings WHERE template_id = 5 AND title LIKE 'Spacious Family Home%' LIMIT 1);
SET @listing3_id = (SELECT id FROM app_template_property_listings WHERE template_id = 5 AND title LIKE 'Luxury Waterfront%' LIMIT 1);

INSERT INTO app_template_property_images (template_listing_id, image_url, caption, display_order, is_primary, created_at) VALUES
(@listing1_id, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', 'Living Room', 1, 1, NOW()),
(@listing1_id, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', 'Kitchen', 2, 0, NOW()),
(@listing1_id, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', 'Bedroom', 3, 0, NOW()),
(@listing2_id, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800', 'Front Exterior', 1, 1, NOW()),
(@listing2_id, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800', 'Kitchen', 2, 0, NOW()),
(@listing2_id, 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800', 'Backyard', 3, 0, NOW()),
(@listing3_id, 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', 'Waterfront View', 1, 1, NOW()),
(@listing3_id, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 'Pool Area', 2, 0, NOW()),
(@listing3_id, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', 'Interior', 3, 0, NOW());

-- ========================================
-- STEP 14: Create Role Home Screens
-- ========================================
INSERT INTO app_template_role_home_screens (template_role_id, screen_id, created_at) VALUES
(@buyer_role_id, 112, NOW()),   -- Buyer home = Search Properties
(@seller_role_id, 129, NOW()),  -- Seller home = My Listings
(@agent_role_id, 131, NOW());   -- Agent home = Dashboard

-- ========================================
-- STEP 15: Verification Queries
-- ========================================
SELECT 'Template 5 Setup Complete!' as status;

SELECT 'Screens:' as info, COUNT(*) as count FROM app_template_screens WHERE template_id = 5;
SELECT 'Roles:' as info, COUNT(*) as count FROM app_template_roles WHERE template_id = 5;
SELECT 'Menus:' as info, COUNT(*) as count FROM app_template_menus WHERE template_id = 5;
SELECT 'Menu Items:' as info, COUNT(*) as count FROM app_template_menu_items WHERE template_menu_id IN (SELECT id FROM app_template_menus WHERE template_id = 5);
SELECT 'Screen Role Access:' as info, COUNT(*) as count FROM app_template_screen_role_access WHERE template_id = 5;
SELECT 'Screen Menu Assignments:' as info, COUNT(*) as count FROM app_template_screen_menu_assignments WHERE template_id = 5;
SELECT 'Users:' as info, COUNT(*) as count FROM app_template_users WHERE template_id = 5;
SELECT 'Property Listings:' as info, COUNT(*) as count FROM app_template_property_listings WHERE template_id = 5;
