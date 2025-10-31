# Screen Builder Implementation Guide

## Overview
This document outlines the implementation of the dynamic screen builder system for mobile apps.

## Database Structure

### Tables Created
1. **screen_elements** - Available element types (47 elements across 7 categories)
2. **app_screens** - Screen templates created by master admin
3. **screen_element_instances** - Elements added to specific screens
4. **app_screen_assignments** - Screens assigned to apps
5. **app_screen_content** - App-specific content for screen elements

## Element Categories

### 1. Input Elements (9 types)
- Text Field, Text Area, Rich Text Editor
- Email, Phone, URL, Password
- Number, Currency

### 2. Selection Elements (7 types)
- Dropdown, Multi-Select
- Radio Button, Checkbox
- Switch/Toggle
- Country Selector, Language Selector

### 3. DateTime Elements (4 types)
- Date Picker, Time Picker
- DateTime Picker, Calendar

### 4. Media Elements (6 types)
- File Upload, Image Upload, Video Upload
- Audio Recorder, Camera Capture
- Signature Pad

### 5. Content Display Elements (6 types)
- Heading, Paragraph
- Rich Text Display, Icon
- Divider, Spacer

### 6. Interactive Elements (6 types)
- Button, Link
- Slider, Stepper
- Rating, Color Picker

### 7. Advanced Elements (9 types)
- Address Input, Location Picker
- Barcode Scanner, OTP Input
- Tags Input, Progress Bar
- Timer/Countdown, Chart/Graph

## API Endpoints

### Screen Elements
- `GET /api/v1/screen-elements` - Get all elements
- `GET /api/v1/screen-elements/categories` - Get categories
- `GET /api/v1/screen-elements/category/:category` - Get by category
- `GET /api/v1/screen-elements/:id` - Get element by ID

### App Screens
- `GET /api/v1/app-screens` - Get all screens
- `GET /api/v1/app-screens/:id` - Get screen with elements
- `POST /api/v1/app-screens` - Create new screen
- `PUT /api/v1/app-screens/:id` - Update screen
- `DELETE /api/v1/app-screens/:id` - Delete screen

### Screen Element Instances
- `POST /api/v1/app-screens/elements` - Add element to screen
- `PUT /api/v1/app-screens/elements/:id` - Update element instance
- `DELETE /api/v1/app-screens/elements/:id` - Remove element from screen

### App Screen Assignments
- `GET /api/v1/app-screens/app/:app_id` - Get screens for app
- `POST /api/v1/app-screens/app/assign` - Assign screen to app
- `DELETE /api/v1/app-screens/app/:app_id/:screen_id` - Unassign screen

### App Screen Content
- `GET /api/v1/app-screens/app/:app_id/screen/:screen_id` - Get screen content for app
- `POST /api/v1/app-screens/app/content` - Update screen content

## Frontend Pages to Implement

### 1. Master Dashboard Updates
**Location:** `/admin_portal/app/master/page.tsx`

**Add Two New Sections:**

#### Screens Section
- Display total count of screens
- Show recent screens (limit 10)
- "View All" link to `/master/screens`
- Columns: Name, Category, Apps Count, Created Date

#### Screen Elements Section
- Display total count of elements
- Group by category with counts
- "View All" link to `/master/screen-elements`
- Show element distribution chart/stats

### 2. Master Screens Management
**Location:** `/admin_portal/app/master/screens/page.tsx`

**Features:**
- List all screens with search/filter
- Create new screen button
- Edit/Delete screen actions
- View element count per screen
- Assign to apps button

**Create Screen Modal:**
- Screen name
- Screen key (auto-generated from name)
- Description
- Icon selector
- Category dropdown

### 3. Screen Builder Page
**Location:** `/admin_portal/app/master/screens/[id]/page.tsx`

**Features:**
- Left sidebar: Element categories
- Center: Screen preview with added elements
- Right sidebar: Element properties panel
- Drag-and-drop interface (or click to add)
- Reorder elements
- Configure each element:
  - Label
  - Placeholder
  - Default value
  - Required/Optional
  - Readonly
  - Validation rules
  - Custom config (JSON)

### 4. Screen Elements Library
**Location:** `/admin_portal/app/master/screen-elements/page.tsx`

**Features:**
- Grid view of all elements
- Filter by category
- Search elements
- View element details
- Show which screens use each element

### 5. App Screen Assignment
**Location:** `/admin_portal/app/master/apps/[id]/screens/page.tsx`

**Features:**
- List available screens
- Assign/unassign screens to app
- Set display order
- Activate/deactivate screens

### 6. Master Apps Page Update
**Location:** `/admin_portal/app/master/apps/page.tsx`

**Add:**
- New icon button in Actions column
- Opens screen assignment modal or navigates to assignment page
- Icon: `Monitor` or `Layout`

### 7. App Screens Content Editor
**Location:** `/admin_portal/app/app/[id]/screens/page.tsx`

**Update to:**
- List all assigned screens for the app
- Click screen to edit content
- Show screen elements with current content
- Edit content based on element type:
  - **Content fields** (heading, paragraph): Rich text editor
  - **Option fields** (dropdown, radio): Manage options
  - **Fixed fields**: Display only, no edit
  - **Input fields**: Show as preview

### 8. Screen Content Edit Page
**Location:** `/admin_portal/app/app/[id]/screens/[screen_id]/page.tsx`

**Features:**
- Display screen name and description
- List all elements in order
- Edit content for each element:
  - Text fields: Input/textarea
  - Rich text: WYSIWYG editor
  - Dropdowns/Radio/Checkbox: Manage options (add/edit/delete)
  - Images: Upload and preview
  - Fixed elements: Display only
- Save button
- Preview button (shows how it looks in mobile)

## Element Behavior Matrix

| Element Type | App Admin Can Edit | Has Options | Is Content | Is Input |
|-------------|-------------------|-------------|-----------|----------|
| Text Field | ✓ | ✗ | ✗ | ✓ |
| Heading | ✓ | ✗ | ✓ | ✗ |
| Dropdown | ✓ | ✓ | ✗ | ✓ |
| Button | ✓ | ✗ | ✓ | ✗ |
| Date Picker | ✗ | ✗ | ✗ | ✓ |
| Image Upload | ✗ | ✗ | ✗ | ✓ |

## Implementation Priority

### Phase 1 (Current)
✅ Database schema
✅ API endpoints
✅ API client functions

### Phase 2 (Next)
- [ ] Add sections to master dashboard
- [ ] Create master screens list page
- [ ] Add "Manage Screens" button to apps page

### Phase 3
- [ ] Create screen builder page
- [ ] Implement element library page
- [ ] Create screen assignment page

### Phase 4
- [ ] Update app screens page
- [ ] Create screen content editor
- [ ] Add mobile preview

## Notes

- Master Admin creates screen templates
- Screens are assigned to apps
- App Admins/Editors edit content for their app's screens
- Content is unique per app (same screen, different content)
- Mobile app will fetch screen definitions and content via API
- Future: Add screen versioning and publishing workflow

## Next Steps

1. Update master dashboard with new sections
2. Create screens management pages
3. Build screen builder interface
4. Implement content editor for apps
5. Add mobile preview functionality
6. Create API endpoints for mobile app consumption
