# Template 5: Real Estate App - Implementation Checklist

## Overview

**Template 5** is the "Real Estate App" template for property listings and real estate marketplace.  
**Template 9** is the "Property Rental App" template which is fully functional and serves as the reference.

This checklist outlines what needs to be done to make Template 5 fully functional like Template 9.

---

## Current State Analysis

### Template 9 (Property Rental - COMPLETE) ✅
| Component | Count | Status |
|-----------|-------|--------|
| Screens | 35 | ✅ All linked to master screens via `screen_id` |
| Roles | 3 (guest, host, renter) | ✅ Complete |
| Menus | 4 (tabbar, 2 sidebars, legal) | ✅ Complete |
| Menu Items | 47 | ✅ Complete |
| Screen Role Access | 19 entries | ✅ Complete |
| Screen Menu Assignments | 24 entries | ✅ Complete |
| Sample Users | 6 | ✅ Complete |
| User Role Assignments | 6 | ✅ Complete |
| Property Listings | 11 | ✅ Complete |

### Template 5 (Real Estate - COMPLETE) ✅
| Component | Count | Status |
|-----------|-------|--------|
| Screens | 30 | ✅ All linked to master screens via `screen_id` |
| Roles | 3 (buyer, seller, agent) | ✅ Complete |
| Menus | 4 (tabbar, 2 sidebars, legal) | ✅ Complete |
| Menu Items | 31 | ✅ Complete |
| Screen Role Access | 36 entries | ✅ Complete |
| Screen Menu Assignments | 30 entries | ✅ Complete |
| Sample Users | 6 | ✅ Complete |
| User Role Assignments | 6 | ✅ Complete |
| Property Listings | 8 | ✅ Complete |

**Migration Applied:** `045_populate_template5_real_estate.sql` on December 9, 2025

---

## Key Differences: Property Rental vs Real Estate

| Feature | Property Rental (Template 9) | Real Estate (Template 5) |
|---------|------------------------------|--------------------------|
| **Purpose** | Short-term vacation rentals | Property buying/selling/renting |
| **User Types** | Guest, Host, Renter | Buyer, Seller, Agent |
| **Listings** | Nightly rentals with availability | Properties for sale/rent with pricing |
| **Booking** | Date-based reservations | Inquiry/showing requests |
| **Pricing** | Per night + fees | Sale price or monthly rent |
| **Key Features** | Calendar, availability, reviews | MLS integration, mortgage calc, virtual tours |

---

## Implementation Checklist

### Phase 1: Database Structure Setup ✅ COMPLETE

#### 1.1 Update Template Metadata
- [ ] Update `app_templates` description for Template 5
  ```sql
  UPDATE app_templates SET 
    description = 'Complete real estate marketplace for buying, selling, and renting properties with agent profiles, property listings, and inquiry management'
  WHERE id = 5;
  ```

#### 1.2 Create Roles
- [ ] Create roles in `app_template_roles`:
  - **buyer** (default) - Browse and inquire about properties
  - **seller** - List properties for sale
  - **agent** - Manage listings, connect buyers and sellers

```sql
INSERT INTO app_template_roles (template_id, name, display_name, description, is_default) VALUES
(5, 'buyer', 'Buyer', 'Browse properties, save favorites, and submit inquiries', 1),
(5, 'seller', 'Seller', 'List properties for sale or rent, manage inquiries', 0),
(5, 'agent', 'Agent', 'Real estate agent - manage listings, connect buyers and sellers', 0);
```

#### 1.3 Create Menus
- [ ] Create menus in `app_template_menus`:
  - **Buyer Tab Bar** - Bottom navigation for buyers
  - **Buyer Sidebar** - Left sidebar for buyers
  - **Agent Sidebar** - Left sidebar for agents
  - **Legal Sidebar** - Right sidebar for legal pages

```sql
INSERT INTO app_template_menus (template_id, name, menu_type, icon, description, is_active) VALUES
(5, 'Buyer Tab Bar', 'tabbar', 'menu', 'Bottom navigation for property browsing', 1),
(5, 'Buyer Menu', 'sidebar_left', 'menu', 'Buyer sidebar menu', 1),
(5, 'Agent Menu', 'sidebar_left', 'menu', 'Agent sidebar menu', 1),
(5, 'Legal', 'sidebar_right', 'menu', 'Legal pages sidebar', 1);
```

