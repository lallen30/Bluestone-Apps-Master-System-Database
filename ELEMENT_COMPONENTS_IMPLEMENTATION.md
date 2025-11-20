# Element Components Implementation Guide
**Date:** November 20, 2025  
**Phase:** 2 of 6 - Building Element Components

---

## 🎯 **OBJECTIVE**

Convert the hardcoded screens into reusable element components that:
1. Accept configuration from the database
2. Render dynamically based on config
3. Integrate with DynamicScreen.tsx
4. Use existing API services

---

## 📁 **FILE STRUCTURE**

Create new directory and files:

```
/mobile_apps/property_listings/src/components/elements/
  ├── index.ts                        # Export all elements
  ├── BookingFormElement.tsx          # From BookingScreen.tsx
  ├── BookingListElement.tsx          # From MyBookingsScreen.tsx
  ├── BookingDetailElement.tsx        # From BookingDetailScreen.tsx
  ├── ConversationListElement.tsx     # From ConversationsScreen.tsx
  ├── ChatInterfaceElement.tsx        # From ChatScreen.tsx
  └── PropertySearchElement.tsx       # New component
```

---

## 🔄 **CONVERSION STRATEGY**

### Step 1: Copy Existing Code
Take the code from hardcoded screens and adapt it to be element components.

### Step 2: Accept Element Props
Each component receives:
```typescript
interface ElementProps {
  element: ScreenElement;  // Contains config
  navigation: any;
  route?: any;
}
```

### Step 3: Extract Config
Parse the element's config:
```typescript
const config = element.config || element.default_config || {};
const {
  listing_id_source,
  show_price_breakdown,
  enable_special_requests,
  // ... other config options
} = config;
```

### Step 4: Use Existing APIs
All components use the API services we already created:
- `bookingsService.ts`
- `messagesService.ts`
- `listingsService.ts`

---

## 📋 **COMPONENT SPECIFICATIONS**

### 1. BookingFormElement.tsx

**Source:** BookingScreen.tsx (500 lines)

**Props:**
```typescript
interface BookingFormElementProps {
  element: ScreenElement;
  navigation: any;
  route: any;
}
```

**Config Options:**
- `listing_id_source`: 'route_param' | 'element_field'
- `show_price_breakdown`: boolean
- `enable_special_requests`: boolean
- `success_navigation`: string (screen name)
- `min_nights`: number
- `max_nights`: number
- `require_phone`: boolean

**Key Changes from Hardcoded:**
- Get `listingId` from `route.params` or element config
- Use config to show/hide sections
- Navigate to config-specified screen on success

**Example:**
```typescript
const BookingFormElement: React.FC<BookingFormElementProps> = ({ element, navigation, route }) => {
  const config = element.config || {};
  const listingId = route.params?.listingId || config.listing_id;
  
  // Rest of booking form logic...
  // Use config.show_price_breakdown to show/hide price section
  // Use config.enable_special_requests to show/hide requests field
  
  const handleSuccess = () => {
    navigation.navigate(config.success_navigation || 'MyBookings');
  };
};
```

---

### 2. BookingListElement.tsx

**Source:** MyBookingsScreen.tsx (400 lines)

**Props:**
```typescript
interface BookingListElementProps {
  element: ScreenElement;
  navigation: any;
}
```

**Config Options:**
- `filters`: string[] (e.g., ['all', 'pending', 'confirmed'])
- `default_filter`: string
- `show_status_badges`: boolean
- `enable_cancel`: boolean
- `card_layout`: 'compact' | 'detailed'
- `pull_to_refresh`: boolean
- `items_per_page`: number

**Key Changes:**
- Use config.filters to show filter tabs
- Use config.card_layout to switch between layouts
- Use config.enable_cancel to show/hide cancel button

---

### 3. BookingDetailElement.tsx

**Source:** BookingDetailScreen.tsx (450 lines)

**Props:**
```typescript
interface BookingDetailElementProps {
  element: ScreenElement;
  navigation: any;
  route: any;
}
```

**Config Options:**
- `booking_id_source`: 'route_param' | 'element_field'
- `sections`: string[] (e.g., ['property', 'trip', 'guest', 'host', 'price', 'timeline'])
- `show_timeline`: boolean
- `enable_cancel`: boolean
- `enable_contact_host`: boolean

**Key Changes:**
- Get `bookingId` from route or config
- Only render sections specified in config.sections
- Show/hide timeline based on config
- Show/hide action buttons based on config

---

### 4. ConversationListElement.tsx

**Source:** ConversationsScreen.tsx (350 lines)

**Props:**
```typescript
interface ConversationListElementProps {
  element: ScreenElement;
  navigation: any;
}
```

**Config Options:**
- `auto_refresh_interval`: number (milliseconds)
- `show_unread_badge`: boolean
- `show_avatars`: boolean
- `enable_archive`: boolean
- `pull_to_refresh`: boolean
- `items_per_page`: number

**Key Changes:**
- Use config.auto_refresh_interval for refresh timing
- Show/hide unread badges based on config
- Show/hide avatars based on config
- Enable/disable archive based on config

