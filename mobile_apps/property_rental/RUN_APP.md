# 🚀 Quick Start Guide - Run Your App NOW!

**App:** Property Listings (App ID 28)  
**Status:** ✅ READY TO RUN  
**Time to Launch:** 5 minutes

---

## ✅ Prerequisites Check

Before running, ensure you have:
- [x] Node.js 20+ installed
- [x] Xcode (for iOS) or Android Studio (for Android)
- [x] Backend API running on `localhost:3000`
- [x] CocoaPods installed: `sudo gem install cocoapods`

---

## 🎯 Choose Your Platform

### **Option A: Run on iOS** (Recommended for Mac)

```bash
cd /Users/lallen30/Documents/bluestoneapps/Bluestone\ Apps\ Master\ System/mobile_apps/property_listings

# Install iOS dependencies (first time only)
cd ios
bundle install
bundle exec pod install
cd ..

# Run the app
npm run ios
```

**What happens:**
1. Metro bundler starts automatically
2. iOS Simulator launches
3. App builds and installs
4. App opens on simulator

**Troubleshooting:**
- If build fails: `cd ios && rm -rf Pods && pod install && cd ..`
- If simulator doesn't open: Open Xcode → Preferences → Locations → Command Line Tools

---

### **Option B: Run on Android**

```bash
cd /Users/lallen30/Documents/bluestoneapps/Bluestone\ Apps\ Master\ System/mobile_apps/property_listings

# IMPORTANT: Update API URL for Android
# Edit src/api/config.ts and change:
# BASE_URL: 'http://10.0.2.2:3000/api/v1'

# Run the app
npm run android
```

**Requirements:**
- Android Studio installed
- Android emulator running OR physical device connected
- USB debugging enabled (for physical device)

**Troubleshooting:**
- If build fails: `cd android && ./gradlew clean && cd ..`
- If connection error: Verify API URL is `10.0.2.2` not `localhost`

---

## 📱 Test the App - Step by Step

### **1. Launch Screen**
You'll see the login screen with:
- Property Listings logo/title
- Email input
- Password input
- Sign In button
- "Don't have an account?" link

### **2. Register a New User**

**Option A: In the App**
1. Tap "Sign Up"
2. Fill in:
   - First Name: Test
   - Last Name: User
   - Email: test@example.com
   - Password: password123
   - Confirm Password: password123
3. Tap "Create Account"
4. You're automatically logged in!

**Option B: Via API (Quick)**
```bash
curl -X POST http://localhost:3000/api/v1/mobile/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"demo@example.com",
    "password":"demo123",
    "first_name":"Demo",
    "last_name":"User",
    "app_id":28
  }'
```

Then login in the app with: demo@example.com / demo123

### **3. Explore the App**

**Home Tab (Explore):**
- Browse active property listings
- Use search bar to find properties
- Pull down to refresh
- Tap any listing to see details
- Scroll to load more listings

**My Listings Tab:**
- View your own properties
- Publish/unpublish listings
- Delete listings
- See listing status badges
- Pull down to refresh

**Profile Tab:**
- View your account info
- See email verification status
- Access settings menu
- Logout option

### **4. View Property Details**
1. Tap any listing on Home screen
2. See full property information:
   - Photos section
   - Property details (beds, baths, guests)
   - Description
   - Pricing
   - Host information
   - House rules
   - Contact Host button

---

## 🔌 Verify Backend Connection

### **Check API is Running:**
```bash
# Should return 35 amenities
curl http://localhost:3000/api/v1/amenities

# Should return listing data (or empty array)
curl http://localhost:3000/api/v1/apps/28/listings
```

### **Check Docker Containers:**
```bash
docker ps

# You should see:
# - multi_app_api (port 3000)
# - multi_app_mysql (port 3306)
# - admin_portal (port 3001)
```

### **If API is Not Running:**
```bash
cd /Users/lallen30/Documents/bluestoneapps/Bluestone\ Apps\ Master\ System
docker-compose up -d
```

---

## 🎨 What You Should See

### **Login Screen:**
```
┌──────────────────────────┐
│   Property Listings      │
│   Sign in to continue    │
│                          │
│  ┌──────────────────┐    │
│  │ Email            │    │
│  └──────────────────┘    │
│  ┌──────────────────┐    │
│  │ Password         │    │
│  └──────────────────┘    │
│                          │
│  ┌──────────────────┐    │
│  │     Sign In      │    │
│  └──────────────────┘    │
│                          │
│  Don't have an account?  │
│        Sign Up           │
└──────────────────────────┘
```

