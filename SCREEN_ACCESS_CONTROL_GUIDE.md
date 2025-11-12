# 🔐 Screen Access Control Guide

## Overview
Screen-level access control allows Master Admins to restrict which mobile users can see specific screens based on assigned roles. This enables premium features, gated content, and user segmentation.

---

## How It Works

### Role-Based System
Instead of granting access to individual users (which doesn't scale), we use **roles**:
- Roles are created per app
- Users are assigned one or more roles
- Screens are configured to be accessible by specific roles
- Mobile API filters screens based on user's assigned roles

### Default Roles
Three roles are automatically created for each app:

1. **All Users** (default role)
   - Assigned to new users automatically
   - Has access to all published screens by default
   - Cannot be deleted

2. **Premium Users**
   - For users with premium subscriptions
   - Access to exclusive premium screens
   - Manually assigned by admin

3. **Admin Users**
   - For users with administrative privileges
   - Access to admin-only screens
   - Manually assigned by admin

---

## Database Structure

### Tables Created

**1. `app_roles`**
```sql
id, app_id, name, display_name, description, is_default, created_at, updated_at
```
Stores roles for each app.

**2. `screen_role_access`**
```sql
id, screen_id, role_id, app_id, can_access, created_at
```
Maps which roles can access which screens.

**3. `app_user_role_assignments`** (updated)
```sql
id, user_id, role_id (nullable), app_role_id (new), assigned_by, assigned_at
```
Assigns roles to users.

---

## API Endpoints

### For Master Admins (Admin Portal)

**Get App Roles**
```http
GET /api/v1/apps/:appId/roles
Response: { roles: [{ id, name, display_name, description, is_default }] }
```

**Create New Role**
```http
POST /api/v1/apps/:appId/roles
Body: { name: "vip", display_name: "VIP Users", description: "..." }
Response: { success: true, data: { id: 4 } }
```

**Get Screen Access Settings**
```http
GET /api/v1/apps/:appId/screens/:screenId/access
Response: {
  roles: [
    { id: 1, name: "all_users", display_name: "All Users", can_access: 1 },
    { id: 2, name: "premium", display_name: "Premium Users", can_access: 0 }
  ]
}
```

**Update Screen Access**
```http
PUT /api/v1/apps/:appId/screens/:screenId/access
Body: { role_ids: [1, 2] }  // Only these roles can access
Response: { success: true }
```

**Get User's Roles**
```http
GET /api/v1/app-users/:userId/roles
Response: { roles: [{ id, name, display_name, assigned_at }] }
```

**Update User's Roles**
```http
PUT /api/v1/app-users/:userId/roles
Body: { role_ids: [1, 2] }  // Assign these roles to user
Response: { success: true }
```

### For Mobile Apps

**Get Published Screens (Filtered by Role)**
```http
GET /api/v1/mobile/apps/:appId/screens
Headers: { Authorization: "Bearer [JWT_TOKEN]" }
Response: { screens: [...] }  // Only screens user's role can access
```

**Get Screen Details (with Permission Check)**
```http
GET /api/v1/mobile/apps/:appId/screens/:screenId
Headers: { Authorization: "Bearer [JWT_TOKEN]" }
Response: { screen: {...}, elements: [...] }
Error (403): { message: "You do not have permission to access this screen" }
```

---

## How to Use

### Scenario 1: Create a Premium-Only Screen

1. **Create/Edit Screen** (already published at `/app/26/screens`)
   
2. **Configure Access**:
   ```bash
   curl -X PUT http://localhost:3000/api/v1/apps/26/screens/75/access \
     -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"role_ids": [2]}'  # Only premium users (role_id 2)
   ```

3. **Result**:
   - Regular users (role "all_users") won't see this screen
   - Premium users (role "premium") will see it
   - Admin users (role "admin") won't see it unless you add role_id 3

### Scenario 2: Upgrade a User to Premium

1. **Find User ID** at `/app/26/app-users`

2. **Assign Premium Role**:
   ```bash
   curl -X PUT http://localhost:3000/api/v1/app-users/USER_ID/roles \
     -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"role_ids": [1, 2]}'  # All Users + Premium
   ```

3. **Result**:
   - User can now access both regular and premium screens

### Scenario 3: Make a Screen Accessible to Everyone

```bash
curl -X PUT http://localhost:3000/api/v1/apps/26/screens/75/access \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role_ids": [1, 2, 3]}'  # All roles
```

### Scenario 4: Create a Custom Role

```bash
curl -X POST http://localhost:3000/api/v1/apps/26/roles \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "vip",
    "display_name": "VIP Members",
    "description": "Users with VIP membership"
  }'
```

---

## Mobile App Integration

### 1. User Login
```javascript
// Login user
const response = await fetch('http://api.example.com/api/v1/mobile/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
    app_id: 26
  })
});

const { token, user } = await response.json();
// Store token for future requests
localStorage.setItem('auth_token', token);
```

### 2. Fetch Accessible Screens
```javascript
// Get screens user can access (filtered by their role)
const response = await fetch('http://api.example.com/api/v1/mobile/apps/26/screens', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const { data } = await response.json();
const screens = data.screens;
// Render only the screens they have access to
```

### 3. Access Specific Screen
```javascript
// Try to access a screen
const response = await fetch('http://api.example.com/api/v1/mobile/apps/26/screens/75', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

if (response.status === 403) {
  // User doesn't have permission
  alert('This screen requires premium access');
} else {
  const { data } = await response.json();
  const { screen, elements } = data;
  // Render the screen
}
```

---

## Testing the Access Control

### Test 1: Unauthenticated Access (All Screens)
```bash
curl http://localhost:3000/api/v1/mobile/apps/26/screens
# Returns all published screens (no filtering)
```

### Test 2: Authenticated User with Default Role
```bash
# First, login and get token
curl -X POST http://localhost:3000/api/v1/mobile/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"password123"}'

# Then use token to get screens
curl http://localhost:3000/api/v1/mobile/apps/26/screens \
  -H "Authorization: Bearer YOUR_TOKEN"
# Returns only screens accessible by "all_users" role
```

### Test 3: Restrict a Screen
```bash
# Restrict screen 75 to premium users only
curl -X PUT http://localhost:3000/api/v1/apps/26/screens/75/access \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role_ids": [2]}'

# Now regular users won't see screen 75
# Premium users will see it
```

### Test 4: Upgrade User to Premium
```bash
# Check current roles (you'll see role_id 1 "all_users")
curl http://localhost:3000/api/v1/app-users/1/roles \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Add premium role
curl -X PUT http://localhost:3000/api/v1/app-users/1/roles \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role_ids": [1, 2]}'

# Now user can access premium screens
```

---

## Admin UI Integration (To Be Built)

### Screens List Page Enhancement
Location: `/app/[id]/screens`

Add an "Access" button next to each screen:
- Click opens modal
- Shows list of all roles with checkboxes
- Check roles that should have access
- Save updates `screen_role_access` table

### User Management Enhancement
Location: `/app/[id]/app-users`

Add a "Roles" column/button:
- Click opens modal
- Shows list of all roles with checkboxes
- Check roles to assign to user
- Save updates `app_user_role_assignments` table

### New Roles Management Page
Location: `/app/[id]/roles`

Create a new page to:
- List all roles for the app
- Create new roles
- Edit existing roles
- See how many users have each role
- See which screens each role can access

---

## Common Use Cases

### 1. Freemium App
```
Roles:
- Free Users (default) → Basic screens only
- Premium Users → All screens including premium features
```

### 2. Multi-Level Access
```
Roles:
- Basic Users (default) → Level 1 screens
- Silver Members → Level 1-2 screens
- Gold Members → Level 1-3 screens
- Platinum Members → All screens
```

### 3. B2B SaaS
```
Roles:
- Viewer (default) → Read-only screens
- Editor → Can edit certain screens
- Admin → All screens including settings
```

### 4. Education Platform
```
Roles:
- Free Students (default) → Intro lessons only
- Enrolled Students → Course material
- Instructors → All content + grading screens
```

---

## Security Considerations

### Current Implementation
✅ JWT authentication required for role filtering
✅ Role-based access enforced at API level
✅ Permission checks before returning screen data
✅ Cannot bypass restrictions by guessing screen IDs

### Best Practices
1. **Always use HTTPS** in production
2. **Rotate JWT secrets** regularly
3. **Audit role assignments** periodically
4. **Log access attempts** for security monitoring
5. **Rate limit** the API endpoints

### Fallback Behavior
- **Without JWT token**: Returns all published screens (for demo/preview)
- **With invalid token**: Returns 401 Unauthorized
- **With valid token but no access**: Returns 403 Forbidden

---

## Troubleshooting

### User Can't See a Screen They Should Have Access To

**Check 1: Is the screen published?**
```sql
SELECT is_published FROM app_screen_assignments 
WHERE app_id = 26 AND screen_id = 75;
```

**Check 2: Does their role have access?**
```sql
SELECT * FROM screen_role_access 
WHERE screen_id = 75 AND role_id IN (
  SELECT app_role_id FROM app_user_role_assignments WHERE user_id = 1
);
```

**Check 3: Do they have a role assigned?**
```sql
SELECT * FROM app_user_role_assignments WHERE user_id = 1;
```

### Screen Shows Up for Everyone

**Check if role access is configured:**
```sql
SELECT * FROM screen_role_access WHERE screen_id = 75;
```

If no rows exist, the screen has no access restrictions configured.

### User Has Wrong Role

**Update their role:**
```sql
DELETE FROM app_user_role_assignments WHERE user_id = 1 AND app_role_id IS NOT NULL;
INSERT INTO app_user_role_assignments (user_id, role_id, app_role_id) 
VALUES (1, NULL, 2); -- Assign premium role (id 2)
```

---

## Next Steps

### Priority 1: Build Admin UI
1. **Screen Access Modal** - Manage which roles can access each screen
2. **User Roles Modal** - Assign roles to users
3. **Roles Management Page** - Create and manage app roles

### Priority 2: Mobile SDK
1. Create React Native helpers
2. Auto-handle 403 errors
3. Cache accessible screens
4. Prompt for upgrade on restricted access

### Priority 3: Advanced Features
1. Time-based access (trial periods)
2. Usage limits (X accesses per month)
3. Screen bundles (packages of screens)
4. Dynamic role assignment (based on behavior)

---

## Summary

**✅ What's Working Now:**
- Default roles created for all apps
- Mobile API filters screens by user's role
- Permission checks prevent unauthorized access
- Admin API endpoints ready for UI integration
- All new users get "all_users" role automatically
- Existing users assigned to default roles

**⏳ What Needs to Be Built:**
- Admin UI for managing screen access
- Admin UI for assigning roles to users
- Admin UI for creating custom roles

**🎯 Result:**
Master Admins can now control who sees what screens by:
1. Creating/using roles (All Users, Premium, Admin, custom)
2. Assigning users to roles via API (UI coming soon)
3. Configuring screen access per role via API (UI coming soon)

Mobile apps automatically enforce these restrictions when users log in!

---

**Date:** November 12, 2025  
**Status:** Backend ✅ Complete | Frontend ⏳ Pending
