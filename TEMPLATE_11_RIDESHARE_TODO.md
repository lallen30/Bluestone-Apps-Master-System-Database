# Template 11 (Rideshare) - Complete Implementation TODO

## Overview

This document outlines everything needed to make Template 11 (Rideshare) fully functional like Template 9 (Property Rental).

## ✅ COMPLETED (Dec 3, 2025)

### Phase 1: Database Schema ✅
- Created `040_create_rideshare_tables.sql` with:
  - `rides` - Core ride requests table
  - `driver_profiles` - Driver information and stats
  - `ride_reviews` - Ratings and reviews
  - `user_payment_methods` - Payment methods
  - `ride_payments` - Payment records
  - `user_saved_addresses` - Saved locations
  - `ride_promo_codes` - Promo codes
  - `ride_promo_code_usage` - Usage tracking
  - `driver_earnings` - Earnings records
  - `driver_payouts` - Payout records
  - `ride_pricing_rules` - Pricing configuration
  - `app_template_rides` - Template ride data
  - `app_template_driver_profiles` - Template driver data
  - `app_template_ride_pricing` - Template pricing

### Phase 2: Master Screens ✅
- Created `041_create_rideshare_master_screens.sql`
- Added 12 new screens to `app_screens`
- Linked all 25 template screens to master screens

### Phase 3: Template Data ✅
- Created `042_populate_template11_data.sql`
- Added 2 roles (rider, driver)
- Added 4 menus (Rider Tab Bar, Driver Tab Bar, Rider Sidebar, Driver Sidebar)
- Added 25 menu items
- Added 4 sample users
- Added 2 driver profiles
- Added 3 sample rides
- Added 1 administrator
- Added screen role access
- Added menu role access
- Added role home screens

### Phase 4: Backend API ✅
- Created `ridesController.js` with:
  - `requestRide` - Request a new ride
  - `getRideHistory` - Get ride history
  - `getRideById` - Get ride details
  - `getActiveRide` - Get active ride
  - `cancelRide` - Cancel a ride
  - `rateRide` - Rate a ride
  - `updateRideStatus` - Update ride status (driver)
  - `acceptRide` - Accept a ride (driver)
- Created `driversController.js` with:
  - `registerDriver` - Register as driver
  - `getDriverProfile` - Get driver profile
  - `updateDriverProfile` - Update driver profile
  - `toggleDriverStatus` - Go online/offline
  - `updateDriverLocation` - Update location
  - `getDriverEarnings` - Get earnings
  - `getDriverRides` - Get driver's rides
  - `getAvailableRides` - Get available rides
  - `getDriverById` - Get driver public profile
- Created `rides.js` and `drivers.js` routes
- Registered routes in `server.js`

### Phase 5: App Templates Controller ✅
- Added rideshare cloning logic:
  - Clone driver profiles
  - Clone rides
  - Clone pricing rules

### Current State Comparison (UPDATED)

| Component | Template 9 (Property Rental) | Template 11 (Rideshare) |
|-----------|------------------------------|-------------------------|
| `app_template_screens` | 33 screens (with screen_id links) | 25 screens ✅ (with screen_id links) |
| `app_template_roles` | 3 roles | 2 roles ✅ |
| `app_template_menus` | 4 menus | 4 menus ✅ |
| `app_template_users` | 6 users | 4 users ✅ |
| `app_template_driver_profiles` | N/A | 2 profiles ✅ |
| `app_template_administrators` | 2 admins | 1 admin ✅ |
| Master Screens | All linked | All linked ✅ |
| Mobile App | Complete (`mobile_apps/property_rental/`) | ✅ Created (`mobile_apps/rideshare/`) |
| Backend API | Complete (controllers, routes) | ✅ Complete |
| Database Tables | Complete (property_*, booking_*) | ✅ Complete (rides, driver_profiles, etc.) |

