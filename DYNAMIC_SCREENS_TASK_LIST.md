# Dynamic Screens Implementation - Task List
**Project:** Property Rental App - Dynamic Screens Conversion  
**Date Created:** November 20, 2025  
**Status:** Phase 1 Complete (8%), Phase 2 Ready

---

## 📊 OVERALL PROGRESS

- [x] Phase 1: Create element types (1h) ✅ COMPLETE
- [ ] Phase 2: Build element components (5h) ⏳ NEXT
- [ ] Phase 3: Update template (3h)
- [ ] Phase 4: Remove hardcoded screens (1h)
- [ ] Phase 5: Testing (2h)

**Total:** 12 hours | **Done:** 8%

---

## ✅ COMPLETED: Phase 1

### Element Types Created in Database

**File:** `multi_site_manager/src/migrations/005_create_dynamic_element_types.sql`

**Elements Created:**
| ID | Element Type | Category |
|----|--------------|----------|
| 108 | booking_form | forms |
| 109 | booking_list | lists |
| 110 | booking_detail | detail |
| 111 | conversation_list | lists |
| 112 | chat_interface | messaging |
| 113 | property_search | search |

**Verify:**
```bash
docker exec -i multi_app_mysql mysql -u root -prootpassword multi_site_manager -e "SELECT id, element_type FROM screen_elements WHERE id >= 108;"
```

---

## 📋 PHASE 2: BUILD ELEMENT COMPONENTS (5 hours)

### Directory Setup
```bash
cd mobile_apps/property_listings/src/components
mkdir -p elements
```

### Task 2.1: BookingFormElement.tsx (1h)
**Source:** Adapt from `src/screens/BookingScreen.tsx`

**Key Changes:**
- Accept `element`, `navigation`, `route` props
- Extract config from `element.config`
- Use config for: show_price_breakdown, enable_special_requests, success_navigation

**Props:**
```typescript
interface BookingFormElementProps {
  element: ScreenElement;
  navigation: any;
  route: any;
}
```

---

### Task 2.2: BookingListElement.tsx (1h)
**Source:** Adapt from `src/screens/MyBookingsScreen.tsx`

**Config:** filters, default_filter, show_status_badges, enable_cancel

---

### Task 2.3: BookingDetailElement.tsx (1h)
**Source:** Adapt from `src/screens/BookingDetailScreen.tsx`

**Config:** sections, show_timeline, enable_cancel, enable_contact_host

---

### Task 2.4: ConversationListElement.tsx (45min)
**Source:** Adapt from `src/screens/ConversationsScreen.tsx`

**Config:** auto_refresh_interval, show_unread_badge, show_avatars

---

### Task 2.5: ChatInterfaceElement.tsx (45min)
**Source:** Adapt from `src/screens/ChatScreen.tsx`

**Config:** auto_refresh_interval, show_timestamps, max_message_length

---

### Task 2.6: PropertySearchElement.tsx (1.5h)
**New Component**

**Config:** filters, sort_options, card_layout, enable_favorites

---

### Task 2.7: Create index.ts
```typescript
export { default as BookingFormElement } from './BookingFormElement';
export { default as BookingListElement } from './BookingListElement';
export { default as BookingDetailElement } from './BookingDetailElement';
export { default as ConversationListElement } from './ConversationListElement';
export { default as ChatInterfaceElement } from './ChatInterfaceElement';
export { default as PropertySearchElement } from './PropertySearchElement';
```

---

### Task 2.8: Update DynamicScreen.tsx (30min)

**Location:** `src/screens/DynamicScreen.tsx`

**Add imports:**
```typescript
import {
  BookingFormElement,
  BookingListElement,
  BookingDetailElement,
  ConversationListElement,
  ChatInterfaceElement,
  PropertySearchElement
} from '../components/elements';
```

**Add cases to renderElement:**
```typescript
case 'booking_form':
  return <BookingFormElement element={element} navigation={navigation} route={route} />;
case 'booking_list':
  return <BookingListElement element={element} navigation={navigation} />;
case 'booking_detail':
  return <BookingDetailElement element={element} navigation={navigation} route={route} />;
case 'conversation_list':
  return <ConversationListElement element={element} navigation={navigation} />;
case 'chat_interface':
  return <ChatInterfaceElement element={element} navigation={navigation} route={route} />;
case 'property_search':
  return <PropertySearchElement element={element} navigation={navigation} />;
```

