# Property Rental App - Deep Dive Analysis
**App ID:** 28  
**Template:** Property Rental App (ID: 9)  
**Date:** November 20, 2025

---

## 📊 EXECUTIVE SUMMARY

### Current State: **PARTIALLY FUNCTIONAL** ⚠️

The Property Rental App has a **solid foundation** with database schema and API endpoints for property listings, but **critical features are missing** for a fully functional rental platform.

### What Works ✅
- Property listing CRUD operations (backend)
- User authentication system
- Profile management
- Image upload infrastructure
- Dynamic screen rendering

### What's Missing ❌
- **Booking/Reservation system** (no database tables or API)
- **Messaging system** (no backend implementation)
- **Payment processing** (not implemented)
- **Reviews & Ratings** (no database tables or API)
- **Search functionality** (screens exist but no backend logic)
- **Availability calendar** (table exists but no API)

---

## 🗄️ DATABASE ANALYSIS

### ✅ IMPLEMENTED TABLES

#### 1. `property_listings`
**Status:** Fully implemented  
**Purpose:** Store property information

**Key Fields:**
- Basic info: `title`, `description`, `property_type`
- Location: `address_line1`, `city`, `state`, `country`, `latitude`, `longitude`
- Details: `bedrooms`, `bathrooms`, `beds`, `guests_max`, `square_feet`
- Pricing: `price_per_night`, `cleaning_fee`, `service_fee_percentage`
- Booking rules: `min_nights`, `max_nights`, `check_in_time`, `check_out_time`
- Status: `status` (draft/pending_review/active/inactive/suspended)
- Publishing: `is_published`, `is_instant_book`

**Current Data:** 0 listings in database

#### 2. `property_amenities`
**Status:** Fully implemented  
**Purpose:** Master list of available amenities

**Fields:**
- `name`, `category`, `icon`, `description`, `is_active`
- Categories: basic, features, safety, accessibility, outdoor, entertainment

#### 3. `property_listing_amenities`
**Status:** Fully implemented  
**Purpose:** Link listings to amenities (many-to-many)

#### 4. `property_images`
**Status:** Fully implemented  
**Purpose:** Store property photos

**Fields:**
- `listing_id`, `image_url`, `image_key`, `caption`
- `display_order`, `is_primary`

#### 5. `property_availability`
**Status:** Table exists, **NO API**  
**Purpose:** Track available/blocked dates

**Fields:**
- `listing_id`, `date`, `is_available`
- `price_override`, `notes`

**Issue:** No controller or routes to manage availability

### ❌ MISSING TABLES

#### 1. Bookings/Reservations
**Status:** NOT IMPLEMENTED  
**Required for:** Users to book properties

**Needed Fields:**
```sql
CREATE TABLE property_bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  app_id INT NOT NULL,
  listing_id INT NOT NULL,
  guest_user_id INT NOT NULL,
  host_user_id INT NOT NULL,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  guests_count INT NOT NULL,
  nights INT NOT NULL,
  price_per_night DECIMAL(10,2),
  cleaning_fee DECIMAL(10,2),
  service_fee DECIMAL(10,2),
  total_price DECIMAL(10,2),
  status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
  special_requests TEXT,
  guest_first_name VARCHAR(100),
  guest_last_name VARCHAR(100),
  guest_email VARCHAR(255),
  guest_phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (listing_id) REFERENCES property_listings(id),
  FOREIGN KEY (guest_user_id) REFERENCES app_users(id),
  FOREIGN KEY (host_user_id) REFERENCES app_users(id)
);
```

#### 2. Messages/Conversations
**Status:** NOT IMPLEMENTED  
**Required for:** Guest-Host communication

**Needed Tables:**
```sql
CREATE TABLE conversations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  app_id INT NOT NULL,
  listing_id INT,
  user1_id INT NOT NULL,
  user2_id INT NOT NULL,
  last_message_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user1_id) REFERENCES app_users(id),
  FOREIGN KEY (user2_id) REFERENCES app_users(id)
);

CREATE TABLE messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  conversation_id INT NOT NULL,
  sender_id INT NOT NULL,
  message_text TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id),
  FOREIGN KEY (sender_id) REFERENCES app_users(id)
);
```

