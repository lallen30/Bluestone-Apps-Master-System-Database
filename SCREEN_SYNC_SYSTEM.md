# Screen Sync System - Template to App

**Date:** November 20, 2025  
**Purpose:** Control how app screens sync with template screens

---

## 🎯 **CONCEPT**

Apps can have screens that are:
1. **Synced** - Automatically update when template changes
2. **Custom** - Independent from template, can be modified per app

---

## 🔧 **DATABASE STRUCTURE**

### **app_screen_assignments Table**

Key columns:
- `auto_sync_enabled` (tinyint) - Controls if screen syncs with template
  - `1` = Synced (updates from template)
  - `0` = Custom (independent from template)

---

## 📊 **SYNC MODES**

### **Mode 1: Auto-Sync Enabled (Default)**
```
Template Screen → Changes → App Screen (automatically updated)
```

**Use case:**
- Standard screens that should be consistent across all apps
- Core functionality screens
- Screens you want to update globally

**Example:**
- Login Screen
- Splash Screen
- Terms of Service

### **Mode 2: Auto-Sync Disabled (Custom)**
```
Template Screen → Changes → App Screen (NOT updated)
```

**Use case:**
- App-specific customizations
- Screens with custom elements per app
- A/B testing different layouts

**Example:**
- Custom branded home screen
- App-specific booking flow
- Unique feature screens

---

## 🔄 **HOW IT WORKS**

### **When Template Screen Changes:**

1. **Check each app's screen assignment**
2. **If `auto_sync_enabled = 1`:**
   - Update app screen with template changes
   - Sync elements, config, display order
   - Preserve app-specific overrides (if any)
3. **If `auto_sync_enabled = 0`:**
   - Skip update
   - App screen remains unchanged
   - Manual sync available if needed

---

## 🎛️ **ADMIN PORTAL CONTROLS**

At **http://localhost:3001/app/28/screens**, you should have:

### **Per-Screen Controls:**
- ✅ **Auto-Sync Toggle** - Enable/disable sync for each screen
- 🔄 **Manual Sync Button** - Force sync even if auto-sync is off
- 🔒 **Lock Screen** - Prevent any changes (custom mode)
- 📋 **View Diff** - See differences between app and template

### **Bulk Actions:**
- **Sync All Screens** - Update all auto-sync enabled screens
- **Enable Auto-Sync for All** - Turn on sync for all screens
- **Disable Auto-Sync for All** - Make all screens custom

---

## 💾 **SQL OPERATIONS**

### **Enable Auto-Sync for Specific Screen:**
```sql
UPDATE app_screen_assignments
SET auto_sync_enabled = 1
WHERE app_id = 28 AND screen_id = 228;
```

### **Disable Auto-Sync (Make Custom):**
```sql
UPDATE app_screen_assignments
SET auto_sync_enabled = 0
WHERE app_id = 28 AND screen_id = 228;
```

### **Check Sync Status:**
```sql
SELECT 
    asa.id,
    s.name as screen_name,
    asa.auto_sync_enabled,
    asa.is_active,
    asa.display_order
FROM app_screen_assignments asa
JOIN app_screens s ON asa.screen_id = s.id
WHERE asa.app_id = 28
ORDER BY asa.display_order;
```

### **Sync All Auto-Enabled Screens:**
```sql
-- This would be done via API/backend logic
-- Pseudo-code:
-- 1. Find all screens where auto_sync_enabled = 1
-- 2. Get corresponding template screen
-- 3. Copy elements, config, settings from template to app
```

---

## 🎨 **USE CASES**

### **Scenario 1: Standard App (All Synced)**
```
Template: Property Rental App
App: AirPnP
Strategy: Keep all screens synced

Result: Any template updates automatically apply to AirPnP
```

**Settings:**
- All screens: `auto_sync_enabled = 1`

### **Scenario 2: Custom Branded App**
```
Template: Property Rental App
App: LuxuryStays
Strategy: Custom home screen, synced core features

Result: 
- Home screen: Custom branding
- Booking/Messages: Synced with template
```

**Settings:**
- Home screen: `auto_sync_enabled = 0`
- Other screens: `auto_sync_enabled = 1`