### **Home Screen (After Login):**
```
┌──────────────────────────┐
│  Explore Properties      │
│  ┌──────────────────┐    │
│  │ 🔍 Search...     │    │
│  └──────────────────┘    │
│                          │
│  ┌──────────────────┐    │
│  │ [Image]          │    │
│  │ Beach House      │    │
│  │ 📍 Miami, USA    │    │
│  │ 🛏️ 2  👥 4       │    │
│  │ $200 / night     │    │
│  └──────────────────┘    │
│  ┌──────────────────┐    │
│  │ [Image]          │    │
│  │ Mountain Cabin   │    │
│  │ ...              │    │
└──────────────────────────┘
 🔍 Explore  🏠 My Listings  👤 Profile
```

---

## 🐛 Common Issues & Quick Fixes

### **Issue: "Network Error" or "Unable to connect"**
**Fix:**
```bash
# iOS: localhost should work
# Android: Change to 10.0.2.2

# Edit src/api/config.ts:
BASE_URL: 'http://10.0.2.2:3000/api/v1'  // Android
BASE_URL: 'http://localhost:3000/api/v1' // iOS
```

### **Issue: "Metro bundler won't start"**
**Fix:**
```bash
npm start --reset-cache
```

### **Issue: "Build failed on iOS"**
**Fix:**
```bash
cd ios
rm -rf Pods Podfile.lock
bundle exec pod install
cd ..
npm run ios
```

### **Issue: "Build failed on Android"**
**Fix:**
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### **Issue: "Cannot find module"**
**Fix:**
```bash
rm -rf node_modules
npm install
```

---

## 📊 Expected Behavior

### **On First Launch:**
1. ✅ See login screen
2. ✅ Can tap "Sign Up" to register
3. ✅ Can enter credentials and login
4. ✅ After login, see home screen with listings

### **After Login:**
1. ✅ Home tab shows active listings (or empty state)
2. ✅ Can search listings
3. ✅ Can tap listing to see details
4. ✅ My Listings shows user's properties
5. ✅ Profile shows user information
6. ✅ Can logout

### **Navigation:**
1. ✅ Bottom tabs work (Explore, My Listings, Profile)
2. ✅ Can navigate to listing details
3. ✅ Back button works
4. ✅ Logout returns to login screen

---

## ⚡ Quick Test Sequence

**Complete this in 3 minutes:**

1. **Start the app** (`npm run ios` or `npm run android`)
2. **Register** a test user (or use existing)
3. **Login** with credentials
4. **Browse** listings on Home tab
5. **Tap** a listing to see details
6. **Go to** My Listings tab
7. **Check** Profile tab
8. **Logout** to test

✅ If all steps work, your app is fully functional!

---

## 🎯 Success Checklist

After running the app, verify:

- [ ] App launches without errors
- [ ] Login screen displays correctly
- [ ] Can register new user
- [ ] Can login existing user
- [ ] Home screen shows listings (or empty state)
- [ ] Can search listings
- [ ] Can view listing details
- [ ] My Listings tab works
- [ ] Profile tab displays user info
- [ ] Can logout successfully
- [ ] Navigation between tabs works
- [ ] Pull to refresh works
- [ ] No console errors

---

## 📱 Next Steps After Testing

### **If Everything Works:**
1. ✅ Create test listings via admin portal
2. ✅ Test with multiple users
3. ✅ Test all features thoroughly
4. ✅ Consider UI/UX improvements
5. ✅ Plan next features (bookings, favorites, etc.)

### **If Issues Occur:**
1. Check backend API is running
2. Verify API URL configuration
3. Check console logs for errors
4. Review error messages
5. Consult troubleshooting section above

---

## 🚀 You're Ready!

**Run this command NOW:**

```bash
cd /Users/lallen30/Documents/bluestoneapps/Bluestone\ Apps\ Master\ System/mobile_apps/property_listings && npm run ios
```

**Your Property Rental App will launch in ~30 seconds!** 🎉

---

## 📞 Quick Reference

**Project Location:**
```
/Users/lallen30/Documents/bluestoneapps/Bluestone Apps Master System/mobile_apps/property_listings
```

**Run Commands:**
- `npm run ios` - iOS simulator
- `npm run android` - Android emulator
- `npm start` - Metro bundler only

**API:**
- Backend: http://localhost:3000/api/v1
- Admin: http://localhost:3001/app/28

**Documentation:**
- `APP_COMPLETE.md` - Full feature list
- `SETUP.md` - Detailed setup guide
- This file - Quick start instructions

---

**LAUNCH YOUR APP NOW!** 🚀📱✨