#### 3. Reviews & Ratings
**Status:** NOT IMPLEMENTED  
**Required for:** Trust and quality assurance

**Needed Table:**
```sql
CREATE TABLE property_reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  app_id INT NOT NULL,
  listing_id INT NOT NULL,
  booking_id INT,
  reviewer_user_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  cleanliness_rating INT,
  accuracy_rating INT,
  communication_rating INT,
  location_rating INT,
  value_rating INT,
  review_text TEXT,
  host_response TEXT,
  is_verified_stay BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (listing_id) REFERENCES property_listings(id),
  FOREIGN KEY (reviewer_user_id) REFERENCES app_users(id)
);
```

#### 4. Favorites/Wishlists
**Status:** NOT IMPLEMENTED  
**Required for:** Users to save listings

**Needed Table:**
```sql
CREATE TABLE property_favorites (
  id INT PRIMARY KEY AUTO_INCREMENT,
  app_id INT NOT NULL,
  user_id INT NOT NULL,
  listing_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_favorite (user_id, listing_id),
  FOREIGN KEY (user_id) REFERENCES app_users(id),
  FOREIGN KEY (listing_id) REFERENCES property_listings(id)
);
```

---

## 🔌 API ANALYSIS

### ✅ IMPLEMENTED ENDPOINTS

**File:** `/multi_site_manager/src/routes/propertyListings.js`  
**Controller:** `/multi_site_manager/src/controllers/propertyListingsController.js`

#### Public Endpoints (No Auth)
1. **GET** `/api/v1/apps/:appId/listings`
   - Get all listings with filters
   - **Status:** ✅ Working
   - **Features:** Pagination, search, filters

2. **GET** `/api/v1/apps/:appId/listings/:listingId`
   - Get single listing details
   - **Status:** ✅ Working
   - **Includes:** Amenities, images

3. **GET** `/api/v1/amenities`
   - Get all available amenities
   - **Status:** ✅ Working

#### Protected Endpoints (Auth Required)
4. **POST** `/api/v1/apps/:appId/listings`
   - Create new listing
   - **Status:** ✅ Working
   - **Auth:** Mobile user JWT required

5. **PUT** `/api/v1/apps/:appId/listings/:listingId`
   - Update listing
   - **Status:** ✅ Working
   - **Validation:** Ownership check

6. **DELETE** `/api/v1/apps/:appId/listings/:listingId`
   - Delete listing
   - **Status:** ✅ Working
   - **Validation:** Ownership check

7. **PUT** `/api/v1/apps/:appId/listings/:listingId/publish`
   - Publish/unpublish listing
   - **Status:** ✅ Working

### ❌ MISSING ENDPOINTS

#### Bookings/Reservations
- **POST** `/api/v1/apps/:appId/bookings` - Create booking
- **GET** `/api/v1/apps/:appId/bookings` - Get user's bookings
- **GET** `/api/v1/apps/:appId/bookings/:bookingId` - Get booking details
- **PUT** `/api/v1/apps/:appId/bookings/:bookingId/confirm` - Confirm booking
- **PUT** `/api/v1/apps/:appId/bookings/:bookingId/cancel` - Cancel booking
- **GET** `/api/v1/apps/:appId/listings/:listingId/bookings` - Get listing bookings (host)

#### Messaging
- **POST** `/api/v1/apps/:appId/conversations` - Start conversation
- **GET** `/api/v1/apps/:appId/conversations` - Get user's conversations
- **GET** `/api/v1/apps/:appId/conversations/:conversationId/messages` - Get messages
- **POST** `/api/v1/apps/:appId/conversations/:conversationId/messages` - Send message
- **PUT** `/api/v1/apps/:appId/messages/:messageId/read` - Mark as read

