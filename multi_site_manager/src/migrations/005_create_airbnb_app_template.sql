-- Airbnb-Style Property Rental App Template Migration
-- Creates a comprehensive property rental/booking app template with 6 screens

-- Insert Airbnb-Style Template
INSERT INTO app_templates (name, description, category, icon, is_active, created_at)
VALUES (
  'Property Rental App',
  'Complete property rental and booking platform similar to Airbnb with property listings, detailed views, booking system, host profiles, and reviews',
  'Real Estate & Rental',
  'Home',
  1,
  NOW()
);

SET @template_id = LAST_INSERT_ID();

-- ============================================
-- SCREEN 1: Property Listing
-- ============================================
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at)
VALUES (
  @template_id,
  'Property Listings',
  'property_listings',
  'Browse available properties with filters and search',
  'Building',
  'Property',
  1,
  1,
  NOW()
);

SET @screen_id = LAST_INSERT_ID();

-- Property Listing Elements
INSERT INTO app_template_screen_elements (template_screen_id, element_id, field_key, label, placeholder, default_value, is_required, is_readonly, display_order, config, created_at)
VALUES
  -- Header
  (@screen_id, 27, 'listings_title', 'Page Title', '', 'Find Your Perfect Stay', 0, 1, 1, '{}', NOW()),
  (@screen_id, 28, 'listings_subtitle', 'Subtitle', '', 'Discover unique places to stay around the world', 0, 1, 2, '{}', NOW()),
  
  -- Search & Filters
  (@screen_id, 1, 'search_location', 'Location', 'Where are you going?', '', 0, 0, 3, '{}', NOW()),
  (@screen_id, 17, 'check_in_date', 'Check-in Date', 'Select date', '', 0, 0, 4, '{}', NOW()),
  (@screen_id, 17, 'check_out_date', 'Check-out Date', 'Select date', '', 0, 0, 5, '{}', NOW()),
  (@screen_id, 8, 'guests_count', 'Number of Guests', 'How many guests?', '1', 0, 0, 6, '{"min": 1, "max": 20}', NOW()),
  (@screen_id, 10, 'property_type', 'Property Type', 'Any type', '', 0, 0, 7, '{"options": [{"label": "Any", "value": "any"}, {"label": "Entire Place", "value": "entire"}, {"label": "Private Room", "value": "private"}, {"label": "Shared Room", "value": "shared"}]}', NOW()),
  (@screen_id, 8, 'min_price', 'Min Price', 'Min $', '', 0, 0, 8, '{"prefix": "$", "decimals": 0}', NOW()),
  (@screen_id, 8, 'max_price', 'Max Price', 'Max $', '', 0, 0, 9, '{"prefix": "$", "decimals": 0}', NOW()),
  (@screen_id, 33, 'search_button', 'Search', '', 'Search Properties', 0, 0, 10, '{"variant": "primary", "action": "search"}', NOW()),
  
  -- Results
  (@screen_id, 27, 'results_heading', 'Search Results', '', 'Available Properties', 0, 1, 11, '{"level": "h3"}', NOW()),
  (@screen_id, 28, 'properties_list', 'Properties', '', 'Properties will appear here based on your search.', 0, 1, 12, '{"type": "list"}', NOW());

-- ============================================
-- SCREEN 2: Property Details
-- ============================================
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at)
VALUES (
  @template_id,
  'Property Details',
  'property_details',
  'Detailed view of a specific property with photos, amenities, and booking options',
  'HomeIcon',
  'Property',
  2,
  0,
  NOW()
);

SET @screen_id = LAST_INSERT_ID();