### Phase 6: Mobile App ✅
- Created `mobile_apps/rideshare/` directory (cloned from property_rental)
- Updated `app.config.ts` with rideshare defaults
- Updated `package.json` with rideshare name
- Updated `app.json` with rideshare name
- Updated `.env.example` with rideshare configuration
- Created `ridesService.ts` - API service for rides
- Created `driversService.ts` - API service for drivers

### Phase 7: Rideshare UI Screens ✅
- Created `RideRequestScreen.tsx` - Request a ride with pickup/destination, ride type selection, promo codes
- Created `RideTrackingScreen.tsx` - Track active ride with driver info, status updates, cancel/rate options
- Created `RideHistoryScreen.tsx` - View past rides with pagination, status badges, fare display
- Created `DriverDashboardScreen.tsx` - Driver home with online toggle, available rides, quick actions
- Created `screens/index.ts` - Export all rideshare screens

---

## 🔲 REMAINING WORK (Lower Priority)

### Optional Enhancements:
1. **iOS Native Project** - Update Xcode project:
   - Rename project from PropertyListings to Rideshare
   - Update bundle identifier
   - Update Info.plist display name

2. **Android Native Project** - Update Android project:
   - Update package name
   - Update app name

3. **Maps Integration** - Add Google Maps or similar for:
   - Location picking with autocomplete
   - Route display on map
   - Real-time driver tracking

4. **Real-time Updates** - Add WebSocket support for:
   - Driver location updates
   - Ride status changes
   - Push notifications

5. **Additional Screens**:
   - `DriverEarningsScreen` - Detailed earnings view
   - `BecomeDriverScreen` - Driver registration form
   - `RateRideScreen` - Rating modal after ride

---

## PHASE 1: Database Schema (Backend)

### 1.1 Create Rideshare Database Tables

Create migration file: `multi_site_manager/src/migrations/XXX_create_rideshare_tables.sql`

