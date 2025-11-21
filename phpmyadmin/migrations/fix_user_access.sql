-- ============================================================================
-- Fix User Access for App 28
-- Issue: User can't access screens after login
-- Solution: Assign role and remove screen restrictions
-- ============================================================================

USE multi_site_manager;

SET @app_id = 28;
SET @user_email = 'user1@knoxweb.com';

-- ============================================================================
-- STEP 1: Get or create Renter role
-- ============================================================================

INSERT INTO user_roles (app_id, name, display_name, description, is_default, created_at, updated_at)
SELECT @app_id, 'Renter', 'Renter', 'Standard renter role', 0, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM user_roles WHERE name = 'Renter' AND app_id = @app_id);

SET @role_id = (SELECT id FROM user_roles WHERE name = 'Renter' AND app_id = @app_id LIMIT 1);

SELECT CONCAT('✅ Renter role ID: ', @role_id) as Status;

-- ============================================================================
-- STEP 2: Assign role to user
-- ============================================================================

SET @user_id = (SELECT id FROM app_users WHERE email = @user_email AND app_id = @app_id);

SELECT CONCAT('✅ User ID: ', @user_id, ' (', @user_email, ')') as Status;

INSERT INTO app_user_role_assignments (user_id, role_id, assigned_at)
VALUES (@user_id, @role_id, NOW())
ON DUPLICATE KEY UPDATE assigned_at = NOW();

SELECT '✅ Role assigned to user' as Status;

-- ============================================================================
-- STEP 3: Remove role restrictions from main screens
-- ============================================================================

-- Get screen IDs
SET @search_screen_id = (SELECT id FROM app_screens WHERE screen_key = 'search_properties' LIMIT 1);
SET @bookings_screen_id = (SELECT id FROM app_screens WHERE screen_key = 'my_bookings' LIMIT 1);
SET @messages_screen_id = (SELECT id FROM app_screens WHERE screen_key = 'messages' LIMIT 1);

-- Remove restrictions (make accessible to all)
DELETE FROM screen_role_access 
WHERE app_id = @app_id 
  AND screen_id IN (@search_screen_id, @bookings_screen_id, @messages_screen_id);

SELECT '✅ Removed role restrictions from main screens' as Status;

-- ============================================================================
-- STEP 4: Verification
-- ============================================================================

SELECT '👤 User Information:' as Info;

SELECT 
  u.id,
  u.email,
  u.first_name,
  u.last_name,
  r.name as role_name,
  aur.assigned_at
FROM app_users u
LEFT JOIN app_user_role_assignments aur ON u.id = aur.user_id
LEFT JOIN user_roles r ON aur.role_id = r.id
WHERE u.email = @user_email AND u.app_id = @app_id;

SELECT '📱 Screen Access:' as Info;

SELECT 
  s.id,
  s.name,
  s.screen_key,
  asa.is_published,
  asa.show_in_tabbar,
  asa.tabbar_order,
  CASE 
    WHEN sra.id IS NULL THEN '✅ Accessible to all'
    ELSE CONCAT('⚠️ Restricted to role: ', r.name)
  END as access_level
FROM app_screens s
JOIN app_screen_assignments asa ON s.id = asa.screen_id AND asa.app_id = @app_id
LEFT JOIN screen_role_access sra ON s.id = sra.screen_id AND sra.app_id = @app_id
LEFT JOIN user_roles r ON sra.role_id = r.id
WHERE s.screen_key IN ('search_properties', 'my_bookings', 'messages')
ORDER BY asa.tabbar_order;

SELECT '✅ Fix Complete! User should now be able to access the app.' as Status;