---

## 📋 PHASE 3: UPDATE TEMPLATE (3 hours)

**URL:** http://localhost:3001/master/app-templates/9

### Task 3.1: Create "Book Property" Screen (15min)
- Add Booking Form element (ID: 108)
- Assign to: Renter, Premium Renter
- Show in Tab Bar: No

### Task 3.2: Create "My Bookings" Screen (15min)
- Add Booking List element (ID: 109)
- Assign to: Renter, Premium Renter, Host
- Show in Tab Bar: Yes (Order: 2)

### Task 3.3: Create "Booking Details" Screen (15min)
- Add Booking Detail element (ID: 110)
- Assign to: Renter, Premium Renter, Host
- Show in Tab Bar: No

### Task 3.4: Create "Messages" Screen (15min)
- Add Conversation List element (ID: 111)
- Assign to: All roles
- Show in Tab Bar: Yes (Order: 3)

### Task 3.5: Create "Chat" Screen (15min)
- Add Chat Interface element (ID: 112)
- Assign to: All roles
- Show in Tab Bar: No

### Task 3.6: Create "Search Properties" Screen (15min)
- Add Property Search element (ID: 113)
- Assign to: All roles
- Show in Tab Bar: Yes (Order: 1)

### Task 3.7: Update Property Details Screen (20min)
- Add "Book Now" button → navigates to "Book Property"
- Add "Contact Host" button → starts conversation

### Task 3.8: Publish Template (10min)

---

## 📋 PHASE 4: CLEANUP (1 hour)

### Task 4.1: Delete Hardcoded Screens
```bash
cd mobile_apps/property_listings/src/screens
rm BookingScreen.tsx MyBookingsScreen.tsx BookingDetailScreen.tsx
rm ConversationsScreen.tsx ChatScreen.tsx
```

### Task 4.2: Update AppNavigator.tsx
- Remove imports for deleted screens
- Remove screen registrations
- Keep only DynamicScreen

---

## 📋 PHASE 5: TESTING (2 hours)

### Task 5.1: Create Test App (10min)
- Create new app from template
- Verify all screens present

### Task 5.2: Test Booking Flow (30min)
- Search → View Property → Book → View Bookings → Cancel

### Task 5.3: Test Messaging (20min)
- Contact Host → Send Messages → View Conversations

### Task 5.4: Test Roles (15min)
- Guest, Renter, Host see correct screens

### Task 5.5: Test Config Changes (15min)
- Modify element config in template
- Verify changes apply to new apps

### Task 5.6: Fix Bugs (30min)

---

## ✅ COMPLETION CHECKLIST

- [ ] All 6 element components created
- [ ] DynamicScreen updated
- [ ] Template has 6 new screens
- [ ] Hardcoded screens deleted
- [ ] Test app works
- [ ] All flows tested
- [ ] No critical bugs

---

## 📝 QUICK START (Next Session)

```bash
# 1. Verify elements exist
docker exec -i multi_app_mysql mysql -u root -prootpassword multi_site_manager -e "SELECT id, element_type FROM screen_elements WHERE id >= 108;"

# 2. Navigate to project
cd /Users/lallen30/Documents/bluestoneapps/Bluestone_Apps_Master_System/mobile_apps/property_listings

# 3. Create elements directory
mkdir -p src/components/elements

# 4. Start with BookingFormElement.tsx
# Copy from src/screens/BookingScreen.tsx and adapt
```

---

## 📚 REFERENCE DOCS

- `ELEMENT_COMPONENTS_IMPLEMENTATION.md` - Detailed implementation guide
- `DYNAMIC_ELEMENTS_CREATED.md` - Element types documentation
- `DYNAMIC_SCREENS_IMPLEMENTATION_PLAN.md` - Overall plan

---

**Status:** Ready for Phase 2! Start by creating element components.