#### Reviews
- **POST** `/api/v1/apps/:appId/listings/:listingId/reviews` - Create review
- **GET** `/api/v1/apps/:appId/listings/:listingId/reviews` - Get listing reviews
- **PUT** `/api/v1/apps/:appId/reviews/:reviewId` - Update review
- **DELETE** `/api/v1/apps/:appId/reviews/:reviewId` - Delete review

#### Favorites
- **POST** `/api/v1/apps/:appId/favorites` - Add to favorites
- **GET** `/api/v1/apps/:appId/favorites` - Get user's favorites
- **DELETE** `/api/v1/apps/:appId/favorites/:listingId` - Remove from favorites

#### Availability
- **GET** `/api/v1/apps/:appId/listings/:listingId/availability` - Get availability calendar
- **PUT** `/api/v1/apps/:appId/listings/:listingId/availability` - Update availability
- **POST** `/api/v1/apps/:appId/listings/:listingId/availability/bulk` - Bulk update dates

#### Search
- **GET** `/api/v1/apps/:appId/listings/search` - Advanced search with filters
  - Location (city, coordinates, radius)
  - Dates (check-in, check-out)
  - Guests count
  - Price range
  - Property type
  - Amenities
  - Instant book only

---

## 📱 MOBILE APP ANALYSIS

### ✅ IMPLEMENTED SCREENS

**App ID:** 28  
**Total Screens:** 18 screens configured

#### Active Screens (Published)
1. **Property Listings** (ID: 75) - ✅ Tab Bar
   - Elements: Search filters, results display
   - **Issue:** No backend search logic

2. **Advanced Search** (ID: 80) - ✅ Tab Bar
   - Elements: Location, dates, guests, price, property type
   - **Issue:** No backend search implementation

3. **User Profile** (ID: 58) - ✅ Tab Bar
   - Elements: Profile display fields
   - **Status:** Working (profile data persistence)

4. **Edit Profile** (ID: 59)
   - Elements: Input fields, image upload, date picker
   - **Status:** Working (with native components)

5. **Property Details** (ID: 76)
   - Elements: Photos, description, amenities, pricing
   - Buttons: "Book Now", "Contact Host"
   - **Issue:** Buttons not functional (no booking/messaging API)

6. **Booking Form** (ID: 77)
   - Elements: Check-in/out dates, guest info, price summary
   - **Issue:** Form exists but no backend to process bookings

7. **Messages** (ID: 88)
   - Elements: Basic heading, paragraph, button, text field
   - **Issue:** No messaging backend

8. **Host Profile** (ID: 78)
9. **Reviews & Ratings** (ID: 79)
10. **Notifications** (ID: 94)
11. **About Us** (ID: 65)
12. **Contact Us** (ID: 95)
13. **Privacy Policy** (ID: 62)
14. **Terms of Service** (ID: 89)

#### Inactive Screens (Not Published)
- Login Screen (ID: 18)
- Sign Up (ID: 48)
- Forgot Password (ID: 50)
- Email Verification (ID: 49)
- Splash Screen (ID: 46)

### ✅ IMPLEMENTED MOBILE COMPONENTS

**Files in `/mobile_apps/property_listings/src/`:**

1. **ListingDetailScreen.tsx** - ✅ Exists
   - Fetches listing by ID
   - Displays property details
   - **Status:** Functional for viewing

2. **MyListingsScreen.tsx** - ✅ Exists
   - Shows user's created listings
   - **Status:** Functional

3. **listingsService.ts** - ✅ Exists
   - API client for listings
   - Methods: getListings, getListingById, createListing, updateListing, deleteListing, publishListing, getAmenities
   - **Status:** Fully functional

4. **DynamicScreen.tsx** - ✅ Exists
   - Renders screens dynamically from backend
   - Supports: text, images, forms, date pickers, dropdowns
   - **Status:** Fully functional

5. **uploadService.ts** - ✅ Exists
   - Uploads images to server
   - Per-app folder structure
   - **Status:** Fully functional

### ❌ MISSING MOBILE COMPONENTS

