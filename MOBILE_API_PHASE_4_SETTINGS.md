# Mobile API Phase 4: Settings Management

## Overview
Complete settings management system for mobile applications including general settings, notification preferences, privacy controls, and custom app-specific settings.

**Base URL:** `http://localhost:3000/api/v1/mobile/settings`

**Authentication:** All endpoints require Bearer token authentication

---

## Endpoints

### 1. Get All Settings
Get complete user settings including general, notifications, privacy, and custom settings.

**Endpoint:** `GET /api/v1/mobile/settings`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "success": true,
  "settings": {
    "notifications_enabled": true,
    "email_notifications": true,
    "push_notifications": true,
    "sms_notifications": false,
    "language": "en",
    "theme": "auto",
    "timezone": "UTC",
    "privacy_settings": null,
    "custom_settings": null,
    "updated_at": "2025-11-07T19:30:00.000Z"
  }
}
```

---

### 2. Update General Settings
Update language, theme, and timezone preferences.

**Endpoint:** `PUT /api/v1/mobile/settings`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "language": "es",
  "theme": "dark",
  "timezone": "America/New_York"
}
```

**Supported Values:**
- **language:** Any ISO 639-1 language code (e.g., "en", "es", "fr", "de")
- **theme:** "light", "dark", or "auto"
- **timezone:** Any valid timezone (e.g., "UTC", "America/New_York", "Europe/London")

**Response:**
```json
{
  "success": true,
  "message": "Settings updated successfully",
  "settings": {
    "notifications_enabled": true,
    "email_notifications": true,
    "push_notifications": true,
    "sms_notifications": false,
    "language": "es",
    "theme": "dark",
    "timezone": "America/New_York",
    "privacy_settings": null,
    "custom_settings": null,
    "updated_at": "2025-11-07T19:35:00.000Z"
  }
}
```

---

### 3. Get Notification Preferences
Get user's notification settings.

**Endpoint:** `GET /api/v1/mobile/settings/notifications`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "success": true,
  "notifications": {
    "notifications_enabled": true,
    "email_notifications": true,
    "push_notifications": true,
    "sms_notifications": false
  }
}
```

---

### 4. Update Notification Preferences
Update notification settings for email, push, and SMS.

**Endpoint:** `PUT /api/v1/mobile/settings/notifications`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "notifications_enabled": true,
  "email_notifications": false,
  "push_notifications": true,
  "sms_notifications": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Notification preferences updated successfully",
  "notifications": {
    "notifications_enabled": true,
    "email_notifications": false,
    "push_notifications": true,
    "sms_notifications": false
  }
}
```

---

### 5. Get Privacy Settings
Get user's privacy and visibility settings.

**Endpoint:** `GET /api/v1/mobile/settings/privacy`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "success": true,
  "privacy": {
    "profile_visibility": "public",
    "show_email": false,
    "show_phone": false,
    "show_location": true,
    "show_online_status": true,
    "allow_friend_requests": true,
    "allow_messages": true,
    "show_activity": true,
    "data_sharing": false,
    "personalized_ads": true
  }
}
```

**Privacy Settings Fields:**
- **profile_visibility:** "public", "friends", or "private"
- **show_email:** Show email on profile
- **show_phone:** Show phone number on profile
- **show_location:** Share location with app
- **show_online_status:** Show when user is online
- **allow_friend_requests:** Allow others to send friend requests
- **allow_messages:** Allow messages from other users
- **show_activity:** Show activity status
- **data_sharing:** Allow data sharing with third parties
- **personalized_ads:** Allow personalized advertisements

---

### 6. Update Privacy Settings
Update privacy and visibility preferences.

**Endpoint:** `PUT /api/v1/mobile/settings/privacy`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "profile_visibility": "friends",
  "show_email": false,
  "show_phone": false,
  "show_location": true,
  "show_online_status": false,
  "allow_friend_requests": true,
  "allow_messages": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Privacy settings updated successfully",
  "privacy": {
    "profile_visibility": "friends",
    "show_email": false,
    "show_phone": false,
    "show_location": true,
    "show_online_status": false,
    "allow_friend_requests": true,
    "allow_messages": true
  }
}
```

---

### 7. Get Custom Settings
Get app-specific custom settings.

**Endpoint:** `GET /api/v1/mobile/settings/custom`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "success": true,
  "custom_settings": {
    "auto_play_videos": true,
    "data_saver_mode": false,
    "font_size": "medium",
    "sound_effects": true
  }
}
```

---

### 8. Update Custom Settings
Update app-specific custom settings. You can store any JSON-serializable data.

**Endpoint:** `PUT /api/v1/mobile/settings/custom`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "auto_play_videos": true,
  "data_saver_mode": false,
  "font_size": "medium",
  "sound_effects": true,
  "video_quality": "hd",
  "download_over_wifi_only": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Custom settings updated successfully",
  "custom_settings": {
    "auto_play_videos": true,
    "data_saver_mode": false,
    "font_size": "medium",
    "sound_effects": true,
    "video_quality": "hd",
    "download_over_wifi_only": true
  }
}
```

