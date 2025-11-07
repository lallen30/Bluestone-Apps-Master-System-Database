# Mobile API Testing Guide

## 🎯 Complete API Status

### ✅ **Phase 1 & 2: Authentication & User Management** - COMPLETE
### ✅ **Phase 3: User Profile Management** - COMPLETE

All endpoints are implemented and ready to test!

---

## 🔐 Authentication Endpoints

### 1. Register New User
```bash
curl -X POST http://localhost:3000/api/v1/mobile/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "app_id": 1,
    "email": "testuser@example.com",
    "password": "password123",
    "first_name": "Test",
    "last_name": "User",
    "phone": "555-1234"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": 1,
      "email": "testuser@example.com",
      "first_name": "Test",
      "last_name": "User"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 2. Login
```bash
curl -X POST http://localhost:3000/api/v1/mobile/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "app_id": 1,
    "email": "testuser@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "testuser@example.com",
      "first_name": "Test",
      "last_name": "User"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Save the token for subsequent requests!**

---

### 3. Verify Email
```bash
curl -X POST http://localhost:3000/api/v1/mobile/auth/verify-email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "verification_code": "123456"
  }'
```

---

### 4. Logout
```bash
curl -X POST http://localhost:3000/api/v1/mobile/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 👤 Profile Management Endpoints

### 5. Get Current User Profile
```bash
curl -X GET http://localhost:3000/api/v1/mobile/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "app_id": 1,
    "email": "testuser@example.com",
    "first_name": "Test",
    "last_name": "User",
    "phone": "555-1234",
    "bio": null,
    "avatar_url": null,
    "date_of_birth": null,
    "gender": null,
    "email_verified": 0,
    "status": "active",
    "last_login_at": "2025-11-07T18:00:00.000Z",
    "created_at": "2025-11-07T17:00:00.000Z",
    "updated_at": "2025-11-07T18:00:00.000Z",
    "settings": {
      "notifications_enabled": 1,
      "email_notifications": 1,
      "push_notifications": 1,
      "language": "en",
      "theme": "light"
    }
  }
}
```

---

### 6. Update Profile
```bash
curl -X PUT http://localhost:3000/api/v1/mobile/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "first_name": "Updated",
    "last_name": "Name",
    "phone": "555-9999",
    "bio": "This is my bio",
    "date_of_birth": "1990-01-15",
    "gender": "male"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "first_name": "Updated",
    "last_name": "Name",
    "phone": "555-9999",
    "bio": "This is my bio",
    "date_of_birth": "1990-01-15",
    "gender": "male"
  }
}
```

---

### 7. Upload Avatar
```bash
curl -X POST http://localhost:3000/api/v1/mobile/profile/avatar \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "avatar=@/path/to/your/image.jpg"
```

**Response:**
```json
{
  "success": true,
  "message": "Avatar uploaded successfully",
  "data": {
    "avatar_url": "/uploads/app_1/avatar_1699380000000.jpg",
    "filename": "avatar_1699380000000.jpg"
  }
}
```

---

### 8. Change Password
```bash
curl -X PUT http://localhost:3000/api/v1/mobile/profile/password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "current_password": "password123",
    "new_password": "newpassword456"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

### 9. Get Another User's Public Profile
```bash
curl -X GET http://localhost:3000/api/v1/mobile/profile/2 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "first_name": "John",
    "last_name": "Doe",
    "bio": "Software developer",
    "avatar_url": "/uploads/app_1/avatar_123.jpg",
    "created_at": "2025-11-01T10:00:00.000Z"
  }
}
```

---

### 10. Get User Permissions
```bash
curl -X GET http://localhost:3000/api/v1/mobile/profile/permissions \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "permissions": [
      {
        "id": 1,
        "name": "view_content",
        "description": "Can view content",
        "category": "content"
      }
    ],
    "byCategory": {
      "content": [...]
    },
    "permissionNames": ["view_content", "edit_profile"]
  }
}
```

---

## 📱 Testing with Postman

