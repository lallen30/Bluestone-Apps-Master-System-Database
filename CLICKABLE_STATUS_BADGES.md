# Clickable Status Badges

## Summary
Made the status badges clickable so admins can cycle through statuses by clicking directly on the badge.

**Date:** November 21, 2025

---

## Changes Made

### Admin Portal - Listings Page
**File:** `admin_portal/app/app/[id]/listings/page.tsx`

#### 1. Status Badge is Now Clickable
- Changed from `<span>` to `<button>` element
- Added hover effects (darker background on hover)
- Added cursor pointer
- Added tooltip: "Click to cycle status"

#### 2. Status Cycling Logic
Click the status badge to cycle through:
```
draft → pending_review → active → inactive → draft
```

If listing is suspended, clicking cycles back to draft (unsuspends).

#### 3. New Suspend Button
- Replaced Eye icon with X icon (suspend)
- Only shows when listing is NOT already suspended
- Requires confirmation before suspending
- Tooltip: "Suspend listing"

---

## UI Changes

### Before:
```
Status Column: [gray badge: draft]
Actions Column: [👁️ Eye] [🗑️ Trash]
```

### After:
```
Status Column: [clickable badge: draft] ← Click to cycle
Actions Column: [❌ Suspend] [🗑️ Delete]
```

---

## Status Cycle Flow

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  draft → pending_review → active → inactive ────┤
│    ↑                                            │
│    └────────────────────────────────────────────┘
│
│  suspended → draft (click to unsuspend)
```

---

## Button Actions

| Button | Icon | Action | Confirmation? |
|--------|------|--------|---------------|
| **Status Badge** | None | Cycle through statuses | No |
| **Suspend** | ❌ X | Set status to 'suspended' | Yes |
| **Delete** | 🗑️ Trash | Delete listing permanently | Yes |

---

## Color Coding

| Status | Color | Hover Color |
|--------|-------|-------------|
| **active** | Green (bg-green-50) | Darker green |
| **draft** | Gray (bg-gray-50) | Darker gray |
| **pending_review** | Yellow (bg-yellow-50) | Darker yellow |
| **inactive** | Orange (bg-orange-50) | Darker orange |
| **suspended** | Red (bg-red-50) | Darker red |

---

## User Experience

### Quick Status Changes
1. **Click badge once** - Changes to next status in cycle
2. **Click multiple times** - Cycles through all statuses
3. **Hover over badge** - Background darkens (shows it's clickable)
4. **Tooltip appears** - "Click to cycle status"

### Suspending a Listing
1. **Click X button** (only visible if not already suspended)
2. **Confirm suspension** - Alert dialog appears
3. **Status changes to 'suspended'** - Badge turns red
4. **X button disappears** - Can only unsuspend by clicking badge

### Common Workflows

**Publish a draft listing:**
- Click badge: draft → pending_review → active ✅

**Temporarily pause a listing:**
- Click badge: active → inactive ✅

**Reactivate a paused listing:**
- Click badge: inactive → draft → pending_review → active ✅

**Suspend a problematic listing:**
- Click X button → Confirm ✅

**Unsuspend a listing:**
- Click badge: suspended → draft ✅

---

## Benefits

1. **Faster** - One click instead of two (no Eye icon needed)
2. **More Intuitive** - Click the thing you want to change
3. **Visual Feedback** - Hover effect shows it's clickable
4. **Flexible** - Can cycle through all statuses
5. **Clear Actions** - Suspend is separate from status cycling

---

## Testing

### Test Status Cycling
1. Go to http://localhost:3001/app/28/listings
2. Find a listing with status 'draft'
3. Click the gray "draft" badge
4. Should change to yellow "pending_review"
5. Click again → green "active"
6. Click again → orange "inactive"
7. Click again → gray "draft" (back to start)

### Test Suspend
1. Find an active listing
2. Click the X button (suspend)
3. Confirm the alert
4. Badge should turn red "suspended"
5. X button should disappear
6. Click the red "suspended" badge
7. Should change to gray "draft" (unsuspended)

---

**Status:** ✅ Implemented
**User Feedback:** More intuitive and faster to use
