# Role Management Quick Start Guide

## For Administrators

This guide shows you how to manage mobile user roles and control screen access in your app.

---

## 🎯 What Can You Do?

As an administrator, you can:
- ✅ Create custom roles for your mobile app users
- ✅ Control which screens each role can access
- ✅ Assign roles to users
- ✅ Set default roles for new users

---

## 📍 Where to Go

### Manage Roles & Screens
**URL**: http://localhost:3001/app/28/roles

This page lets you:
- Create, edit, and delete roles
- Assign screens to roles
- View role statistics

### Manage User Roles
**URL**: http://localhost:3001/app/28/app-users

Click the **Shield icon** (🛡️) next to any user to:
- View their current roles
- Assign new roles
- Remove roles

---

## 🚀 Quick Start: 5 Steps

### Step 1: Create a Role

1. Go to http://localhost:3001/app/28/roles
2. Click **"Create Role"** button
3. Fill in the form:
   ```
   Name:         vip_member
   Display Name: VIP Member
   Description:  Access to exclusive features
   Default Role: ☐ (uncheck unless you want all new users to have this)
   ```
4. Click **"Create Role"**

### Step 2: Assign Screens to the Role

1. Click on your new role in the left panel
2. Right panel shows all available screens
3. **Check the boxes** for screens this role should access
4. **Uncheck boxes** for screens this role should NOT access
5. Changes save automatically!

**Visual Guide:**
- ✅ **Green background** = Screen accessible
- ⚪ **Gray background** = Screen blocked

### Step 3: Assign the Role to a User

1. Go to http://localhost:3001/app/28/app-users
2. Find a user in the list
3. Click the **Shield icon** (🛡️) in the Actions column
4. In the modal, scroll to "Available Roles"
5. Click **"Assign"** next to "VIP Member"
6. Done! The user now has VIP access

### Step 4: Verify It Works

1. The user should now see only the screens you granted access to
2. Check the role's user count - it should show 1 user
3. In the user's roles modal, "VIP Member" should appear under "Current Roles"

### Step 5: Remove a Role (if needed)

1. Go to the user's roles modal (Shield icon)
2. Under "Current Roles", click **"Remove"** next to the role
3. The role is immediately removed

---

## 💡 Common Use Cases

### Use Case 1: Free vs. Premium Users

**Goal**: Give premium users access to exclusive content

1. Create role: `premium` / "Premium Member"
2. Assign premium-only screens to this role
3. Remove those screens from `all_users` role
4. Assign `premium` role to paying users

**Result**: Free users see basic content, premium users see everything

---

### Use Case 2: Beta Testers

**Goal**: Give beta testers access to unreleased features

1. Create role: `beta_tester` / "Beta Tester"
2. Assign beta/draft screens to this role
3. Assign role to selected users
4. When feature is ready, assign screen to `all_users` role

**Result**: Only beta testers see new features until public release

---

### Use Case 3: Moderators

**Goal**: Give moderators access to moderation tools

1. Create role: `moderator` / "Moderator"
2. Assign moderation screens (reports, user management, etc.)
3. Assign role to trusted users
4. Regular users won't see moderation tools

**Result**: Only moderators can access moderation features

---

## 🔒 Important Rules

### ⚠️ Cannot Delete Roles with Users
If a role has users assigned, you must remove all users first before deleting the role.

**Error Message**: "Cannot delete role. It is assigned to X user(s)."

**Solution**:
1. Go to each user with this role
2. Remove the role from them
3. Then delete the role

### ⚠️ Default Roles
- Only one role should be marked as "Default"
- Default roles are automatically assigned to new users
- The `all_users` role is typically the default

### ⚠️ Screen Access Logic
- If a user has multiple roles, they get access to ALL screens from ALL their roles
- Example: User has `free` (3 screens) + `premium` (5 screens) = Access to 8 screens total

---

## 📊 Understanding the Interface

### Roles Page - Left Panel
```
┌─────────────────────────────┐
│ 🛡️ Roles (3)               │
├─────────────────────────────┤
│ ✓ All Users [Default]       │
│   Basic access to app        │
│   👥 15 users                │
├─────────────────────────────┤
│   Premium Users              │
│   Exclusive features         │
│   👥 3 users                 │
├─────────────────────────────┤
│   VIP Member                 │
│   Full access                │
│   👥 1 user                  │
└─────────────────────────────┘
```

### Roles Page - Right Panel (when role selected)
```
┌─────────────────────────────┐
│ Premium Users - Screen Access│
│ 5 of 10 screens accessible   │
├─────────────────────────────┤
│ ✅ Home Screen               │
│    ☑️ Accessible             │
├─────────────────────────────┤
│ ✅ Premium Content           │
│    ☑️ Accessible             │
├─────────────────────────────┤
│ ⚪ Admin Dashboard           │
│    ☐ Blocked                 │
└─────────────────────────────┘
```

---

## 🎨 Visual Indicators

| Icon | Meaning |
|------|---------|
| 🛡️ | Manage user roles |
| ✏️ | Edit role |
| 🗑️ | Delete role |
| 📺 | Manage screens |
| ✅ Green | Screen accessible |
| ⚪ Gray | Screen blocked |
| 🔵 Default | Auto-assigned to new users |

---

## ❓ FAQ

**Q: What's the difference between roles and permissions?**
A: Currently, roles control screen access. Permissions (feature-level control) will be added in a future update.

**Q: Can a user have multiple roles?**
A: Yes! Users can have multiple roles and will get access to all screens from all their roles.

**Q: What happens if I delete a screen that's assigned to a role?**
A: The screen access assignment is automatically removed (cascade delete).

**Q: Can I rename a role?**
A: Yes, click the Edit icon (✏️) and change the name or display name.

**Q: How do I make a role the default?**
A: Edit the role and check "Default role". Only one role should be default at a time.

**Q: Where do mobile users see their roles?**
A: Roles control what screens they can access. They don't see the role names, just the screens they have access to.

---

## 🆘 Troubleshooting

### Problem: Can't delete a role
**Solution**: Remove all users from the role first, then delete it.

### Problem: User can't see a screen
**Solution**: 
1. Check if the screen is published (not draft)
2. Check if any of the user's roles have access to that screen
3. Assign the screen to one of the user's roles

### Problem: New users aren't getting the default role
**Solution**: 
1. Go to roles page
2. Edit the role that should be default
3. Check "Default role" checkbox
4. Uncheck it on any other roles

---

## 📞 Need Help?

If you encounter issues:
1. Check the browser console for errors (F12)
2. Verify the API is running (http://localhost:3000)
3. Check the admin portal logs
4. Review the ROLE_MANAGEMENT_IMPLEMENTATION.md for technical details

---

## 🎉 You're Ready!

You now know how to:
- ✅ Create and manage roles
- ✅ Control screen access
- ✅ Assign roles to users
- ✅ Set up different user tiers (free, premium, etc.)

Start by creating your first custom role and see how it works!
