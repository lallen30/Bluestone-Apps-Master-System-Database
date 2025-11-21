-- ============================================================================
-- Sync Template 9 to App 28 - Fixed Version
-- Creates master screens from template screens, then assigns to app
-- ============================================================================

USE multi_site_manager;

SET @app_id = 28;
SET @template_id = 9;
SET @assigned_by = 1;

-- ============================================================================
-- STEP 1: Create master screens for template screens that don't have one
-- ============================================================================

INSERT INTO app_screens (
    name,
    screen_key,
    description,
    icon,
    category,
    is_active,
    created_by,
    created_at,
    updated_at
)
SELECT 
    ts.screen_name,
    ts.screen_key,
    ts.screen_description,
    ts.screen_icon,
    ts.screen_category,
    1,
    @assigned_by,
    NOW(),
    NOW()
FROM app_template_screens ts
LEFT JOIN app_screens s ON ts.screen_key = s.screen_key
WHERE ts.template_id = @template_id
    AND s.id IS NULL  -- Only create if doesn't exist
    AND ts.screen_id IS NULL;  -- Only for template screens without master screen

-- Update template screens with their new master screen IDs
UPDATE app_template_screens ts
JOIN app_screens s ON ts.screen_key = s.screen_key
SET ts.screen_id = s.id
WHERE ts.template_id = @template_id
    AND ts.screen_id IS NULL;

-- ============================================================================
-- STEP 2: Add all template screens to app 28
-- ============================================================================

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
    ts.screen_id,
    1,
    1,
    ts.display_order,
    @assigned_by,
    1,  -- Auto-sync enabled by default
    CASE 
        WHEN ts.screen_name IN ('Search Properties', 'My Bookings', 'Messages') THEN 1
        ELSE 0
    END,
    CASE 
        WHEN ts.screen_name = 'Search Properties' THEN 1
        WHEN ts.screen_name = 'My Bookings' THEN 2
        WHEN ts.screen_name = 'Messages' THEN 3
        ELSE NULL
    END,
    ts.screen_icon,
    CASE 
        WHEN ts.screen_name = 'Search Properties' THEN 'Search'
        WHEN ts.screen_name = 'My Bookings' THEN 'Bookings'
        WHEN ts.screen_name = 'Messages' THEN 'Messages'
        ELSE NULL
    END
FROM app_template_screens ts
LEFT JOIN app_screen_assignments asa ON ts.screen_id = asa.screen_id AND asa.app_id = @app_id
WHERE ts.template_id = @template_id
    AND ts.screen_id IS NOT NULL
    AND asa.id IS NULL;  -- Only add if not already assigned

-- ============================================================================
-- STEP 3: Verification
-- ============================================================================

SELECT '✅ Sync Complete!' as Status;

SELECT 
    COUNT(*) as total_screens_in_app
FROM app_screen_assignments
WHERE app_id = @app_id;

SELECT '🎯 New Dynamic Screens:' as Info;

SELECT 
    s.id as screen_id,
    s.name as screen_name,
    s.screen_key,
    asa.show_in_tabbar,
    asa.tabbar_order,
    asa.auto_sync_enabled
FROM app_template_screens ts
JOIN app_screens s ON ts.screen_id = s.id
LEFT JOIN app_screen_assignments asa ON s.id = asa.screen_id AND asa.app_id = @app_id
WHERE ts.template_id = @template_id
    AND ts.id IN (575, 576, 577, 578, 579, 580)
ORDER BY ts.display_order;

SELECT '📱 Tab Bar Screens:' as Info;

SELECT 
    s.name as screen_name,
    asa.tabbar_order,
    asa.tabbar_label,
    asa.tabbar_icon
FROM app_screen_assignments asa
JOIN app_screens s ON asa.screen_id = s.id
WHERE asa.app_id = @app_id
    AND asa.show_in_tabbar = 1
ORDER BY asa.tabbar_order;
