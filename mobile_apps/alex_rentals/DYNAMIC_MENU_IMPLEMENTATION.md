# Dynamic Menu System - Mobile App Implementation

## Overview

The mobile app now features a dynamic Menu tab that loads screens from the database and renders them using a dynamic screen component. This allows you to create and manage screens from the admin portal, and they automatically appear in the mobile app.

## Architecture

### Navigation Structure

```
Bottom Tabs (After Login):
├── Explore (Home) - Browse property listings
├── My Listings - User's created/saved properties
└── Menu - Dynamic screens + Profile access

Stack Navigator:
├── MainTabs (Bottom Tabs)
├── ListingDetail - Property details
├── DynamicScreen - Renders any app screen
└── Profile - User profile
```

### New Files Created

#### 1. **screensService.ts** (`src/api/screensService.ts`)
API service for fetching screen data from the backend.

**Methods:**
- `getAppScreens()` - Fetches all published screens for app ID 28
- `getScreenContent(screenId)` - Gets screen structure and elements
- `saveScreenContent(screenId, data)` - Saves user-submitted screen data

**Endpoints Used:**
- `GET /api/v1/app-screens/app/28` - List screens
- `GET /api/v1/app-screens/app/28/screen/{id}` - Screen content
- `POST /api/v1/app-screens/app/28/screen/{id}/content` - Save data

#### 2. **MenuScreen.tsx** (`src/screens/MenuScreen.tsx`)
Main menu screen that displays:
- User profile section with avatar and info
- Quick actions (View Profile, etc.)
- Dynamic list of app screens loaded from database
- Logout button

**Features:**
- Pull-to-refresh to reload screens
- Color-coded categories
- Screen descriptions and badges
- Navigates to DynamicScreen when screen is tapped

#### 3. **DynamicScreen.tsx** (`src/screens/DynamicScreen.tsx`)
Universal screen renderer that dynamically displays any screen based on its elements.

**Supported Element Types:**
- `text_input` - Single-line text input
- `email` - Email input with keyboard
- `phone` - Phone number input
- `textarea` - Multi-line text
- `number` - Numeric input
- `switch` / `checkbox` - Boolean toggle
- `heading` - Section heading
- `text` / `paragraph` - Display text
- `divider` - Visual separator

**Features:**
- Form validation (required fields)
- Auto-save functionality
- Pre-fills existing data
- Responsive layout

#### 4. **Updated AppNavigator.tsx**
Modified navigation to:
- Replace Profile tab with Menu tab
- Add DynamicScreen to stack navigator
- Keep Profile accessible from Menu

## How to Use

### From Admin Portal

1. **Create Screens** at `http://localhost:3001/app/28/screens`
   - Click "Add Screen" or assign existing screens
   - Add elements to screen
   - Set category, description, and display order
   - **Publish** the screen

2. **Screen Elements** at `http://localhost:3001/app/28/screens/{id}/elements`
   - Add form fields, headings, text, etc.
   - Set field names, labels, placeholders
   - Mark required fields
   - Configure display order

3. **Publish Screen**
   - Only published screens appear in mobile app
   - Use toggle button in screens list

### From Mobile App

1. **Login** to the app
2. **Navigate to Menu tab** (3rd tab)
3. **See all published screens** listed with:
   - Screen name
   - Description
   - Category badge
   - Color-coded icons
4. **Tap a screen** to open it
5. **Fill in form fields** if screen has inputs
6. **Tap Save** to submit data

## Database Tables

### Tables Used

**app_screens**
- Screen definitions (name, description, category)

**app_screen_assignments**
- Links screens to apps
- Controls published status
- Sets display order

**screen_element_instances**
- Elements on each screen
- Display order, labels, validation

**screen_elements**
- Master element types (text_input, email, etc.)

**app_screen_content**
- Saved form data
- User submissions

## Backend API Endpoints

All endpoints are authenticated and require JWT token.

### Get App Screens
```
GET /api/v1/app-screens/app/28
Response: {
  success: true,
  data: [
    {
      id: 1,
      name: "Contact Us",
      description: "Send us a message",
      category: "forms",
      is_published: true,
      element_count: 5,
      display_order: 1
    }
  ]
}
```

### Get Screen Content
```
GET /api/v1/app-screens/app/28/screen/1
Response: {
  success: true,
  data: {
    id: 1,
    name: "Contact Us",
    elements: [
      {
        id: 10,
        element_type: "text_input",
        label: "Full Name",
        field_name: "full_name",
        is_required: true,
        display_order: 1
      }
    ]
  }
}
```