```sql
-- Core Ride Tables
CREATE TABLE rides (
    id INT AUTO_INCREMENT PRIMARY KEY,
    app_id INT NOT NULL,
    rider_id INT NOT NULL,           -- app_users.id (passenger)
    driver_id INT,                    -- app_users.id (driver, null until assigned)
    
    -- Locations
    pickup_address VARCHAR(500) NOT NULL,
    pickup_latitude DECIMAL(10, 8),
    pickup_longitude DECIMAL(11, 8),
    destination_address VARCHAR(500) NOT NULL,
    destination_latitude DECIMAL(10, 8),
    destination_longitude DECIMAL(11, 8),
    
    -- Ride Details
    ride_type ENUM('standard', 'premium', 'xl', 'luxury') DEFAULT 'standard',
    estimated_fare DECIMAL(10, 2),
    actual_fare DECIMAL(10, 2),
    distance_km DECIMAL(10, 2),
    duration_minutes INT,
    
    -- Status
    status ENUM('requested', 'searching', 'driver_assigned', 'driver_arriving', 
                'in_progress', 'completed', 'cancelled') DEFAULT 'requested',
    
    -- Timestamps
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    driver_assigned_at TIMESTAMP NULL,
    pickup_at TIMESTAMP NULL,
    dropoff_at TIMESTAMP NULL,
    cancelled_at TIMESTAMP NULL,
    
    -- Additional
    promo_code VARCHAR(50),
    ride_notes TEXT,
    cancellation_reason TEXT,
    cancelled_by ENUM('rider', 'driver', 'system'),
    
    FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
    FOREIGN KEY (rider_id) REFERENCES app_users(id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES app_users(id) ON DELETE SET NULL,
    INDEX idx_app_rider (app_id, rider_id),
    INDEX idx_app_driver (app_id, driver_id),
    INDEX idx_status (status)
);

-- Driver Profiles
CREATE TABLE driver_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    app_id INT NOT NULL,
    user_id INT NOT NULL,             -- app_users.id
    
    -- Vehicle Info
    vehicle_make VARCHAR(100),
    vehicle_model VARCHAR(100),
    vehicle_year INT,
    vehicle_color VARCHAR(50),
    license_plate VARCHAR(20),
    vehicle_type ENUM('sedan', 'suv', 'van', 'luxury') DEFAULT 'sedan',
    
    -- Driver Stats
    total_rides INT DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 5.00,
    acceptance_rate DECIMAL(5, 2) DEFAULT 100.00,
    cancellation_rate DECIMAL(5, 2) DEFAULT 0.00,
    
    -- Status
    is_verified BOOLEAN DEFAULT FALSE,
    is_online BOOLEAN DEFAULT FALSE,
    current_latitude DECIMAL(10, 8),
    current_longitude DECIMAL(11, 8),
    last_location_update TIMESTAMP NULL,
    
    -- Documents (URLs)
    drivers_license_url VARCHAR(500),
    vehicle_registration_url VARCHAR(500),
    insurance_url VARCHAR(500),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_driver (app_id, user_id)
);

-- Ride Ratings/Reviews
CREATE TABLE ride_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ride_id INT NOT NULL,
    reviewer_id INT NOT NULL,         -- Who left the review
    reviewee_id INT NOT NULL,         -- Who is being reviewed
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    review_type ENUM('rider_to_driver', 'driver_to_rider') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES app_users(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewee_id) REFERENCES app_users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_review (ride_id, reviewer_id)
);

-- Payment Methods
CREATE TABLE user_payment_methods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    app_id INT NOT NULL,
    user_id INT NOT NULL,
    payment_type ENUM('credit', 'debit', 'paypal', 'apple_pay', 'google_pay') NOT NULL,
    
    -- Card details (encrypted/tokenized in production)
    card_last_four VARCHAR(4),
    card_brand VARCHAR(20),           -- visa, mastercard, amex
    expiry_month INT,
    expiry_year INT,
    
    -- PayPal/Digital Wallet
    wallet_email VARCHAR(255),
    
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE,
    INDEX idx_user (app_id, user_id)
);

-- Ride Payments
CREATE TABLE ride_payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ride_id INT NOT NULL,
    payment_method_id INT,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Breakdown
    base_fare DECIMAL(10, 2),
    distance_fare DECIMAL(10, 2),
    time_fare DECIMAL(10, 2),
    surge_multiplier DECIMAL(3, 2) DEFAULT 1.00,
    promo_discount DECIMAL(10, 2) DEFAULT 0.00,
    tip_amount DECIMAL(10, 2) DEFAULT 0.00,
    
    status ENUM('pending', 'processing', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    transaction_id VARCHAR(100),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP NULL,
    
    FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE CASCADE,
    FOREIGN KEY (payment_method_id) REFERENCES user_payment_methods(id) ON DELETE SET NULL
);

-- Saved Addresses
CREATE TABLE user_saved_addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    app_id INT NOT NULL,
    user_id INT NOT NULL,
    label VARCHAR(50) NOT NULL,       -- 'home', 'work', 'gym', etc.
    address VARCHAR(500) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE,
    INDEX idx_user (app_id, user_id)
);

-- Promo Codes
CREATE TABLE promo_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    app_id INT NOT NULL,
    code VARCHAR(50) NOT NULL,
    discount_type ENUM('percentage', 'fixed') NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    max_discount DECIMAL(10, 2),      -- Cap for percentage discounts
    min_ride_amount DECIMAL(10, 2),
    usage_limit INT,
    used_count INT DEFAULT 0,
    valid_from TIMESTAMP,
    valid_until TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
    UNIQUE KEY unique_code (app_id, code)
);

-- Driver Earnings
CREATE TABLE driver_earnings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    app_id INT NOT NULL,
    driver_id INT NOT NULL,
    ride_id INT NOT NULL,
    
    gross_amount DECIMAL(10, 2) NOT NULL,
    platform_fee DECIMAL(10, 2) DEFAULT 0.00,
    net_amount DECIMAL(10, 2) NOT NULL,
    tip_amount DECIMAL(10, 2) DEFAULT 0.00,
    
    status ENUM('pending', 'available', 'paid') DEFAULT 'pending',
    payout_id INT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES app_users(id) ON DELETE CASCADE,
    FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE CASCADE
);
```