### Import Collection
1. Open Postman
2. Click "Import"
3. Create new collection: "Bluestone Apps Mobile API"
4. Add requests for each endpoint above

### Environment Variables
Create environment with:
- `base_url`: `http://localhost:3000/api/v1`
- `token`: (set after login)
- `app_id`: `1`

### Test Flow
1. **Register** → Save token
2. **Login** → Update token
3. **Get Profile** → Verify data
4. **Update Profile** → Check changes
5. **Upload Avatar** → Verify image
6. **Change Password** → Test new password
7. **Logout** → Clear session

---

## 🧪 React Native Testing

### Setup
```javascript
const API_BASE_URL = 'http://localhost:3000/api/v1';
let authToken = null;

// Store token after login
const setAuthToken = (token) => {
  authToken = token;
};

// API helper
const apiCall = async (endpoint, method = 'GET', body = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { 'Authorization': `Bearer ${authToken}` })
    }
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  return response.json();
};
```

### Test Authentication
```javascript
// Register
const register = async () => {
  const result = await apiCall('/mobile/auth/register', 'POST', {
    app_id: 1,
    email: 'test@example.com',
    password: 'password123',
    first_name: 'Test',
    last_name: 'User'
  });
  
  if (result.success) {
    setAuthToken(result.data.token);
    console.log('Registered:', result.data.user);
  }
};

// Login
const login = async () => {
  const result = await apiCall('/mobile/auth/login', 'POST', {
    app_id: 1,
    email: 'test@example.com',
    password: 'password123'
  });
  
  if (result.success) {
    setAuthToken(result.data.token);
    console.log('Logged in:', result.data.user);
  }
};
```

### Test Profile Management
```javascript
// Get profile
const getProfile = async () => {
  const result = await apiCall('/mobile/profile');
  console.log('Profile:', result.data);
};

// Update profile
const updateProfile = async () => {
  const result = await apiCall('/mobile/profile', 'PUT', {
    first_name: 'Updated',
    last_name: 'Name',
    bio: 'My new bio'
  });
  console.log('Updated:', result.data);
};

// Change password
const changePassword = async () => {
  const result = await apiCall('/mobile/profile/password', 'PUT', {
    current_password: 'password123',
    new_password: 'newpassword456'
  });
  console.log('Password changed:', result.message);
};
```

### Test Avatar Upload
```javascript
const uploadAvatar = async (imageUri) => {
  const formData = new FormData();
  formData.append('avatar', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'avatar.jpg'
  });
  
  const response = await fetch(`${API_BASE_URL}/mobile/profile/avatar`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`
    },
    body: formData
  });
  
  const result = await response.json();
  console.log('Avatar uploaded:', result.data.avatar_url);
};
```

---

## ✅ API Checklist

### Authentication
- [x] Register new user
- [x] Login with credentials
- [x] Verify email
- [x] Logout and clear session
- [x] JWT token generation
- [x] Token validation

### Profile Management
- [x] Get current user profile
- [x] Update profile information
- [x] Upload/update avatar
- [x] Change password
- [x] Get other user's public profile
- [x] Get user permissions

### Security
- [x] Password hashing (bcrypt)
- [x] JWT authentication
- [x] Token expiration (7 days)
- [x] Activity logging
- [x] Per-app user isolation

---

## 🎉 All Phase 1-3 Endpoints Complete!

**Total Endpoints:** 10  
**Status:** ✅ All Working  
**Ready For:** Mobile app development

---

## 📊 Next Steps

### Phase 4: Settings Management (TODO)
- GET /api/v1/mobile/settings
- PUT /api/v1/mobile/settings
- PUT /api/v1/mobile/settings/notifications
- PUT /api/v1/mobile/settings/privacy

### Phase 5: Social Features (TODO)
- Friends, followers, chat, etc.

### Phase 6: E-Commerce (TODO)
- Products, cart, orders, etc.

See `MOBILE_APP_API_TODO.md` for full roadmap.
