# Role-Based Access Control - Testing Guide

**Date:** November 20, 2025  
**Status:** ✅ IMPLEMENTED

---

## 🎉 WHAT WAS IMPLEMENTED

### 1. Load User Roles in Authentication ✅
**File:** `/multi_site_manager/src/middleware/mobileAuth.js`

**Changes:**
- Added role loading query after user authentication
- Attached `roles`, `role_ids`, and `role_display_names` to `req.user`

**Result:** Every authenticated request now includes user's roles

---

### 2. Filter Screen List by Roles ✅
**File:** `/multi_site_manager/src/controllers/mobileScreensController.js` - `getPublishedScreens`

**Changes:**
- Authenticated users with roles: See only screens assigned to their roles
- Guest users (no auth): See only screens with NO role restrictions
- Uses `screen_role_access` table to filter

**Result:** Tab bar and navigation only show role-appropriate screens

---

### 3. Check Role Access for Individual Screens ✅
**File:** `/multi_site_manager/src/controllers/mobileScreensController.js` - `getScreenWithElements`

**Changes:**
- Checks if screen has role restrictions
- Verifies user has required role
- Returns 403 error if access denied

**Result:** Direct screen access is blocked for unauthorized users

---

## 🧪 TESTING STEPS

### Prerequisites

1. **Assign Roles to Test Users**

```sql
-- Check existing users
SELECT id, email, first_name, last_name FROM app_users WHERE app_id = 28;

-- Assign Guest role to user 20 (larry@bluestoneapps.com)
INSERT INTO app_user_role_assignments (user_id, role_id)
SELECT 20, id FROM app_roles WHERE app_id = 28 AND name = 'guest';

-- Assign Renter role to user 21 (john@test.com)
INSERT INTO app_user_role_assignments (user_id, role_id)
SELECT 21, id FROM app_roles WHERE app_id = 28 AND name = 'renter';

-- Assign Host role to user 22 (user1@knoxweb.com)
INSERT INTO app_user_role_assignments (user_id, role_id)
SELECT 22, id FROM app_roles WHERE app_id = 28 AND name = 'host';

-- Verify assignments
SELECT u.email, r.name as role_name, r.display_name
FROM app_users u
JOIN app_user_role_assignments ura ON u.id = ura.user_id
JOIN app_roles r ON ura.role_id = r.id
WHERE u.app_id = 28;
```

2. **Assign Screens to Roles (via Admin Portal)**

Go to: http://localhost:3001/app/28/roles

For each role, assign appropriate screens:

**Guest Role:**
- ✅ Property Listings
- ✅ Property Details
- ✅ Advanced Search
- ✅ About Us
- ✅ Contact Us
- ✅ Privacy Policy
- ✅ Terms of Service

**Renter Role:**
- ✅ All Guest screens
- ✅ Booking Form
- ✅ User Profile
- ✅ Edit Profile
- ✅ Messages
- ✅ Notifications

**Host Role:**
- ✅ All Renter screens
- ✅ My Listings (when created)
- ✅ Create Listing (when created)
- ✅ Host Profile

---

### Test 1: User with Guest Role

**User:** larry@bluestoneapps.com (Guest role)

**1. Login:**
```bash
curl -X POST http://localhost:3000/api/v1/mobile/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "larry@bluestoneapps.com",
    "password": "your_password",
    "app_id": 28
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 20,
      "email": "larry@bluestoneapps.com",
      "roles": ["guest"],
      "role_ids": [24]
    },
    "token": "eyJhbGc..."
  }
}
```

