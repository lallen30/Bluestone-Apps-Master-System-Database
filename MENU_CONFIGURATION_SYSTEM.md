# Menu Configuration System

## Overview

The admin portal now includes a powerful menu configuration system that allows you to control where screens appear in your mobile app:

1. **Bottom Tab Bar** - Main navigation with 2-5 screens
2. **Sidebar Menu** - Unlimited screens in the Menu tab

## Admin Portal Features

### Menu Configuration Button

On the **App Screens** page (`http://localhost:3001/app/28/screens`), each screen now has a **blue grid icon** button (📱) in the Actions column.

### Configuration Modal

Clicking the menu configuration button opens a modal with two sections:

#### 1. Bottom Tab Bar Configuration
- **Enable/Disable**: Toggle to show screen in bottom navigation
- **Tab Label**: Short name (max 15 characters) displayed under the icon
- **Tab Icon**: Choose from predefined Material Icons
- **Display Order**: Control tab position (lower numbers = left side)
- **Limit**: Recommended 2-5 tabs for optimal UX

#### 2. Sidebar Menu Configuration  
- **Enable/Disable**: Toggle to show screen in Menu tab list
- **Display Order**: Control position in menu list
- **No Limit**: Add as many screens as needed

## Database Schema

### New Columns in `app_screen_assignments`

```sql
show_in_tabbar BOOLEAN DEFAULT FALSE
tabbar_order INT DEFAULT NULL
tabbar_icon VARCHAR(50) DEFAULT NULL
tabbar_label VARCHAR(50) DEFAULT NULL
show_in_sidebar BOOLEAN DEFAULT FALSE
sidebar_order INT DEFAULT NULL
```

## API Endpoints

### Update Menu Configuration
```
PUT /api/v1/app-screens/app/{appId}/screen/{screenId}/menu-config

Body:
{
  "show_in_tabbar": true,
  "tabbar_order": 1,
  "tabbar_icon": "home",
  "tabbar_label": "Home",
  "show_in_sidebar": true,
  "sidebar_order": 1
}

Response:
{
  "success": true,
  "message": "Menu configuration updated successfully"
}
```

### Get Screens with Menu Config
```
GET /api/v1/app-screens/app/{appId}

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Home",
      "show_in_tabbar": true,
      "tabbar_order": 1,
      "tabbar_icon": "home",
      "tabbar_label": "Home",
      "show_in_sidebar": false,
      ...
    }
  ]
}
```

## Mobile App Integration

### Current Implementation

The mobile app currently has a **static 3-tab navigation**:
1. **Explore** - Browse property listings
2. **My Listings** - User's properties
3. **Menu** - Dynamic screens + Profile

The **Menu tab** now uses `screensService.getSidebarScreens()` to show only screens configured for the sidebar.

### Available Icon Options

The following Material Icons are supported for tab bar icons:

- `home` - Home
- `search` - Search/Explore
- `favorite` - Favorites
- `person` - Profile
- `settings` - Settings
- `notifications` - Notifications
- `message` - Messages
- `calendar` - Calendar
- `map` - Map
- `camera` - Camera
- `image` - Gallery
- `bookmark` - Bookmarks
- `share` - Share
- `list` - List
- `grid-view` - Grid
- `menu` - Menu

### Service Methods

```typescript
// Get screens for bottom tab bar
const tabbarScreens = await screensService.getTabbarScreens();

// Get screens for sidebar menu
const sidebarScreens = await screensService.getSidebarScreens();

// Get all published screens
const allScreens = await screensService.getAppScreens();
```

### Implementing Dynamic Tab Navigation

To make the tab bar fully dynamic, update `AppNavigator.tsx`:

```typescript
import { useEffect, useState } from 'react';
import { screensService, AppScreen } from '../api/screensService';

const TabNavigator = () => {
  const [tabScreens, setTabScreens] = useState<AppScreen[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTabScreens();
  }, []);

  const loadTabScreens = async () => {
    try {
      const screens = await screensService.getTabbarScreens();
      setTabScreens(screens);
    } catch (error) {
      console.error('Error loading tab screens:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <Tab.Navigator>
      {/* Static tabs (always shown) */}
      <Tab.Screen
        name="Explore"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="search" color={color} size={size} />
          ),
        }}
      />
      
      {/* Dynamic tabs from database */}
      {tabScreens.map((screen) => (
        <Tab.Screen
          key={screen.id}
          name={`Screen${screen.id}`}
          component={DynamicScreen}
          initialParams={{ screenId: screen.id, screenName: screen.name }}
          options={{
            tabBarLabel: screen.tabbar_label || screen.name,
            tabBarIcon: ({ color, size }) => (
              <Icon 
                name={screen.tabbar_icon || 'article'} 
                color={color} 
                size={size} 
              />
            ),
          }}
        />
      ))}
      
      {/* Menu tab (always shown) */}
      <Tab.Screen
        name="Menu"
        component={MenuScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="menu" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
```

## Use Cases & Examples

### Example 1: Property Rental App

**Bottom Tab Bar (3 tabs):**
1. **Explore** (search icon) - Browse listings
2. **My Listings** (home icon) - User's properties
3. **Menu** (menu icon) - All other screens

**Sidebar Menu:**
- Contact Us
- About
- Settings
- Help & Support
- Terms of Service

### Example 2: Social App

**Bottom Tab Bar (5 tabs):**
1. **Feed** (home icon) - Main feed
2. **Search** (search icon) - Discover
3. **Camera** (camera icon) - Create post
4. **Notifications** (notifications icon) - Activity
5. **Profile** (person icon) - User profile

