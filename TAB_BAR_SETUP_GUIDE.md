# Tab Bar Setup Guide for App 28 (AirPnP)

**Date:** November 20, 2025  
**Purpose:** Set up the Tab Bar (Bottom Navigation) with the 6 new dynamic screens

---

## 🎯 **Understanding the Menu System**

### **How It Works:**

1. **Create a Menu** → Choose type: Tab Bar, Left Sidebar, or Right Sidebar
2. **Add Screens to Menu** → Select which screens appear in that menu
3. **Configure Each Item** → Set label, icon, and order for each screen
4. **Menu Displays in App** → Users see the navigation in the mobile app

### **Database Tables:**

```
app_menus
├── id
├── app_id
├── name (e.g., "Main Navigation")
├── menu_type ('tabbar', 'sidebar_left', 'sidebar_right')
└── description

menu_items
├── id
├── menu_id (links to app_menus)
├── screen_id (links to app_screens)
├── display_order
├── label (custom label for this menu item)
├── icon (icon for this menu item)
└── is_active
```

---

## 📋 **STEP-BY-STEP SETUP**

### **Step 1: Create Tab Bar Menu**

Go to: **http://localhost:3001/app/28/menus**

1. Click **"Create Menu"**
2. Fill in:
   - **Menu Name:** "Main Navigation" (or any name)
   - **Menu Type:** "Tab Bar (Bottom Navigation)"
   - **Menu Icon:** "menu" (doesn't matter for tab bar)
   - **Description:** "Bottom navigation with main screens"
3. Click **"Create Menu"**

### **Step 2: Add Screens to Menu**

After creating the menu, you'll see it in the list.

1. Click **"Manage Items"** on the Tab Bar menu
2. Click **"Manage Screens"** button
3. **Select these 3 screens** (for tab bar):
   - ☑️ **Search Properties**
   - ☑️ **My Bookings**
   - ☑️ **Messages**
4. Click **"Save Changes"**

### **Step 3: Configure Labels and Icons**

Now you'll see the 3 screens in the menu. For each one:

#### **Search Properties:**
- **Label:** "Search" (or "Explore", "Find")
- **Icon:** "search"
- **Order:** 1 (drag to first position)

#### **My Bookings:**
- **Label:** "Bookings" (or "Trips", "My Trips")
- **Icon:** "calendar" (or "list", "bookmark")
- **Order:** 2 (drag to second position)

#### **Messages:**
- **Label:** "Messages" (or "Chat", "Inbox")
- **Icon:** "message-square" (or "chat", "mail")
- **Order:** 3 (drag to third position)

### **Step 4: Save**

Click **"Save Changes"** to save the order and configurations.

---

## 🎨 **RECOMMENDED TAB BAR CONFIGURATION**

```
┌─────────────────────────────────────────┐
│                                         │
│         App Content Area                │
│                                         │
└─────────────────────────────────────────┘
┌─────────┬─────────┬─────────┐
│ 🔍      │ 📅      │ 💬      │
│ Search  │Bookings │Messages │
└─────────┴─────────┴─────────┘
```

---

## 📊 **COMPLETE SCREEN SETUP**

### **Tab Bar Screens (3):**
| Order | Screen | Label | Icon | Purpose |
|-------|--------|-------|------|---------|
| 1 | Search Properties | Search | search | Find properties |
| 2 | My Bookings | Bookings | calendar | View bookings |
| 3 | Messages | Messages | message-square | Chat with hosts |

### **Detail Screens (Not in Tab Bar - 3):**
| Screen | Access From | Purpose |
|--------|-------------|---------|
| Book Property | Search Properties → Property card | Create booking |
| Booking Details | My Bookings → Booking card | View booking details |
| Chat | Messages → Conversation | Chat interface |

---

## 🔧 **SQL TO CREATE MENU (Alternative Method)**

If you prefer SQL instead of the UI:

```sql
USE multi_site_manager;

SET @app_id = 28;

-- Step 1: Create the Tab Bar menu
INSERT INTO app_menus (app_id, name, menu_type, description, is_active, created_at, updated_at)
VALUES (@app_id, 'Main Navigation', 'tabbar', 'Bottom navigation with main screens', 1, NOW(), NOW());

SET @menu_id = LAST_INSERT_ID();

-- Step 2: Get screen IDs for the new dynamic screens
SET @search_screen_id = (SELECT id FROM app_screens WHERE screen_key = 'search_properties');
SET @bookings_screen_id = (SELECT id FROM app_screens WHERE screen_key = 'my_bookings');
SET @messages_screen_id = (SELECT id FROM app_screens WHERE screen_key = 'messages');

-- Step 3: Add screens to menu
INSERT INTO menu_items (menu_id, screen_id, display_order, label, icon, is_active, created_at, updated_at)
VALUES
  (@menu_id, @search_screen_id, 1, 'Search', 'search', 1, NOW(), NOW()),
  (@menu_id, @bookings_screen_id, 2, 'Bookings', 'calendar', 1, NOW(), NOW()),
  (@menu_id, @messages_screen_id, 3, 'Messages', 'message-square', 1, NOW(), NOW());

-- Verify
SELECT 
  m.name as menu_name,
  m.menu_type,
  mi.display_order,
  s.name as screen_name,
  mi.label,
  mi.icon
FROM app_menus m
JOIN menu_items mi ON m.id = mi.menu_id
JOIN app_screens s ON mi.screen_id = s.id
WHERE m.app_id = @app_id
ORDER BY m.id, mi.display_order;
```

---

## 📱 **HOW THE MOBILE APP USES THIS**

### **Mobile App Flow:**

1. **App starts** → Fetches menus for the app
2. **Finds Tab Bar menu** → `menu_type = 'tabbar'`
3. **Gets menu items** → Ordered by `display_order`
4. **Renders bottom navigation** → Shows label, icon for each item
5. **User taps item** → Navigates to the screen

### **API Endpoint:**

```
GET /api/v1/mobile/apps/{appId}/menus
```

Returns:
```json
{
  "menus": [
    {
      "id": 1,
      "name": "Main Navigation",
      "menu_type": "tabbar",
      "items": [
        {
          "screen_id": 112,
          "screen_key": "search_properties",
          "label": "Search",
          "icon": "search",
          "display_order": 1
        },
        {
          "screen_id": 114,
          "screen_key": "my_bookings",
          "label": "Bookings",
          "icon": "calendar",
          "display_order": 2
        },
        {
          "screen_id": 116,
          "screen_key": "messages",
          "label": "Messages",
          "icon": "message-square",
          "display_order": 3
        }
      ]
    }
  ]
}
```

---

## ✅ **VERIFICATION CHECKLIST**

After setup, verify:

- [ ] Menu created with type "tabbar"
- [ ] 3 screens added to menu (Search, Bookings, Messages)
- [ ] Each screen has a label
- [ ] Each screen has an icon
- [ ] Display order is correct (1, 2, 3)
- [ ] All items are active
- [ ] Menu is active

---

## 🎯 **NEXT STEPS AFTER MENU SETUP**

1. **Test in Mobile App:**
   - Restart the mobile app
   - Should see bottom tab bar with 3 items
   - Tap each tab to navigate

2. **Add Other Screens to Sidebar (Optional):**
   - Create a "Left Sidebar" menu
   - Add screens like: Profile, Settings, About, etc.

3. **Configure Screen-to-Screen Navigation:**
   - Search Properties → Book Property (via property card tap)
   - My Bookings → Booking Details (via booking card tap)
   - Messages → Chat (via conversation tap)

---

## 💡 **IMPORTANT NOTES**

### **Tab Bar vs Menu Items:**

- **Tab Bar** = Bottom navigation (3-5 main screens)
- **Menu Items** = Screens that appear IN the menu
- **Menu on Screen** = Different! This is showing a menu ON a screen (like a hamburger menu)

### **Two Different Concepts:**

1. **Add Screen TO Menu** → Screen appears as an item in the menu
   - Done at: `/app/28/menus/{menuId}` → Manage Items
   
2. **Show Menu ON Screen** → Menu appears on the screen (hamburger icon)
   - Done at: `/app/28/screens` → Configure Menus button

For Tab Bar, you only need #1 (Add Screen TO Menu).

---

## 🚀 **READY TO SET UP?**

**Option 1: Use Admin Portal (Recommended)**
1. Go to http://localhost:3001/app/28/menus
2. Follow Step 1-4 above

**Option 2: Use SQL Script**
1. Run the SQL script above
2. Verify in admin portal

**Which would you like to do?**