**2. Get Screen List:**
```bash
curl -X GET http://localhost:3000/api/v1/mobile/apps/28/screens \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected:**
- ✅ Should see: Property Listings, Property Details, Advanced Search, About Us, etc.
- ❌ Should NOT see: Booking Form, User Profile, My Listings

**3. Try to Access Restricted Screen (e.g., Booking Form ID 77):**
```bash
curl -X GET http://localhost:3000/api/v1/mobile/apps/28/screens/77 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "success": false,
  "message": "You do not have permission to access this screen"
}
```

---

### Test 2: User with Renter Role

**User:** john@test.com (Renter role)

**1. Login:**
```bash
curl -X POST http://localhost:3000/api/v1/mobile/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@test.com",
    "password": "your_password",
    "app_id": 28
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 21,
      "email": "john@test.com",
      "roles": ["renter"],
      "role_ids": [25]
    },
    "token": "eyJhbGc..."
  }
}
```

**2. Get Screen List:**
```bash
curl -X GET http://localhost:3000/api/v1/mobile/apps/28/screens \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected:**
- ✅ Should see: All Guest screens + Booking Form, User Profile, Edit Profile
- ❌ Should NOT see: My Listings, Create Listing (Host-only screens)

**3. Try to Access Host-Only Screen:**
```bash
# Assuming "My Listings" screen exists with ID 90
curl -X GET http://localhost:3000/api/v1/mobile/apps/28/screens/90 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "success": false,
  "message": "You do not have permission to access this screen"
}
```

---

### Test 3: User with Host Role

**User:** user1@knoxweb.com (Host role)

**1. Login:**
```bash
curl -X POST http://localhost:3000/api/v1/mobile/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user1@knoxweb.com",
    "password": "your_password",
    "app_id": 28
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 22,
      "email": "user1@knoxweb.com",
      "roles": ["host"],
      "role_ids": [26]
    },
    "token": "eyJhbGc..."
  }
}
```

**2. Get Screen List:**
```bash
curl -X GET http://localhost:3000/api/v1/mobile/apps/28/screens \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected:**
- ✅ Should see: All Renter screens + My Listings, Create Listing, Host Profile
- ✅ Should have access to ALL assigned screens

**3. Access Host-Only Screen:**
```bash
curl -X GET http://localhost:3000/api/v1/mobile/apps/28/screens/90 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "screen": {
      "id": 90,
      "name": "My Listings",
      ...
    }
  }
}
```

---

### Test 4: Guest User (Not Authenticated)

**1. Get Screen List (No Token):**
```bash
curl -X GET http://localhost:3000/api/v1/mobile/apps/28/screens
```

**Expected:**
- ✅ Should see: Only screens with NO role restrictions
- ❌ Should NOT see: Any screens assigned to specific roles

**2. Try to Access Role-Restricted Screen:**
```bash
curl -X GET http://localhost:3000/api/v1/mobile/apps/28/screens/77
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Authentication required to access this screen"
}
```

---

## 📱 MOBILE APP TESTING

### Test in iOS Simulator

**1. Reload the Mobile App:**
```bash
cd mobile_apps/property_listings
npx react-native run-ios
```

**2. Test Guest User:**
- Open app without logging in
- Check tab bar - should only show public screens
- Try to navigate - should not see restricted screens

**3. Test Renter User:**
- Login as john@test.com
- Check tab bar - should see Renter screens
- Should NOT see "My Listings" or "Create Listing"
- Try to access Host screen - should show error or redirect

**4. Test Host User:**
- Login as user1@knoxweb.com
- Check tab bar - should see all Host screens
- Should see "My Listings" and "Create Listing"
- Should be able to access all screens

---

## ✅ VERIFICATION CHECKLIST

After testing, verify:

- [ ] Users with Guest role see only Guest screens
- [ ] Users with Renter role see Guest + Renter screens
- [ ] Users with Host role see Guest + Renter + Host screens
- [ ] Direct API access to restricted screens returns 403
- [ ] Guest users (not logged in) see only public screens
- [ ] Tab bar dynamically updates based on user role
- [ ] Screen access is properly enforced
- [ ] Error messages are clear and appropriate

---

## 🐛 TROUBLESHOOTING

### Issue: User sees all screens regardless of role

**Check:**
1. Are roles assigned to user?
   ```sql
   SELECT * FROM app_user_role_assignments WHERE user_id = ?;
   ```

2. Are screens assigned to roles?
   ```sql
   SELECT * FROM screen_role_access WHERE app_id = 28;
   ```

3. Is API server restarted?
   ```bash
   docker restart multi_app_api
   ```

### Issue: User sees NO screens

**Check:**
1. Does user have at least one role?
2. Are screens assigned to that role?
3. Are screens published?
   ```sql
   SELECT s.name, asa.is_published 
   FROM app_screens s 
   JOIN app_screen_assignments asa ON s.id = asa.screen_id 
   WHERE asa.app_id = 28;
   ```

### Issue: 403 error for screens user should access

**Check:**
1. Is screen assigned to user's role?
   ```sql
   SELECT s.name, r.name as role, sra.can_access
   FROM screen_role_access sra
   JOIN app_screens s ON sra.screen_id = s.id
   JOIN app_roles r ON sra.role_id = r.id
   WHERE sra.app_id = 28 AND s.id = ? AND r.id = ?;
   ```

2. Is `can_access` set to 1 (not 0)?

---

## 📊 DATABASE QUERIES FOR VERIFICATION

### Check User Roles
```sql
SELECT 
  u.id,
  u.email,
  GROUP_CONCAT(r.name) as roles,
  GROUP_CONCAT(r.display_name) as role_names
