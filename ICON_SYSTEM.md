# Icon System Implementation

## Overview
The icon system allows you to select icons from a dropdown in the admin portal that will display in the mobile app's tab bar and sidebars.

## Admin Portal

### Icon Picker Component
- **Location**: `admin_portal/components/IconPicker.tsx`
- **Features**:
  - Dropdown with icon previews (emoji symbols)
  - Search functionality
  - 70+ common icons available
  - Icon names match Ionicons library

### Menu Configuration
- **Page**: `http://localhost:3001/app/[appId]/menus/[menuId]`
- **How to Use**:
  1. Navigate to any menu (Tab Bar, Left Sidebar, or Right Sidebar)
  2. Click on the icon dropdown for any menu item
  3. Search or browse available icons
  4. Select an icon - it will save automatically when you click "Save Changes"

### Available Icons
Icons are defined in `admin_portal/components/IconPicker.tsx` in the `AVAILABLE_ICONS` array:
- **Navigation**: home, search, map, navigate
- **User**: person, heart, settings
- **Communication**: mail, chatbubble, notifications
- **Media**: camera, image, videocam, play, pause
- **Commerce**: cart, card, cash, gift, pricetag
- **Actions**: add, create, trash, close, checkmark
- **Security**: key, lock-closed, shield
- **Files**: document, folder, cloud
- **And many more...**

## Mobile App

### Icon Library
- **Package**: `react-native-vector-icons`
- **Font**: Ionicons
- Icon names from admin portal match Ionicons exactly

### Components Using Icons
1. **DynamicTabBar** (`mobile_apps/property_listings/src/components/DynamicTabBar.tsx`)
   - Bottom tab navigation
   - Shows icons with labels
   - Active state highlighting

2. **DynamicSidebar** (`mobile_apps/property_listings/src/components/DynamicSidebar.tsx`)
   - Left and right sidebar menus
   - Shows icons with menu item labels
   - Active state highlighting

### Icon Display
- **Size**: 24px
- **Active Color**: `#007AFF` (iOS blue)
- **Inactive Color**: `#8E8E93` (gray)
- **Default Icon**: `help-circle-outline` (if no icon selected)

## Adding New Icons

### Step 1: Add to Admin Portal
Edit `admin_portal/components/IconPicker.tsx`:

```typescript
export const AVAILABLE_ICONS = [
  // ... existing icons
  { name: 'new-icon-name', label: 'Display Label', symbol: '🆕' },
];
```

### Step 2: Verify Icon Name
1. Go to [Ionicons Directory](https://ionic.io/ionicons)
2. Search for your icon
3. Copy the exact icon name (e.g., `home`, `search`, `person-outline`)
4. Use that exact name in the admin portal

### Step 3: Test
1. Select the icon in admin portal menu configuration
2. Save changes
3. Check mobile app - icon should display automatically

## Technical Details

### Type Definitions
`mobile_apps/property_listings/src/types/react-native-vector-icons.d.ts` contains TypeScript definitions for Ionicons.

### Icon Props
```typescript
{
  name: string;    // Icon name from Ionicons
  size?: number;   // Default: 24
  color?: string;  // Hex color
}
```

### Database Fields
- **Table**: `menu_items`
- **Field**: `icon` (VARCHAR)
- Stores icon name as string (e.g., "home", "search")

## Best Practices

1. **Consistency**: Use the same icon for the same action across all menus
2. **Clarity**: Choose icons that clearly represent their function
3. **Testing**: Always test icons in the mobile app after selection
4. **Fallback**: System automatically shows `help-circle-outline` if icon name is invalid

## Troubleshooting

### Icon Not Showing in Mobile App
1. **Check icon name**: Must match Ionicons exactly (case-sensitive)
2. **Rebuild app**: Sometimes requires reloading the app
3. **Check default**: If showing `help-circle-outline`, the icon name is invalid

### Icon Not in Dropdown
1. Icon not added to `AVAILABLE_ICONS` array
2. Add it following the "Adding New Icons" steps above

### Icon Looks Different Than Expected
1. Check [Ionicons Directory](https://ionic.io/ionicons) for actual icon appearance
2. Emoji symbols in admin portal are just visual aids, actual icons may differ