---

### 9. Reset Settings to Defaults
Reset all settings to their default values.

**Endpoint:** `POST /api/v1/mobile/settings/reset`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "success": true,
  "message": "Settings reset to defaults successfully",
  "settings": {
    "notifications_enabled": true,
    "email_notifications": true,
    "push_notifications": true,
    "sms_notifications": false,
    "language": "en",
    "theme": "auto",
    "timezone": "UTC",
    "privacy_settings": null,
    "custom_settings": null,
    "updated_at": "2025-11-07T19:40:00.000Z"
  }
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "No token provided" | "Invalid token" | "Token expired"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Settings not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Failed to retrieve settings" | "Failed to update settings"
}
```

---

## Testing Examples

### cURL Examples

#### Get All Settings
```bash
curl -X GET http://localhost:3000/api/v1/mobile/settings \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Update General Settings
```bash
curl -X PUT http://localhost:3000/api/v1/mobile/settings \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "language": "es",
    "theme": "dark",
    "timezone": "America/New_York"
  }'
```

#### Update Notification Preferences
```bash
curl -X PUT http://localhost:3000/api/v1/mobile/settings/notifications \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "notifications_enabled": true,
    "email_notifications": false,
    "push_notifications": true,
    "sms_notifications": false
  }'
```

#### Update Privacy Settings
```bash
curl -X PUT http://localhost:3000/api/v1/mobile/settings/privacy \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "profile_visibility": "friends",
    "show_email": false,
    "show_online_status": false
  }'
```

#### Update Custom Settings
```bash
curl -X PUT http://localhost:3000/api/v1/mobile/settings/custom \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "auto_play_videos": true,
    "data_saver_mode": false,
    "font_size": "large"
  }'
```

#### Reset Settings
```bash
curl -X POST http://localhost:3000/api/v1/mobile/settings/reset \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## React Native Example

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:3000/api/v1';

// Get access token
const getToken = async () => {
  return await AsyncStorage.getItem('access_token');
};

// Get all settings
export const getSettings = async () => {
  const token = await getToken();
  const response = await fetch(`${API_URL}/mobile/settings`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return await response.json();
};

// Update general settings
export const updateSettings = async (settings) => {
  const token = await getToken();
  const response = await fetch(`${API_URL}/mobile/settings`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings),
  });
  return await response.json();
};

// Update notification preferences
export const updateNotifications = async (preferences) => {
  const token = await getToken();
  const response = await fetch(`${API_URL}/mobile/settings/notifications`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(preferences),
  });
  return await response.json();
};

// Update privacy settings
export const updatePrivacy = async (privacy) => {
  const token = await getToken();
  const response = await fetch(`${API_URL}/mobile/settings/privacy`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(privacy),
  });
  return await response.json();
};

// Update custom settings
export const updateCustomSettings = async (custom) => {
  const token = await getToken();
  const response = await fetch(`${API_URL}/mobile/settings/custom`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(custom),
  });
  return await response.json();
};

// Reset settings
export const resetSettings = async () => {
  const token = await getToken();
  const response = await fetch(`${API_URL}/mobile/settings/reset`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return await response.json();
};

// Usage in a component
const SettingsScreen = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const result = await getSettings();
    if (result.success) {
      setSettings(result.settings);
    }
  };

  const handleThemeChange = async (theme) => {
    const result = await updateSettings({ theme });
    if (result.success) {
      setSettings(result.settings);
    }
  };

  const handleNotificationToggle = async (enabled) => {
    const result = await updateNotifications({ 
      notifications_enabled: enabled 
    });
    if (result.success) {
      loadSettings(); // Reload all settings
    }
  };

  return (
    <View>
      {/* Your settings UI here */}
    </View>
  );
};
```

---

## Database Schema

The settings are stored in the `user_settings` table:

```sql
CREATE TABLE user_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL UNIQUE,
  notifications_enabled TINYINT(1) DEFAULT 1,
  email_notifications TINYINT(1) DEFAULT 1,
  push_notifications TINYINT(1) DEFAULT 1,
  sms_notifications TINYINT(1) DEFAULT 0,
  language VARCHAR(10) DEFAULT 'en',
  theme ENUM('light', 'dark', 'auto') DEFAULT 'auto',
  timezone VARCHAR(50) DEFAULT 'UTC',
  privacy_settings JSON DEFAULT NULL,
  custom_settings JSON DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE
);
```

---

## Implementation Notes

1. **Default Settings:** When a user registers, default settings are automatically created
2. **Partial Updates:** All update endpoints support partial updates - only send the fields you want to change
3. **JSON Fields:** `privacy_settings` and `custom_settings` are stored as JSON, allowing flexible schema
4. **Cascading Deletes:** Settings are automatically deleted when a user is deleted
5. **Timezone Support:** Use standard IANA timezone identifiers
6. **Theme Support:** "auto" theme respects system preferences

---

## Status

✅ **Phase 4 Complete!**

All settings management endpoints are implemented and tested.

**Next Phase:** Phase 5 - Social Features (Friends, Chat, Activity Feed)