1. **BookingScreen.tsx** - Not implemented
2. **MessagingScreen.tsx** - Not implemented
3. **ConversationScreen.tsx** - Not implemented
4. **ReviewsScreen.tsx** - Not implemented
5. **SearchResultsScreen.tsx** - Not implemented
6. **FavoritesScreen.tsx** - Not implemented
7. **bookingsService.ts** - Not implemented
8. **messagesService.ts** - Not implemented
9. **reviewsService.ts** - Not implemented

---

## 🔄 USER FLOW ANALYSIS

### 1️⃣ LISTING A PROPERTY

**Current Status:** ✅ **PARTIALLY WORKING**

#### What Works:
1. User authenticates (JWT system working)
2. User navigates to create listing screen
3. Form collects property data
4. API creates listing in database
5. Images can be uploaded to server
6. Listing saved as draft

#### What's Missing:
- No dedicated "Create Listing" screen in mobile app
- Would need to create a multi-step form screen
- No image gallery management UI
- No amenities selection UI
- No availability calendar UI

**Workaround:** Could use DynamicScreen with form elements, but UX would be poor

---

### 2️⃣ SEARCHING PROPERTIES

**Current Status:** ❌ **NOT WORKING**

#### What Exists:
- "Property Listings" screen (ID: 75) with search form
- "Advanced Search" screen (ID: 80) with filters
- Form fields: location, check-in, check-out, guests, price range, property type

#### What's Missing:
- **No backend search logic** in `propertyListingsController.js`
- Current `getListings` endpoint returns all listings
- No filtering by:
  - Location (city, coordinates, radius)
  - Availability (date range)
  - Guest capacity
  - Price range
  - Amenities
  - Property type

#### What Needs to Be Done:
1. Implement search query builder in controller
2. Add date availability check against `property_availability` table
3. Add geolocation search (lat/lng + radius)
4. Add price range filtering
5. Add amenities filtering (JOIN query)
6. Add sorting options (price, rating, distance)

---

### 3️⃣ COMMUNICATING WITH HOST

**Current Status:** ❌ **NOT WORKING**

#### What Exists:
- "Messages" screen (ID: 88) - basic placeholder
- "Contact Host" button on Property Details screen

#### What's Missing:
- **No database tables** for conversations/messages
- **No API endpoints** for messaging
- **No mobile components** for chat UI
- No real-time messaging (WebSocket/polling)
- No push notifications for new messages

#### What Needs to Be Done:
1. Create database tables (`conversations`, `messages`)
2. Create messaging controller and routes
3. Implement conversation creation (guest → host)
4. Implement message sending/receiving
5. Build chat UI component
6. Add real-time updates (Socket.io or polling)
7. Implement push notifications

---

### 4️⃣ RESERVING/RENTING A PROPERTY

**Current Status:** ❌ **NOT WORKING**

#### What Exists:
- "Booking Form" screen (ID: 77) with all required fields
- Form collects: check-in, check-out, guest info, special requests
- Price summary display

#### What's Missing:
- **No database table** for bookings
- **No API endpoints** for booking operations
- **No payment processing** integration
- **No availability checking** before booking
- **No booking confirmation** system
- **No calendar blocking** after booking

#### What Needs to Be Done:
1. Create `property_bookings` table
2. Create bookings controller and routes
3. Implement availability checking logic
4. Implement booking creation with validation
5. Integrate payment processing (Stripe/PayPal)
6. Update `property_availability` when booking confirmed
7. Send confirmation emails
8. Create booking management screens (view/cancel)
9. Create host booking management (approve/reject if not instant book)

---

## 🎯 IMPLEMENTATION PRIORITY

### 🔴 CRITICAL (Phase 1) - Core Functionality

#### 1. Property Search ⭐⭐⭐⭐⭐
**Priority:** HIGHEST  
**Reason:** Users can't find properties without search

**Tasks:**
- [ ] Implement search query builder in `propertyListingsController.js`
- [ ] Add location-based search (city, coordinates)
- [ ] Add date availability filtering
- [ ] Add guest count filtering
- [ ] Add price range filtering
- [ ] Add property type filtering
- [ ] Add amenities filtering
- [ ] Add sorting (price, rating, newest)
- [ ] Update mobile app to call search endpoint