### 1.2 Create Template-Specific Tables

```sql
-- Template ride data (for cloning)
CREATE TABLE app_template_rides (
    id INT AUTO_INCREMENT PRIMARY KEY,
    template_id INT NOT NULL,
    template_rider_id INT,
    template_driver_id INT,
    pickup_address VARCHAR(500),
    destination_address VARCHAR(500),
    ride_type VARCHAR(20),
    status VARCHAR(20),
    estimated_fare DECIMAL(10, 2),
    FOREIGN KEY (template_id) REFERENCES app_templates(id) ON DELETE CASCADE
);

CREATE TABLE app_template_driver_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    template_id INT NOT NULL,
    template_user_id INT NOT NULL,
    vehicle_make VARCHAR(100),
    vehicle_model VARCHAR(100),
    vehicle_year INT,
    vehicle_color VARCHAR(50),
    license_plate VARCHAR(20),
    vehicle_type VARCHAR(20),
    rating DECIMAL(3, 2),
    FOREIGN KEY (template_id) REFERENCES app_templates(id) ON DELETE CASCADE
);
```

---

## PHASE 2: Backend API (Node.js/Express)

### 2.1 Create Controllers

Create file: `multi_site_manager/src/controllers/ridesController.js`

**Required endpoints:**
- `POST /api/v1/apps/:appId/rides` - Request a new ride
- `GET /api/v1/apps/:appId/rides` - Get user's ride history
- `GET /api/v1/apps/:appId/rides/:rideId` - Get ride details
- `PUT /api/v1/apps/:appId/rides/:rideId/cancel` - Cancel ride
- `PUT /api/v1/apps/:appId/rides/:rideId/rate` - Rate ride
- `GET /api/v1/apps/:appId/rides/active` - Get active ride

Create file: `multi_site_manager/src/controllers/driversController.js`

**Required endpoints:**
- `POST /api/v1/apps/:appId/drivers/register` - Register as driver
- `GET /api/v1/apps/:appId/drivers/profile` - Get driver profile
- `PUT /api/v1/apps/:appId/drivers/profile` - Update driver profile
- `PUT /api/v1/apps/:appId/drivers/status` - Toggle online/offline
- `PUT /api/v1/apps/:appId/drivers/location` - Update location
- `GET /api/v1/apps/:appId/drivers/earnings` - Get earnings
- `GET /api/v1/apps/:appId/drivers/rides` - Get driver's rides

Create file: `multi_site_manager/src/controllers/paymentMethodsController.js`

**Required endpoints:**
- `GET /api/v1/apps/:appId/payment-methods` - List payment methods
- `POST /api/v1/apps/:appId/payment-methods` - Add payment method
- `DELETE /api/v1/apps/:appId/payment-methods/:id` - Remove payment method
- `PUT /api/v1/apps/:appId/payment-methods/:id/default` - Set default

### 2.2 Create Routes

Create file: `multi_site_manager/src/routes/rides.js`
Create file: `multi_site_manager/src/routes/drivers.js`
Create file: `multi_site_manager/src/routes/paymentMethods.js`

### 2.3 Register Routes in index.js

Add to `multi_site_manager/src/index.js`:
```javascript
const ridesRoutes = require('./routes/rides');
const driversRoutes = require('./routes/drivers');
const paymentMethodsRoutes = require('./routes/paymentMethods');

app.use('/api/v1/apps/:appId/rides', ridesRoutes);
app.use('/api/v1/apps/:appId/drivers', driversRoutes);
app.use('/api/v1/apps/:appId/payment-methods', paymentMethodsRoutes);
```

---

## PHASE 3: Master Screens (Admin Portal)

### 3.1 Create Master Screens in Database

