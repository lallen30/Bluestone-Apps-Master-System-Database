-- ============================================================================
-- Create 6 Dynamic Screens for Property Rental App Template (ID: 9)
-- Date: November 20, 2025
-- Phase 3: Template Setup via SQL
-- ============================================================================

USE multi_site_manager;

SET @template_id = 9;
SET @next_order = (SELECT COALESCE(MAX(display_order), 0) + 1 FROM app_template_screens WHERE template_id = @template_id);

-- ============================================================================
-- SCREEN 1: Search Properties
-- ============================================================================

INSERT INTO app_template_screens (
    template_id, screen_id, screen_name, screen_key, screen_description,
    screen_icon, screen_category, display_order, is_home_screen, created_at
) VALUES (
    @template_id, NULL, 'Search Properties', 'search_properties',
    'Search and filter available properties', 'search', 'Search',
    @next_order, 1, NOW()
);
SET @search_screen_id = LAST_INSERT_ID();

INSERT INTO app_template_screen_elements (
    template_screen_id, element_id, field_key, label, display_order, config, created_at
) VALUES (
    @search_screen_id, 113, 'property_search', 'Property Search', 1,
    JSON_OBJECT(
        'filters', JSON_ARRAY('location', 'price', 'guests'),
        'sort_options', JSON_ARRAY('price_asc', 'price_desc', 'newest'),
        'default_sort', 'newest',
        'card_layout', 'grid',
        'items_per_page', 20
    ),
    NOW()
);

-- ============================================================================
-- SCREEN 2: Book Property
-- ============================================================================

SET @next_order = @next_order + 1;
INSERT INTO app_template_screens (
    template_id, screen_id, screen_name, screen_key, screen_description,
    screen_icon, screen_category, display_order, is_home_screen, created_at
) VALUES (
    @template_id, NULL, 'Book Property', 'book_property',
    'Create a booking for a property', 'event', 'Booking',
    @next_order, 0, NOW()
);
SET @book_screen_id = LAST_INSERT_ID();

INSERT INTO app_template_screen_elements (
    template_screen_id, element_id, field_key, label, display_order, config, created_at
) VALUES (
    @book_screen_id, 108, 'booking_form', 'Booking Form', 1,
    JSON_OBJECT(
        'listing_id_source', 'route_param',
        'show_price_breakdown', TRUE,
        'enable_special_requests', TRUE,
        'success_navigation', 'MyBookings',
        'min_nights', 1,
        'max_nights', 365,
        'require_phone', FALSE
    ),
    NOW()
);

-- ============================================================================
-- SCREEN 3: My Bookings
-- ============================================================================

SET @next_order = @next_order + 1;
INSERT INTO app_template_screens (
    template_id, screen_id, screen_name, screen_key, screen_description,
    screen_icon, screen_category, display_order, is_home_screen, created_at
) VALUES (
    @template_id, NULL, 'My Bookings', 'my_bookings',
    'View and manage your bookings', 'list', 'Booking',
    @next_order, 0, NOW()
);
SET @bookings_screen_id = LAST_INSERT_ID();

INSERT INTO app_template_screen_elements (
    template_screen_id, element_id, field_key, label, display_order, config, created_at
) VALUES (
    @bookings_screen_id, 109, 'booking_list', 'Booking List', 1,
    JSON_OBJECT(
        'filters', JSON_ARRAY('all', 'pending', 'confirmed', 'cancelled'),
        'default_filter', 'all',
        'show_status_badges', TRUE,
        'enable_cancel', TRUE,
        'card_layout', 'compact',
        'pull_to_refresh', TRUE,
        'items_per_page', 20
    ),
    NOW()
);

-- ============================================================================
-- SCREEN 4: Booking Details
-- ============================================================================

