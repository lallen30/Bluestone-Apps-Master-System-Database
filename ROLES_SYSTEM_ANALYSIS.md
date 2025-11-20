# Roles System Analysis & Issues

## Current State

The system has **THREE different role tables**, causing confusion:

### 1. `roles` Table (Admin Portal Users)
- **Purpose**: Roles for admin portal administrators
- **Users**: Admin portal users from `/app/[id]/users` page
- **Scope**: Global system roles (Master Admin, Admin, Editor)
- **Table**: `users` table with `role_id` FK to `roles`
- **Count**: 3 roles (Master Admin, Admin, Editor)

### 2. `user_roles` Table (Mobile App Users - OLD)
- **Purpose**: App-specific roles for mobile users
- **Users**: Mobile app users from `/app/[id]/app-users` page
- **Scope**: Per-app roles with permissions
- **Table**: `app_users` linked via `app_user_role_assignments`
- **Foreign Key**: `app_id` references `apps(id)`
- **Count**: 4 roles total
- **Related Tables**:
  - `role_permissions` - Available permissions
  - `role_permission_assignments` - Maps roles to permissions
  - `app_user_role_assignments` - Maps users to roles

### 3. `app_roles` Table (Screen Access Control - NEW)
- **Purpose**: Screen-level access control for mobile users
- **Users**: Mobile app users from `/app/[id]/app-users` page
- **Scope**: Per-app roles for screen access
- **Table**: `app_users` linked via `app_user_role_assignments.app_role_id`
- **Foreign Key**: `app_id` references `apps(id)`
- **Count**: 15 roles (3 per app: all_users, premium, admin)
- **Related Tables**:
  - `screen_role_access` - Maps screens to roles
  - `app_user_role_assignments.app_role_id` - Maps users to app_roles

## The Problem

### Issue 1: Duplicate Role Systems for Mobile Users
There are **TWO separate role systems** for mobile app users:
- `user_roles` (older, permission-based)
- `app_roles` (newer, screen-access-based)

This creates confusion about which system should be used.

### Issue 2: Wrong User Type on Roles Page
The `/app/[id]/roles` page shows roles from `user_roles` table, which is correct for mobile app users. However:
- The page doesn't clarify it's for **mobile app users** (from `/app/[id]/app-users`)
- NOT for **administrators** (from `/app/[id]/users`)

### Issue 3: Missing App Roles for App 28
```sql
SELECT * FROM app_roles WHERE app_id = 28;
-- Returns: Empty (no roles created for this app)
```

App 28 (AirPnP) has no `app_roles` created, even though the migration should have created default roles.

### Issue 4: Conflicting Role Assignment Table
The `app_user_role_assignments` table has BOTH:
- `role_id` (references `user_roles`)
- `app_role_id` (references `app_roles`)

This dual-reference creates ambiguity about which role system is active.

## Current API Behavior

### `/api/v1/apps/:appId/roles` (rolesController.js)
```javascript
// Queries user_roles table
SELECT r.*, 
  (SELECT COUNT(*) FROM app_user_role_assignments WHERE role_id = r.id) as user_count,
  (SELECT COUNT(*) FROM role_permission_assignments WHERE role_id = r.id) as permission_count
FROM user_roles r
WHERE r.app_id = ?
```

This is **correct** - it's querying mobile user roles, not admin roles.

## What Should Happen

### Correct Architecture
1. **Admin Portal Users** (`/app/[id]/users`)
   - Use `roles` table (Master Admin, Admin, Editor)
   - Manage the admin portal itself
   - NOT app-specific

2. **Mobile App Users** (`/app/[id]/app-users`)
   - Use **ONE unified role system** (choose either `user_roles` or `app_roles`)
   - Roles should be **app-specific** (unique per app)
   - Control access to:
     - Permissions (what they can do)
     - Screens (what they can see)

### Recommended Solution

**Option A: Use `app_roles` + Extend with Permissions**
1. Deprecate `user_roles` table
2. Use `app_roles` as the primary role system
3. Add permission support to `app_roles`:
   - Create `app_role_permissions` table
   - Link `app_roles` to `role_permissions`
4. Benefits:
   - Single source of truth
   - Already handles screen access
   - Cleaner architecture

**Option B: Use `user_roles` + Add Screen Access**
1. Deprecate `app_roles` table
2. Use `user_roles` as the primary role system
3. Migrate `screen_role_access` to use `user_roles`:
   - Update FK from `app_roles` to `user_roles`
4. Benefits:
   - Already has permission system
   - More mature implementation

## Immediate Actions Needed

### 1. Create Missing App Roles for App 28
```sql
INSERT INTO app_roles (app_id, name, display_name, description, is_default)
VALUES 
  (28, 'all_users', 'All Users', 'Default role with access to all published screens', TRUE),
  (28, 'premium', 'Premium Users', 'Users with premium features and exclusive screens', FALSE),
  (28, 'admin', 'Administrators', 'Users with administrative privileges', FALSE);
```

### 2. Update Roles Page UI
Add clarification that this page manages **Mobile App User Roles**, not Administrator roles:
```tsx
<p className="text-gray-600 mt-2">
  Manage roles and permissions for mobile app users (not administrators)
</p>
```

### 3. Decide on Unified Role System
Choose either `user_roles` or `app_roles` and create migration plan to consolidate.

## Database Schema Recommendations

### Current Tables to Keep
- `roles` - Admin portal roles (keep as-is)
- `app_users` - Mobile app users (keep as-is)
- `users` - Admin portal users (keep as-is)

### Consolidate Role System
**Recommended: Use `app_roles` as primary**

```sql
-- New unified structure
app_roles (keep)
  - id, app_id, name, display_name, description, is_default

app_role_permissions (new - replaces role_permission_assignments)
  - id, app_role_id, permission_id

role_permissions (keep - global permission definitions)
  - id, name, display_name, description, category

app_user_role_assignments (modify)
  - id, user_id, app_role_id (remove role_id column)

screen_role_access (keep)
  - id, screen_id, app_role_id, app_id, can_access

-- Deprecate
user_roles (remove)
role_permission_assignments (remove)
```

## Testing Required

After implementing fixes:
1. Verify `/app/28/roles` shows correct roles
2. Verify role assignment to mobile users works
3. Verify screen access control works
4. Verify permission checks work
5. Test with multiple apps to ensure isolation

## Files to Update

### Backend
- `multi_site_manager/src/controllers/rolesController.js` - Update to use app_roles
- `multi_site_manager/src/controllers/appUsersController.js` - Update role assignment logic
- Create new migration to consolidate role systems

### Frontend
- `admin_portal/app/app/[id]/roles/page.tsx` - Add clarification text
- `admin_portal/app/app/[id]/app-users/page.tsx` - Verify role management uses correct system
- `admin_portal/lib/api.ts` - Update API calls if needed