Template 9 has screens linked to master `app_screens` table. Template 11 needs the same.

Create migration: `XXX_create_rideshare_master_screens.sql`

**Required screens (17 total):**

| Screen Name | screen_key | Category | Description |
|-------------|------------|----------|-------------|
| Splash Screen | splash_screen | Auth | App splash/loading |
| Login | login | Auth | User login |
| Sign Up | sign_up | Auth | User registration |
| Forgot Password | forgot_password | Auth | Password reset |
| Email Verification | email_verification | Auth | Verify email |
| Request Ride | request_ride | Booking | Main ride request screen |
| Ride Tracking | ride_tracking | Booking | Track active ride |
| Ride History | ride_history | Account | Past rides list |
| Ride Details | ride_details | Booking | Single ride details |
| Payment Methods | payment_methods | Account | Manage payments |
| Driver Profile | driver_profile | Booking | View driver info |
| User Profile | user_profile | Account | User settings |
| Edit Profile | edit_profile | Account | Edit user info |
| Notifications | notifications | Account | Notification center |
| Contact Us | contact_us | Support | Contact form |
| About Us | about_us | Support | About page |
| Privacy Policy | privacy_policy | Legal | Privacy policy |
| Terms of Service | terms_of_service | Legal | Terms |
| Driver Dashboard | driver_dashboard | Driver | Driver home (if driver mode) |
| Driver Earnings | driver_earnings | Driver | Earnings summary |
| Become a Driver | become_driver | Driver | Driver registration |

### 3.2 Link Template Screens to Master Screens

Update `app_template_screens` to set `screen_id` for each screen.

---

## PHASE 4: Template Data Population

### 4.1 Create Migration to Populate Template 11

Create file: `multi_site_manager/src/migrations/XXX_populate_template11_data.sql`

**Copy structure from `011_copy_app28_to_template9.sql` but for rideshare:**

```sql
-- Roles for Rideshare
INSERT INTO app_template_roles (template_id, name, display_name, description, is_default)
VALUES 
    (11, 'rider', 'Rider', 'Passenger who requests rides', 1),
    (11, 'driver', 'Driver', 'Driver who provides rides', 0),
    (11, 'admin', 'Admin', 'App administrator', 0);

-- Menus
INSERT INTO app_template_menus (template_id, name, menu_type, icon, description, is_active)
VALUES
    (11, 'Rider Tab Bar', 'tab_bar', 'Navigation', 'Bottom navigation for riders', 1),
    (11, 'Driver Tab Bar', 'tab_bar', 'Navigation', 'Bottom navigation for drivers', 1),
    (11, 'Rider Sidebar', 'sidebar', 'Menu', 'Side menu for riders', 1),
    (11, 'Driver Sidebar', 'sidebar', 'Menu', 'Side menu for drivers', 1);

-- Sample Users
INSERT INTO app_template_users (template_id, email, password_hash, first_name, last_name, status, email_verified)
VALUES
    (11, 'rider@example.com', '$2b$10$...', 'John', 'Rider', 'active', 1),
    (11, 'driver@example.com', '$2b$10$...', 'Jane', 'Driver', 'active', 1),
    (11, 'admin@example.com', '$2b$10$...', 'Admin', 'User', 'active', 1);

-- Sample Driver Profile
INSERT INTO app_template_driver_profiles (template_id, template_user_id, vehicle_make, vehicle_model, vehicle_year, vehicle_color, license_plate, vehicle_type, rating)
SELECT 11, id, 'Toyota', 'Camry', 2023, 'Silver', 'ABC 123', 'sedan', 4.85
FROM app_template_users WHERE template_id = 11 AND email = 'driver@example.com';

-- Administrators
INSERT INTO app_template_administrators (template_id, user_id, role_id)
VALUES (11, 1, 2);  -- Master admin
```

---

## PHASE 5: Mobile App

### 5.1 Create Mobile App Directory

Copy and modify `mobile_apps/property_rental/` to `mobile_apps/rideshare/`

