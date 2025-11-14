# Property Listings API - Complete Guide

## 🎉 Status: Phase 1 COMPLETE

**Implementation Date:** November 12, 2025  
**Property Rental App Template ID:** 9  
**Database:** MySQL (multi_site_manager)  
**API Base:** http://localhost:3000/api/v1

---

## 📊 Database Schema

### Tables Created

#### 1. `property_listings`
Main table for property listings with:
- **Basic Info**: title, description, property_type
- **Location**: address, city, state, country, coordinates (lat/long)
- **Details**: bedrooms, bathrooms, beds, guests_max, square_feet
- **Pricing**: price_per_night, currency, cleaning_fee, service_fee
- **Booking Rules**: min/max nights, check-in/out times, cancellation policy
- **Status**: draft, pending_review, active, inactive, suspended
- **Relationships**: Belongs to app and user (host)

#### 2. `property_images`
Photo gallery for listings:
- image_url, image_key (S3/storage reference)
- caption, display_order, is_primary flag
- Links to property_listings

#### 3. `property_amenities`
Master list of amenities:
- **35 default amenities** across 6 categories:
  - **Basic** (9): WiFi, Kitchen, Washer, Dryer, A/C, Heating, TV, etc.
  - **Features** (8): Pool, Hot Tub, Gym, EV Charger, BBQ, etc.
  - **Safety** (5): Smoke Alarm, CO Alarm, Fire Extinguisher, etc.
  - **Accessibility** (4): Step-free Entry, Elevator, etc.
  - **Outdoor** (5): Patio, Balcony, Garden, Beach Access, etc.
  - **Entertainment** (4): Netflix, Board Games, Books, etc.

#### 4. `property_listing_amenities`
Many-to-many relationship linking listings to amenities

#### 5. `property_availability`
Calendar system for availability and dynamic pricing

---

## 🔌 API Endpoints

### Public Endpoints (No Auth Required)

#### 1. Browse Listings
```http
GET /api/v1/apps/:appId/listings
```

**Query Parameters:**
- `search` - Search in title, description, city
- `city` - Filter by city
- `country` - Filter by country
- `property_type` - house, apartment, condo, villa, cabin, cottage, townhouse, loft, other
- `min_price` - Minimum price per night
- `max_price` - Maximum price per night
- `bedrooms` - Minimum bedrooms
- `guests` - Minimum guest capacity
- `status` - draft, pending_review, active, inactive, suspended
- `user_id` - Filter by host/owner
- `page` - Page number (default: 1)
- `per_page` - Results per page (default: 20)

**Example:**
```bash
curl "http://localhost:3000/api/v1/apps/27/listings?city=Miami&min_price=100&bedrooms=2"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "listings": [
      {
        "id": 1,
        "title": "Beachfront Condo in Miami",
        "description": "...",
        "property_type": "condo",
        "city": "Miami",
        "price_per_night": "150.00",
        "bedrooms": 2,
        "bathrooms": 2.0,
        "guests_max": 4,
        "primary_image": "https://...",
        "image_count": 8,
        "amenities": "WiFi,Pool,Beach Access",
        "host_first_name": "John",
        "host_last_name": "Doe"
      }
    ],
    "pagination": {
      "page": 1,
      "per_page": 20,
      "total": 45,
      "total_pages": 3
    }
  }
}
```

#### 2. View Listing Details
```http
GET /api/v1/apps/:appId/listings/:listingId
```

**Example:**
```bash
curl "http://localhost:3000/api/v1/apps/27/listings/1"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Beachfront Condo in Miami",
    "description": "Beautiful 2BR condo...",
    "property_type": "condo",
    "address_line1": "123 Ocean Drive",
    "city": "Miami",
    "state": "Florida",
    "country": "USA",
    "latitude": 25.7617,
    "longitude": -80.1918,
    "bedrooms": 2,
    "bathrooms": 2.0,
    "beds": 2,
    "guests_max": 4,
    "square_feet": 1200,
    "price_per_night": "150.00",
    "currency": "USD",
    "cleaning_fee": "50.00",
    "min_nights": 2,
    "max_nights": 30,
    "check_in_time": "15:00:00",
    "check_out_time": "11:00:00",
    "cancellation_policy": "moderate",
    "is_instant_book": true,
    "status": "active",
    "images": [
      {
        "id": 1,
        "image_url": "https://...",
        "caption": "Ocean view from balcony",
        "display_order": 1,
        "is_primary": true
      }
    ],
    "amenities": [
      {
        "id": 1,
        "name": "WiFi",
        "category": "basic",
        "icon": "Wifi"
      },
      {
        "id": 10,
        "name": "Pool",
        "category": "features",
        "icon": "Waves"
      }
    ],
    "host_first_name": "John",
    "host_last_name": "Doe",
    "host_email": "john@example.com",
    "host_avatar": "https://..."
  }
}
```

#### 3. Get All Amenities
```http
GET /api/v1/amenities
```

**Example:**
```bash
curl "http://localhost:3000/api/v1/amenities"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "WiFi",
      "category": "basic",
      "icon": "Wifi",
      "description": null,
      "is_active": true
    }
  ]
}
```

---

### Protected Endpoints (Authentication Required)

#### 4. Create Listing
```http
POST /api/v1/apps/:appId/listings
Headers: Authorization: Bearer {JWT_TOKEN}
```