-- Property Details Elements
INSERT INTO app_template_screen_elements (template_screen_id, element_id, field_key, label, placeholder, default_value, is_required, is_readonly, display_order, config, created_at)
VALUES
  -- Property Info
  (@screen_id, 27, 'property_name', 'Property Name', '', 'Luxury Beachfront Villa', 0, 1, 1, '{}', NOW()),
  (@screen_id, 28, 'property_location', 'Location', '', 'Malibu, California', 0, 1, 2, '{}', NOW()),
  (@screen_id, 28, 'property_rating', 'Rating', '', '4.9 ★ (127 reviews)', 0, 1, 3, '{}', NOW()),
  
  -- Images
  (@screen_id, 27, 'photos_heading', 'Photos', '', 'Property Photos', 0, 1, 4, '{"level": "h3"}', NOW()),
  (@screen_id, 28, 'photo_gallery', 'Photo Gallery', '', 'Property images will be displayed here.', 0, 1, 5, '{"type": "gallery"}', NOW()),
  
  -- Description
  (@screen_id, 27, 'description_heading', 'About', '', 'About This Property', 0, 1, 6, '{"level": "h3"}', NOW()),
  (@screen_id, 28, 'property_description', 'Description', '', 'Beautiful beachfront villa with stunning ocean views, private pool, and modern amenities. Perfect for families or groups looking for a luxurious getaway.', 0, 1, 7, '{}', NOW()),
  
  -- Property Details
  (@screen_id, 27, 'details_heading', 'Property Details', '', 'Details', 0, 1, 8, '{"level": "h3"}', NOW()),
  (@screen_id, 28, 'bedrooms', 'Bedrooms', '', '4 Bedrooms', 0, 1, 9, '{}', NOW()),
  (@screen_id, 28, 'bathrooms', 'Bathrooms', '', '3 Bathrooms', 0, 1, 10, '{}', NOW()),
  (@screen_id, 28, 'max_guests', 'Max Guests', '', 'Up to 8 guests', 0, 1, 11, '{}', NOW()),
  
  -- Amenities
  (@screen_id, 27, 'amenities_heading', 'Amenities', '', 'What This Place Offers', 0, 1, 12, '{"level": "h3"}', NOW()),
  (@screen_id, 28, 'amenities_list', 'Amenities', '', 'WiFi, Pool, Kitchen, Parking, Air Conditioning, Beach Access', 0, 1, 13, '{"type": "list"}', NOW()),
  
  -- Pricing
  (@screen_id, 27, 'pricing_heading', 'Pricing', '', 'Price', 0, 1, 14, '{"level": "h3"}', NOW()),
  (@screen_id, 8, 'price_per_night', 'Price Per Night', '', '450', 0, 1, 15, '{"prefix": "$", "decimals": 0}', NOW()),
  (@screen_id, 28, 'cleaning_fee', 'Cleaning Fee', '', 'Cleaning fee: $75', 0, 1, 16, '{}', NOW()),
  
  -- Actions
  (@screen_id, 33, 'book_button', 'Book Now', '', 'Reserve This Property', 0, 0, 17, '{"variant": "primary", "action": "navigate", "target": "/booking"}', NOW()),
  (@screen_id, 33, 'contact_host_button', 'Contact Host', '', 'Message Host', 0, 0, 18, '{"variant": "secondary"}', NOW());

-- ============================================
-- SCREEN 3: Booking Form
-- ============================================
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at)
VALUES (
  @template_id,
  'Booking Form',
  'booking_form',
  'Complete booking form with dates, guests, and payment information',
  'Calendar',
  'Booking',
  3,
  0,
  NOW()
);

SET @screen_id = LAST_INSERT_ID();