### **Scenario 3: A/B Testing**
```
Template: Property Rental App
App: TestApp
Strategy: Test new booking flow vs template

Result:
- Booking screens: Custom (test version)
- Other screens: Synced
```

**Settings:**
- Booking screens: `auto_sync_enabled = 0`
- Other screens: `auto_sync_enabled = 1`

---

## 🚀 **IMPLEMENTATION NEEDED**

### **Backend API Endpoints:**

```javascript
// Sync single screen
POST /api/v1/apps/:appId/screens/:screenId/sync

// Sync all auto-enabled screens
POST /api/v1/apps/:appId/screens/sync-all

// Toggle auto-sync
PUT /api/v1/apps/:appId/screens/:screenId/auto-sync
Body: { auto_sync_enabled: true/false }

// Get sync status
GET /api/v1/apps/:appId/screens/sync-status
```

### **Sync Logic:**

```javascript
async function syncScreenFromTemplate(appId, screenId) {
  // 1. Get app screen assignment
  const assignment = await getScreenAssignment(appId, screenId);
  
  // 2. Check if auto-sync enabled
  if (!assignment.auto_sync_enabled) {
    return { skipped: true, reason: 'Auto-sync disabled' };
  }
  
  // 3. Get template screen
  const app = await getApp(appId);
  const templateScreen = await getTemplateScreen(app.template_id, screenId);
  
  // 4. Get template screen elements
  const templateElements = await getTemplateScreenElements(templateScreen.id);
  
  // 5. Update app screen elements
  await updateAppScreenElements(appId, screenId, templateElements);
  
  // 6. Update screen config
  await updateAppScreenConfig(appId, screenId, templateScreen.config);
  
  return { synced: true };
}
```

---

## 📋 **CURRENT STATUS**

### **What Exists:**
✅ `auto_sync_enabled` column in database  
✅ Default value is `1` (sync enabled)

### **What's Needed:**
⏳ Admin UI to toggle auto-sync per screen  
⏳ API endpoint to trigger manual sync  
⏳ Backend logic to perform sync  
⏳ Sync all button in admin portal  
⏳ Visual indicator showing sync status  

---

## 🎯 **IMMEDIATE SOLUTION FOR APP 28**

Since the new template screens (575-580) aren't in the app yet, we need to:

### **Option 1: Add New Screens to App (Recommended)**
```sql
-- Add the 6 new dynamic screens to app 28
-- These will be synced by default

INSERT INTO app_screen_assignments (
    app_id, screen_id, is_active, auto_sync_enabled, 
    assigned_by, display_order
)
SELECT 
    28 as app_id,
    s.id as screen_id,
    1 as is_active,
    1 as auto_sync_enabled,
    1 as assigned_by,
    s.display_order
FROM app_template_screens s
WHERE s.template_id = 9
    AND s.id IN (575, 576, 577, 578, 579, 580);
```

### **Option 2: Manual Sync via Admin Portal**
1. Go to http://localhost:3001/app/28/screens
2. Click "Sync with Template" or "Add Template Screens"
3. Select the 6 new screens
4. Choose sync mode (auto or manual)

---

## 💡 **RECOMMENDATIONS**

### **For Standard Screens:**
- ✅ Enable auto-sync
- Examples: Login, Signup, Terms, Privacy

### **For App-Specific Screens:**
- ❌ Disable auto-sync
- Examples: Custom home, Branded screens, Special features

### **For Testing:**
- ❌ Disable auto-sync during testing
- ✅ Re-enable after testing complete

---

## 🔍 **VERIFICATION**

After adding screens to app, verify:

```sql
-- Check new screens are assigned
SELECT 
    s.id,
    s.screen_name,
    asa.auto_sync_enabled,
    asa.is_active
FROM app_template_screens s
LEFT JOIN app_screen_assignments asa ON s.id = asa.screen_id AND asa.app_id = 28
WHERE s.template_id = 9
    AND s.id >= 575
ORDER BY s.display_order;
```

---

**Would you like me to:**
1. Add the 6 new screens to app 28 with auto-sync enabled?
2. Create the sync API endpoints?
3. Build the admin UI controls for sync management?
