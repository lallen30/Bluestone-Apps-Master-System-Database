# White-Label App Cloning Guide

This guide explains how to create a new white-label app from the Property Rental template.

## Overview

The white-label app factory consists of two parts:
1. **Backend Cloning** - Creates a new app in the database with all screens, users, and data
2. **Mobile App Cloning** - Creates a new React Native project configured for the new app

## Prerequisites

- Node.js 18+
- React Native development environment set up
- Access to the admin portal
- API server running

## Step 1: Create Backend App

First, create the new app in the admin portal using the API:

```bash
# Login to get auth token
TOKEN=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@knoxweb.com", "password": "admin123"}' \
  | jq -r '.data.token')

# Create new app from template
curl -X POST http://localhost:3000/api/v1/app-templates/create-from-template \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "template_id": 9,
    "app_name": "Your App Name",
    "source_app_id": 28,
    "created_by": 1
  }'
```

This will return the new app ID:
```json
{
  "success": true,
  "data": {
    "app_id": 39,
    "app_name": "Your App Name",
    "stats": {
      "screens": 50,
      "roles": 3,
      "propertyListings": 11,
      ...
    }
  }
}
```

**Note the `app_id`** - you'll need it for the mobile app.

## Step 2: Clone Mobile App

Use the clone script to create a new mobile app project:

```bash
cd mobile_apps/property_rental

# Run the clone script
./scripts/clone-app.sh "Your App Name" 39

# Or specify a custom target directory
./scripts/clone-app.sh "Your App Name" 39 ~/projects/your-app-name
```

The script will:
1. Copy all project files to a new directory
2. Update package.json with new name
3. Update app.json with new display name
4. Create .env file with correct APP_ID
5. Update iOS and Android display names
6. Initialize a new git repository

## Step 3: Configure the New App

### Update API URL (if needed)

Edit `.env` in your new project:

```env
API_BASE_URL=https://your-api-server.com/api/v1
SERVER_URL=https://your-api-server.com
```

### Install Dependencies

```bash
cd ~/projects/your-app-name
npm install

# iOS only
cd ios && pod install && cd ..
```

### Run the App

```bash
# iOS
npm run ios

# Android
npm run android
```

## Step 4: Full Native Renaming (Optional)

For production apps, you'll want to fully rename the native projects:

```bash
# Install react-native-rename
npm install -g react-native-rename

# Rename the app
npx react-native-rename "Your App Name" -b com.yourcompany.yourappname
```

This updates:
- iOS bundle identifier
- Android package name
- All native project references

## Step 5: App Store Preparation

### Required Assets

| Asset | iOS Size | Android Size |
|-------|----------|--------------|
| App Icon | 1024x1024 | 512x512 |
| Splash Screen | 2732x2732 | 1920x1920 |
| Feature Graphic | - | 1024x500 |

### iOS Specific
1. Create App Store Connect listing
2. Generate signing certificates
3. Configure provisioning profiles
4. Update `ios/PropertyListings.xcodeproj` with your team ID

### Android Specific
1. Create Google Play Console listing
2. Generate signing keystore
3. Configure `android/app/build.gradle` with signing config
4. Update `android/app/google-services.json` if using Firebase

## What Gets Cloned

### Backend (via API)
| Data | Cloned |
|------|--------|
| App configuration | ✅ |
| Screens (50) | ✅ |
| Roles (3) | ✅ |
| Role-screen permissions | ✅ |
| Menus (4) | ✅ |
| Menu items (33) | ✅ |
| Admin permissions | ✅ |
| App users | ✅ |
| User role assignments | ✅ |
| Property listings | ✅ |
| Property images | ✅ |
| Element overrides | ✅ |
| Custom elements | ✅ |
| Screen content | ✅ |

### Mobile App (via script)
| File | Updated |
|------|---------|
| package.json | ✅ name |
| app.json | ✅ name, displayName |
| .env | ✅ APP_ID, APP_NAME |
| app.config.ts | ✅ defaults |
| Info.plist | ✅ CFBundleDisplayName |
| strings.xml | ✅ app_name |

## Troubleshooting

### App shows wrong data
- Verify APP_ID in `.env` matches the backend app ID
- Clear app cache and restart

### Build fails after cloning
- Run `npm install` again
- For iOS: `cd ios && pod install`
- Clean build: `npm run clean` or delete `ios/build` and `android/build`

### Native module errors
- After renaming, you may need to re-link native modules
- Try: `npx react-native-clean-project`

## Support

For issues with:
- **Backend cloning**: Check `multi_site_manager/src/controllers/appTemplatesController.js`
- **Mobile app**: Check `src/config/app.config.ts`
- **Admin portal**: Check `admin_portal/components/layouts/AppLayout.tsx`
