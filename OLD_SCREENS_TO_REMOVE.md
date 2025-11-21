# Old Screens to Remove - Cleanup List

**Date:** November 20, 2025  
**Template:** Property Rental App (ID: 9)

---

## 🗑️ **DUPLICATE/OLD SCREENS TO DELETE**

### ❌ **DUPLICATES - Delete These:**

| ID | Screen Name | Screen Key | Category | Created | Reason |
|----|-------------|------------|----------|---------|--------|
| **573** | Messages | messages | Main | 2025-11-12 | **DUPLICATE** - We have new Messages (ID: 579) |
| **123** | Booking Form | booking_form | Booking | 2025-11-06 | **OLD** - Now using Book Property (ID: 576) with element |

### ✅ **NEW SCREENS - Keep These:**

| ID | Screen Name | Screen Key | Category | Created | Status |
|----|-------------|------------|----------|---------|--------|
| **575** | Search Properties | search_properties | Search | 2025-11-20 | ✅ NEW - Uses Property Search element |
| **576** | Book Property | book_property | Booking | 2025-11-20 | ✅ NEW - Uses Booking Form element |
| **577** | My Bookings | my_bookings | Booking | 2025-11-20 | ✅ NEW - Uses Booking List element |
| **578** | Booking Details | booking_details | Booking | 2025-11-20 | ✅ NEW - Uses Booking Detail element |
| **579** | Messages | messages | Communication | 2025-11-20 | ✅ NEW - Uses Conversation List element |
| **580** | Chat | chat | Communication | 2025-11-20 | ✅ NEW - Uses Chat Interface element |

---

## 🔍 **ANALYSIS**

### **Messages Screens (2 found):**
1. **ID: 573** (OLD) - Created Nov 12, category "Main" → **DELETE**
2. **ID: 579** (NEW) - Created Nov 20, category "Communication" → **KEEP**

### **Booking Form Screens:**
1. **ID: 123** (OLD) - Old template screen → **DELETE**
2. **ID: 576** (NEW) - "Book Property" with dynamic element → **KEEP**

---

## 🧹 **CLEANUP SQL SCRIPT**

```sql
USE multi_site_manager;

-- Delete old Messages screen (ID: 573)
DELETE FROM app_template_screen_elements WHERE template_screen_id = 573;
DELETE FROM app_template_screens WHERE id = 573;

-- Delete old Booking Form screen (ID: 123)
DELETE FROM app_template_screen_elements WHERE template_screen_id = 123;
DELETE FROM app_template_screens WHERE id = 123;

-- Verify deletion
SELECT 
    id, screen_name, screen_key, screen_category, display_order
FROM app_template_screens
WHERE template_id = 9
    AND screen_name IN ('Messages', 'Booking Form', 'Book Property')
ORDER BY display_order;
```

---

## 📋 **OTHER OLD SCREENS (Review)**

These are old screens that might also need review:

| ID | Screen Name | Screen Key | Category | Notes |
|----|-------------|------------|----------|-------|
| 121 | Property Listings | property_listings | Property | Could be replaced with Search Properties |
| 122 | Property Details | property_details | Property | Keep - still needed for detail view |
| 124 | Host Profile | host_profile | Profile | Keep - not replaced yet |
| 125 | Reviews & Ratings | reviews_ratings | Reviews | Keep - not replaced yet |
| 126 | Advanced Search | advanced_search | Search | Could be replaced with Search Properties |

**Recommendation:** Focus on removing the clear duplicates (573, 123) first, then review the others.

---

## ⚠️ **BEFORE DELETING**

Check if any of these screens are:
1. Referenced in menus
2. Used in navigation
3. Assigned to roles
4. Have active users accessing them

---

## ✅ **SAFE TO DELETE NOW**

These two are safe to delete immediately:
- **ID: 573** - Duplicate Messages (we have 579)
- **ID: 123** - Old Booking Form (we have 576)

---

## 🚀 **EXECUTION PLAN**

1. **Backup first:**
   ```bash
   docker exec multi_app_mysql mysqldump -u root -prootpassword multi_site_manager app_template_screens app_template_screen_elements > backup_before_cleanup.sql
   ```

2. **Delete duplicates:**
   - Run the cleanup SQL script above

3. **Verify:**
   - Check admin portal
   - Test mobile app
   - Confirm no broken navigation

4. **Update display order:**
   - Renumber screens to be sequential

---

## 📊 **EXPECTED RESULT**

After cleanup, Template 9 should have:
- ✅ 6 new dynamic screens (575-580)
- ✅ No duplicate Messages screens
- ✅ No old Booking Form screen
- ✅ Clean, organized screen list

---

**Ready to execute cleanup?**
