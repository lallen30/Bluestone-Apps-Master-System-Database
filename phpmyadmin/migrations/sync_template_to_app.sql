-- ============================================================================
-- Sync Template 9 (Property Rental App) to App 28 (AirPnP)
-- Date: November 20, 2025
-- Purpose: Add all template screens to the app
-- ============================================================================

USE multi_site_manager;

SET @app_id = 28;
SET @template_id = 9;
SET @assigned_by = 1; -- Admin user

-- ============================================================================
-- STEP 1: Get all template screens that are NOT in the app yet
-- ============================================================================

-- First, let's see what's missing
SELECT 
    ts.id as template_screen_id,
    ts.screen_name,
    ts.screen_key,
    ts.display_order,
    CASE 
        WHEN asa.id IS NULL THEN 'MISSING - Will be added'
        ELSE 'Already in app'
    END as status
FROM app_template_screens ts
LEFT JOIN app_screen_assignments asa ON ts.screen_id = asa.screen_id AND asa.app_id = @app_id
WHERE ts.template_id = @template_id
ORDER BY ts.display_order;

-- ============================================================================
-- STEP 2: Add missing screens to app
-- ============================================================================

-- This will add ALL template screens that aren't already in the app
-- with auto_sync_enabled = 1 (synced by default)

INSERT INTO app_screen_assignments (
    app_id,
    screen_id,
    is_active,
    is_published,
    display_order,
    assigned_by,
    auto_sync_enabled,
    show_in_tabbar,
    tabbar_order,
    tabbar_icon,
    tabbar_label
)
SELECT 
    @app_id,
    COALESCE(ts.screen_id, s.id) as screen_id,
    1 as is_active,
    1 as is_published,
    ts.display_order,
    @assigned_by,
    1 as auto_sync_enabled,
    CASE 
        WHEN ts.screen_category IN ('Search', 'Booking', 'Communication') 
        AND ts.screen_name IN ('Search Properties', 'My Bookings', 'Messages')
        THEN 1 
        ELSE 0 
    END as show_in_tabbar,
    CASE 
        WHEN ts.screen_name = 'Search Properties' THEN 1
        WHEN ts.screen_name = 'My Bookings' THEN 2
        WHEN ts.screen_name = 'Messages' THEN 3
        ELSE NULL
    END as tabbar_order,
    ts.screen_icon as tabbar_icon,
    CASE 
        WHEN ts.screen_name = 'Search Properties' THEN 'Search'
        WHEN ts.screen_name = 'My Bookings' THEN 'Bookings'
        WHEN ts.screen_name = 'Messages' THEN 'Messages'
        ELSE NULL
    END as tabbar_label
FROM app_template_screens ts
LEFT JOIN app_screens s ON ts.screen_key = s.screen_key
LEFT JOIN app_screen_assignments asa ON COALESCE(ts.screen_id, s.id) = asa.screen_id AND asa.app_id = @app_id
WHERE ts.template_id = @template_id
    AND asa.id IS NULL  -- Only add screens that don't exist yet
ORDER BY ts.display_order;

-- ============================================================================
-- STEP 3: Verify the sync
-- ============================================================================

SELECT '✅ Sync Complete! Here are all screens in app 28:' as Status;

SELECT 
    asa.id as assignment_id,
    COALESCE(ts.screen_name, s.name) as screen_name,
    COALESCE(ts.screen_key, s.screen_key) as screen_key,
    asa.auto_sync_enabled,
    asa.show_in_tabbar,
    asa.tabbar_order,
    asa.display_order,
    asa.is_active
FROM app_screen_assignments asa
LEFT JOIN app_screens s ON asa.screen_id = s.id
LEFT JOIN app_template_screens ts ON s.screen_key = ts.screen_key AND ts.template_id = @template_id
WHERE asa.app_id = @app_id
ORDER BY asa.display_order;

-- ============================================================================
-- STEP 4: Show the 6 new dynamic screens specifically
-- ============================================================================

SELECT '🎯 New Dynamic Screens Added:' as Status;

SELECT 
    asa.id as assignment_id,
    ts.screen_name,
    ts.screen_key,
    se.element_type,
    asa.auto_sync_enabled,
    asa.show_in_tabbar,
    asa.tabbar_order
FROM app_template_screens ts
JOIN app_template_screen_elements tse ON ts.id = tse.template_screen_id
JOIN screen_elements se ON tse.element_id = se.id
LEFT JOIN app_screens s ON ts.screen_key = s.screen_key
LEFT JOIN app_screen_assignments asa ON COALESCE(ts.screen_id, s.id) = asa.screen_id AND asa.app_id = @app_id
WHERE ts.template_id = @template_id
    AND ts.id IN (575, 576, 577, 578, 579, 580)
ORDER BY ts.display_order;

-- ============================================================================
-- OPTIONAL: Update existing screens to enable auto-sync
-- ============================================================================

-- Uncomment this if you want to enable auto-sync for all existing screens
-- UPDATE app_screen_assignments
-- SET auto_sync_enabled = 1
-- WHERE app_id = @app_id;

-- ============================================================================
-- OPTIONAL: Set specific screens as custom (no auto-sync)
-- ============================================================================

-- Example: Make the home screen custom
-- UPDATE app_screen_assignments
-- SET auto_sync_enabled = 0
-- WHERE app_id = @app_id 
--   AND screen_id IN (SELECT id FROM app_screens WHERE screen_key = 'home_screen');
