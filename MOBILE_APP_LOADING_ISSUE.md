# Mobile App Loading Issue - Diagnosis & Fix

**Date:** November 20, 2025  
**Issue:** App stuck on "Loading..." after login  
**User:** user1@knoxweb.com  
**App ID:** 28 (AirPnP)

---

## 🔍 **DIAGNOSIS**

### **What's Happening:**

The app successfully logs in, but gets stuck at the `InitialScreenLoader` component which shows:
```
App Name
Version 1.0
Loading...
```

### **Root Cause:**

The `InitialScreenLoader` in `AppNavigator.tsx` is trying to:
1. Fetch screens via `/mobile/apps/28/screens`
2. Navigate to the first screen
3. But something is failing silently

### **Possible Issues:**

1. **API Endpoint Not Returning Data**
   - The endpoint might be failing
   - Or returning empty array
   - Or the response format is wrong

2. **Navigation Failing**
   - The screen ID might be invalid
   - The DynamicScreen might be crashing
   - Missing screen content/elements

3. **Authentication Issue**
   - Token not being sent correctly
   - User roles not set up
   - Screen role access blocking

---

## 🧪 **TESTING STEPS**

### **Step 1: Check API Response**

Test the screens endpoint:
```bash
# Get the auth token first
TOKEN="<user1_token_here>"

# Test screens endpoint
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/v1/mobile/apps/28/screens
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "screens": [
      {
        "id": 112,
        "name": "Search Properties",
        "show_in_tabbar": 1,
        "tabbar_order": 1,
        ...
      },
      ...
    ],
    "total": 40
  }
}
```

### **Step 2: Check User Roles**

```sql
SELECT 
  u.id,
  u.email,
  u.first_name,
  u.last_name,
  aur.role_id,
  r.role_name
FROM app_users u
LEFT JOIN app_user_roles aur ON u.id = aur.user_id
LEFT JOIN user_roles r ON aur.role_id = r.id
WHERE u.email = 'user1@knoxweb.com' AND u.app_id = 28;
```

### **Step 3: Check Screen Role Access**

```sql
SELECT 
  s.id,
  s.name,
  sra.role_id,
  r.role_name,
  sra.can_access
FROM app_screens s
LEFT JOIN screen_role_access sra ON s.id = sra.screen_id AND sra.app_id = 28
LEFT JOIN user_roles r ON sra.role_id = r.id
WHERE s.id IN (112, 114, 116)
ORDER BY s.id, sra.role_id;
```

---

## 🔧 **SOLUTIONS**

### **Solution 1: Assign User a Role**

If user has no roles, they can't access any screens:

```sql
-- Get or create a "Renter" role
SET @role_id = (SELECT id FROM user_roles WHERE role_name = 'Renter' AND app_id = 28 LIMIT 1);

-- If no role exists, create one
INSERT INTO user_roles (app_id, role_name, description, is_active, created_at, updated_at)
SELECT 28, 'Renter', 'Standard renter role', 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM user_roles WHERE role_name = 'Renter' AND app_id = 28);

SET @role_id = (SELECT id FROM user_roles WHERE role_name = 'Renter' AND app_id = 28 LIMIT 1);

-- Assign role to user
SET @user_id = (SELECT id FROM app_users WHERE email = 'user1@knoxweb.com' AND app_id = 28);

INSERT INTO app_user_roles (user_id, role_id, assigned_at)
VALUES (@user_id, @role_id, NOW())
ON DUPLICATE KEY UPDATE assigned_at = NOW();
```

### **Solution 2: Remove Role Restrictions from Screens**

If screens have role restrictions but user has no matching role:

```sql
-- Remove all role restrictions for the 3 main screens
DELETE FROM screen_role_access 
WHERE app_id = 28 
  AND screen_id IN (112, 114, 116);
```

### **Solution 3: Add Role Access for User's Role**

If user has a role, but screens don't allow that role:

```sql
-- Grant access to Renter role for all 3 screens
SET @role_id = (SELECT id FROM user_roles WHERE role_name = 'Renter' AND app_id = 28 LIMIT 1);

INSERT INTO screen_role_access (app_id, screen_id, role_id, can_access, created_at)
VALUES
  (28, 112, @role_id, 1, NOW()),
  (28, 114, @role_id, 1, NOW()),
  (28, 116, @role_id, 1, NOW())
ON DUPLICATE KEY UPDATE can_access = 1;
```

### **Solution 4: Check Mobile App Console**

Enable React Native debugging:
1. Shake device/emulator
2. Select "Debug"
3. Open Chrome DevTools
4. Check Console for errors
5. Check Network tab for API calls

Look for:
- Failed API calls
- 403 Forbidden errors
- Navigation errors
- Component crashes

---

## 🚀 **RECOMMENDED FIX**

Run this comprehensive fix:

```sql
USE multi_site_manager;

SET @app_id = 28;
SET @user_email = 'user1@knoxweb.com';

-- 1. Get or create Renter role
INSERT INTO user_roles (app_id, role_name, description, is_active, created_at, updated_at)
SELECT @app_id, 'Renter', 'Standard renter role', 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM user_roles WHERE role_name = 'Renter' AND app_id = @app_id);

SET @role_id = (SELECT id FROM user_roles WHERE role_name = 'Renter' AND app_id = @app_id LIMIT 1);

-- 2. Assign role to user
SET @user_id = (SELECT id FROM app_users WHERE email = @user_email AND app_id = @app_id);

INSERT INTO app_user_roles (user_id, role_id, assigned_at)
VALUES (@user_id, @role_id, NOW())
ON DUPLICATE KEY UPDATE assigned_at = NOW();

-- 3. Remove role restrictions from main screens (make them accessible to all)
DELETE FROM screen_role_access 
WHERE app_id = @app_id 
  AND screen_id IN (
    SELECT id FROM app_screens WHERE screen_key IN ('search_properties', 'my_bookings', 'messages')
  );

-- 4. Verify
SELECT 
  'User Roles:' as Info,
  u.email,
  r.role_name
FROM app_users u
JOIN app_user_roles aur ON u.id = aur.user_id
JOIN user_roles r ON aur.role_id = r.id
WHERE u.email = @user_email AND u.app_id = @app_id;

SELECT 
  'Screen Access:' as Info,
  s.name,
  CASE 
    WHEN sra.id IS NULL THEN 'No restrictions (accessible to all)'
    ELSE CONCAT('Restricted to role: ', r.role_name)
  END as access_level
FROM app_screens s
LEFT JOIN screen_role_access sra ON s.id = sra.screen_id AND sra.app_id = @app_id
LEFT JOIN user_roles r ON sra.role_id = r.id
WHERE s.screen_key IN ('search_properties', 'my_bookings', 'messages')
ORDER BY s.id;
```

---

## 📱 **AFTER FIXING**

1. **Restart the mobile app**
2. **Login again** with user1@knoxweb.com
3. **Should see:**
   - Bottom tab bar with 3 tabs
   - Search Properties screen loads
   - Can navigate between tabs

---

## 🐛 **IF STILL NOT WORKING**

### **Check React Native Logs:**

```bash
# iOS
npx react-native log-ios

# Android
npx react-native log-android
```

### **Check API Logs:**

```bash
# Backend logs
docker logs multi_app_api -f
```

### **Manual API Test:**

```bash
# Login to get token
curl -X POST http://localhost:3000/api/v1/mobile/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user1@knoxweb.com",
    "password": "password123",
    "app_id": 28
  }'

# Use the token to fetch screens
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:3000/api/v1/mobile/apps/28/screens
```

---

## 💡 **PREVENTION**

To avoid this in the future:

1. **Always assign new users a default role** (e.g., "Renter")
2. **Make main screens accessible to all roles** (no restrictions)
3. **Test with a real user account** before deploying
4. **Add better error handling** in InitialScreenLoader
5. **Show error messages** instead of infinite loading

---

**Next Steps:**
1. Run the recommended fix SQL
2. Restart mobile app
3. Test login
4. Report results
