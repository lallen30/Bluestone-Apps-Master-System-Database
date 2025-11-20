# Screen Role Access - Current State & Implementation

**Date:** November 20, 2025  
**Question:** Will assigning screens to roles prevent Renters from accessing Host-only screens?

---

## ❌ **SHORT ANSWER: NO, IT WON'T WORK YET**

The admin portal allows you to assign screens to roles, and the data is saved correctly in the `screen_role_access` table. **However, the mobile API does NOT enforce these restrictions.**

---

## 🔍 **CURRENT STATE**

### ✅ What Works (Admin Portal)

**URL:** http://localhost:3001/app/28/roles

1. **Create Roles** ✅
   - Guest, Renter, Host, Premium Renter, Verified User

2. **Assign Screens to Roles** ✅
   - Select which screens each role can access
   - Data saved to `screen_role_access` table

3. **Assign Roles to Users** ✅
   - URL: http://localhost:3001/app/28/app-users
   - Assign roles to specific users

### ❌ What Doesn't Work (Mobile API)

**The mobile API ignores role-based screen access!**

#### Evidence:

**File:** `/multi_site_manager/src/controllers/mobileScreensController.js`

**Line 12-13 (getPublishedScreens):**
```javascript
// For now, always return all published, active screens for the app.
// We can re-introduce role-based filtering later when needed.
```

**Line 98-99 (getScreenWithElements):**
```javascript
// Skip role-based access checks for now
// We can re-introduce this later when role management is fully set up
```

---

## 📊 **DATABASE STATE**

### ✅ `screen_role_access` Table Exists

```sql
DESCRIBE screen_role_access;
```

| Field | Type | Description |
|-------|------|-------------|
| id | int | Primary key |
| screen_id | int | Which screen |
| role_id | int | Which role |
| app_id | int | Which app |
| can_access | tinyint(1) | 1 = can access, 0 = denied |
| created_at | timestamp | When assigned |

### ✅ Data is Being Saved

```sql
SELECT s.name as screen_name, r.name as role_name, sra.can_access
FROM screen_role_access sra
JOIN app_screens s ON sra.screen_id = s.id
JOIN app_roles r ON sra.role_id = r.id
WHERE sra.app_id = 28
LIMIT 10;
```

**Result:**
| Screen Name | Role Name | Can Access |
|-------------|-----------|------------|
| Property Listings | guest | 1 |
| Property Details | guest | 1 |
| Advanced Search | guest | 1 |
| Property Listings | renter | 1 |
| Property Details | renter | 1 |
| ... | ... | ... |

**The data is there!** But the API doesn't check it.

---

## 🔴 **THE PROBLEM**

### Scenario:
1. Admin creates "Create Listing" screen
2. Admin assigns it ONLY to "Host" role
3. Admin assigns "Renter" role to user John
4. John logs into mobile app

### Expected Behavior:
- ❌ John should NOT see "Create Listing" in navigation
- ❌ John should get 403 error if he tries to access it directly