-- Booking Form Elements
INSERT INTO app_template_screen_elements (template_screen_id, element_id, field_key, label, placeholder, default_value, is_required, is_readonly, display_order, config, created_at)
VALUES
  -- Header
  (@screen_id, 27, 'booking_title', 'Page Title', '', 'Complete Your Booking', 0, 1, 1, '{}', NOW()),
  (@screen_id, 28, 'booking_subtitle', 'Subtitle', '', 'You\'re just a few steps away from your perfect stay', 0, 1, 2, '{}', NOW()),
  
  -- Trip Details
  (@screen_id, 27, 'trip_details_heading', 'Trip Details', '', 'Your Trip', 0, 1, 3, '{"level": "h3"}', NOW()),
  (@screen_id, 17, 'booking_check_in', 'Check-in', 'Select date', '', 1, 0, 4, '{}', NOW()),
  (@screen_id, 17, 'booking_check_out', 'Check-out', 'Select date', '', 1, 0, 5, '{}', NOW()),
  (@screen_id, 8, 'booking_guests', 'Number of Guests', 'How many guests?', '1', 1, 0, 6, '{"min": 1, "max": 20}', NOW()),
  
  -- Guest Information
  (@screen_id, 27, 'guest_info_heading', 'Guest Information', '', 'Your Information', 0, 1, 7, '{"level": "h3"}', NOW()),
  (@screen_id, 1, 'guest_first_name', 'First Name', 'Enter first name', '', 1, 0, 8, '{}', NOW()),
  (@screen_id, 1, 'guest_last_name', 'Last Name', 'Enter last name', '', 1, 0, 9, '{}', NOW()),
  (@screen_id, 5, 'guest_email', 'Email', 'Enter email', '', 1, 0, 10, '{}', NOW()),
  (@screen_id, 6, 'guest_phone', 'Phone Number', 'Enter phone', '', 1, 0, 11, '{}', NOW()),
  
  -- Special Requests
  (@screen_id, 27, 'requests_heading', 'Special Requests', '', 'Special Requests (Optional)', 0, 1, 12, '{"level": "h3"}', NOW()),
  (@screen_id, 2, 'special_requests', 'Requests', 'Any special requests?', '', 0, 0, 13, '{}', NOW()),
  
  -- Price Summary
  (@screen_id, 27, 'price_summary_heading', 'Price Summary', '', 'Price Breakdown', 0, 1, 14, '{"level": "h3"}', NOW()),
  (@screen_id, 28, 'nights_total', 'Nights Total', '', '$450 x 3 nights = $1,350', 0, 1, 15, '{}', NOW()),
  (@screen_id, 28, 'service_fee', 'Service Fee', '', 'Service fee: $135', 0, 1, 16, '{}', NOW()),
  (@screen_id, 28, 'total_price', 'Total Price', '', 'Total: $1,560', 0, 1, 17, '{}', NOW()),
  
  -- Actions
  (@screen_id, 33, 'confirm_booking_button', 'Confirm Booking', '', 'Confirm and Pay', 0, 0, 18, '{"variant": "primary", "action": "submit"}', NOW()),
  (@screen_id, 33, 'cancel_booking_button', 'Cancel', '', 'Cancel', 0, 0, 19, '{"variant": "secondary", "action": "cancel"}', NOW());

-- ============================================
-- SCREEN 4: Host Profile
-- ============================================
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at)
VALUES (
  @template_id,
  'Host Profile',
  'host_profile',
  'View host information, ratings, and other properties',
  'User',
  'Profile',
  4,
  0,
  NOW()
);

SET @screen_id = LAST_INSERT_ID();

-- Host Profile Elements
INSERT INTO app_template_screen_elements (template_screen_id, element_id, field_key, label, placeholder, default_value, is_required, is_readonly, display_order, config, created_at)
VALUES
  -- Host Info
  (@screen_id, 27, 'host_name', 'Host Name', '', 'Sarah Johnson', 0, 1, 1, '{}', NOW()),
  (@screen_id, 28, 'host_title', 'Title', '', 'Superhost', 0, 1, 2, '{}', NOW()),
  (@screen_id, 28, 'host_location', 'Location', '', 'Los Angeles, CA', 0, 1, 3, '{}', NOW()),
  (@screen_id, 28, 'member_since', 'Member Since', '', 'Member since 2018', 0, 1, 4, '{}', NOW()),
  
  -- Host Stats
  (@screen_id, 27, 'stats_heading', 'Host Stats', '', 'About This Host', 0, 1, 5, '{"level": "h3"}', NOW()),
  (@screen_id, 28, 'total_reviews', 'Reviews', '', '247 Reviews', 0, 1, 6, '{}', NOW()),
  (@screen_id, 28, 'rating_score', 'Rating', '', '4.9 ★ Rating', 0, 1, 7, '{}', NOW()),
  (@screen_id, 28, 'response_rate', 'Response Rate', '', '100% Response rate', 0, 1, 8, '{}', NOW()),
  (@screen_id, 28, 'response_time', 'Response Time', '', 'Responds within an hour', 0, 1, 9, '{}', NOW()),
  
  -- About Host
  (@screen_id, 27, 'about_heading', 'About', '', 'About Sarah', 0, 1, 10, '{"level": "h3"}', NOW()),
  (@screen_id, 28, 'host_bio', 'Bio', '', 'I love hosting guests and sharing the beauty of California\'s coastline. I\'m passionate about providing exceptional experiences and ensuring every stay is memorable.', 0, 1, 11, '{}', NOW()),
  
  -- Other Properties
  (@screen_id, 27, 'properties_heading', 'Other Properties', '', 'Sarah\'s Other Listings', 0, 1, 12, '{"level": "h3"}', NOW()),
  (@screen_id, 28, 'other_properties', 'Properties', '', 'Other properties by this host will appear here.', 0, 1, 13, '{"type": "list"}', NOW()),
  
  -- Actions
  (@screen_id, 33, 'contact_button', 'Contact Host', '', 'Send Message', 0, 0, 14, '{"variant": "primary"}', NOW()),
  (@screen_id, 33, 'report_button', 'Report', '', 'Report Host', 0, 0, 15, '{"variant": "secondary"}', NOW());

