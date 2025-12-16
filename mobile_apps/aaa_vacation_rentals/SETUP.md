# Property Listings App - Setup Guide

**Created:** November 13, 2025  
**App ID:** 28 (AirPnP)  
**Template:** Property Rental App  
**Backend API:** http://localhost:3000/api/v1

---

## 🎯 Project Overview

This is a React Native mobile app (non-Expo) for the Property Rental platform, connecting to App ID 28 in your backend system.

### Features Implemented:
✅ React Native 0.82.1 (Latest)  
✅ React Navigation (Stack + Bottom Tabs)  
✅ TypeScript configuration  
✅ API client with Axios  
✅ Authentication context (login/register/logout)  
✅ Property listings API integration  
✅ Async Storage for token management  

---

## 📁 Project Structure

```
property_listings/
├── src/
│   ├── api/
│   │   ├── config.ts           # API endpoints & configuration
│   │   ├── client.ts           # Axios instance with auth interceptors
│   │   ├── authService.ts      # Authentication API calls
│   │   └── listingsService.ts  # Property listings API calls
│   ├── components/             # Reusable components
│   ├── context/
│   │   └── AuthContext.tsx     # Global auth state management
│   ├── navigation/
│   │   └── AppNavigator.tsx    # Navigation setup
│   ├── screens/                # Screen components (to be completed)
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   └── utils/                  # Utility functions
├── android/                    # Android native code
├── ios/                        # iOS native code
└── package.json
```

---

## 🔧 Installation & Setup

### Prerequisites:
- Node.js >= 20
- Xcode (for iOS development)
- Android Studio (for Android development)
- CocoaPods (for iOS): `sudo gem install cocoapods`

### Install Dependencies:
```bash
cd /Users/lallen30/Documents/bluestoneapps/Bluestone\ Apps\ Master\ System/mobile_apps/property_listings

# Already done, but if needed:
# npm install

# For iOS:
cd ios
bundle install
bundle exec pod install
cd ..
```

---

## 🚀 Running the App

### Start Metro Bundler:
```bash
npm start
```

### Run on iOS:
```bash
npm run ios
# or
npx react-native run-ios
```

### Run on Android:
```bash
npm run android
# or
npx react-native run-android
```

---

## 🔌 API Configuration

### Current Settings:
```typescript
BASE_URL: 'http://localhost:3000/api/v1'
APP_ID: 28
```

### For iOS Simulator:
`localhost` works fine

### For Android Emulator:
Change `localhost` to `10.0.2.2` in `src/api/config.ts`:
```typescript
BASE_URL: 'http://10.0.2.2:3000/api/v1'
```

### For Physical Devices:
Use your computer's IP address:
```typescript
BASE_URL: 'http://192.168.x.x:3000/api/v1'
```

---

## 📱 Available API Endpoints

### Authentication:
- `POST /mobile/auth/register` - Register new user
- `POST /mobile/auth/login` - Login
- `POST /mobile/auth/logout` - Logout
- `POST /mobile/auth/verify-email` - Verify email

### Property Listings:
- `GET /apps/28/listings` - Browse listings (with filters)
- `GET /apps/28/listings/:id` - Get listing details
- `POST /apps/28/listings` - Create listing (auth required)
- `PUT /apps/28/listings/:id` - Update listing (auth required)
- `DELETE /apps/28/listings/:id` - Delete listing (auth required)
- `PUT /apps/28/listings/:id/publish` - Publish/unpublish (auth required)

### Amenities:
- `GET /amenities` - Get all 35 amenities

---

## 🎨 Next Steps - Screens to Implement

### Authentication Screens:
1. **LoginScreen** - Email/password login
2. **RegisterScreen** - New user registration

### Main Screens:
3. **HomeScreen** - Browse listings with search/filters
4. **ListingDetailScreen** - Full property details
5. **MyListingsScreen** - Host's property management
6. **ProfileScreen** - User profile & settings

### Additional Screens (Future):
- CreateListingScreen
- EditListingScreen
- BookingScreen
- MessagingScreen
- FavoritesScreen

---

## 🧩 Key Components to Build

### Property Listing Card:
```tsx
<ListingCard
  listing={property}
  onPress={() => navigate('ListingDetail', { id: property.id })}
/>
```

### Search Bar with Filters:
```tsx
<SearchBar
  onSearch={handleSearch}
  filters={{ city, priceRange, bedrooms }}
/>
```

