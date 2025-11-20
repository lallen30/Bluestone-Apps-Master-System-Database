-- Quick Fix: Create missing app_roles for existing apps and clarify role systems
-- This addresses the immediate issues while we plan the full consolidation

-- 1. Create missing app_roles for all apps that don't have them
INSERT INTO app_roles (app_id, name, display_name, description, is_default)
SELECT DISTINCT a.id, 'all_users', 'All Users', 'Default role with access to all published screens', TRUE
FROM apps a
WHERE NOT EXISTS (
  SELECT 1 FROM app_roles ar WHERE ar.app_id = a.id AND ar.name = 'all_users'
);

INSERT INTO app_roles (app_id, name, display_name, description, is_default)
SELECT DISTINCT a.id, 'premium', 'Premium Users', 'Users with premium features and exclusive screens', FALSE
FROM apps a
WHERE NOT EXISTS (
  SELECT 1 FROM app_roles ar WHERE ar.app_id = a.id AND ar.name = 'premium'
);

INSERT INTO app_roles (app_id, name, display_name, description, is_default)
SELECT DISTINCT a.id, 'admin', 'Administrators', 'Users with administrative privileges', FALSE
FROM apps a
WHERE NOT EXISTS (
  SELECT 1 FROM app_roles ar WHERE ar.app_id = a.id AND ar.name = 'admin'
);

-- 2. Assign all existing mobile users to default "all_users" role
INSERT INTO app_user_role_assignments (user_id, role_id, app_role_id)
SELECT 
  au.id as user_id,
  NULL as role_id,
  ar.id as app_role_id
FROM app_users au
JOIN app_roles ar ON ar.app_id = au.app_id AND ar.is_default = TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM app_user_role_assignments aura 
  WHERE aura.user_id = au.id 
  AND aura.app_role_id = ar.id
);

-- 3. Grant "all_users" role access to all published screens
INSERT INTO screen_role_access (screen_id, role_id, app_id, can_access)
SELECT 
  asa.screen_id,
  ar.id as role_id,
  asa.app_id,
  TRUE
FROM app_screen_assignments asa
JOIN app_roles ar ON ar.app_id = asa.app_id AND ar.name = 'all_users'
WHERE asa.is_published = 1
AND NOT EXISTS (
  SELECT 1 FROM screen_role_access sra 
  WHERE sra.screen_id = asa.screen_id 
  AND sra.role_id = ar.id 
  AND sra.app_id = asa.app_id
);

-- 4. Verify the fix
SELECT 
  'App Roles Created' as check_type,
  COUNT(*) as count
FROM app_roles
WHERE app_id = 28

UNION ALL

SELECT 
  'User Role Assignments' as check_type,
  COUNT(*) as count
FROM app_user_role_assignments aura
JOIN app_users au ON aura.user_id = au.id
WHERE au.app_id = 28 AND aura.app_role_id IS NOT NULL

UNION ALL

SELECT 
  'Screen Access Rules' as check_type,
  COUNT(*) as count
FROM screen_role_access
WHERE app_id = 28;
