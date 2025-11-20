# Role Loading Fix - Summary

## Problem Found
The `app_user_role_assignments` table has TWO role columns:
- `role_id` - References `user_roles` (admin portal roles)
- `app_role_id` - References `app_roles` (mobile app roles)

The middleware was querying the WRONG column (`role_id` instead of `app_role_id`).

## Fix Applied
Changed `/multi_site_manager/src/middleware/mobileAuth.js` line 63:
```sql
-- BEFORE (WRONG):
JOIN app_roles r ON ura.role_id = r.id

-- AFTER (CORRECT):
JOIN app_roles r ON ura.app_role_id = r.id
```

## Actions Taken
1. ✅ Fixed middleware to use `app_role_id`
2. ✅ Assigned Host role to user1@knoxweb.com (user_id: 22)
3. ✅ Removed duplicate role assignment
4. ✅ Restarted API server

## Current State
- User: user1@knoxweb.com
- Role: Host (app_role_id: 26)
- Screens assigned to Host role: 19 screens

## Next Steps
1. **Logout and login again** in the mobile app to get a fresh token
2. The app should now show all 19 screens assigned to the Host role
3. If still showing "No screens available", check the API logs

## Verification Query
```sql
-- Check user's role
SELECT u.email, r.name as role_name, r.display_name 
FROM app_users u 
JOIN app_user_role_assignments ura ON u.id = ura.user_id 
JOIN app_roles r ON ura.app_role_id = r.id 
WHERE u.email = 'user1@knoxweb.com';

-- Check screens assigned to Host role
SELECT COUNT(*) as screen_count 
FROM screen_role_access sra 
JOIN app_roles r ON sra.role_id = r.id 
WHERE r.app_id = 28 AND r.name = 'host' AND sra.can_access = 1;
```

## Important Note
The admin portal role assignment UI was working correctly - it was saving to `app_role_id`. The bug was ONLY in the middleware query that loads the roles during authentication.