**Estimated Time:** 2-3 days

---

#### 2. Booking System ⭐⭐⭐⭐⭐
**Priority:** HIGHEST  
**Reason:** Core functionality for rental platform

**Tasks:**
- [ ] Create `property_bookings` database table
- [ ] Create `bookingsController.js`
- [ ] Create `bookings` routes
- [ ] Implement booking creation endpoint
- [ ] Implement availability checking logic
- [ ] Implement booking confirmation
- [ ] Update `property_availability` on booking
- [ ] Create booking management endpoints (list, view, cancel)
- [ ] Create `bookingsService.ts` in mobile app
- [ ] Update Booking Form screen to submit to API
- [ ] Create "My Bookings" screen
- [ ] Create "My Reservations" screen (for hosts)

**Estimated Time:** 4-5 days

---

#### 3. Availability Calendar ⭐⭐⭐⭐
**Priority:** HIGH  
**Reason:** Required for booking system

**Tasks:**
- [ ] Create availability controller and routes
- [ ] Implement GET availability endpoint
- [ ] Implement UPDATE availability endpoint
- [ ] Implement bulk update endpoint
- [ ] Create calendar UI component in mobile app
- [ ] Integrate with booking system

**Estimated Time:** 2-3 days

---

### 🟡 IMPORTANT (Phase 2) - Enhanced Functionality

#### 4. Messaging System ⭐⭐⭐⭐
**Priority:** HIGH  
**Reason:** Essential for guest-host communication

**Tasks:**
- [ ] Create `conversations` and `messages` tables
- [ ] Create messaging controller and routes
- [ ] Implement conversation creation
- [ ] Implement message sending/receiving
- [ ] Implement message read status
- [ ] Create chat UI component
- [ ] Add real-time updates (Socket.io or polling)
- [ ] Integrate with Property Details "Contact Host" button

**Estimated Time:** 5-6 days

---

#### 5. Reviews & Ratings ⭐⭐⭐
**Priority:** MEDIUM-HIGH  
**Reason:** Builds trust and quality

**Tasks:**
- [ ] Create `property_reviews` table
- [ ] Create reviews controller and routes
- [ ] Implement review creation (verified stays only)
- [ ] Implement review listing
- [ ] Calculate average ratings
- [ ] Update listings with rating data
- [ ] Create review UI components
- [ ] Add review submission screen

**Estimated Time:** 3-4 days

---

#### 6. Favorites/Wishlist ⭐⭐⭐
**Priority:** MEDIUM  
**Reason:** Improves user experience

**Tasks:**
- [ ] Create `property_favorites` table
- [ ] Create favorites controller and routes
- [ ] Implement add/remove favorites
- [ ] Create "My Favorites" screen
- [ ] Add heart icon to listing cards

**Estimated Time:** 1-2 days

---

### 🟢 NICE TO HAVE (Phase 3) - Advanced Features

#### 7. Payment Processing ⭐⭐⭐⭐⭐
**Priority:** CRITICAL (but complex)  
**Reason:** Required for real transactions

**Tasks:**
- [ ] Choose payment provider (Stripe recommended)
- [ ] Create payment processing controller
- [ ] Implement payment intent creation
- [ ] Implement payment confirmation
- [ ] Handle refunds for cancellations
- [ ] Implement host payouts
- [ ] Add payment UI to booking flow
- [ ] Handle payment failures

**Estimated Time:** 7-10 days

---

#### 8. Notifications ⭐⭐⭐
**Priority:** MEDIUM  
**Reason:** Keeps users engaged

**Tasks:**
- [ ] Create notifications table
- [ ] Implement push notifications (Firebase)
- [ ] Create notification types (booking, message, review)
- [ ] Create notifications screen
- [ ] Add notification badges

**Estimated Time:** 3-4 days

---

#### 9. Host Dashboard ⭐⭐⭐
**Priority:** MEDIUM  
**Reason:** Helps hosts manage properties