---

### 5. ChatInterfaceElement.tsx

**Source:** ChatScreen.tsx (400 lines)

**Props:**
```typescript
interface ChatInterfaceElementProps {
  element: ScreenElement;
  navigation: any;
  route: any;
}
```

**Config Options:**
- `conversation_id_source`: 'route_param' | 'element_field'
- `auto_refresh_interval`: number
- `show_timestamps`: boolean
- `enable_attachments`: boolean
- `max_message_length`: number
- `message_bubble_style`: 'ios' | 'android' | 'custom'
- `show_date_separators`: boolean

**Key Changes:**
- Get `conversationId` from route or config
- Use config for refresh interval
- Show/hide timestamps based on config
- Enable/disable attachments based on config
- Apply bubble style from config

---

### 6. PropertySearchElement.tsx

**Source:** New component (use existing search logic)

**Props:**
```typescript
interface PropertySearchElementProps {
  element: ScreenElement;
  navigation: any;
}
```

**Config Options:**
- `filters`: string[] (e.g., ['location', 'dates', 'guests', 'price'])
- `sort_options`: string[] (e.g., ['price_asc', 'price_desc', 'newest'])
- `default_sort`: string
- `show_map`: boolean
- `card_layout`: 'grid' | 'list'
- `items_per_page`: number
- `enable_favorites`: boolean

**Implementation:**
```typescript
const PropertySearchElement: React.FC<PropertySearchElementProps> = ({ element, navigation }) => {
  const config = element.config || {};
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [listings, setListings] = useState([]);
  
  // Use listingsService.getListings with filters
  // Render based on config.card_layout
  // Show filters based on config.filters
};
```

---

## 🔌 **INTEGRATION WITH DYNAMICSCREEN**

### Update DynamicScreen.tsx

Add to the `renderElement` function:

```typescript
const renderElement = (element: ScreenElement) => {
  const { element_type } = element;

  switch (element_type) {
    // ... existing cases ...
    
    case 'booking_form':
      return (
        <BookingFormElement
          key={element.id}
          element={element}
          navigation={navigation}
          route={route}
        />
      );
    
    case 'booking_list':
      return (
        <BookingListElement
          key={element.id}
          element={element}
          navigation={navigation}
        />
      );
    
    case 'booking_detail':
      return (
        <BookingDetailElement
          key={element.id}
          element={element}
          navigation={navigation}
          route={route}
        />
      );
    
    case 'conversation_list':
      return (
        <ConversationListElement
          key={element.id}
          element={element}
          navigation={navigation}
        />
      );
    
    case 'chat_interface':
      return (
        <ChatInterfaceElement
          key={element.id}
          element={element}
          navigation={navigation}
          route={route}
        />
      );
    
    case 'property_search':
      return (
        <PropertySearchElement
          key={element.id}
          element={element}
          navigation={navigation}
        />
      );
    
    default:
      return null;
  }
};
```

---

## 📦 **EXPORTS**

Create `/components/elements/index.ts`:

```typescript
export { default as BookingFormElement } from './BookingFormElement';
export { default as BookingListElement } from './BookingListElement';
export { default as BookingDetailElement } from './BookingDetailElement';
export { default as ConversationListElement } from './ConversationListElement';
export { default as ChatInterfaceElement } from './ChatInterfaceElement';
export { default as PropertySearchElement } from './PropertySearchElement';
```

---

## ✅ **TESTING CHECKLIST**

After creating components:

- [ ] BookingFormElement renders with config
- [ ] BookingListElement shows correct filters
- [ ] BookingDetailElement shows correct sections
- [ ] ConversationListElement auto-refreshes
- [ ] ChatInterfaceElement sends messages
- [ ] PropertySearchElement filters work
- [ ] All components integrate with DynamicScreen
- [ ] Navigation works correctly
- [ ] Config changes reflect in UI

---

## 🎯 **IMPLEMENTATION ORDER**

### Session 1 (2 hours):
1. Create BookingFormElement
2. Create BookingListElement
3. Test both components

### Session 2 (2 hours):
4. Create BookingDetailElement
5. Create ConversationListElement
6. Create ChatInterfaceElement
7. Create PropertySearchElement

### Session 3 (1 hour):
8. Update DynamicScreen
9. Create index.ts exports
10. Test all components

---

## 📝 **NOTES**

### Key Principles:
1. **Reuse existing code** - Don't rewrite, adapt
2. **Config-driven** - Use element config for behavior
3. **API services** - Use existing bookingsService, messagesService
4. **Type safety** - Maintain TypeScript types
5. **Error handling** - Keep existing error handling

### Benefits:
- ✅ Single source of truth (database)
- ✅ Easy to customize per app
- ✅ Template reusability
- ✅ No code duplication
- ✅ Maintainable

---

## 🚀 **READY TO START**

The element types are in the database. Now we need to:
1. Create the element components
2. Update DynamicScreen
3. Test the integration

**Estimated Time:** 4 hours total

**Next:** Start creating BookingFormElement.tsx

---

**Status:** Ready to implement Phase 2! 🎊
