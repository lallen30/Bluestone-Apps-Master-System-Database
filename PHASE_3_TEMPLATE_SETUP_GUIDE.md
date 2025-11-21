# Phase 3: Template Setup Guide

**Template:** Property Rental App (ID: 9)  
**URL:** http://localhost:3001/master/app-templates/9  
**Estimated Time:** 3 hours

---

## 🎯 **OVERVIEW**

Create 6 new screens using the dynamic element components we built in Phase 2.

**Screens to Create:**
1. Search Properties (Property Search element)
2. Book Property (Booking Form element)
3. My Bookings (Booking List element)
4. Booking Details (Booking Detail element)
5. Messages (Conversation List element)
6. Chat (Chat Interface element)

---

## 📝 **SCREEN CREATION INSTRUCTIONS**

### Screen 1: Search Properties 🔍

**Purpose:** Allow users to search and filter property listings

**Steps:**
1. Click "Add Screen" button
2. Fill in screen details:
   - **Name:** `Search Properties`
   - **Description:** `Search and filter available properties`
   - **Show in Tab Bar:** ✅ Yes
   - **Tab Bar Order:** `1`
   - **Tab Bar Icon:** `search`
   - **Tab Bar Label:** `Search`

3. Click "Save Screen"

4. **Add Element:**
   - Click "Add Element" button
   - **Element Type:** Select `Property Search` (ID: 113)
   - **Display Order:** `1`
   - **Configuration (JSON):**
   ```json
   {
     "filters": ["location", "price", "guests"],
     "sort_options": ["price_asc", "price_desc", "newest"],
     "default_sort": "newest",
     "show_map": false,
     "card_layout": "grid",
     "items_per_page": 20,
     "enable_favorites": true
   }
   ```
   - Click "Save Element"

5. **Assign Roles:**
   - Guest ✅
   - Renter ✅
   - Premium Renter ✅
   - Host ✅
   - Admin ✅

---

### Screen 2: Book Property 📅

**Purpose:** Booking form for a specific property

**Steps:**
1. Click "Add Screen" button
2. Fill in screen details:
   - **Name:** `Book Property`
   - **Description:** `Create a booking for a property`
   - **Show in Tab Bar:** ❌ No (navigated to from property details)
   - **Tab Bar Order:** Leave empty
   - **Tab Bar Icon:** Leave empty

3. Click "Save Screen"

4. **Add Element:**
   - Click "Add Element" button
   - **Element Type:** Select `Booking Form` (ID: 108)
   - **Display Order:** `1`
   - **Configuration (JSON):**
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
   - Click "Save Element"

5. **Assign Roles:**
   - Guest ❌
   - Renter ✅
   - Premium Renter ✅
   - Host ❌
   - Admin ✅

---

### Screen 3: My Bookings 📋

**Purpose:** List of user's bookings with filters

**Steps:**
1. Click "Add Screen" button
2. Fill in screen details:
   - **Name:** `My Bookings`
   - **Description:** `View and manage your bookings`
   - **Show in Tab Bar:** ✅ Yes
   - **Tab Bar Order:** `2`
   - **Tab Bar Icon:** `event`
   - **Tab Bar Label:** `Bookings`

3. Click "Save Screen"

4. **Add Element:**
   - Click "Add Element" button
   - **Element Type:** Select `Booking List` (ID: 109)
   - **Display Order:** `1`
   - **Configuration (JSON):**
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
   - Click "Save Element"

5. **Assign Roles:**
   - Guest ❌
   - Renter ✅
   - Premium Renter ✅
   - Host ✅
   - Admin ✅

---

### Screen 4: Booking Details 📄

**Purpose:** Detailed view of a single booking

**Steps:**
1. Click "Add Screen" button
2. Fill in screen details:
   - **Name:** `Booking Details`
   - **Description:** `View detailed booking information`
   - **Show in Tab Bar:** ❌ No (navigated to from booking list)
   - **Tab Bar Order:** Leave empty
   - **Tab Bar Icon:** Leave empty

3. Click "Save Screen"

4. **Add Element:**
   - Click "Add Element" button
   - **Element Type:** Select `Booking Detail` (ID: 110)
   - **Display Order:** `1`
   - **Configuration (JSON):**
   ```json
   {
     "booking_id_source": "route_param",
     "sections": ["property", "trip", "guest", "host", "price", "timeline"],
     "show_timeline": true,
     "enable_cancel": true,
     "enable_contact_host": true
   }
   ```
   - Click "Save Element"

5. **Assign Roles:**
   - Guest ❌
   - Renter ✅
   - Premium Renter ✅
   - Host ✅
   - Admin ✅

---

### Screen 5: Messages 💬

**Purpose:** List of conversations