### 5.2 Create Rideshare-Specific Components

Create in `mobile_apps/rideshare/src/components/elements/`:

| Component | Purpose |
|-----------|---------|
| `RideRequestElement.tsx` | Request ride form with map |
| `RideTrackingElement.tsx` | Real-time ride tracking |
| `RideHistoryElement.tsx` | List of past rides |
| `RideDetailElement.tsx` | Single ride details |
| `DriverProfileElement.tsx` | Driver info display |
| `PaymentMethodsElement.tsx` | Payment management |
| `DriverDashboardElement.tsx` | Driver home screen |
| `DriverEarningsElement.tsx` | Earnings summary |
| `RideRatingElement.tsx` | Rate ride/driver |

### 5.3 Create API Services

Create in `mobile_apps/rideshare/src/api/`:

| Service | Purpose |
|---------|---------|
| `ridesService.ts` | Ride CRUD operations |
| `driversService.ts` | Driver profile/status |
| `paymentMethodsService.ts` | Payment methods |
| `locationService.ts` | Location tracking |

### 5.4 Update App Configuration

Update `mobile_apps/rideshare/src/config/app.config.ts`:
```typescript
export const AppConfig = {
  APP_ID: parseInt(Config.APP_ID || 'XX', 10),  // New app ID
  APP_NAME: Config.APP_NAME || 'Rideshare',
  APP_DISPLAY_NAME: Config.APP_DISPLAY_NAME || 'Rideshare',
  // ...
};
```

---

## PHASE 6: Screen Elements

### 6.1 Add Rideshare-Specific Elements to screen_elements Table

```sql
INSERT INTO screen_elements (name, element_type, category, icon, description, default_config)
VALUES
    ('Ride Request', 'ride_request', 'rideshare', 'MapPin', 'Request a ride with pickup/destination', '{}'),
    ('Ride Tracking', 'ride_tracking', 'rideshare', 'Navigation', 'Real-time ride tracking', '{}'),
    ('Ride List', 'ride_list', 'lists', 'List', 'List of rides', '{}'),
    ('Ride Detail', 'ride_detail', 'detail', 'FileText', 'Ride details display', '{}'),
    ('Driver Card', 'driver_card', 'Display', 'User', 'Driver info card', '{}'),
    ('Payment Methods', 'payment_methods', 'forms', 'CreditCard', 'Payment method management', '{}'),
    ('Driver Dashboard', 'driver_dashboard', 'Display', 'LayoutDashboard', 'Driver statistics', '{}'),
    ('Earnings Summary', 'earnings_summary', 'Display', 'DollarSign', 'Driver earnings', '{}'),
    ('Ride Rating', 'ride_rating', 'Interactive', 'Star', 'Rate ride/driver', '{}'),
    ('Location Picker', 'location_picker_ride', 'Input', 'MapPin', 'Pick location on map', '{}');
```

---

## PHASE 7: Update appTemplatesController.js

### 7.1 Add Rideshare Cloning Logic

In `createAppFromTemplate()`, add handling for rideshare-specific tables:

```javascript
// STEP XX: Clone Rides from template
const templateRides = await db.query(
    'SELECT * FROM app_template_rides WHERE template_id = ?',
    [template_id]
);
// ... clone logic

// STEP XX: Clone Driver Profiles from template
const templateDrivers = await db.query(
    'SELECT * FROM app_template_driver_profiles WHERE template_id = ?',
    [template_id]
);
// ... clone logic
```

---

## PHASE 8: Admin Portal Updates

### 8.1 Create Rideshare Management Pages

Create in `admin_portal/app/app/[id]/`:

| Page | Purpose |
|------|---------|
| `rides/page.tsx` | Manage rides |
| `drivers/page.tsx` | Manage drivers |
| `earnings/page.tsx` | View earnings |
| `promo-codes/page.tsx` | Manage promo codes |

### 8.2 Add API Methods