**Tasks:**
- [ ] Create dashboard screen
- [ ] Show booking statistics
- [ ] Show revenue analytics
- [ ] Show calendar overview
- [ ] Quick actions (approve/reject bookings)

**Estimated Time:** 3-4 days

---

#### 10. Advanced Features ⭐⭐
**Priority:** LOW  
**Reason:** Polish and optimization

**Tasks:**
- [ ] Dynamic pricing based on demand
- [ ] Multi-currency support
- [ ] Map view for search results
- [ ] Photo verification
- [ ] Identity verification
- [ ] Insurance options
- [ ] Cleaning service integration

**Estimated Time:** Ongoing

---

## 📋 IMPLEMENTATION ROADMAP

### Week 1-2: Search & Discovery
- Implement property search backend
- Add filtering and sorting
- Test search functionality
- Update mobile app search screens

### Week 3-4: Booking System
- Create booking database tables
- Implement booking API
- Build booking flow in mobile app
- Test booking creation and management

### Week 5: Availability Management
- Implement availability API
- Create calendar UI
- Integrate with booking system
- Test date blocking

### Week 6-7: Messaging
- Create messaging database
- Implement messaging API
- Build chat UI
- Add real-time updates

### Week 8: Reviews & Ratings
- Create reviews database
- Implement reviews API
- Build review UI
- Calculate and display ratings

### Week 9: Favorites & Polish
- Implement favorites
- Bug fixes and testing
- UI/UX improvements
- Performance optimization

### Week 10+: Payment & Advanced Features
- Integrate payment processing
- Implement notifications
- Build host dashboard
- Add advanced features

---

## 🚀 QUICK START GUIDE

### To Make the App Functional (Minimum Viable Product):

1. **Implement Search** (2-3 days)
   - Users can find properties
   - Filter by location, dates, price

2. **Implement Bookings** (4-5 days)
   - Users can reserve properties
   - Hosts can manage reservations
   - Availability is tracked

3. **Add Messaging** (5-6 days)
   - Guests can contact hosts
   - Basic chat functionality

**Total MVP Time:** ~3 weeks

---

## 📊 CURRENT FUNCTIONALITY MATRIX

| Feature | Database | API | Mobile UI | Status |
|---------|----------|-----|-----------|--------|
| User Auth | ✅ | ✅ | ✅ | ✅ Working |
| Profile Management | ✅ | ✅ | ✅ | ✅ Working |
| Image Upload | ✅ | ✅ | ✅ | ✅ Working |
| Property Listings | ✅ | ✅ | ✅ | ✅ Working |
| Property Details | ✅ | ✅ | ✅ | ✅ Working |
| Amenities | ✅ | ✅ | ⚠️ | ⚠️ Partial |
| Search | ⚠️ | ❌ | ✅ | ❌ Not Working |
| Availability | ✅ | ❌ | ❌ | ❌ Not Working |
| Bookings | ❌ | ❌ | ✅ | ❌ Not Working |
| Messaging | ❌ | ❌ | ⚠️ | ❌ Not Working |
| Reviews | ❌ | ❌ | ⚠️ | ❌ Not Working |
| Favorites | ❌ | ❌ | ❌ | ❌ Not Working |
| Payments | ❌ | ❌ | ❌ | ❌ Not Working |
| Notifications | ⚠️ | ❌ | ✅ | ❌ Not Working |

**Legend:**
- ✅ Fully implemented
- ⚠️ Partially implemented
- ❌ Not implemented

---

## 🎯 CONCLUSION

The Property Rental App has a **strong foundation** with:
- ✅ Robust authentication system
- ✅ Property listing management
- ✅ Image upload infrastructure
- ✅ Dynamic screen rendering
- ✅ Well-structured database schema

However, it's **not yet functional** as a rental platform because:
- ❌ Users cannot search for properties effectively
- ❌ Users cannot book/reserve properties
- ❌ Users cannot communicate with hosts
- ❌ No payment processing
- ❌ No reviews or trust system

**Recommendation:** Focus on implementing the **Phase 1 Critical Features** (Search, Bookings, Availability) to achieve a Minimum Viable Product within 3 weeks.
