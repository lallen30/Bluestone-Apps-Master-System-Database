# App Screen Isolation Design

## Problem Statement

Currently, all apps share the same master screens and elements. When you edit a screen's elements, it affects ALL apps using that screen. This is not ideal for multi-tenant applications where each app should have independent control over their screens.

## Current Architecture

```
apps
  └─ app_screen_assignments (links apps to screens)
       └─ app_screens (master screens - SHARED)
            └─ screen_element_instances (elements - SHARED)
                 └─ screen_elements (element types)
```

**Problem:** Modifying `screen_element_instances` affects all apps using that screen.

---

## Proposed Solution: Copy-on-Assign

### Architecture

```
apps
  └─ app_screen_instances (app-specific screen copies)
       └─ app_element_instances (app-specific element copies)
            └─ screen_elements (element types - still shared)

app_screens (master screens - templates only)
  └─ screen_element_instances (master elements - templates only)
```

### New Tables

#### 1. app_screen_instances
Stores app-specific copies of screens.

```sql
CREATE TABLE app_screen_instances (
  id INT PRIMARY KEY AUTO_INCREMENT,
  app_id INT NOT NULL,
  master_screen_id INT NULL, -- Reference to original template
  name VARCHAR(255) NOT NULL,
  screen_key VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  description TEXT,
  icon VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
  FOREIGN KEY (master_screen_id) REFERENCES app_screens(id) ON DELETE SET NULL,
  UNIQUE KEY unique_screen_key_per_app (app_id, screen_key)
);
```

#### 2. app_element_instances
Stores app-specific copies of screen elements.

```sql
CREATE TABLE app_element_instances (
  id INT PRIMARY KEY AUTO_INCREMENT,
  app_screen_instance_id INT NOT NULL,
  element_id INT NOT NULL,
  field_key VARCHAR(255) NOT NULL,
  label VARCHAR(255),
  placeholder VARCHAR(255),
  default_value TEXT,
  validation_rules JSON,
  is_required BOOLEAN DEFAULT FALSE,
  is_visible BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  config JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (app_screen_instance_id) REFERENCES app_screen_instances(id) ON DELETE CASCADE,
  FOREIGN KEY (element_id) REFERENCES screen_elements(id),
  UNIQUE KEY unique_field_key_per_screen (app_screen_instance_id, field_key)
);
```

---

## Migration Strategy

### Phase 1: Create New Tables
1. Create `app_screen_instances` table
2. Create `app_element_instances` table
3. Add indexes for performance

### Phase 2: Migrate Existing Data
1. For each app with screen assignments:
   - Copy assigned screens → `app_screen_instances`
   - Copy screen elements → `app_element_instances`
2. Verify data integrity

### Phase 3: Update Application Code
1. Update screen queries to use `app_screen_instances`
2. Update element queries to use `app_element_instances`
3. Update admin portal UI
4. Update API endpoints

### Phase 4: Deprecate Old System
1. Keep `app_screens` as master templates
2. Remove `app_screen_assignments` (no longer needed)
3. Keep `screen_element_instances` for templates only

---

## Benefits

### ✅ **App Isolation**
- Each app has its own screen copies
- Modifications don't affect other apps
- Apps can customize freely

### ✅ **Template System**
- Master screens remain as templates
- New apps can be created from templates
- Templates can be updated without affecting existing apps

### ✅ **Flexibility**
- Apps can add custom screens
- Apps can modify element configurations
- Apps can hide/show elements independently

### ✅ **Data Integrity**
- Deleting an app removes its screens (CASCADE)
- Master templates remain intact
- No orphaned data

---

## API Changes

### Current Endpoints
```
GET  /api/v1/apps/:appId/screens  (uses app_screen_assignments)
POST /api/v1/apps/:appId/screens  (assigns master screen)
```

### New Endpoints
```
GET    /api/v1/apps/:appId/screens           (from app_screen_instances)
POST   /api/v1/apps/:appId/screens           (creates instance from template)
PUT    /api/v1/apps/:appId/screens/:screenId (updates app's screen)
DELETE /api/v1/apps/:appId/screens/:screenId (removes app's screen)

GET    /api/v1/apps/:appId/screens/:screenId/elements (app_element_instances)
POST   /api/v1/apps/:appId/screens/:screenId/elements (add element to app screen)
PUT    /api/v1/apps/:appId/screens/:screenId/elements/:elementId (update)
DELETE /api/v1/apps/:appId/screens/:screenId/elements/:elementId (remove)

GET    /api/v1/templates/screens              (master templates)
GET    /api/v1/templates/screens/:screenId    (template details)
```

---

## UI Changes

### App Screen Management
**Before:**
- Shows assigned master screens
- Can't modify elements per app

**After:**
- Shows app's screen instances
- Can add/remove/modify elements
- Can customize per app

### Screen Builder
**New Features:**
- Drag-and-drop element management
- Per-app element configuration
- Hide/show elements
- Reorder elements
- Custom labels and placeholders

---

## Implementation Steps

### Step 1: Database Migration (30 min)
```bash
# Create new tables
mysql < migrations/026_create_app_screen_instances.sql

# Migrate existing data
mysql < migrations/027_migrate_to_screen_instances.sql
```

### Step 2: Backend Updates (2 hours)
- Update controllers
- Update routes
- Add new endpoints
- Update queries

### Step 3: Frontend Updates (2 hours)
- Update screen list page
- Add element management UI
- Update API calls
- Add drag-and-drop

### Step 4: Testing (1 hour)
- Test app isolation
- Test element modifications
- Test template creation
- Test data integrity

**Total Time: ~5-6 hours**

---

## Example Usage

### Creating an App from Template

```javascript
// 1. User creates app from "E-commerce" template
POST /api/v1/apps
{
  "name": "My Shop",
  "template_id": 10
}

// 2. System automatically:
// - Creates app record
// - Copies template screens → app_screen_instances
// - Copies template elements → app_element_instances

// 3. User can now customize their app's screens
PUT /api/v1/apps/123/screens/456/elements/789
{
  "label": "Product Name",
  "is_required": true,
  "placeholder": "Enter product name"
}

// 4. Changes only affect app 123, not other apps using the same template
```

---

## Backward Compatibility

### Option 1: Clean Break
- Migrate all existing apps
- Remove old tables
- Update all code

### Option 2: Gradual Migration
- Keep both systems running
- Migrate apps one by one
- Deprecate old system after all apps migrated

**Recommendation:** Option 1 (Clean Break) - Cleaner, less technical debt

---

## Next Steps

1. **Review this design** - Confirm approach
2. **Create migrations** - Database changes
3. **Update backend** - API and controllers
4. **Update frontend** - Admin portal UI
5. **Test thoroughly** - Ensure isolation works
6. **Deploy** - Roll out new system

---

## Questions to Consider

1. Should apps be able to create screens from scratch, or only from templates?
2. Should template updates propagate to existing apps (with opt-in)?
3. Should we allow apps to share custom screens with other apps?
4. Should we version screen instances for rollback capability?

---

**Status:** Design Complete - Ready for Implementation
**Estimated Time:** 5-6 hours
**Priority:** High - Critical for multi-tenant functionality