### Save Screen Content
```
POST /api/v1/app-screens/app/28/screen/1/content
Body: {
  content: {
    full_name: "John Doe",
    email: "john@example.com",
    message: "Hello!"
  }
}
Response: {
  success: true,
  message: "Content saved"
}
```

## Screen Categories & Colors

The MenuScreen color-codes screens by category:

- **Settings** - Orange (#FF9500)
- **Social** - Purple (#5856D6)
- **Content** - Blue (#007AFF)
- **Forms** - Green (#34C759)
- **Default** - Gray (#8E8E93)

## Example Use Cases

### 1. Contact Form
Create a "Contact Us" screen with:
- Heading element: "Get in Touch"
- Text element: "We'd love to hear from you!"
- Text input: "Full Name" (required)
- Email input: "Email Address" (required)
- Textarea: "Message" (required)

### 2. Settings Screen
Create a "App Settings" screen with:
- Heading: "Preferences"
- Switch: "Push Notifications"
- Switch: "Email Notifications"
- Switch: "Dark Mode"

### 3. About Page
Create an "About Us" screen with:
- Heading: "About AirPnP"
- Paragraph: Company description
- Divider
- Heading: "Contact Information"
- Text: Phone, email, address

### 4. Feedback Form
Create a "Send Feedback" screen with:
- Text input: "Subject"
- Textarea: "Your Feedback"
- Number: "Rating (1-5)"

## Testing

### Test Flow

1. **Admin Portal:**
   ```
   http://localhost:3001/app/28/screens
   - Create new screen "Test Form"
   - Add elements
   - Publish screen
   ```

2. **Mobile App:**
   ```
   - Login
   - Go to Menu tab
   - Pull to refresh
   - See "Test Form" screen
   - Tap to open
   - Fill and save
   ```

3. **Verify Data:**
   ```
   Check app_screen_content table in database
   SELECT * FROM app_screen_content 
   WHERE app_id = 28 AND screen_id = [your_screen_id];
   ```

## Future Enhancements

### Planned Features

1. **More Element Types:**
   - Date picker
   - Image upload
   - Dropdown/select
   - Radio buttons
   - File attachment

2. **Conditional Logic:**
   - Show/hide fields based on other values
   - Dynamic validation rules

3. **Multi-step Forms:**
   - Wizard-style screens
   - Progress indicators

4. **Offline Support:**
   - Cache screens locally
   - Queue submissions when offline

5. **Rich Content:**
   - Markdown support in text elements
   - Embedded media (images, videos)

## Troubleshooting

### Screens Not Appearing

1. **Check screen is published:**
   ```sql
   SELECT * FROM app_screen_assignments 
   WHERE app_id = 28 AND is_published = 1;
   ```

2. **Pull to refresh** in Menu tab

3. **Check API logs:**
   ```bash
   docker logs multi_app_api
   ```

### Can't Save Data

1. **Check authentication token** is valid
2. **Verify field_name** matches in form
3. **Check backend logs** for errors
4. **Ensure elements exist** for screen

### Elements Not Rendering

1. **Check element_type** is supported
2. **Verify display_order** is set
3. **Check elements are linked** to screen in `screen_element_instances`

## File Structure

```
mobile_apps/property_listings/src/
├── api/
│   ├── screensService.ts          # NEW - Screen API service
│   ├── authService.ts
│   ├── listingsService.ts
│   ├── client.ts
│   └── config.ts
├── screens/
│   ├── MenuScreen.tsx             # NEW - Dynamic menu
│   ├── DynamicScreen.tsx          # NEW - Universal screen renderer
│   ├── HomeScreen.tsx
│   ├── MyListingsScreen.tsx
│   ├── ProfileScreen.tsx
│   └── auth/
│       ├── LoginScreen.tsx
│       └── RegisterScreen.tsx
├── navigation/
│   └── AppNavigator.tsx           # UPDATED - Added Menu tab
├── context/
│   └── AuthContext.tsx
└── types/
    └── index.ts
```

## Summary

✅ **Menu tab** replaces Profile in bottom navigation
✅ **Dynamic screen loading** from database
✅ **Form rendering** with validation
✅ **Data persistence** to backend
✅ **Pull-to-refresh** functionality
✅ **Category-based styling**
✅ **Profile still accessible** from Menu

The app is now a true dynamic platform where screens can be created and managed from the admin portal without requiring mobile app updates!
