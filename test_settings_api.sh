#!/bin/bash

# Mobile Settings API Test Script
# Tests all Phase 4 Settings Management endpoints

API_URL="http://localhost:3000/api/v1"
APP_ID=1
TEST_EMAIL="settingstest@example.com"
TEST_PASSWORD="password123"

echo "================================"
echo "Mobile Settings API Test"
echo "================================"
echo ""

# Step 1: Register a test user
echo "1. Registering test user..."
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/mobile/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"app_id\": $APP_ID,
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\",
    \"first_name\": \"Settings\",
    \"last_name\": \"Test\"
  }")

echo "$REGISTER_RESPONSE" | jq '.'
echo ""

# Extract token from registration (user is auto-logged in)
TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.data.tokens.access_token')

# If registration failed (user exists), login instead
if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo "User exists, logging in..."
  LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/mobile/auth/login" \
    -H "Content-Type: application/json" \
    -d "{
      \"app_id\": $APP_ID,
      \"email\": \"$TEST_EMAIL\",
      \"password\": \"$TEST_PASSWORD\"
    }")
  
  TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.tokens.access_token')
fi
echo "Access Token: $TOKEN"
echo ""

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo "❌ Failed to get access token. Exiting."
  exit 1
fi

# Step 3: Get all settings
echo "3. Getting all settings..."
curl -s -X GET "$API_URL/mobile/settings" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# Step 4: Update general settings
echo "4. Updating general settings (language, theme, timezone)..."
curl -s -X PUT "$API_URL/mobile/settings" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "language": "es",
    "theme": "dark",
    "timezone": "America/New_York"
  }' | jq '.'
echo ""

# Step 5: Get notification preferences
echo "5. Getting notification preferences..."
curl -s -X GET "$API_URL/mobile/settings/notifications" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# Step 6: Update notification preferences
echo "6. Updating notification preferences..."
curl -s -X PUT "$API_URL/mobile/settings/notifications" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "notifications_enabled": true,
    "email_notifications": false,
    "push_notifications": true,
    "sms_notifications": false
  }' | jq '.'
echo ""

# Step 7: Get privacy settings
echo "7. Getting privacy settings..."
curl -s -X GET "$API_URL/mobile/settings/privacy" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# Step 8: Update privacy settings
echo "8. Updating privacy settings..."
curl -s -X PUT "$API_URL/mobile/settings/privacy" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "profile_visibility": "friends",
    "show_email": false,
    "show_phone": false,
    "show_location": true,
    "show_online_status": false,
    "allow_friend_requests": true,
    "allow_messages": true
  }' | jq '.'
echo ""

# Step 9: Get custom settings
echo "9. Getting custom settings..."
curl -s -X GET "$API_URL/mobile/settings/custom" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# Step 10: Update custom settings
echo "10. Updating custom settings..."
curl -s -X PUT "$API_URL/mobile/settings/custom" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "auto_play_videos": true,
    "data_saver_mode": false,
    "font_size": "medium",
    "sound_effects": true
  }' | jq '.'
echo ""

# Step 11: Get all settings again to verify
echo "11. Getting all settings to verify updates..."
curl -s -X GET "$API_URL/mobile/settings" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# Step 12: Reset settings to defaults
echo "12. Resetting settings to defaults..."
curl -s -X POST "$API_URL/mobile/settings/reset" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# Step 13: Get settings after reset
echo "13. Getting settings after reset..."
curl -s -X GET "$API_URL/mobile/settings" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

echo "================================"
echo "✅ All tests completed!"
echo "================================"