---

### Phase 2: Screen Configuration ✅ COMPLETE

#### 2.1 Link Existing Screens to Master Screens
Current Template 5 screens have `screen_id = NULL`. Need to either:
- Link to existing master screens, OR
- Create new master screens for real estate specific functionality

| Template Screen | Master Screen ID | Action Needed |
|-----------------|------------------|---------------|
| Splash Screen | 101 | Link |
| Login Screen | 18 | Link |
| Sign Up | 102 | Link |
| Email Verification | 104 | Link |
| Forgot Password | 103 | Link |
| Reset Password | (create new) | Create master screen |
| Home | 112 (Search Properties) | Link |
| Property Listings | 96 | Link |
| Property Details | 97 | Link |
| Favorites | 135 | Link |
| Map View | (create new) | Create master screen |
| User Profile | 105 | Link |
| Edit Profile | 106 | Link |
| Notifications List | 107 | Link |
| Settings | (create new) | Create master screen |
| Privacy Policy | 110 | Link |
| Terms of Service | 111 | Link |
| Contact Us | 108 | Link |
| About Us | 109 | Link |

#### 2.2 Add Missing Real Estate Screens
- [ ] Agent Dashboard (similar to Host Dashboard - 131)
- [ ] My Listings (reuse 129)
- [ ] Create Listing (reuse 127)
- [ ] Edit Listing (reuse 130)
- [ ] Property Inquiries (similar to Host Bookings - 132)
- [ ] Messages (reuse 116)
- [ ] Chat (reuse 117)
- [ ] Schedule Showing (new)
- [ ] Mortgage Calculator (new)
- [ ] Agent Profile (similar to Host Profile - 98)
- [ ] Saved Searches (new)
- [ ] Compare Properties (new)

#### 2.3 Update Template Screens with screen_id
```sql
-- Example updates (need to verify screen_ids exist)
UPDATE app_template_screens SET screen_id = 101 WHERE template_id = 5 AND screen_key = 'splash_screen';
UPDATE app_template_screens SET screen_id = 18 WHERE template_id = 5 AND screen_key = 'login';
UPDATE app_template_screens SET screen_id = 102 WHERE template_id = 5 AND screen_key = 'sign_up';
-- ... continue for all screens
```

---

### Phase 3: Menu Configuration ✅ COMPLETE

#### 3.1 Create Menu Items
After creating menus, add items to `app_template_menu_items`:

**Buyer Tab Bar Items:**
- Home/Search (screen_id: 112)
- Favorites (screen_id: 135)
- Messages (screen_id: 116)
- Profile (screen_id: 105)
- Sidebar toggle

**Buyer Sidebar Items:**
- Home
- Profile
- Notifications
- Favorites
- Messages
- About Us
- Contact Us
- Privacy Policy
- Terms of Service
- Logout

**Agent Sidebar Items:**
- Dashboard
- My Listings
- Create Listing
- Inquiries
- Messages
- Earnings/Stats
- Profile
- Settings
- Logout

#### 3.2 Create Menu Role Access
- [ ] Add entries to `app_template_menu_role_access`:
  - Buyer Tab Bar → buyer role
  - Buyer Sidebar → buyer role
  - Agent Sidebar → agent role
  - Legal Sidebar → all roles

---

### Phase 4: Screen Access Control ✅ COMPLETE

#### 4.1 Screen Role Access
- [ ] Add entries to `app_template_screen_role_access`:

| Screen | Buyer | Seller | Agent |
|--------|-------|--------|-------|
| Property Listings | ✅ | ✅ | ✅ |
| Property Details | ✅ | ✅ | ✅ |
| Favorites | ✅ | ✅ | ✅ |
| Messages | ✅ | ✅ | ✅ |
| Chat | ✅ | ✅ | ✅ |
| Submit Inquiry | ✅ | ❌ | ❌ |
| My Listings | ❌ | ✅ | ✅ |
| Create Listing | ❌ | ✅ | ✅ |
| Edit Listing | ❌ | ✅ | ✅ |
| Agent Dashboard | ❌ | ❌ | ✅ |
| Manage Inquiries | ❌ | ✅ | ✅ |

