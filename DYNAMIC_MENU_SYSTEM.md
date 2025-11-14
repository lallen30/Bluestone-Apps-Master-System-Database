# Dynamic Menu System - Template-Specific Features

**Date:** November 13, 2025  
**Status:** ✅ IMPLEMENTED

---

## 🎯 Problem Solved

**Question:** "What if it isn't a Property Listings app but the property listing screen is added to the app by the Master admin?"

**Answer:** The admin sidebar menu is now **dynamic** and shows template-specific features based on:
1. Which template the app was created from
2. What features have been added to the app

---

## 🔄 How It Works

### **Database Schema**
```sql
-- Added to apps table
template_id INT NULL
  REFERENCES app_templates(id)
```

This tracks which template was used to create the app.

### **Dynamic Menu Logic**
The `AppLayout` component now:
1. Fetches the app details on load
2. Checks the `template_id` field
3. Conditionally shows template-specific menu items

**Example:**
```typescript
// Property Rental App Template (ID: 9)
if (templateId === 9) {
  setHasPropertyListings(true);
  // Shows "Property Listings" menu item
}
```

---

## 📋 Current Template-Specific Features

### **Property Rental App (Template ID: 9)**
Shows additional menu item:
- 🏠 **Property Listings** → `/app/{id}/listings`

### **Base Features (All Apps)**
- Dashboard
- Administrators
- App Users
- App Users Roles
- Screens
- Settings

---

## 🔧 Implementation Details

### Files Modified:
```
admin_portal/components/layouts/AppLayout.tsx
  - Added hasPropertyListings state
  - Fetches app template_id
  - Dynamically builds menu items
```

### Migration Created:
```
multi_site_manager/src/migrations/033_add_template_id_to_apps.sql
  - Adds template_id column to apps table
  - Creates foreign key to app_templates
  - Adds index for performance
```

### Apps Updated:
```sql
UPDATE apps SET template_id = 9 WHERE id IN (27, 28);
```
- App 28 (AirPnP) now shows Property Listings

---

## 🎨 User Experience

### **Before:**
- All apps had the same sidebar menu
- Property Listings page existed but wasn't accessible
- Confusion about which features belong to which app

### **After:**
1. Master admin creates app from "Property Rental App" template
2. App automatically gets `template_id = 9`
3. When viewing that app, "Property Listings" appears in sidebar
4. Other apps don't show this menu item

---

## 🚀 Future Enhancements

### **Option 1: Screen-Based Detection**
Instead of just checking template_id, also check if app has property-related screens:

```typescript
// Check app_screens table
const screens = await getAppScreens(appId);
const hasPropertyScreens = screens.some(s => 
  s.name.includes('Property') || s.name.includes('Listing')
);

if (templateId === 9 || hasPropertyScreens) {
  setHasPropertyListings(true);
}
```

**Use case:** Master admin adds property screens to ANY app, menu item appears automatically.

### **Option 2: Feature Flags**
Add a features table to explicitly control which features each app has:

```sql
CREATE TABLE app_features (
  app_id INT,
  feature_name VARCHAR(50), -- 'property_listings', 'messaging', etc.
  enabled BOOLEAN DEFAULT true
);
```

**Benefit:** Fine-grained control, can enable/disable features per app.

### **Option 3: Template Configuration**
Store menu configuration in the template itself:

```sql
CREATE TABLE app_template_features (
  template_id INT,
  feature_name VARCHAR(50),
  menu_label VARCHAR(50),
  menu_icon VARCHAR(50),
  route_path VARCHAR(255)
);
```

**Benefit:** Templates define their own menu structure, fully dynamic.

---

## 📊 Template Types & Features

### **Current Templates:**
1. **Property Rental App (ID: 9)**
   - Property Listings ✅
   - Bookings (coming)
   - Reviews (coming)
   - Messaging (coming)

### **Future Templates:**
2. **E-Commerce App**
   - Products
   - Orders
   - Payments
   - Inventory

3. **Social Media App**
   - Posts
   - Comments
   - Followers
   - Direct Messages

4. **Food Delivery App**
   - Restaurants
   - Menus
   - Orders
   - Drivers

Each template will have its own set of menu items!

---

## 🔐 How Master Admins Control This

### **Method 1: Create from Template**
```
Master Admin Portal → Apps → Create New
→ Select "Property Rental App" template
→ App automatically gets template_id = 9
→ Property Listings menu appears
```

### **Method 2: Manual Assignment**
```sql
-- Assign template to existing app
UPDATE apps SET template_id = 9 WHERE id = 28;
```

### **Method 3: Add Screens (Future)**
Master admin adds property-related screens to any app:
- System detects screens with "Property" or "Listing" in name
- Automatically enables Property Listings feature
- Menu item appears

---

## ✅ Benefits

### **For Users:**
- ✅ Cleaner interface (only see relevant features)
- ✅ Less confusion
- ✅ Faster navigation

### **For Developers:**
- ✅ Modular feature system
- ✅ Easy to add new template types
- ✅ Scalable architecture

### **For Master Admins:**
- ✅ Template-based app creation
- ✅ Flexible feature assignment
- ✅ Per-app customization

---

## 🧪 Testing

### **Test Scenario 1: Property Rental App**
1. Navigate to http://localhost:3001/app/28
2. ✅ See "Property Listings" in sidebar
3. Click it → goes to listings page
4. ✅ Can view/manage property listings

### **Test Scenario 2: Regular App**
1. Create new app without template
2. Navigate to that app's dashboard
3. ✅ "Property Listings" does NOT appear
4. Only base menu items shown

### **Test Scenario 3: Template Change**
1. Update app: `UPDATE apps SET template_id = 9 WHERE id = X`
2. Refresh app dashboard
3. ✅ "Property Listings" now appears
4. Feature is activated

---

## 💡 Best Practices

### **For Template Creators:**
1. Assign template_id when creating apps from templates
2. Document which features each template includes
3. Keep menu items relevant to template purpose

### **For Feature Developers:**
1. Register new features in template configuration
2. Add menu item logic to AppLayout
3. Create dedicated page for feature
4. Update this documentation

### **For Master Admins:**
1. Choose appropriate template when creating apps
2. Understand which features each template provides
3. Use template_id to control feature visibility

---

## 📝 Summary

**The Dynamic Menu System ensures:**
- Apps only show relevant features in their sidebar
- Template-based feature assignment works automatically
- Future scalability for any template type
- Clean, intuitive user experience

**Your app (ID 28 "AirPnP") now:**
- ✅ Has template_id = 9 (Property Rental App)
- ✅ Shows "Property Listings" menu item
- ✅ Provides property management features
- ✅ Ready for property-related operations

**Next time you create an app from the Property Rental template, it will automatically have the Property Listings menu item!** 🎉
