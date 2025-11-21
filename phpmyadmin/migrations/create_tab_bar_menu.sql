-- ============================================================================
-- Create Tab Bar Menu for App 28 (AirPnP)
-- Date: November 20, 2025
-- Purpose: Set up bottom navigation with 3 main screens
-- ============================================================================

USE multi_site_manager;

SET @app_id = 28;

-- ============================================================================
-- STEP 1: Create the Tab Bar menu
-- ============================================================================

INSERT INTO app_menus (app_id, name, menu_type, icon, description, is_active, created_at, updated_at)
VALUES (@app_id, 'Main Navigation', 'tabbar', 'menu', 'Bottom navigation with main screens', 1, NOW(), NOW());

SET @menu_id = LAST_INSERT_ID();

SELECT CONCAT('✅ Created Tab Bar menu with ID: ', @menu_id) as Status;

-- ============================================================================
-- STEP 2: Get screen IDs for the new dynamic screens
-- ============================================================================

SET @search_screen_id = (SELECT id FROM app_screens WHERE screen_key = 'search_properties' LIMIT 1);
SET @bookings_screen_id = (SELECT id FROM app_screens WHERE screen_key = 'my_bookings' LIMIT 1);
SET @messages_screen_id = (SELECT id FROM app_screens WHERE screen_key = 'messages' LIMIT 1);

-- Verify screen IDs were found
SELECT 
    CASE 
        WHEN @search_screen_id IS NULL THEN '❌ Search Properties screen not found'
        WHEN @bookings_screen_id IS NULL THEN '❌ My Bookings screen not found'
        WHEN @messages_screen_id IS NULL THEN '❌ Messages screen not found'
        ELSE '✅ All screens found'
    END as ScreenCheck;

-- ============================================================================
-- STEP 3: Add screens to menu with proper configuration
-- ============================================================================

-- Add Search Properties (Tab 1)
INSERT INTO menu_items (menu_id, screen_id, display_order, label, icon, is_active, created_at, updated_at)
VALUES (@menu_id, @search_screen_id, 1, 'Search', 'search', 1, NOW(), NOW());

-- Add My Bookings (Tab 2)
INSERT INTO menu_items (menu_id, screen_id, display_order, label, icon, is_active, created_at, updated_at)
VALUES (@menu_id, @bookings_screen_id, 2, 'Bookings', 'calendar', 1, NOW(), NOW());

-- Add Messages (Tab 3)
INSERT INTO menu_items (menu_id, screen_id, display_order, label, icon, is_active, created_at, updated_at)
VALUES (@menu_id, @messages_screen_id, 3, 'Messages', 'message-square', 1, NOW(), NOW());

-- ============================================================================
-- STEP 4: Verification
-- ============================================================================

SELECT '✅ Tab Bar Menu Setup Complete!' as Status;

SELECT '📱 Tab Bar Configuration:' as Info;

SELECT 
    m.id as menu_id,
    m.name as menu_name,
    m.menu_type,
    mi.display_order as tab_order,
    s.name as screen_name,
    s.screen_key,
    mi.label as tab_label,
    mi.icon as tab_icon,
    mi.is_active
FROM app_menus m
JOIN menu_items mi ON m.id = mi.menu_id
JOIN app_screens s ON mi.screen_id = s.id
WHERE m.app_id = @app_id AND m.menu_type = 'tabbar'
ORDER BY mi.display_order;

SELECT '📊 Summary:' as Info;

SELECT 
    COUNT(DISTINCT m.id) as total_menus,
    COUNT(mi.id) as total_menu_items,
    SUM(CASE WHEN m.menu_type = 'tabbar' THEN 1 ELSE 0 END) as tabbar_menus,
    SUM(CASE WHEN m.menu_type = 'sidebar_left' THEN 1 ELSE 0 END) as left_sidebar_menus,
    SUM(CASE WHEN m.menu_type = 'sidebar_right' THEN 1 ELSE 0 END) as right_sidebar_menus
FROM app_menus m
LEFT JOIN menu_items mi ON m.id = mi.menu_id
WHERE m.app_id = @app_id;
