-- Migration: Create Dynamic Element Types for Property Rental App
-- Date: 2025-11-20
-- Description: Add new element types for booking and messaging functionality

-- ============================================
-- Insert New Element Types
-- ============================================

-- 1. Booking Form Element
INSERT INTO screen_elements (
  name, 
  element_type, 
  category, 
  icon,
  description, 
  is_editable_by_app_admin,
  has_options,
  is_content_field,
  is_input_field,
  default_config,
  is_active
)
VALUES (
  'Booking Form',
  'booking_form',
  'forms',
  'event',
  'Complete booking form with date pickers, guest information, and price calculation',
  1,
  1,
  0,
  1,
  JSON_OBJECT(
    'listing_id_source', 'route_param',
    'show_price_breakdown', true,
    'enable_special_requests', true,
    'success_navigation', 'MyBookings',
    'min_nights', 1,
    'max_nights', 365,
    'require_phone', false
  ),
  1
);

-- 2. Booking List Element
INSERT INTO screen_elements (
  name, element_type, category, icon, description,
  is_editable_by_app_admin, has_options, is_content_field, is_input_field,
  default_config, is_active
)
VALUES (
  'Booking List',
  'booking_list',
  'lists',
  'list',
  'Display user bookings with filters and status badges',
  1, 1, 0, 0,
  JSON_OBJECT(
    'filters', JSON_ARRAY('all', 'pending', 'confirmed', 'cancelled'),
    'default_filter', 'all',
    'show_status_badges', true,
    'enable_cancel', true,
    'card_layout', 'compact',
    'pull_to_refresh', true,
    'items_per_page', 20
  ),
  1
);

-- 3. Booking Detail Element
INSERT INTO screen_elements (
  name, element_type, category, icon, description,
  is_editable_by_app_admin, has_options, is_content_field, is_input_field,
  default_config, is_active
)
VALUES (
  'Booking Detail',
  'booking_detail',
  'detail',
  'info',
  'Display full booking information with timeline and actions',
  1, 1, 0, 0,
  JSON_OBJECT(
    'booking_id_source', 'route_param',
    'sections', JSON_ARRAY('property', 'trip', 'guest', 'host', 'price', 'timeline'),
    'show_timeline', true,
    'enable_cancel', true,
    'enable_contact_host', true
  ),
  1
);

-- 4. Conversation List Element
INSERT INTO screen_elements (
  name, element_type, category, icon, description,
  is_editable_by_app_admin, has_options, is_content_field, is_input_field,
  default_config, is_active
)
VALUES (
  'Conversation List',
  'conversation_list',
  'lists',
  'chat',
  'Display user conversations with unread badges and auto-refresh',
  1, 1, 0, 0,
  JSON_OBJECT(
    'auto_refresh_interval', 30000,
    'show_unread_badge', true,
    'show_avatars', true,
    'enable_archive', true,
    'pull_to_refresh', true,
    'items_per_page', 50
  ),
  1
);

-- 5. Chat Interface Element
INSERT INTO screen_elements (
  name, element_type, category, icon, description,
  is_editable_by_app_admin, has_options, is_content_field, is_input_field,
  default_config, is_active
)
VALUES (
  'Chat Interface',
  'chat_interface',
  'messaging',
  'message',
  'Send and receive messages with real-time updates',
  1, 1, 0, 1,
  JSON_OBJECT(
    'conversation_id_source', 'route_param',
    'auto_refresh_interval', 5000,
    'show_timestamps', true,
    'enable_attachments', false,
    'max_message_length', 1000,
    'message_bubble_style', 'ios',
    'show_date_separators', true
  ),
  1
);

-- 6. Property Search Element
INSERT INTO screen_elements (
  name, element_type, category, icon, description,
  is_editable_by_app_admin, has_options, is_content_field, is_input_field,
  default_config, is_active
)
VALUES (
  'Property Search',
  'property_search',
  'search',
  'search',
  'Search properties with advanced filters and sorting',
  1, 1, 0, 1,
  JSON_OBJECT(
    'filters', JSON_ARRAY('location', 'dates', 'guests', 'price', 'property_type', 'amenities'),
    'sort_options', JSON_ARRAY('price_asc', 'price_desc', 'newest', 'rating'),
    'default_sort', 'newest',
    'show_map', false,
    'card_layout', 'grid',
    'items_per_page', 20,
    'enable_favorites', true
  ),
  1
);

-- ============================================
-- Verify Insertion
-- ============================================
SELECT 
  id,
  name,
  element_type,
  category,
  description,
  is_active
FROM screen_elements
WHERE element_type IN (
  'booking_form',
  'booking_list',
  'booking_detail',
  'conversation_list',
  'chat_interface',
  'property_search'
)
ORDER BY element_type;