#### 4.2 Screen Menu Assignments
- [ ] Add entries to `app_template_screen_menu_assignments`:
  - Assign appropriate menus to each screen

---

### Phase 5: Sample Data ✅ COMPLETE

#### 5.1 Create Sample Users
- [ ] Add to `app_template_users`:
  - 2 buyers
  - 2 sellers
  - 2 agents

#### 5.2 Assign User Roles
- [ ] Add to `app_template_user_role_assignments`

#### 5.3 Create Sample Property Listings
- [ ] Add to `app_template_property_listings`:
  - Mix of properties for sale and rent
  - Various property types (house, condo, apartment, land)
  - Different price ranges
  - Different locations

#### 5.4 Add Property Images
- [ ] Add to `app_template_property_images`

#### 5.5 Add Property Amenities
- [ ] Add to `app_template_property_amenities`

---

### Phase 6: Role Home Screens ✅ COMPLETE

- [ ] Add to `app_template_role_home_screens`:
  - buyer → Property Listings / Search
  - seller → My Listings
  - agent → Agent Dashboard

---

### Phase 7: Administrator Permissions ⬜ (Optional)

- [ ] Add to `app_template_administrators`:
  - Define default admin permissions for apps created from this template

---

### Phase 8: Screen Module Assignments ⬜ (Optional)

- [ ] Add to `app_template_screen_module_assignments`:
  - Header bar configurations for each screen

---

## Migration File Structure

Create migration file: `045_populate_template5_real_estate.sql`

```sql
-- Migration: Populate Real Estate App Template (ID: 5)
-- Date: 2025-12-09

-- STEP 1: Update template metadata
-- STEP 2: Create roles
-- STEP 3: Create menus
-- STEP 4: Update screens with screen_id
-- STEP 5: Add new screens
-- STEP 6: Create menu items
-- STEP 7: Create menu role access
-- STEP 8: Create screen role access
-- STEP 9: Create screen menu assignments
-- STEP 10: Create sample users
-- STEP 11: Create user role assignments
-- STEP 12: Create sample property listings
-- STEP 13: Create property images
-- STEP 14: Create property amenities
-- STEP 15: Create role home screens
-- STEP 16: Create administrator permissions
-- STEP 17: Create screen module assignments
```

---

## Testing Checklist

After implementation:

- [ ] Template 5 appears correctly in admin portal at `/master/app-templates/5`
- [ ] All screens show with correct icons and categories
- [ ] "Create App from Template" button works
- [ ] New app is created with:
  - [ ] All screens assigned
  - [ ] All roles created
  - [ ] All menus created
  - [ ] All menu items created
  - [ ] Screen role access configured
  - [ ] Sample users created
  - [ ] Sample listings created
- [ ] Mobile app can load screens for the new app
- [ ] Role-based access works correctly

---

## Files to Modify/Create

1. **New Migration File:**
   - `/multi_site_manager/src/migrations/045_populate_template5_real_estate.sql`

2. **Potentially New Master Screens:**
   - Map View screen
   - Settings screen
   - Reset Password screen
   - Schedule Showing screen
   - Mortgage Calculator screen
   - Saved Searches screen
   - Compare Properties screen

---

## Estimated Effort

| Phase | Estimated Time |
|-------|----------------|
| Phase 1: Database Structure | 30 min |
| Phase 2: Screen Configuration | 1 hour |
| Phase 3: Menu Configuration | 45 min |
| Phase 4: Screen Access Control | 30 min |
| Phase 5: Sample Data | 1 hour |
| Phase 6-8: Additional Config | 30 min |
| Testing | 1 hour |
| **Total** | **~5 hours** |

---

## Next Steps

1. Review this checklist and confirm the approach
2. Decide which existing master screens to reuse vs create new ones
3. Create the migration file
4. Run migration
5. Test template in admin portal
6. Test creating an app from the template
7. Test the created app in mobile

---

*Last Updated: December 9, 2025*
