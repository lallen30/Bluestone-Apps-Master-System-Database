# Admin Portal Verification Guide

**Date:** November 20, 2025  
**Task:** Verify the 6 new dynamic screens in the admin portal

---

## 🌐 **ADMIN PORTAL URL**

**Main Template Page:**  
http://localhost:3001/master/app-templates/9

---

## ✅ **VERIFICATION CHECKLIST**

### Step 1: Navigate to Template
1. Open your browser
2. Go to: http://localhost:3001/master/app-templates/9
3. You should see the "Property Rental App" template page

### Step 2: Check Screens List
Look for a section showing "Template Screens" or "Screens"

**You should see these 6 NEW screens:**

| Screen Name | Screen Key | Element Type | Icon |
|-------------|------------|--------------|------|
| Search Properties | search_properties | property_search | search |
| Book Property | book_property | booking_form | event |
| My Bookings | my_bookings | booking_list | list |
| Booking Details | booking_details | booking_detail | info |
| Messages | messages | conversation_list | chat |
| Chat | chat | chat_interface | message |

### Step 3: Check Screen Details
Click on each screen to verify:

#### ✅ Search Properties
- **Element:** Property Search (ID: 113)
- **Configuration should show:**
  ```json
  {
    "filters": ["location", "price", "guests"],
    "sort_options": ["price_asc", "price_desc", "newest"],
    "default_sort": "newest",
    "card_layout": "grid",
    "items_per_page": 20
  }
  ```
- **Home Screen:** Yes (should be marked as home screen)

#### ✅ Book Property
- **Element:** Booking Form (ID: 108)
- **Configuration should show:**
  ```json
  {
    "listing_id_source": "route_param",
    "show_price_breakdown": true,
    "enable_special_requests": true,
    "success_navigation": "MyBookings",
    "min_nights": 1,
    "max_nights": 365,
    "require_phone": false
  }
  ```

#### ✅ My Bookings
- **Element:** Booking List (ID: 109)
- **Configuration should show:**
  ```json
  {
    "filters": ["all", "pending", "confirmed", "cancelled"],
    "default_filter": "all",
    "show_status_badges": true,
    "enable_cancel": true,
    "card_layout": "compact",
    "pull_to_refresh": true,
    "items_per_page": 20
  }
  ```

#### ✅ Booking Details
- **Element:** Booking Detail (ID: 110)
- **Configuration should show:**
  ```json
  {
    "booking_id_source": "route_param",
    "sections": ["property", "trip", "guest", "host", "price", "timeline"],
    "show_timeline": true,
    "enable_cancel": true,
    "enable_contact_host": true
  }
  ```

#### ✅ Messages
- **Element:** Conversation List (ID: 111)
- **Configuration should show:**
  ```json
  {
    "auto_refresh_interval": 30000,
    "show_unread_badge": true,
    "show_avatars": true,
    "enable_archive": true,
    "pull_to_refresh": true,
    "items_per_page": 50
  }
  ```

#### ✅ Chat
- **Element:** Chat Interface (ID: 112)
- **Configuration should show:**
  ```json
  {
    "conversation_id_source": "route_param",
    "auto_refresh_interval": 5000,
    "show_timestamps": true,
    "enable_attachments": false,
    "max_message_length": 1000,
    "message_bubble_style": "ios",
    "show_date_separators": true
  }
  ```

---

## 🔍 **WHAT TO LOOK FOR**

### ✅ All Screens Present
- [ ] All 6 screens are visible in the template
- [ ] Screen names match exactly
- [ ] Screen keys are correct

### ✅ Element Assignments
- [ ] Each screen has the correct element type assigned
- [ ] Element IDs are 108-113
- [ ] No errors or "Element not found" messages

### ✅ Configuration
- [ ] JSON configurations are valid (no syntax errors)
- [ ] All config options are present
- [ ] Values match the specifications

### ✅ Display Order
- [ ] Screens are in logical order
- [ ] Search Properties is first/home screen
- [ ] Display order: 20, 21, 22, 23, 24, 25

### ✅ Icons and Categories
- [ ] Each screen has an icon assigned
- [ ] Categories are set (Search, Booking, Communication)
- [ ] Icons are appropriate for each screen

---

## 🐛 **COMMON ISSUES & SOLUTIONS**

### Issue: Screens not showing
**Possible causes:**
1. Need to refresh the page
2. Database connection issue
3. Template ID incorrect

**Solution:**
```bash
# Verify screens in database
docker exec -i multi_app_mysql mysql -u root -prootpassword multi_site_manager -e "
SELECT id, screen_name, screen_key, display_order 
FROM app_template_screens 
WHERE template_id = 9 AND id >= 575 
ORDER BY display_order;"
```

### Issue: Element not found
**Possible causes:**
1. Element IDs 108-113 don't exist
2. Element type mismatch

**Solution:**
```bash
# Verify elements exist
docker exec -i multi_app_mysql mysql -u root -prootpassword multi_site_manager -e "
SELECT id, element_type, name 
FROM screen_elements 
WHERE id >= 108 AND id <= 113;"
```

### Issue: JSON configuration error
**Possible causes:**
1. Invalid JSON syntax
2. Missing quotes or commas

**Solution:**
- Copy the config from this guide
- Validate at https://jsonlint.com
- Re-save the screen

### Issue: Can't edit screens
**Possible causes:**
1. Permissions issue
2. Screen locked

**Solution:**
- Check if you're logged in as admin
- Try refreshing the page
- Check browser console for errors

---

## 📸 **SCREENSHOTS TO TAKE**

For documentation, take screenshots of:
1. Template screens list showing all 6 screens
2. Each screen's detail page showing element and config
3. Any errors or issues encountered

---

## ✅ **VERIFICATION COMPLETE**

Once you've verified all items above, check off:

- [ ] All 6 screens are visible in admin portal
- [ ] Each screen has correct element assigned
- [ ] All configurations are valid JSON
- [ ] Display order is correct (20-25)
- [ ] Search Properties is set as home screen
- [ ] No errors or warnings
- [ ] Ready to proceed to mobile app testing

---

## 📝 **REPORT FINDINGS**

After verification, note:

**✅ Working correctly:**
- List what's working

**⚠️ Issues found:**
- List any issues

**🔧 Fixes needed:**
- List what needs to be fixed

---

## 🚀 **NEXT STEPS**

After successful verification:
1. ✅ Screens verified in admin portal
2. ⏳ Test screens in mobile app
3. ⏳ Phase 4: Remove hardcoded screens
4. ⏳ Phase 5: Final testing

---

**Start verification now at:** http://localhost:3001/master/app-templates/9
