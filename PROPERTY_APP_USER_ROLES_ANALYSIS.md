# Property Rental App - User Roles & Host Management Analysis
**App ID:** 28  
**Date:** November 20, 2025

---

## 📊 CURRENT STATE: ROLES EXIST BUT NOT FUNCTIONAL

### Summary
The role system is **partially implemented** but **not connected** to the property management workflow. Users with the "Host" role **cannot currently add or manage properties** through the mobile app.

---

## 👥 EXISTING ROLES

### Roles in Database (App ID: 28)

| ID | Role Name | Display Name | Description | Default |
|----|-----------|--------------|-------------|---------|
| 24 | `guest` | Guest | Browse properties without booking - perfect for window shopping and research | ✅ Yes |
| 25 | `renter` | Renter | Book properties, manage reservations, and communicate with hosts | ❌ No |
| 26 | **`host`** | **Host** | **List and manage properties, handle bookings, and communicate with guests** | ❌ No |
| 27 | `premium_renter` | Premium Renter | Enhanced features, exclusive properties, and priority support | ❌ No |
| 28 | `verified_user` | Verified User | ID-verified users with instant booking privileges | ❌ No |

---

## 🔴 CRITICAL ISSUES

### 1. **Users Have NO Roles Assigned**

**Current State:**
```sql
SELECT u.email, r.name as role_name 
FROM app_users u 
LEFT JOIN app_user_role_assignments ura ON u.id = ura.user_id 
LEFT JOIN app_roles r ON ura.role_id = r.id 
WHERE u.app_id = 28;

-- Result: All users show NULL for role_name
```

**Users in System:**
- john@test.com - No role
- larry@bluestoneapps.com - No role  
- user1@knoxweb.com - No role

**Issue:** The `app_user_role_assignments` table is empty. No users have been assigned any roles.

---

### 2. **Roles Have NO Permissions**

**Current State:**
```sql
SELECT rp.name 
FROM role_permission_assignments rpa 
JOIN app_roles r ON rpa.role_id = r.id 
WHERE r.app_id = 28 AND r.name = 'host';

-- Result: 0 rows (no permissions assigned)
```

**Issue:** The `role_permission_assignments` table is empty. Even if users had the "Host" role, it wouldn't grant them any permissions.

---

### 3. **Mobile Auth Doesn't Load Roles**

**File:** `/multi_site_manager/src/middleware/mobileAuth.js`

**Current Implementation:**
```javascript
// Lines 59-67
req.user = {
  id: user.id,
  app_id: user.app_id,
  email: user.email,
  first_name: user.first_name,
  last_name: user.last_name,
  email_verified: user.email_verified
  // ❌ NO ROLES LOADED
};
```

**Issue:** The authentication middleware doesn't query or attach user roles to the request object.

---

### 4. **Property API Doesn't Check Roles**

**File:** `/multi_site_manager/src/controllers/propertyListingsController.js`

**Current Implementation:**
```javascript
// Line 10-17
const userId = req.user?.id;

if (!userId) {
  return res.status(401).json({
    success: false,
    message: 'Authentication required'
  });
}
// ✅ Only checks if authenticated
// ❌ Doesn't check if user has "Host" role
```

**Issue:** Any authenticated user can create listings, regardless of their role.

---

### 5. **No "Create Listing" Screen in Mobile App**

**Screens in Database:**
- ✅ Property Listings (ID: 75) - Browse listings
- ✅ Property Details (ID: 76) - View single listing
- ❌ **NO "Create Listing" screen**
- ❌ **NO "Edit Listing" screen**
- ❌ **NO "My Listings" screen** (in database)

