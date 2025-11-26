# Property Listing Status Refactor

## Summary
Simplified the property listing status system by removing the redundant `is_published` field and using only the `status` enum field.

**Date:** November 21, 2025

---

## Problem
The system had two overlapping fields:
- `is_published` (boolean: 0 or 1)
- `status` (enum: draft, pending_review, active, inactive, suspended)

These were redundant because:
- `is_published = 1` always set `status = 'active'`
- `is_published = 0` always set `status = 'draft'`
- Other status values (pending_review, inactive, suspended) were never used

---

## Solution: Use Only `status`

### Status Values & Meanings:
- **`draft`** - Host is creating/editing, not visible to public
- **`pending_review`** - Submitted for admin approval (future feature)
- **`active`** - Published and visible in search results, bookable
- **`inactive`** - Temporarily unavailable (host paused)
- **`suspended`** - Admin removed (policy violation)

---

## Changes Made

### Backend API

#### 1. New Controller Function
**File:** `multi_site_manager/src/controllers/propertyListingsController.js`

Created `updateListingStatus()`:
- Accepts `status` parameter (draft, pending_review, active, inactive, suspended)
- Validates status values
- Only admins can set 'suspended' status
- Updates `published_at` timestamp when changing to/from 'active'
- Admins can update any listing, users can only update their own

Kept `publishListing()` for backward compatibility:
- Converts `is_published` boolean to status ('active' or 'draft')
- Forwards to `updateListingStatus()`

#### 2. New Route
**File:** `multi_site_manager/src/routes/propertyListings.js`

Added:
```javascript
PUT /api/v1/apps/:appId/listings/:listingId/status
```

Kept old route for backward compatibility:
```javascript
PUT /api/v1/apps/:appId/listings/:listingId/publish
```

Both use `authenticateDual` middleware (admin or mobile user auth).

---

### Admin Portal

#### 1. Updated API Client
**File:** `admin_portal/lib/api.ts`

Added `updateListingStatus()` method:
```typescript
updateListingStatus: async (appId: number, listingId: number, status: string)
```

#### 2. Updated Listings Page
**File:** `admin_portal/app/app/[id]/listings/page.tsx`

Changes:
- `handleTogglePublish()` now toggles between 'active' and 'draft' status
- Removed `is_published` badge display
- Updated `getStatusColor()` to handle all 5 status values with color coding:
  - **active** → Green
  - **draft** → Gray
  - **pending_review** → Yellow
  - **inactive** → Orange
  - **suspended** → Red

---

### Mobile App

#### 1. Updated Config
**File:** `mobile_apps/property_listings/src/api/config.ts`

Added STATUS endpoint:
```typescript
STATUS: (id: number) => `/apps/${API_CONFIG.APP_ID}/listings/${id}/status`
```

#### 2. Updated Service
**File:** `mobile_apps/property_listings/src/api/listingsService.ts`

Added `updateListingStatus()` method:
```typescript
updateListingStatus: async (id: number, status: string)
```

Kept `publishListing()` for backward compatibility.

---

## Database Schema

### Current Schema (No Changes Required)
The `property_listings` table already has:
- `status` enum('draft','pending_review','active','inactive','suspended') DEFAULT 'draft'
- `is_published` tinyint(1) DEFAULT 0 (deprecated but kept for backward compatibility)
- `published_at` timestamp NULL (updated when status changes to/from 'active')

### Future Cleanup (Optional)
To fully remove `is_published`:
1. Update all queries to use only `status`
2. Run migration to drop `is_published` column
3. Remove backward compatibility code

---

## API Behavior

### Visibility Rules
Listings are visible in search results when:
- `status = 'active'`

Listings are hidden when:
- `status = 'draft'`
- `status = 'pending_review'`
- `status = 'inactive'`
- `status = 'suspended'`

### Permission Rules
- **Mobile Users:** Can update status of their own listings (except 'suspended')
- **Admins:** Can update status of any listing (including 'suspended')

---

## Testing Checklist

### Admin Portal
- [ ] Go to http://localhost:3001/app/28/listings
- [ ] Click Eye icon to toggle listing status
- [ ] Verify status changes between 'active' and 'draft'
- [ ] Verify status badge shows correct color
- [ ] Verify no "Invalid token" errors

### Mobile App
- [ ] Create a new listing (should start as 'draft')
- [ ] Publish listing (should change to 'active')
- [ ] Verify listing appears in search when 'active'
- [ ] Unpublish listing (should change to 'draft')
- [ ] Verify listing disappears from search when 'draft'

### API Testing
```bash
# Update status to active
curl -X PUT http://localhost:3000/api/v1/apps/28/listings/1/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "active"}'

# Update status to inactive
curl -X PUT http://localhost:3000/api/v1/apps/28/listings/1/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "inactive"}'
```

---

## Benefits

1. **Simpler Logic** - One field instead of two
2. **More Flexibility** - Can use all 5 status values
3. **Clearer Intent** - Status name describes the state
4. **Better UX** - Color-coded status badges in admin portal
5. **Future-Ready** - Can add approval workflow with 'pending_review'

---

## Backward Compatibility

The old `/publish` endpoint still works:
- `is_published: true` → Sets `status = 'active'`
- `is_published: false` → Sets `status = 'draft'`

This ensures existing mobile app code continues to work while we migrate to the new status-based system.

---

## Migration Path

If you want to fully remove `is_published`:

1. **Update all code** to use `status` instead of `is_published`
2. **Test thoroughly** in all environments
3. **Run migration:**
   ```sql
   -- Sync is_published with status (if needed)
   UPDATE property_listings 
   SET is_published = CASE 
     WHEN status = 'active' THEN 1 
     ELSE 0 
   END;
   
   -- Drop the column
   ALTER TABLE property_listings DROP COLUMN is_published;
   ```
4. **Remove backward compatibility code** from controllers

---

**Status:** ✅ Implemented and ready for testing
**Backward Compatible:** Yes
**Breaking Changes:** None