SET @next_order = @next_order + 1;
INSERT INTO app_template_screens (
    template_id, screen_id, screen_name, screen_key, screen_description,
    screen_icon, screen_category, display_order, is_home_screen, created_at
) VALUES (
    @template_id, NULL, 'Booking Details', 'booking_details',
    'View detailed booking information', 'info', 'Booking',
    @next_order, 0, NOW()
);
SET @booking_detail_screen_id = LAST_INSERT_ID();

INSERT INTO app_template_screen_elements (
    template_screen_id, element_id, field_key, label, display_order, config, created_at
) VALUES (
    @booking_detail_screen_id, 110, 'booking_detail', 'Booking Detail', 1,
    JSON_OBJECT(
        'booking_id_source', 'route_param',
        'sections', JSON_ARRAY('property', 'trip', 'guest', 'host', 'price', 'timeline'),
        'show_timeline', TRUE,
        'enable_cancel', TRUE,
        'enable_contact_host', TRUE
    ),
    NOW()
);

-- ============================================================================
-- SCREEN 5: Messages
-- ============================================================================

SET @next_order = @next_order + 1;
INSERT INTO app_template_screens (
    template_id, screen_id, screen_name, screen_key, screen_description,
    screen_icon, screen_category, display_order, is_home_screen, created_at
) VALUES (
    @template_id, NULL, 'Messages', 'messages',
    'View your conversations', 'chat', 'Communication',
    @next_order, 0, NOW()
);
SET @messages_screen_id = LAST_INSERT_ID();

INSERT INTO app_template_screen_elements (
    template_screen_id, element_id, field_key, label, display_order, config, created_at
) VALUES (
    @messages_screen_id, 111, 'conversation_list', 'Conversation List', 1,
    JSON_OBJECT(
        'auto_refresh_interval', 30000,
        'show_unread_badge', TRUE,
        'show_avatars', TRUE,
        'enable_archive', TRUE,
        'pull_to_refresh', TRUE,
        'items_per_page', 50
    ),
    NOW()
);

-- ============================================================================
-- SCREEN 6: Chat
-- ============================================================================

SET @next_order = @next_order + 1;
INSERT INTO app_template_screens (
    template_id, screen_id, screen_name, screen_key, screen_description,
    screen_icon, screen_category, display_order, is_home_screen, created_at
) VALUES (
    @template_id, NULL, 'Chat', 'chat',
    'Send and receive messages', 'message', 'Communication',
    @next_order, 0, NOW()
);
SET @chat_screen_id = LAST_INSERT_ID();

INSERT INTO app_template_screen_elements (
    template_screen_id, element_id, field_key, label, display_order, config, created_at
) VALUES (
    @chat_screen_id, 112, 'chat_interface', 'Chat Interface', 1,
    JSON_OBJECT(
        'conversation_id_source', 'route_param',
        'auto_refresh_interval', 5000,
        'show_timestamps', TRUE,
        'enable_attachments', FALSE,
        'max_message_length', 1000,
        'message_bubble_style', 'ios',
        'show_date_separators', TRUE
    ),
    NOW()
);

-- ============================================================================
-- VERIFICATION
-- ============================================================================

SELECT '✅ Successfully created 6 dynamic screens!' as Status;

SELECT 
    id, screen_name, screen_key, screen_icon, screen_category, display_order
FROM app_template_screens
WHERE template_id = @template_id
    AND screen_name IN ('Search Properties', 'Book Property', 'My Bookings', 'Booking Details', 'Messages', 'Chat')
ORDER BY display_order;

SELECT 
    ts.screen_name,
    se.element_type,
    tse.field_key,
    tse.config
FROM app_template_screens ts
JOIN app_template_screen_elements tse ON ts.id = tse.template_screen_id
JOIN screen_elements se ON tse.element_id = se.id
WHERE ts.template_id = @template_id
    AND ts.screen_name IN ('Search Properties', 'Book Property', 'My Bookings', 'Booking Details', 'Messages', 'Chat')
ORDER BY ts.display_order;