**Mobile App Files:**
- ✅ `MyListingsScreen.tsx` exists (shows user's listings)
- ❌ NOT registered in `AppNavigator.tsx`
- ❌ NOT accessible from any screen
- ❌ NO "Create Listing" form screen

---

## 🔄 CURRENT WORKFLOW (BROKEN)

### How a Host SHOULD Add Properties:
1. User registers/logs in
2. Admin assigns "Host" role to user
3. User sees "My Listings" in navigation
4. User clicks "Add Property" button
5. User fills out property form
6. API validates user has "Host" role
7. Property is created and saved
8. User can manage their listings

### How It ACTUALLY Works (or doesn't):
1. ✅ User registers/logs in
2. ❌ No roles assigned (users have NULL role)
3. ❌ "My Listings" screen not in navigation
4. ❌ No way to create listings from mobile app
5. ⚠️ API would accept listing creation from ANY authenticated user
6. ❌ No role validation
7. ❌ User cannot manage listings (screen not accessible)

---

## 🛠️ WHAT NEEDS TO BE FIXED

### Priority 1: Role Assignment System

#### A. Assign Default Roles on Registration

**File to Modify:** `/multi_site_manager/src/controllers/mobileAuthController.js`

**Add after user creation:**
```javascript
// After inserting user in register endpoint
const defaultRole = await db.query(
  'SELECT id FROM app_roles WHERE app_id = ? AND is_default = 1',
  [appId]
);

if (defaultRole && defaultRole.length > 0) {
  await db.query(
    'INSERT INTO app_user_role_assignments (user_id, role_id) VALUES (?, ?)',
    [userId, defaultRole[0].id]
  );
}
```

#### B. Admin Portal - Assign Roles to Existing Users

**URL:** http://localhost:3001/app/28/app-users

**Add UI to:**
1. View user's current roles
2. Assign/remove roles
3. Bulk role assignment

---

### Priority 2: Load Roles in Authentication

**File to Modify:** `/multi_site_manager/src/middleware/mobileAuth.js`

**Add role loading:**
```javascript
// After line 56 (after fetching user)
const roles = await db.query(
  `SELECT r.id, r.name, r.display_name 
   FROM app_user_role_assignments ura
   JOIN app_roles r ON ura.role_id = r.id
   WHERE ura.user_id = ?`,
  [user.id]
);

req.user = {
  id: user.id,
  app_id: user.app_id,
  email: user.email,
  first_name: user.first_name,
  last_name: user.last_name,
  email_verified: user.email_verified,
  roles: roles.map(r => r.name), // ['guest', 'host']
  role_ids: roles.map(r => r.id)
};
```

---

### Priority 3: Role-Based Access Control for Listings

**File to Modify:** `/multi_site_manager/src/controllers/propertyListingsController.js`

**Add role check to createListing:**
```javascript
// After line 17 (after userId check)
const hasHostRole = req.user?.roles?.includes('host');

if (!hasHostRole) {
  return res.status(403).json({
    success: false,
    message: 'Only users with Host role can create listings'
  });
}
```

---

### Priority 4: Create "My Listings" Screen in Database

**SQL to add screen:**
```sql
-- Insert screen
INSERT INTO app_screens (name, category, description, screen_key)
VALUES (
  'My Listings',
  'Property',
  'Manage your property listings',
  'my_listings_28_' || UNIX_TIMESTAMP()
);

SET @screen_id = LAST_INSERT_ID();

-- Assign to app
INSERT INTO app_screen_assignments (
  app_id, screen_id, is_published, is_active,
  show_in_tabbar, tabbar_order, tabbar_label, tabbar_icon
)
VALUES (
  28, @screen_id, 1, 1,
  1, 4, 'My Listings', 'list'
);

-- Add screen elements
INSERT INTO screen_element_instances (screen_id, element_id, field_key, label, display_order)
VALUES
  (@screen_id, (SELECT id FROM screen_elements WHERE element_type = 'heading'), 'my_listings_heading', 'My Properties', 0),
  (@screen_id, (SELECT id FROM screen_elements WHERE element_type = 'button'), 'add_listing_button', 'Add New Property', 1),
  (@screen_id, (SELECT id FROM screen_elements WHERE element_type = 'paragraph'), 'listings_list', 'Your Listings', 2);
```

---

### Priority 5: Register MyListingsScreen in Navigation

**File to Modify:** `/mobile_apps/property_listings/src/navigation/AppNavigator.tsx`

**Add import:**
```typescript
import MyListingsScreen from '../screens/MyListingsScreen';
```

**Add to authenticated stack:**
```typescript
<Stack.Screen
  name="MyListings"
  component={MyListingsScreen}
  options={{ title: 'My Listings' }}
/>
```

---

### Priority 6: Create "Add/Edit Listing" Form Screen

**Options:**

#### Option A: Use DynamicScreen with Form Elements
- Create screen in admin portal
- Add form elements (text fields, dropdowns, image upload)
- Configure to submit to property listings API
- **Pros:** No code changes needed
- **Cons:** Limited UX, no multi-step form

#### Option B: Create Dedicated React Native Screen
- Create `CreateListingScreen.tsx`
- Multi-step form (Basic Info → Location → Details → Photos → Pricing)
- Better UX with validation
- **Pros:** Better user experience
- **Cons:** Requires mobile app development

---

### Priority 7: Add "Create Listing" Button to MyListingsScreen

**File to Modify:** `/mobile_apps/property_listings/src/screens/MyListingsScreen.tsx`

**Add floating action button:**
```typescript
// After line 150 (in return statement)
<TouchableOpacity
  style={styles.fab}
  onPress={() => navigation.navigate('CreateListing')}
>
  <Icon name="add" size={24} color="#fff" />
</TouchableOpacity>

// Add to styles
fab: {
  position: 'absolute',
  right: 20,
  bottom: 20,
  width: 56,
  height: 56,
  borderRadius: 28,
  backgroundColor: '#007AFF',
  justifyContent: 'center',
  alignItems: 'center',
  elevation: 4,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
}
```

---

## 🎯 IMPLEMENTATION ROADMAP

### Phase 1: Basic Role System (1-2 days)

**Tasks:**
- [ ] Modify `mobileAuthController.js` to assign default role on registration
- [ ] Modify `mobileAuth.js` middleware to load user roles
- [ ] Update `propertyListingsController.js` to check for "Host" role
- [ ] Manually assign "Host" role to test users in database
- [ ] Test that only hosts can create listings

**SQL to assign Host role to existing user:**
```sql
-- Assign Host role to john@test.com
INSERT INTO app_user_role_assignments (user_id, role_id)
SELECT 21, id FROM app_roles WHERE app_id = 28 AND name = 'host';
```

---

### Phase 2: My Listings Screen (1 day)

**Tasks:**
- [ ] Create "My Listings" screen in admin portal database
- [ ] Register `MyListingsScreen` in `AppNavigator.tsx`
- [ ] Add to tab bar navigation
- [ ] Test viewing user's listings
- [ ] Add "Create Listing" button

---

### Phase 3: Create Listing Form (2-3 days)

**Option A: Quick (DynamicScreen)**
- [ ] Create "Create Listing" screen in admin portal
- [ ] Add all form fields (title, description, location, etc.)
- [ ] Configure image upload for photos
- [ ] Configure amenities selection
- [ ] Test form submission

**Option B: Better UX (Custom Screen)**
- [ ] Create `CreateListingScreen.tsx`
- [ ] Implement multi-step form
- [ ] Add validation
- [ ] Add image picker for multiple photos
- [ ] Add amenities selector
- [ ] Add location picker/map
- [ ] Test complete flow

---

### Phase 4: Admin Portal Role Management (1-2 days)

**Tasks:**
- [ ] Add role display to App Users page
- [ ] Add role assignment UI
- [ ] Add role filter/search
- [ ] Test bulk role assignment

---

### Phase 5: Role Permissions (Optional, 2-3 days)

**Tasks:**
- [ ] Define permissions (create_listing, edit_listing, delete_listing, etc.)
- [ ] Assign permissions to roles
- [ ] Update API to check permissions
- [ ] Create permission management UI in admin portal

---

## 📋 QUICK FIX FOR TESTING

### To Allow a User to Create Listings RIGHT NOW:

**1. Assign Host Role:**
```sql
-- For john@test.com (user_id = 21)
INSERT INTO app_user_role_assignments (user_id, role_id)
SELECT 21, id FROM app_roles WHERE app_id = 28 AND name = 'host';
```

**2. Temporarily Remove Role Check:**
The API currently doesn't check roles, so any authenticated user can create listings via API.

**3. Use API Directly:**
```bash
# Login to get token
curl -X POST http://localhost:3000/api/v1/mobile/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@test.com",
    "password": "your_password",
    "app_id": 28
  }'

# Create listing
curl -X POST http://localhost:3000/api/v1/apps/28/listings \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Beautiful Beach House",
    "description": "Stunning oceanfront property",
    "city": "Miami",
    "country": "USA",
    "price_per_night": 250,
    "bedrooms": 3,
    "bathrooms": 2,
    "guests_max": 6
  }'
```

**4. View in MyListingsScreen:**
- Temporarily add `MyListingsScreen` to navigation
- Navigate to it manually
- See your created listings

---

## 🔍 VERIFICATION CHECKLIST

### After Implementation:

- [ ] New users automatically get "Guest" role
- [ ] Admin can assign "Host" role to users
- [ ] Only users with "Host" role can create listings
- [ ] "My Listings" appears in tab bar for hosts
- [ ] Hosts can view their listings
- [ ] Hosts can create new listings
- [ ] Hosts can edit their listings
- [ ] Hosts can delete their listings
- [ ] Hosts can publish/unpublish listings
- [ ] Non-hosts cannot access listing management

---

## 📊 CURRENT vs DESIRED STATE

| Feature | Current | Desired |
|---------|---------|---------|
| Role Assignment | ❌ Manual SQL only | ✅ Auto on registration + Admin UI |
| Role Loading | ❌ Not loaded | ✅ Loaded in auth middleware |
| Role Checking | ❌ Not enforced | ✅ Enforced in API |
| My Listings Screen | ⚠️ Code exists, not accessible | ✅ In tab bar for hosts |
| Create Listing | ❌ No UI | ✅ Form screen |
| Edit Listing | ❌ No UI | ✅ Edit screen |
| Role-based Navigation | ❌ Same for all users | ✅ Different tabs per role |

---

## 🎯 CONCLUSION

### Current State:
- ✅ Roles are defined in database
- ✅ Property listing API exists
- ✅ MyListingsScreen component exists
- ❌ **No users have roles assigned**
- ❌ **Roles not loaded in authentication**
- ❌ **No role-based access control**
- ❌ **No UI to create listings**
- ❌ **MyListingsScreen not accessible**

### To Make It Work:
1. **Immediate** (1 day): Load roles in auth, add role checks to API
2. **Short-term** (2-3 days): Add MyListings to navigation, create listing form
3. **Medium-term** (1 week): Admin portal role management, permissions system

### Recommended Next Steps:
1. Start with **Phase 1** (Basic Role System)
2. Manually assign Host role to test users
3. Implement **Phase 2** (My Listings Screen)
4. Choose Option A or B for **Phase 3** (Create Listing Form)

**Estimated Time to Full Functionality:** 5-7 days