Add to `admin_portal/lib/api.ts`:

```typescript
export const ridesAPI = {
    getAll: (appId: string, params?: any) => api.get(`/apps/${appId}/rides`, { params }),
    getById: (appId: string, rideId: string) => api.get(`/apps/${appId}/rides/${rideId}`),
    // ...
};

export const driversAPI = {
    getAll: (appId: string, params?: any) => api.get(`/apps/${appId}/drivers`, { params }),
    // ...
};
```

---

## PHASE 9: Testing & Verification

### 9.1 Create Test App from Template

1. Go to http://localhost:3001/master/apps
2. Click "Create App from Template"
3. Select Template 11 (Rideshare)
4. Verify all data is cloned correctly

### 9.2 Verify Cloned Data

Check that new app has:
- [ ] All screens assigned
- [ ] Roles created (rider, driver, admin)
- [ ] Menus created with items
- [ ] Sample users created
- [ ] Driver profiles created
- [ ] Screen role access configured
- [ ] Menu role access configured

### 9.3 Test Mobile App

1. Clone mobile app for new app ID
2. Run on simulator
3. Test all screens render
4. Test ride request flow
5. Test driver mode

---

## Summary Checklist

### Database
- [ ] Create `rides` table
- [ ] Create `driver_profiles` table
- [ ] Create `ride_reviews` table
- [ ] Create `user_payment_methods` table
- [ ] Create `ride_payments` table
- [ ] Create `user_saved_addresses` table
- [ ] Create `promo_codes` table
- [ ] Create `driver_earnings` table
- [ ] Create `app_template_rides` table
- [ ] Create `app_template_driver_profiles` table

### Backend API
- [ ] Create `ridesController.js`
- [ ] Create `driversController.js`
- [ ] Create `paymentMethodsController.js`
- [ ] Create route files
- [ ] Register routes in index.js

### Master Screens
- [ ] Create 17+ master screens in `app_screens`
- [ ] Create screen element instances
- [ ] Link template screens to master screens

### Template Data
- [ ] Add roles to `app_template_roles`
- [ ] Add menus to `app_template_menus`
- [ ] Add menu items to `app_template_menu_items`
- [ ] Add users to `app_template_users`
- [ ] Add driver profiles
- [ ] Add administrators
- [ ] Add screen role access
- [ ] Add menu role access

### Screen Elements
- [ ] Add rideshare elements to `screen_elements`
- [ ] Create element instances for screens

### Mobile App
- [ ] Create `mobile_apps/rideshare/` directory
- [ ] Create rideshare components
- [ ] Create API services
- [ ] Update app configuration
- [ ] Test on simulator

### Admin Portal
- [ ] Create rides management page
- [ ] Create drivers management page
- [ ] Add API methods

### App Templates Controller
- [ ] Add rideshare cloning logic

---

## Estimated Time

| Phase | Estimated Hours |
|-------|-----------------|
| Phase 1: Database Schema | 4-6 hours |
| Phase 2: Backend API | 8-12 hours |
| Phase 3: Master Screens | 4-6 hours |
| Phase 4: Template Data | 2-4 hours |
| Phase 5: Mobile App | 16-24 hours |
| Phase 6: Screen Elements | 2-4 hours |
| Phase 7: Controller Updates | 2-4 hours |
| Phase 8: Admin Portal | 8-12 hours |
| Phase 9: Testing | 4-8 hours |
| **Total** | **50-80 hours** |

---

## Notes

1. **Real-time Features**: Rideshare apps typically need real-time updates (driver location, ride status). Consider adding WebSocket support.

2. **Maps Integration**: Will need Google Maps or similar for:
   - Location picking
   - Route display
   - Distance/time calculation
   - Driver tracking

3. **Payment Integration**: For production, integrate with Stripe or similar for actual payment processing.

4. **Push Notifications**: Essential for ride updates. Ensure push notification infrastructure is in place.

5. **Background Location**: Driver app needs background location tracking when online.