**Request Body:**
```json
{
  "title": "Beautiful Beach House",
  "description": "Stunning ocean views...",
  "property_type": "house",
  "address_line1": "456 Seaside Ave",
  "city": "Miami",
  "state": "Florida",
  "country": "USA",
  "postal_code": "33139",
  "latitude": 25.7617,
  "longitude": -80.1918,
  "bedrooms": 3,
  "bathrooms": 2.5,
  "beds": 4,
  "guests_max": 6,
  "square_feet": 2000,
  "price_per_night": 250,
  "currency": "USD",
  "cleaning_fee": 75,
  "service_fee_percentage": 10,
  "min_nights": 3,
  "max_nights": 30,
  "check_in_time": "16:00:00",
  "check_out_time": "10:00:00",
  "cancellation_policy": "moderate",
  "is_instant_book": false,
  "house_rules": "No smoking, No pets",
  "additional_info": "Parking available",
  "amenities": [1, 2, 10, 11],
  "images": [
    {
      "image_url": "https://example.com/image1.jpg",
      "image_key": "uploads/123.jpg",
      "caption": "Front view",
      "is_primary": true
    },
    {
      "image_url": "https://example.com/image2.jpg",
      "caption": "Living room"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Property listing created successfully",
  "data": {
    "id": 2,
    "title": "Beautiful Beach House",
    "status": "draft"
  }
}
```

#### 5. Update Listing
```http
PUT /api/v1/apps/:appId/listings/:listingId
Headers: Authorization: Bearer {JWT_TOKEN}
```

**Request Body:** (Any fields from create, only include fields to update)
```json
{
  "title": "Updated Title",
  "price_per_night": 275,
  "status": "active"
}
```

#### 6. Delete Listing
```http
DELETE /api/v1/apps/:appId/listings/:listingId
Headers: Authorization: Bearer {JWT_TOKEN}
```

#### 7. Publish/Unpublish Listing
```http
PUT /api/v1/apps/:appId/listings/:listingId/publish
Headers: Authorization: Bearer {JWT_TOKEN}
```

**Request Body:**
```json
{
  "is_published": true
}
```

---

## 🔐 Authentication

**Required for:**
- Creating listings
- Updating listings
- Deleting listings
- Publishing/unpublishing

**Not required for:**
- Browsing listings
- Viewing listing details
- Getting amenities list

**How to authenticate:**
1. User logs in: `POST /api/v1/mobile/auth/login`
2. Receive JWT token in response
3. Include in requests: `Authorization: Bearer {token}`

---

## 🧪 Testing the API

### 1. Get list of amenities
```bash
curl http://localhost:3000/api/v1/amenities
```

### 2. Login as a user (to create listings)
```bash
curl -X POST http://localhost:3000/api/v1/mobile/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "app_id": 27
  }'
```
Save the returned `accessToken`

### 3. Create a listing
```bash
curl -X POST http://localhost:3000/api/v1/apps/27/listings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Test Beach House",
    "city": "Miami",
    "country": "USA",
    "price_per_night": 200,
    "bedrooms": 2,
    "amenities": [1, 2, 10]
  }'
```

### 4. Browse listings
```bash
curl "http://localhost:3000/api/v1/apps/27/listings"
```

### 5. Search listings
```bash
curl "http://localhost:3000/api/v1/apps/27/listings?city=Miami&min_price=100"
```

---

## 📝 Property Types

- `house`
- `apartment`
- `condo`
- `villa`
- `cabin`
- `cottage`
- `townhouse`
- `loft`
- `other`

## 🏷️ Cancellation Policies

- `flexible` - Full refund up to 24 hours before check-in
- `moderate` - Full refund up to 5 days before check-in
- `strict` - 50% refund up to 7 days before check-in
- `super_strict` - 50% refund up to 30 days before check-in

## 📊 Listing Statuses

- `draft` - Not visible to public
- `pending_review` - Submitted for admin approval
- `active` - Published and bookable
- `inactive` - Temporarily unavailable
- `suspended` - Admin suspended

---

## 🎯 Next Steps (Remaining Features)

### Phase 2: Search Enhancement
- [ ] Advanced search with multiple filters
- [ ] Map-based search
- [ ] Proximity search (nearby listings)
- [ ] Sort by price, rating, distance

### Phase 3: Favorites
- [ ] Users can save favorite listings
- [ ] View saved listings

### Phase 4: Images Management
- [ ] Upload images endpoint
- [ ] Reorder images
- [ ] Set primary image
- [ ] Delete images

### Phase 5: Availability Calendar
- [ ] Set unavailable dates
- [ ] Dynamic pricing by date
- [ ] Bulk availability updates

### Future Phases:
- Booking system
- Messaging between guests and hosts
- Reviews and ratings
- Host dashboard
- Guest dashboard

---

## 📁 Files Created

**Migration:**
- `multi_site_manager/src/migrations/032_create_property_listings.sql`

**Backend:**
- `multi_site_manager/src/controllers/propertyListingsController.js`
- `multi_site_manager/src/routes/propertyListings.js`
- Updated: `multi_site_manager/src/server.js`

**Documentation:**
- `PROPERTY_LISTINGS_API_GUIDE.md` (this file)

---

## ✅ What's Working

✅ **Database tables** with proper relationships and indexes  
✅ **35 default amenities** categorized and ready to use  
✅ **Browse/search listings** with filters and pagination  
✅ **View listing details** with images and amenities  
✅ **Create listings** with authentication  
✅ **Update listings** (owners only)  
✅ **Delete listings** (owners only)  
✅ **Publish/unpublish** functionality  
✅ **Role-based access** (hosts can only modify their own listings)  
✅ **Per-app isolation** (listings scoped to specific apps)  

**The Property Rental App now has a fully functional listings system!** 🎉