-- ============================================
-- SCREEN 5: Reviews & Ratings
-- ============================================
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at)
VALUES (
  @template_id,
  'Reviews & Ratings',
  'reviews_ratings',
  'View and submit property reviews and ratings',
  'Star',
  'Reviews',
  5,
  0,
  NOW()
);

SET @screen_id = LAST_INSERT_ID();

-- Reviews Elements
INSERT INTO app_template_screen_elements (template_screen_id, element_id, field_key, label, placeholder, default_value, is_required, is_readonly, display_order, config, created_at)
VALUES
  -- Header
  (@screen_id, 27, 'reviews_title', 'Page Title', '', 'Guest Reviews', 0, 1, 1, '{}', NOW()),
  (@screen_id, 28, 'overall_rating', 'Overall Rating', '', '4.9 ★ (127 reviews)', 0, 1, 2, '{}', NOW()),
  
  -- Rating Breakdown
  (@screen_id, 27, 'breakdown_heading', 'Rating Breakdown', '', 'Rating Categories', 0, 1, 3, '{"level": "h3"}', NOW()),
  (@screen_id, 28, 'cleanliness_rating', 'Cleanliness', '', 'Cleanliness: 4.9 ★', 0, 1, 4, '{}', NOW()),
  (@screen_id, 28, 'accuracy_rating', 'Accuracy', '', 'Accuracy: 4.8 ★', 0, 1, 5, '{}', NOW()),
  (@screen_id, 28, 'communication_rating', 'Communication', '', 'Communication: 5.0 ★', 0, 1, 6, '{}', NOW()),
  (@screen_id, 28, 'location_rating', 'Location', '', 'Location: 4.9 ★', 0, 1, 7, '{}', NOW()),
  (@screen_id, 28, 'checkin_rating', 'Check-in', '', 'Check-in: 5.0 ★', 0, 1, 8, '{}', NOW()),
  (@screen_id, 28, 'value_rating', 'Value', '', 'Value: 4.7 ★', 0, 1, 9, '{}', NOW()),
  
  -- Reviews List
  (@screen_id, 27, 'reviews_list_heading', 'Guest Reviews', '', 'What Guests Are Saying', 0, 1, 10, '{"level": "h3"}', NOW()),
  (@screen_id, 28, 'reviews_list', 'Reviews', '', 'Guest reviews will appear here.', 0, 1, 11, '{"type": "list"}', NOW()),
  
  -- Write Review (if stayed)
  (@screen_id, 27, 'write_review_heading', 'Write a Review', '', 'Share Your Experience', 0, 1, 12, '{"level": "h3"}', NOW()),
  (@screen_id, 8, 'review_rating', 'Your Rating', 'Rate 1-5 stars', '', 0, 0, 13, '{"min": 1, "max": 5}', NOW()),
  (@screen_id, 2, 'review_comment', 'Your Review', 'Share your experience...', '', 0, 0, 14, '{}', NOW()),
  (@screen_id, 33, 'submit_review_button', 'Submit Review', '', 'Submit Review', 0, 0, 15, '{"variant": "primary", "action": "submit"}', NOW());

-- ============================================
-- SCREEN 6: Search & Filters
-- ============================================
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at)
VALUES (
  @template_id,
  'Advanced Search',
  'advanced_search',
  'Advanced search with detailed filters for finding the perfect property',
  'Search',
  'Search',
  6,
  0,
  NOW()
);

SET @screen_id = LAST_INSERT_ID();