**Steps:**
1. Click "Add Screen" button
2. Fill in screen details:
   - **Name:** `Messages`
   - **Description:** `View your conversations`
   - **Show in Tab Bar:** ✅ Yes
   - **Tab Bar Order:** `3`
   - **Tab Bar Icon:** `chat`
   - **Tab Bar Label:** `Messages`

3. Click "Save Screen"

4. **Add Element:**
   - Click "Add Element" button
   - **Element Type:** Select `Conversation List` (ID: 111)
   - **Display Order:** `1`
   - **Configuration (JSON):**
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
   - Click "Save Element"

5. **Assign Roles:**
   - Guest ❌
   - Renter ✅
   - Premium Renter ✅
   - Host ✅
   - Admin ✅

---

### Screen 6: Chat 💭

**Purpose:** Chat interface for a conversation

**Steps:**
1. Click "Add Screen" button
2. Fill in screen details:
   - **Name:** `Chat`
   - **Description:** `Send and receive messages`
   - **Show in Tab Bar:** ❌ No (navigated to from messages list)
   - **Tab Bar Order:** Leave empty
   - **Tab Bar Icon:** Leave empty

3. Click "Save Screen"

4. **Add Element:**
   - Click "Add Element" button
   - **Element Type:** Select `Chat Interface` (ID: 112)
   - **Display Order:** `1`
   - **Configuration (JSON):**
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
   - Click "Save Element"

5. **Assign Roles:**
   - Guest ❌
   - Renter ✅
   - Premium Renter ✅
   - Host ✅
   - Admin ✅

---

## 🔗 **NAVIGATION SETUP**

After creating all screens, you need to update existing screens to add navigation buttons.

### Update "Property Details" Screen

**Add Navigation Elements:**

1. Find the "Property Details" screen in the template
2. Add a **Button Element** (if available) or **Link Element**:
   - **Label:** `Book This Property`
   - **Action:** Navigate to `Book Property` screen
   - **Pass Parameter:** `listingId` from current property
   - **Display Order:** After property description
   - **Visible to:** Renter, Premium Renter roles only

3. Add another **Button Element**:
   - **Label:** `Contact Host`
   - **Action:** Start conversation (navigate to Chat)
   - **Display Order:** After "Book This Property" button
   - **Visible to:** All authenticated users

---

## ✅ **VERIFICATION CHECKLIST**

After creating all screens, verify:

- [ ] All 6 screens created successfully
- [ ] Each screen has the correct element assigned
- [ ] Element configurations are valid JSON
- [ ] Role assignments are correct
- [ ] Tab bar screens show in correct order (Search=1, Bookings=2, Messages=3)
- [ ] Tab bar icons and labels are set
- [ ] Non-tab screens don't have tab bar settings

---

## 🎨 **TAB BAR LAYOUT**

Your tab bar should look like this:

```
┌─────────────────────────────────────────────┐
│  🔍 Search  │  📅 Bookings  │  💬 Messages  │
└─────────────────────────────────────────────┘
```

**Order:**
1. Search Properties (search icon)
2. My Bookings (event icon)
3. Messages (chat icon)

---

## 🚀 **PUBLISH TEMPLATE**

After all screens are configured:

1. Review all screens in the template
2. Test navigation flow
3. Click "Publish Template" button
4. Confirm publication

---

## 📊 **EXPECTED RESULTS**

After completing Phase 3:

✅ **6 new dynamic screens** in the template  
✅ **Config-driven behavior** - no hardcoded screens needed  
✅ **Role-based access** - correct screens for each user type  
✅ **Tab bar navigation** - 3 main screens accessible  
✅ **Deep linking** - screens navigate to each other correctly

---

## 🐛 **TROUBLESHOOTING**

### Issue: Element not showing in dropdown
**Solution:** Verify element IDs 108-113 exist in database:
```bash
docker exec -i multi_app_mysql mysql -u root -prootpassword multi_site_manager -e "SELECT id, element_type FROM screen_elements WHERE id >= 108;"
```

### Issue: JSON configuration error
**Solution:** Validate JSON at https://jsonlint.com before pasting

### Issue: Screen not appearing in mobile app
**Solution:** 
1. Check role assignments
2. Verify screen is published
3. Restart mobile app to fetch new template

---

## ⏱️ **TIME ESTIMATES**

- Screen 1 (Search): 20 minutes
- Screen 2 (Book): 15 minutes
- Screen 3 (Bookings): 15 minutes
- Screen 4 (Details): 15 minutes
- Screen 5 (Messages): 15 minutes
- Screen 6 (Chat): 15 minutes
- Navigation setup: 30 minutes
- Testing & Publishing: 30 minutes

**Total:** ~3 hours

---

## 📝 **NOTES**

- Keep the admin portal open at http://localhost:3001/master/app-templates/9
- Save frequently
- Test each screen after creation
- Take screenshots if needed for documentation

---

**Ready to start?** Begin with Screen 1: Search Properties! 🚀