**Sidebar Menu:**
- Settings
- Privacy
- Saved Posts
- Help

### Example 3: Minimal App

**Bottom Tab Bar (2 tabs):**
1. **Home** (home icon) - Main screen
2. **Menu** (menu icon) - Everything else

**Sidebar Menu:**
- All other app screens

## Best Practices

### Tab Bar Design

✅ **DO:**
- Use 2-5 tabs (optimal UX)
- Choose clear, recognizable icons
- Keep labels short (1-2 words)
- Put most important screens in tabs
- Maintain consistent order

❌ **DON'T:**
- Use more than 5 tabs (crowded)
- Use similar icons for different functions
- Use long labels that truncate
- Change tab order frequently
- Put rarely-used screens in tabs

### Sidebar Menu Design

✅ **DO:**
- Group related screens together
- Use descriptive screen names
- Set logical display order
- Include all important features
- Add category labels if many screens

❌ **DON'T:**
- Duplicate screens from tab bar unnecessarily
- Use generic names like "Screen 1"
- Leave order random
- Hide critical features

## Migration Strategy

### Existing Apps

When you run the migration, all existing published screens are automatically set to:
- `show_in_sidebar = TRUE` (appear in Menu)
- `sidebar_order = display_order` (maintain current order)
- `show_in_tabbar = FALSE` (not in bottom tabs by default)

This ensures no screens disappear after migration.

### Gradual Rollout

1. **Week 1:** Configure sidebar menus for all apps
2. **Week 2:** Test menu navigation
3. **Week 3:** Add 2-3 screens to tab bars
4. **Week 4:** Collect user feedback
5. **Week 5:** Optimize based on analytics

## Testing Checklist

### Admin Portal
- [ ] Open screen configuration modal
- [ ] Enable/disable tab bar placement
- [ ] Set tab label and icon
- [ ] Set display orders
- [ ] Enable/disable sidebar placement
- [ ] Save configuration
- [ ] Verify changes persist

### Mobile App
- [ ] Menu tab shows only sidebar screens
- [ ] Screens appear in correct order
- [ ] Tap screen to open DynamicScreen
- [ ] Pull to refresh updates list
- [ ] Tab bar shows configured screens
- [ ] Tab icons and labels correct
- [ ] Tab order matches configuration

## Troubleshooting

### Screens Not Appearing

**Problem:** Screen not showing in mobile app menus

**Solutions:**
1. Check screen is **published**
2. Verify `show_in_sidebar` or `show_in_tabbar` is enabled
3. Pull to refresh in mobile app
4. Check API response includes menu fields

### Wrong Tab Order

**Problem:** Tabs appear in wrong sequence

**Solutions:**
1. Check `tabbar_order` values
2. Lower numbers appear first
3. NULL orders default to 99
4. Restart app to clear cache

### Too Many Tabs

**Problem:** Tab bar overcrowded (>5 tabs)

**Solutions:**
1. Move less important screens to sidebar
2. Keep only 2-5 most used screens in tabs
3. Update menu configuration
4. Consider user analytics

### Icon Not Showing

**Problem:** Tab icon missing or wrong

**Solutions:**
1. Verify `tabbar_icon` value matches available icons
2. Check icon name spelling
3. Use default if icon not found
4. Update icon in configuration modal

## Future Enhancements

### Planned Features

1. **Custom Icons**
   - Upload custom SVG icons
   - Icon color customization
   - Different icons for active/inactive states

2. **Tab Bar Styles**
   - Choose from multiple tab bar designs
   - Custom colors and themes
   - Badge notifications

3. **Smart Ordering**
   - AI-suggested tab order based on usage
   - A/B testing different configurations
   - Analytics-driven optimization

4. **User Customization**
   - Let users rearrange their tabs
   - Hide/show sidebar screens
   - Save personal preferences

5. **Conditional Display**
   - Show/hide tabs based on user role
   - Feature flags for gradual rollout
   - Geo-based screen visibility

## Database Queries

### Get Tabbar Screens
```sql
SELECT s.*, asa.tabbar_icon, asa.tabbar_label, asa.tabbar_order
FROM app_screen_assignments asa
JOIN app_screens s ON asa.screen_id = s.id
WHERE asa.app_id = 28 
  AND asa.is_published = 1
  AND asa.show_in_tabbar = 1
ORDER BY asa.tabbar_order;
```

### Get Sidebar Screens
```sql
SELECT s.*, asa.sidebar_order
FROM app_screen_assignments asa
JOIN app_screens s ON asa.screen_id = s.id
WHERE asa.app_id = 28
  AND asa.is_published = 1
  AND asa.show_in_sidebar = 1
ORDER BY asa.sidebar_order;
```

### Update Menu Config
```sql
UPDATE app_screen_assignments
SET show_in_tabbar = 1,
    tabbar_order = 1,
    tabbar_icon = 'home',
    tabbar_label = 'Home',
    show_in_sidebar = 0
WHERE app_id = 28 AND screen_id = 1;
```

## Summary

✅ **Implemented:**
- Menu configuration modal in admin portal
- Database schema for menu placements
- API endpoints for configuration
- Mobile app sidebar screen filtering
- Icon selection (16 options)
- Display order controls

🎯 **Ready to Use:**
- Configure any screen for tab bar or sidebar
- Limit 2-5 screens for optimal tab bar UX
- Unlimited sidebar screens
- Pull to refresh updates menus
- Automatic ordering and sorting

📱 **Next Steps:**
1. Run migration (✅ Done)
2. Restart API (✅ Done)
3. Configure screens in admin portal
4. Test in mobile app
5. Optionally implement fully dynamic tab navigation

The system is now ready for production use! 🚀