-- Search & Filters Elements
INSERT INTO app_template_screen_elements (template_screen_id, element_id, field_key, label, placeholder, default_value, is_required, is_readonly, display_order, config, created_at)
VALUES
  -- Header
  (@screen_id, 27, 'search_title', 'Page Title', '', 'Find Your Perfect Stay', 0, 1, 1, '{}', NOW()),
  (@screen_id, 28, 'search_subtitle', 'Subtitle', '', 'Use filters to narrow down your search', 0, 1, 2, '{}', NOW()),
  
  -- Location
  (@screen_id, 27, 'location_heading', 'Location', '', 'Where', 0, 1, 3, '{"level": "h3"}', NOW()),
  (@screen_id, 1, 'destination', 'Destination', 'City, region, or country', '', 0, 0, 4, '{}', NOW()),
  
  -- Dates
  (@screen_id, 27, 'dates_heading', 'Dates', '', 'When', 0, 1, 5, '{"level": "h3"}', NOW()),
  (@screen_id, 17, 'filter_check_in', 'Check-in', 'Select date', '', 0, 0, 6, '{}', NOW()),
  (@screen_id, 17, 'filter_check_out', 'Check-out', 'Select date', '', 0, 0, 7, '{}', NOW()),
  
  -- Guests
  (@screen_id, 27, 'guests_heading', 'Guests', '', 'Who', 0, 1, 8, '{"level": "h3"}', NOW()),
  (@screen_id, 8, 'adults_count', 'Adults', 'Number of adults', '1', 0, 0, 9, '{"min": 1, "max": 16}', NOW()),
  (@screen_id, 8, 'children_count', 'Children', 'Number of children', '0', 0, 0, 10, '{"min": 0, "max": 10}', NOW()),
  (@screen_id, 8, 'infants_count', 'Infants', 'Number of infants', '0', 0, 0, 11, '{"min": 0, "max": 5}', NOW()),
  
  -- Property Type
  (@screen_id, 27, 'type_heading', 'Property Type', '', 'Type of Place', 0, 1, 12, '{"level": "h3"}', NOW()),
  (@screen_id, 10, 'place_type', 'Type', 'Select type', '', 0, 0, 13, '{"options": [{"label": "Entire Place", "value": "entire"}, {"label": "Private Room", "value": "private"}, {"label": "Shared Room", "value": "shared"}, {"label": "Hotel", "value": "hotel"}]}', NOW()),
  
  -- Price Range
  (@screen_id, 27, 'price_heading', 'Price Range', '', 'Price Per Night', 0, 1, 14, '{"level": "h3"}', NOW()),
  (@screen_id, 8, 'filter_min_price', 'Minimum', 'Min $', '0', 0, 0, 15, '{"prefix": "$", "decimals": 0}', NOW()),
  (@screen_id, 8, 'filter_max_price', 'Maximum', 'Max $', '1000', 0, 0, 16, '{"prefix": "$", "decimals": 0}', NOW()),
  
  -- Rooms & Beds
  (@screen_id, 27, 'rooms_heading', 'Rooms & Beds', '', 'Rooms', 0, 1, 17, '{"level": "h3"}', NOW()),
  (@screen_id, 8, 'bedrooms_count', 'Bedrooms', 'Any', '0', 0, 0, 18, '{"min": 0, "max": 10}', NOW()),
  (@screen_id, 8, 'beds_count', 'Beds', 'Any', '0', 0, 0, 19, '{"min": 0, "max": 20}', NOW()),
  (@screen_id, 8, 'bathrooms_count', 'Bathrooms', 'Any', '0', 0, 0, 20, '{"min": 0, "max": 10}', NOW()),
  
  -- Amenities
  (@screen_id, 27, 'amenities_filter_heading', 'Amenities', '', 'Popular Amenities', 0, 1, 21, '{"level": "h3"}', NOW()),
  (@screen_id, 11, 'wifi_filter', 'WiFi', '', '0', 0, 0, 22, '{}', NOW()),
  (@screen_id, 11, 'kitchen_filter', 'Kitchen', '', '0', 0, 0, 23, '{}', NOW()),
  (@screen_id, 11, 'parking_filter', 'Free Parking', '', '0', 0, 0, 24, '{}', NOW()),
  (@screen_id, 11, 'pool_filter', 'Pool', '', '0', 0, 0, 25, '{}', NOW()),
  (@screen_id, 11, 'ac_filter', 'Air Conditioning', '', '0', 0, 0, 26, '{}', NOW()),
  
  -- Actions
  (@screen_id, 33, 'apply_filters_button', 'Apply Filters', '', 'Show Results', 0, 0, 27, '{"variant": "primary", "action": "search"}', NOW()),
  (@screen_id, 33, 'clear_filters_button', 'Clear All', '', 'Clear Filters', 0, 0, 28, '{"variant": "secondary"}', NOW());

-- Success message
SELECT CONCAT('✅ Property Rental App template created successfully! Template ID: ', @template_id) AS Result;
SELECT 'Created 6 screens: Property Listings, Property Details, Booking Form, Host Profile, Reviews & Ratings, Advanced Search' AS Screens;
