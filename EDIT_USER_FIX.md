# Edit User Form Fix

## Issue
The Edit User form on http://localhost:3001/app/28/app-users was not working properly.

## Root Causes

### 1. Frontend Issue
The `editFormData` object included an `email` field that was being sent to the backend, but the backend's `updateAppUser` function doesn't support email updates (email is not editable).

### 2. Backend Issue
The `updateAppUser` function was using a static SQL UPDATE query that would set all fields regardless of whether they were provided in the request. This could cause issues with:
- Undefined values being set in the database
- Empty strings overwriting existing data unintentionally
- No validation of which fields were actually being updated

## Solutions Applied

### Frontend Fix (`admin_portal/app/app/[id]/app-users/page.tsx`)

1. **Line 208**: Added destructuring to remove the `email` field from the update payload:
   ```typescript
   const { email, ...updateData } = editFormData;
   await appUsersAPI.updateUser(parseInt(appId), selectedUser.id, updateData);
   ```

2. **Line 196**: Added default empty string for email field to prevent null/undefined issues:
   ```typescript
   email: user.email || ''
   ```

### Backend Fix (`multi_site_manager/src/controllers/appUsersController.js`)

Completely refactored the `updateAppUser` function (lines 318-401) to:

1. **Use destructuring** for cleaner parameter extraction
2. **Build dynamic SQL queries** that only update fields that are actually provided
3. **Handle null/undefined values** properly by converting empty strings to null
4. **Add validation** to ensure at least one field is being updated
5. **Improve error handling** with proper null checks

Key improvements:
```javascript
// Build dynamic update query based on provided fields
const updateFields = [];
const updateValues = [];

if (first_name !== undefined) {
  updateFields.push('first_name = ?');
  updateValues.push(first_name || null);
}
// ... similar for other fields

// Only update fields that were provided
await db.query(
  `UPDATE app_users SET ${updateFields.join(', ')} WHERE id = ? AND app_id = ?`,
  updateValues
);
```

## Testing

After applying these fixes:

1. Navigate to http://localhost:3001/app/28/app-users
2. Click the Edit icon (pencil) for any user
3. Modify the first name, last name, or phone fields
4. Click "Save Changes"
5. The user should be updated successfully and the list should refresh

## Files Modified

1. `/admin_portal/app/app/[id]/app-users/page.tsx` - Frontend form handling
2. `/multi_site_manager/src/controllers/appUsersController.js` - Backend update logic

## Services Restarted

- `api` (multi_app_api container)
- `admin_portal` (multi_app_admin_portal container)

Both services are now running with the updated code.
