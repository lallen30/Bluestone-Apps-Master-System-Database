-- ============================================================================
-- Create 6 Dynamic Screens for Property Rental App Template (ID: 9)
-- Date: November 20, 2025
-- Phase 3: Template Setup via SQL
-- ============================================================================

USE multi_site_manager;

-- Get the template ID (should be 9 for Property Rental App)
SET @template_id = 9;

-- Get the next display_order
SET @next_order = (SELECT COALESCE(MAX(display_order), 0) + 1 FROM app_template_screens WHERE template_id = @template_id);

-- ============================================================================
-- SCREEN 1: Search Properties (Tab Bar Screen)
-- ============================================================================

INSERT INTO app_template_screens (
    template_id,
    screen_id,
    screen_name,
    screen_key,
    screen_description,
    screen_icon,
    screen_category,
    display_order,
    is_home_screen,
    created_at
) VALUES (
    @template_id,
    NULL,
    'Search Properties',
    'search_properties',
    'Search and filter available properties',
    'search',
    'Search',
    @next_order,
    0,
    NOW()
);

SET @search_screen_id = LAST_INSERT_ID();
SET @next_order = @next_order + 1;

-- Add Property Search element to Search Properties screen
INSERT INTO screen_content (
    screen_id,
    element_id,
    display_order,
    config,
    created_at,
    updated_at
) VALUES (
    @search_screen_id,
    113, -- Property Search element
    1,
    JSON_OBJECT(
        'filters', JSON_ARRAY('location', 'price', 'guests'),
        'sort_options', JSON_ARRAY('price_asc', 'price_desc', 'newest'),
        'default_sort', 'newest',
        'show_map', false,
        'card_layout', 'grid',
        'items_per_page', 20,
        'enable_favorites', true
    ),
    NOW(),
    NOW()
);

-- Assign roles to Search Properties screen (all roles)
INSERT INTO screen_role_access (screen_id, role_id, created_at)
SELECT @search_screen_id, id, NOW()
FROM user_roles
WHERE name IN ('Guest', 'Renter', 'Premium Renter', 'Host', 'Admin');

-- ============================================================================
-- SCREEN 2: Book Property (No Tab Bar)
-- ============================================================================

INSERT INTO app_screens (
    app_template_id,
    name,
    description,
    screen_type,
    show_in_tabbar,
    tabbar_order,
    tabbar_icon,
    tabbar_label,
    is_published,
    created_at,
    updated_at
) VALUES (
    @template_id,
    'Book Property',
    'Create a booking for a property',
    'dynamic',
    0,
    NULL,
    NULL,
    NULL,
    1,
    NOW(),
    NOW()
);

SET @book_screen_id = LAST_INSERT_ID();

-- Add Booking Form element to Book Property screen
INSERT INTO screen_content (
    screen_id,
    element_id,
    display_order,
    config,
    created_at,
    updated_at
) VALUES (
    @book_screen_id,
    108, -- Booking Form element
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
    NOW(),
    NOW()
);

-- Assign roles to Book Property screen (Renter, Premium Renter, Admin only)
INSERT INTO screen_role_access (screen_id, role_id, created_at)
SELECT @book_screen_id, id, NOW()
FROM user_roles
WHERE name IN ('Renter', 'Premium Renter', 'Admin');

-- ============================================================================
-- SCREEN 3: My Bookings (Tab Bar Screen)
-- ============================================================================

INSERT INTO app_screens (
    app_template_id,
    name,
    description,
    screen_type,
    show_in_tabbar,
    tabbar_order,
    tabbar_icon,
    tabbar_label,
    is_published,
    created_at,
    updated_at
) VALUES (
    @template_id,
    'My Bookings',
    'View and manage your bookings',
    'dynamic',
    1,
    2,
    'event',
    'Bookings',
    1,
    NOW(),
    NOW()
);

SET @bookings_screen_id = LAST_INSERT_ID();

-- Add Booking List element to My Bookings screen
INSERT INTO screen_content (
    screen_id,
    element_id,
    display_order,
    config,
    created_at,
    updated_at
) VALUES (
    @bookings_screen_id,
    109, -- Booking List element
    1,
    JSON_OBJECT(
        'filters', JSON_ARRAY('all', 'pending', 'confirmed', 'cancelled'),
        'default_filter', 'all',
        'show_status_badges', true,
        'enable_cancel', true,
        'card_layout', 'compact',
        'pull_to_refresh', true,
        'items_per_page', 20
    ),
    NOW(),
    NOW()
);

-- Assign roles to My Bookings screen (Renter, Premium Renter, Host, Admin)
INSERT INTO screen_role_access (screen_id, role_id, created_at)
SELECT @bookings_screen_id, id, NOW()
FROM user_roles
WHERE name IN ('Renter', 'Premium Renter', 'Host', 'Admin');

-- ============================================================================
-- SCREEN 4: Booking Details (No Tab Bar)
-- ============================================================================

INSERT INTO app_screens (
    app_template_id,
    name,
    description,
    screen_type,
    show_in_tabbar,
    tabbar_order,
    tabbar_icon,
    tabbar_label,
    is_published,
    created_at,
    updated_at
) VALUES (
    @template_id,
    'Booking Details',
    'View detailed booking information',
    'dynamic',
    0,
    NULL,
    NULL,
    NULL,
    1,
    NOW(),
    NOW()
);

SET @booking_detail_screen_id = LAST_INSERT_ID();