FROM app_users u
LEFT JOIN app_user_role_assignments ura ON u.id = ura.user_id
LEFT JOIN app_roles r ON ura.role_id = r.id
WHERE u.app_id = 28
GROUP BY u.id, u.email;
```

### Check Screen-Role Assignments
```sql
SELECT 
  s.id,
  s.name as screen_name,
  GROUP_CONCAT(r.name) as assigned_roles
FROM app_screens s
JOIN app_screen_assignments asa ON s.id = asa.screen_id
LEFT JOIN screen_role_access sra ON s.id = sra.screen_id AND sra.app_id = asa.app_id
LEFT JOIN app_roles r ON sra.role_id = r.id
WHERE asa.app_id = 28 AND asa.is_published = 1
GROUP BY s.id, s.name
ORDER BY s.name;
```

### Check What User Can Access
```sql
-- Replace 21 with user_id
SELECT DISTINCT
  s.id,
  s.name,
  'Can Access' as status
FROM app_screens s
JOIN app_screen_assignments asa ON s.id = asa.screen_id
LEFT JOIN screen_role_access sra ON s.id = sra.screen_id AND sra.app_id = asa.app_id
LEFT JOIN app_user_role_assignments ura ON sra.role_id = ura.role_id
WHERE asa.app_id = 28 
  AND asa.is_published = 1
  AND ura.user_id = 21
  AND (sra.can_access = 1 OR sra.id IS NULL)
ORDER BY s.name;
```

---

## 🎯 SUCCESS CRITERIA

Role-based access control is working correctly when:

1. ✅ Different users see different screens based on their roles
2. ✅ Tab bar dynamically shows only accessible screens
3. ✅ Direct API access to restricted screens returns 403
4. ✅ Guest users see only public screens
5. ✅ Authenticated users see role-appropriate screens
6. ✅ Admin portal role assignments are enforced in mobile app
7. ✅ Security is maintained - no unauthorized access

---

## 📝 NEXT STEPS

After verifying role-based access control works:

1. **Create Host-Specific Screens:**
   - My Listings screen
   - Create Listing form
   - Edit Listing form

2. **Assign to Host Role:**
   - Go to http://localhost:3001/app/28/roles
   - Select "Host" role
   - Assign new screens

3. **Test Complete Flow:**
   - Host can create listings
   - Renter cannot access host screens
   - Guest can only browse

4. **Add Role Checks to Property API:**
   - Only hosts can create listings
   - Only hosts can edit their own listings
   - Anyone can view published listings

---

## 🔐 SECURITY NOTES

**What's Protected:**
- ✅ Screen list filtered by role
- ✅ Individual screen access checked
- ✅ 403 errors for unauthorized access

**What Still Needs Protection:**
- ⚠️ Property listing creation (currently any authenticated user can create)
- ⚠️ Property listing editing (needs ownership + role check)
- ⚠️ Booking creation (needs role check)
- ⚠️ Messaging (needs role check)

**Recommendation:** Add role checks to all API endpoints that modify data.
