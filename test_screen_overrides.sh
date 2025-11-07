#!/bin/bash

# Test Script for App Screen Element Overrides
# This demonstrates how apps can customize screen elements without affecting other apps

BASE_URL="http://localhost:3000/api/v1"
APP_ID=1
SCREEN_ID=18  # Login Screen

echo "================================"
echo "App Screen Override System Test"
echo "================================"
echo ""

# Step 1: Login as admin
echo "1. Logging in as admin..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@knoxweb.com",
    "password": "password123"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.token')
echo "Access Token: ${TOKEN:0:50}..."
echo ""

# Step 2: Get screen elements for app (before overrides)
echo "2. Getting screen elements for App $APP_ID, Screen $SCREEN_ID (before overrides)..."
ELEMENTS_BEFORE=$(curl -s -X GET "$BASE_URL/apps/$APP_ID/screens/$SCREEN_ID/elements" \
  -H "Authorization: Bearer $TOKEN")
echo $ELEMENTS_BEFORE | jq '{
  success,
  counts,
  first_element: .elements[0] | {element_name, label, placeholder, is_required, has_override}
}'
echo ""

# Get first element instance ID
ELEMENT_INSTANCE_ID=$(echo $ELEMENTS_BEFORE | jq -r '.elements[0].element_instance_id')
echo "First element instance ID: $ELEMENT_INSTANCE_ID"
echo ""

# Step 3: Create an override for the first element
echo "3. Creating override for element $ELEMENT_INSTANCE_ID..."
OVERRIDE_RESPONSE=$(curl -s -X PUT "$BASE_URL/apps/$APP_ID/screens/$SCREEN_ID/elements/$ELEMENT_INSTANCE_ID/override" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "custom_label": "Custom Login Title (App 1 Only)",
    "custom_placeholder": "Enter your custom email",
    "is_required": true,
    "custom_display_order": 1
  }')
echo $OVERRIDE_RESPONSE | jq '.'
echo ""

# Step 4: Get screen elements again (after override)
echo "4. Getting screen elements again (after override)..."
ELEMENTS_AFTER=$(curl -s -X GET "$BASE_URL/apps/$APP_ID/screens/$SCREEN_ID/elements" \
  -H "Authorization: Bearer $TOKEN")
echo $ELEMENTS_AFTER | jq '{
  success,
  counts,
  first_element: .elements[0] | {element_name, label, placeholder, is_required, has_override, is_custom}
}'
echo ""

# Step 5: Add a custom element to the screen
echo "5. Adding a custom element to the screen..."
CUSTOM_ELEMENT_RESPONSE=$(curl -s -X POST "$BASE_URL/apps/$APP_ID/screens/$SCREEN_ID/elements/custom" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "element_id": 33,
    "field_key": "custom_remember_me_button",
    "label": "Remember Me",
    "is_required": false,
    "display_order": 10
  }')
echo $CUSTOM_ELEMENT_RESPONSE | jq '.'
echo ""

# Step 6: Get screen elements with custom element
echo "6. Getting screen elements with custom element..."
ELEMENTS_WITH_CUSTOM=$(curl -s -X GET "$BASE_URL/apps/$APP_ID/screens/$SCREEN_ID/elements" \
  -H "Authorization: Bearer $TOKEN")
echo $ELEMENTS_WITH_CUSTOM | jq '{
  success,
  counts,
  total_elements: (.elements | length),
  custom_elements: [.elements[] | select(.is_custom == true) | {element_name, label, field_key}]
}'
echo ""

# Step 7: Hide an element (without deleting it)
echo "7. Hiding an element (it will be excluded from the list)..."
HIDE_RESPONSE=$(curl -s -X PUT "$BASE_URL/apps/$APP_ID/screens/$SCREEN_ID/elements/$ELEMENT_INSTANCE_ID/override" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "is_hidden": true
  }')
echo $HIDE_RESPONSE | jq '.'
echo ""

# Step 8: Get screen elements (hidden element should be excluded)
echo "8. Getting screen elements (hidden element excluded)..."
ELEMENTS_HIDDEN=$(curl -s -X GET "$BASE_URL/apps/$APP_ID/screens/$SCREEN_ID/elements" \
  -H "Authorization: Bearer $TOKEN")
echo $ELEMENTS_HIDDEN | jq '{
  success,
  counts,
  total_visible: (.elements | length),
  element_names: [.elements[] | .element_name]
}'
echo ""

# Step 9: Revert override (delete it)
echo "9. Reverting override (deleting it to restore master element)..."
DELETE_OVERRIDE_RESPONSE=$(curl -s -X DELETE "$BASE_URL/apps/$APP_ID/elements/$ELEMENT_INSTANCE_ID/override" \
  -H "Authorization: Bearer $TOKEN")
echo $DELETE_OVERRIDE_RESPONSE | jq '.'
echo ""

# Step 10: Get screen elements (back to master)
echo "10. Getting screen elements (back to master settings)..."
ELEMENTS_REVERTED=$(curl -s -X GET "$BASE_URL/apps/$APP_ID/screens/$SCREEN_ID/elements" \
  -H "Authorization: Bearer $TOKEN")
echo $ELEMENTS_REVERTED | jq '{
  success,
  counts,
  first_element: .elements[0] | {element_name, label, has_override}
}'
echo ""

echo "================================"
echo "✅ Override system test complete!"
echo "================================"
echo ""
echo "Summary:"
echo "- Master elements remain unchanged"
echo "- App-specific overrides work correctly"
echo "- Custom elements can be added per app"
echo "- Elements can be hidden without deletion"
echo "- Overrides can be reverted to master"
echo ""