-- Add Booking Detail element to Booking Details screen
INSERT INTO screen_content (
    screen_id,
    element_id,
    display_order,
    config,
    created_at,
    updated_at
) VALUES (
    @booking_detail_screen_id,
    110, -- Booking Detail element
    1,
    JSON_OBJECT(
        'booking_id_source', 'route_param',
        'sections', JSON_ARRAY('property', 'trip', 'guest', 'host', 'price', 'timeline'),
        'show_timeline', true,
        'enable_cancel', true,
        'enable_contact_host', true
    ),
    NOW(),
    NOW()
);

-- Assign roles to Booking Details screen (Renter, Premium Renter, Host, Admin)
INSERT INTO screen_role_access (screen_id, role_id, created_at)
SELECT @booking_detail_screen_id, id, NOW()
FROM user_roles
WHERE name IN ('Renter', 'Premium Renter', 'Host', 'Admin');

-- ============================================================================
-- SCREEN 5: Messages (Tab Bar Screen)
-- ============================================================================

INSERT INTO app_screens (
    app_template_id,
    name,
    description,
    screen_type,
    show_in_tabbar,
    tabbar_order,
    tabbar_icon,
    tabbar_label,
    is_published,
    created_at,
    updated_at
) VALUES (
    @template_id,
    'Messages',
    'View your conversations',
    'dynamic',
    1,
    3,
    'chat',
    'Messages',
    1,
    NOW(),
    NOW()
);

SET @messages_screen_id = LAST_INSERT_ID();

-- Add Conversation List element to Messages screen
INSERT INTO screen_content (
    screen_id,
    element_id,
    display_order,
    config,
    created_at,
    updated_at
) VALUES (
    @messages_screen_id,
    111, -- Conversation List element
    1,
    JSON_OBJECT(
        'auto_refresh_interval', 30000,
        'show_unread_badge', true,
        'show_avatars', true,
        'enable_archive', true,
        'pull_to_refresh', true,
        'items_per_page', 50
    ),
    NOW(),
    NOW()
);

-- Assign roles to Messages screen (Renter, Premium Renter, Host, Admin)
INSERT INTO screen_role_access (screen_id, role_id, created_at)
SELECT @messages_screen_id, id, NOW()
FROM user_roles
WHERE name IN ('Renter', 'Premium Renter', 'Host', 'Admin');

-- ============================================================================
-- SCREEN 6: Chat (No Tab Bar)
-- ============================================================================

INSERT INTO app_screens (
    app_template_id,
    name,
    description,
    screen_type,
    show_in_tabbar,
    tabbar_order,
    tabbar_icon,
    tabbar_label,
    is_published,
    created_at,
    updated_at
) VALUES (
    @template_id,
    'Chat',
    'Send and receive messages',
    'dynamic',
    0,
    NULL,
    NULL,
    NULL,
    1,
    NOW(),
    NOW()
);

SET @chat_screen_id = LAST_INSERT_ID();

-- Add Chat Interface element to Chat screen
INSERT INTO screen_content (
    screen_id,
    element_id,
    display_order,
    config,
    created_at,
    updated_at
) VALUES (
    @chat_screen_id,
    112, -- Chat Interface element
    1,
    JSON_OBJECT(
        'conversation_id_source', 'route_param',
        'auto_refresh_interval', 5000,
        'show_timestamps', true,
        'enable_attachments', false,
        'max_message_length', 1000,
        'message_bubble_style', 'ios',
        'show_date_separators', true
    ),
    NOW(),
    NOW()
);

-- Assign roles to Chat screen (Renter, Premium Renter, Host, Admin)
INSERT INTO screen_role_access (screen_id, role_id, created_at)
SELECT @chat_screen_id, id, NOW()
FROM user_roles
WHERE name IN ('Renter', 'Premium Renter', 'Host', 'Admin');

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Show all created screens
SELECT 
    s.id,
    s.name,
    s.description,
    s.show_in_tabbar,
    s.tabbar_order,
    s.tabbar_icon,
    s.tabbar_label,
    se.element_type,
    COUNT(DISTINCT sra.role_id) as role_count
FROM app_screens s
LEFT JOIN screen_content sc ON s.id = sc.screen_id
LEFT JOIN screen_elements se ON sc.element_id = se.id
LEFT JOIN screen_role_access sra ON s.id = sra.screen_id
WHERE s.app_template_id = @template_id
    AND s.name IN ('Search Properties', 'Book Property', 'My Bookings', 'Booking Details', 'Messages', 'Chat')
GROUP BY s.id, s.name, s.description, s.show_in_tabbar, s.tabbar_order, s.tabbar_icon, s.tabbar_label, se.element_type
ORDER BY s.tabbar_order, s.name;

-- Show role assignments
SELECT 
    s.name as screen_name,
    r.name as role_name
FROM app_screens s
JOIN screen_role_access sra ON s.id = sra.screen_id
JOIN user_roles r ON sra.role_id = r.id
WHERE s.app_template_id = @template_id
    AND s.name IN ('Search Properties', 'Book Property', 'My Bookings', 'Booking Details', 'Messages', 'Chat')
ORDER BY s.name, r.name;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

SELECT '✅ Successfully created 6 dynamic screens for Property Rental App template!' as Status;
SELECT CONCAT('Search Properties (ID: ', @search_screen_id, ')') as Screen1;
SELECT CONCAT('Book Property (ID: ', @book_screen_id, ')') as Screen2;
SELECT CONCAT('My Bookings (ID: ', @bookings_screen_id, ')') as Screen3;
SELECT CONCAT('Booking Details (ID: ', @booking_detail_screen_id, ')') as Screen4;
SELECT CONCAT('Messages (ID: ', @messages_screen_id, ')') as Screen5;
SELECT CONCAT('Chat (ID: ', @chat_screen_id, ')') as Screen6;