### Actual Behavior:
- ✅ John SEES "Create Listing" in navigation (all published screens shown)
- ✅ John CAN access the screen (no role check)
- ✅ John CAN submit the form (API doesn't check roles)

**Result:** Role-based screen access is NOT enforced.

---

## 🛠️ **WHAT NEEDS TO BE FIXED**

### Fix 1: Load User Roles in Authentication

**File:** `/multi_site_manager/src/middleware/mobileAuth.js`

**Current (Line 59-67):**
```javascript
req.user = {
  id: user.id,
  app_id: user.app_id,
  email: user.email,
  first_name: user.first_name,
  last_name: user.last_name,
  email_verified: user.email_verified
  // ❌ NO ROLES
};
```

**Fixed:**
```javascript
// Load user's roles
const rolesResult = await db.query(
  `SELECT r.id, r.name, r.display_name 
   FROM app_user_role_assignments ura
   JOIN app_roles r ON ura.role_id = r.id
   WHERE ura.user_id = ?`,
  [user.id]
);

const roles = Array.isArray(rolesResult) && Array.isArray(rolesResult[0]) 
  ? rolesResult[0] 
  : rolesResult;

req.user = {
  id: user.id,
  app_id: user.app_id,
  email: user.email,
  first_name: user.first_name,
  last_name: user.last_name,
  email_verified: user.email_verified,
  roles: (roles || []).map(r => r.name), // ['guest', 'renter']
  role_ids: (roles || []).map(r => r.id) // [24, 25]
};
```

---

### Fix 2: Filter Screens by User Roles

**File:** `/multi_site_manager/src/controllers/mobileScreensController.js`

**Current (Line 14-35):**
```javascript
const query = `SELECT 
    s.id, s.name, s.description, s.category, s.icon,
    asa.display_order, asa.show_in_tabbar, asa.tabbar_order
   FROM app_screen_assignments asa
   JOIN app_screens s ON asa.screen_id = s.id
   WHERE asa.app_id = ? 
     AND asa.is_published = 1 
     AND asa.is_active = 1
   ORDER BY asa.display_order`;
```

**Fixed:**
```javascript
const userId = req.user?.id;
const userRoleIds = req.user?.role_ids || [];

// If user is authenticated and has roles, filter by role access
let query, params;

if (userId && userRoleIds.length > 0) {
  // Filter screens by user's roles
  const roleIdPlaceholders = userRoleIds.map(() => '?').join(',');
  
  query = `SELECT DISTINCT
      s.id, s.name, s.description, s.category, s.icon,
      asa.display_order, asa.show_in_tabbar, asa.tabbar_order,
      asa.tabbar_icon, asa.tabbar_label
     FROM app_screen_assignments asa
     JOIN app_screens s ON asa.screen_id = s.id
     LEFT JOIN screen_role_access sra ON sra.screen_id = s.id 
       AND sra.app_id = asa.app_id
       AND sra.role_id IN (${roleIdPlaceholders})
     WHERE asa.app_id = ? 
       AND asa.is_published = 1 
       AND asa.is_active = 1
       AND s.is_active = 1
       AND (sra.can_access = 1 OR sra.id IS NULL)
     ORDER BY asa.display_order`;
  
  params = [...userRoleIds, appId];
} else {
  // Guest user - show only screens with no role restrictions
  query = `SELECT DISTINCT
      s.id, s.name, s.description, s.category, s.icon,
      asa.display_order, asa.show_in_tabbar, asa.tabbar_order
     FROM app_screen_assignments asa
     JOIN app_screens s ON asa.screen_id = s.id
     LEFT JOIN screen_role_access sra ON sra.screen_id = s.id 
       AND sra.app_id = asa.app_id
     WHERE asa.app_id = ? 
       AND asa.is_published = 1 
       AND asa.is_active = 1
       AND s.is_active = 1
       AND sra.id IS NULL
     ORDER BY asa.display_order`;
  
  params = [appId];
}

const screensResult = await db.query(query, params);
```

---

### Fix 3: Check Role Access When Loading Screen

**File:** `/multi_site_manager/src/controllers/mobileScreensController.js`

**Replace Line 98-99:**
```javascript
// Skip role-based access checks for now
// We can re-introduce this later when role management is fully set up
```

**With:**
```javascript
// Check role-based access
const userId = requestUserId;
const userRoleIds = req.user?.role_ids || [];

if (userId && userRoleIds.length > 0) {
  // Check if user's roles have access to this screen
  const roleIdPlaceholders = userRoleIds.map(() => '?').join(',');
  
  const accessResult = await db.query(
    `SELECT can_access 
     FROM screen_role_access 
     WHERE screen_id = ? 
       AND app_id = ? 
       AND role_id IN (${roleIdPlaceholders})
       AND can_access = 1
     LIMIT 1`,
    [screenId, appId, ...userRoleIds]
  );
  
  const hasAccess = Array.isArray(accessResult) && Array.isArray(accessResult[0]) 
    ? accessResult[0] 
    : accessResult;
  
  // If role restrictions exist but user doesn't have access
  const roleRestrictionsExist = await db.query(
    'SELECT id FROM screen_role_access WHERE screen_id = ? AND app_id = ? LIMIT 1',
    [screenId, appId]
  );
  
  const restrictions = Array.isArray(roleRestrictionsExist) && Array.isArray(roleRestrictionsExist[0]) 
    ? roleRestrictionsExist[0] 
    : roleRestrictionsExist;
  
  if (restrictions && restrictions.length > 0 && (!hasAccess || hasAccess.length === 0)) {
    return res.status(403).json({
      success: false,
      message: 'You do not have permission to access this screen'
    });
  }
}
```

---

## 🎯 **IMPLEMENTATION STEPS**

### Step 1: Update Mobile Auth Middleware (30 min)
- [ ] Add role loading query
- [ ] Attach roles to `req.user`
- [ ] Test that roles are loaded

### Step 2: Update getPublishedScreens (1 hour)
- [ ] Add role-based filtering query
- [ ] Handle authenticated vs guest users
- [ ] Test that screens are filtered correctly

### Step 3: Update getScreenWithElements (1 hour)
- [ ] Add role access check
- [ ] Return 403 if user lacks permission
- [ ] Test access restrictions

### Step 4: Test Complete Flow (1 hour)
- [ ] Create test roles (Guest, Renter, Host)
- [ ] Assign screens to roles
- [ ] Assign roles to test users
- [ ] Test mobile app shows correct screens
- [ ] Test direct access is blocked

**Total Time:** ~3-4 hours

---

## 🧪 **TESTING SCENARIO**

### Setup:
1. **Roles:**
   - Guest: Can view Property Listings, Property Details
   - Renter: Guest + Booking Form, My Bookings
   - Host: Renter + Create Listing, Edit Listing, My Listings

2. **Screens:**
   - Property Listings → Guest, Renter, Host
   - Property Details → Guest, Renter, Host
   - Booking Form → Renter, Host
   - Create Listing → Host ONLY
   - My Listings → Host ONLY

3. **Users:**
   - john@test.com → Renter role
   - larry@bluestoneapps.com → Host role

### Expected Results:

**John (Renter) logs in:**
- ✅ Sees: Property Listings, Property Details, Booking Form
- ❌ Does NOT see: Create Listing, My Listings
- ❌ Cannot access Create Listing (403 error)

**Larry (Host) logs in:**
- ✅ Sees: Property Listings, Property Details, Booking Form, Create Listing, My Listings
- ✅ Can access all screens

**Guest (not logged in):**
- ✅ Sees: Property Listings, Property Details
- ❌ Does NOT see: Booking Form, Create Listing, My Listings

---

## 📋 **CURRENT vs DESIRED STATE**

| Feature | Current | After Fix |
|---------|---------|-----------|
| Admin assigns screens to roles | ✅ Works | ✅ Works |
| Data saved to database | ✅ Works | ✅ Works |
| Roles loaded in auth | ❌ Not loaded | ✅ Loaded |
| Screen list filtered by role | ❌ Shows all | ✅ Filtered |
| Screen access checked | ❌ No check | ✅ 403 if denied |
| Tab bar shows role-specific screens | ❌ Shows all | ✅ Role-based |

---

## 🔐 **SECURITY IMPLICATIONS**

### Current Risk:
**ANY authenticated user can access ANY published screen**, regardless of role assignments.

### Example Attack:
1. User registers as "Renter"
2. User discovers screen ID for "Create Listing" (e.g., ID 85)
3. User calls API directly: `GET /api/v1/mobile/apps/28/screens/85`
4. API returns screen (no role check)
5. User submits form to create listing
6. Listing is created (property API doesn't check roles either)

**Result:** Renters can create listings, even though they shouldn't have access.

### After Fix:
- ✅ Screen list API filters by role
- ✅ Screen access API checks role
- ✅ User gets 403 error if they lack permission
- ✅ Direct API access is blocked

---

## 🎯 **ANSWER TO YOUR QUESTION**

**Q:** "Will assigning screens to roles prevent Renters from accessing Host-only screens?"

**A:** **NO, not currently.** The admin portal saves the assignments correctly, but the mobile API **does not enforce them**. 

### To Make It Work:
1. Load user roles in authentication middleware
2. Filter screen list by user's roles
3. Check role access when loading individual screens
4. Also add role checks to property listing API

**Estimated Time:** 3-4 hours of development + testing

### Quick Test:
After implementing the fixes, you can verify:
```bash
# Login as Renter
curl -X POST http://localhost:3000/api/v1/mobile/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "renter@test.com", "password": "pass", "app_id": 28}'

# Try to access Host-only screen
curl -X GET http://localhost:3000/api/v1/mobile/apps/28/screens/85 \
  -H "Authorization: Bearer RENTER_TOKEN"

# Expected: 403 Forbidden
# Actual (before fix): 200 OK with screen data
```

---

## 💡 **RECOMMENDATION**

**Implement role-based access control BEFORE creating Host-specific screens.**

Otherwise, you'll have a false sense of security where the admin portal shows screens are restricted, but the mobile app allows everyone to access them.

**Priority:** HIGH - This is a security issue, not just a feature gap.
