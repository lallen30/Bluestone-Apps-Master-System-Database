# Postman Collection Guide

## Overview
The Postman collection includes all API endpoints for both the Admin Portal and Mobile API.

**Collection File:** `multi_site_manager/postman_collection.json`

---

## How to Import

1. Open Postman
2. Click **Import** button
3. Select the `postman_collection.json` file
4. Collection will be imported with all endpoints

---

## Collection Variables

The collection uses variables for easy testing:

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `base_url` | `http://localhost:3000/api/v1` | API base URL |
| `token` | (empty) | Admin portal auth token |
| `mobile_token` | (empty) | Mobile API auth token |
| `app_id` | `1` | App ID for mobile testing |

**Note:** Tokens are automatically saved after successful login/register.

---

## API Sections

### 1. Authentication (Admin Portal)
**3 endpoints** - Admin user authentication
- Login (auto-saves token)
- Get Profile
- Change Password

### 2. Users (Admin Portal)
**5 endpoints** - Admin user management
- Get All Users
- Get User by ID
- Create User
- Update User
- Delete User

### 3. Apps (Admin Portal)
**7 endpoints** - Application management
- Get All Apps
- Get App by ID
- Create App
- Update App
- Delete App
- Get App Settings
- Update App Settings

### 4. Permissions (Admin Portal)
**5 endpoints** - User permissions management
- Assign User to App
- Update User Permissions
- Remove User from App
- Get User Permissions
- Get App Users

### 5. Mobile API - Authentication
**4 endpoints** - Mobile user authentication
- Register (auto-saves mobile_token)
- Login (auto-saves mobile_token)
- Verify Email
- Logout

### 6. Mobile API - Profile
**6 endpoints** - User profile management
- Get My Profile
- Update Profile
- Upload Avatar (file upload)
- Change Password
- Get User Profile (Public)
- Get Permissions

### 7. Mobile API - Settings
**9 endpoints** - User settings management
- Get All Settings
- Update General Settings (language, theme, timezone)
- Get Notification Preferences
- Update Notification Preferences
- Get Privacy Settings
- Update Privacy Settings
- Get Custom Settings
- Update Custom Settings
- Reset Settings to Defaults

---

## Testing Workflow

### Admin Portal Testing

1. **Login as Admin**
   ```
   POST /auth/login
   Body: { "email": "master@example.com", "password": "password123" }
   ```
   Token is automatically saved to `{{token}}` variable

2. **Test Other Endpoints**
   All subsequent requests use `{{token}}` for authentication

### Mobile API Testing

1. **Register New User**
   ```
   POST /mobile/auth/register
   Body: {
     "app_id": 1,
     "email": "testuser@example.com",
     "password": "password123",
     "first_name": "Test",
     "last_name": "User"
   }
   ```
   Mobile token is automatically saved to `{{mobile_token}}` variable

2. **Or Login Existing User**
   ```
   POST /mobile/auth/login
   Body: {
     "app_id": 1,
     "email": "testuser@example.com",
     "password": "password123"
   }
   ```

3. **Test Profile Endpoints**
   - Get/Update Profile
   - Upload Avatar
   - Change Password

4. **Test Settings Endpoints**
   - Update general settings
   - Configure notifications
   - Set privacy preferences
   - Add custom settings

---

## Example Test Sequences

### Complete Mobile User Flow

1. **Register** → `POST /mobile/auth/register`
2. **Get Profile** → `GET /mobile/profile`
3. **Update Profile** → `PUT /mobile/profile`
4. **Get Settings** → `GET /mobile/settings`
5. **Update Notifications** → `PUT /mobile/settings/notifications`
6. **Update Privacy** → `PUT /mobile/settings/privacy`
7. **Add Custom Settings** → `PUT /mobile/settings/custom`
8. **Logout** → `POST /mobile/auth/logout`

### Admin Management Flow

1. **Login** → `POST /auth/login`
2. **Get All Apps** → `GET /apps`
3. **Create New App** → `POST /apps`
4. **Assign User to App** → `POST /permissions`
5. **Update Permissions** → `PUT /permissions/{userId}/{appId}`

---

## Tips

### Auto-Save Tokens
Both admin and mobile login endpoints have test scripts that automatically save tokens:
- Admin login saves to `{{token}}`
- Mobile register/login saves to `{{mobile_token}}`

### Testing Multiple Apps
Change the `app_id` variable to test different apps:
```
Right-click collection → Edit → Variables → Change app_id value
```

### File Uploads
For avatar upload endpoint:
1. Select the request
2. Go to Body tab
3. Click "Select File" for the avatar field
4. Choose an image file

### Environment Variables
You can create different environments (dev, staging, production) with different `base_url` values.

---

## Troubleshooting

### 401 Unauthorized
- Token expired or invalid
- Re-run login/register to get a fresh token

### 404 Not Found
- Check the `base_url` variable
- Ensure API server is running on port 3000

### 500 Internal Server Error
- Check API server logs
- Verify database connection

---

## API Documentation

For detailed API documentation, see:
- **Mobile Auth & Profile:** `MOBILE_API.md`
- **Mobile Settings:** `MOBILE_API_PHASE_4_SETTINGS.md`
- **API Testing:** `API_TESTING_GUIDE.md`

---

## Total Endpoints

| Category | Endpoints |
|----------|-----------|
| Admin Authentication | 3 |
| Admin Users | 5 |
| Admin Apps | 7 |
| Admin Permissions | 5 |
| Mobile Authentication | 4 |
| Mobile Profile | 6 |
| Mobile Settings | 9 |
| **Total** | **39** |

---

## Updates

**Latest:** Nov 7, 2025
- Added Mobile API - Settings (9 endpoints)
- Added Mobile API - Profile (6 endpoints)
- Added Mobile API - Authentication (4 endpoints)
- Auto-save tokens on login/register
- Added mobile_token and app_id variables