### Amenities List:
```tsx
<AmenitiesList amenities={property.amenities} />
```

---

## 🔐 Authentication Flow

### Registration:
```typescript
const { register } = useAuth();
await register({
  email: 'user@example.com',
  password: 'password123',
  first_name: 'John',
  last_name: 'Doe'
});
// User is logged in automatically, token stored
```

### Login:
```typescript
const { login } = useAuth();
await login('user@example.com', 'password123');
// Token stored in AsyncStorage, user redirected to app
```

### Logout:
```typescript
const { logout } = useAuth();
await logout();
// Token cleared, user redirected to login
```

---

## 📦 Dependencies Installed

```json
{
  "@react-navigation/native": "^7.0.14",
  "@react-navigation/native-stack": "^7.1.12",
  "@react-navigation/bottom-tabs": "^7.0.10",
  "@react-native-async-storage/async-storage": "^2.1.0",
  "axios": "^1.7.9",
  "react-native-screens": "^4.4.0",
  "react-native-gesture-handler": "^2.23.0",
  "react-native-vector-icons": "^10.2.0"
}
```

---

## 🐛 Troubleshooting

### iOS Build Issues:
```bash
cd ios
rm -rf Pods
bundle exec pod install
cd ..
npm start --reset-cache
```

### Android Build Issues:
```bash
cd android
./gradlew clean
cd ..
npm start --reset-cache
```

### Metro Bundler Issues:
```bash
npm start --reset-cache
# or
npx react-native start --reset-cache
```

### Clear Cache:
```bash
rm -rf node_modules
rm -rf ios/Pods
rm -rf ios/build
rm -rf android/build
npm install
cd ios && bundle exec pod install && cd ..
```

---

## 📱 Testing with Backend

### 1. Ensure Backend is Running:
```bash
# In another terminal
cd /Users/lallen30/Documents/bluestoneapps/Bluestone\ Apps\ Master\ System
docker ps  # Check multi_app_api is running
```

### 2. Test API Connection:
```bash
curl http://localhost:3000/api/v1/amenities
# Should return 35 amenities
```

### 3. Register Test User:
```bash
curl -X POST http://localhost:3000/api/v1/mobile/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"password123",
    "first_name":"Test",
    "last_name":"User",
    "app_id":28
  }'
```

---

## 🎯 Development Roadmap

### Phase 1 - Authentication ✅ (Complete)
- [x] API client setup
- [x] Auth context
- [x] Token management
- [ ] Login screen UI
- [ ] Register screen UI

### Phase 2 - Browse Listings (Next)
- [ ] Home screen with listing grid
- [ ] Search & filter UI
- [ ] Listing detail screen
- [ ] Image gallery component

### Phase 3 - Host Features
- [ ] Create listing form
- [ ] Edit listing
- [ ] My listings management
- [ ] Publish/unpublish

### Phase 4 - Bookings
- [ ] Booking flow
- [ ] Calendar integration
- [ ] Payment integration

### Phase 5 - Social Features
- [ ] Favorites/Wishlist
- [ ] Reviews & ratings
- [ ] Host messaging

---

## 📚 Resources

**React Native Docs:** https://reactnative.dev/  
**React Navigation:** https://reactnavigation.org/  
**Axios:** https://axios-http.com/  

**Backend API Docs:**
- `/Users/lallen30/Documents/bluestoneapps/Bluestone Apps Master System/PROPERTY_LISTINGS_API_GUIDE.md`
- `/Users/lallen30/Documents/bluestoneapps/Bluestone Apps Master System/PROPERTY_RENTAL_PHASE1_COMPLETE.md`

---

## ✅ Quick Start Checklist

- [x] React Native project initialized
- [x] Dependencies installed
- [x] API client configured
- [x] Authentication context created
- [x] Navigation setup
- [x] TypeScript configured
- [ ] Screen components (in progress)
- [ ] UI styling
- [ ] Test on device
- [ ] Connect to backend

---

## 🎉 What's Working Now

**Backend:**
- ✅ Property listings CRUD API
- ✅ Authentication API
- ✅ 35 amenities available
- ✅ Admin UI at http://localhost:3001/app/28/listings

**Mobile App:**
- ✅ Project structure
- ✅ API integration layer
- ✅ Auth state management
- ✅ Navigation framework
- ⏳ Screen UIs (next step)

---

**Next:** Implement the screen components with UI!
