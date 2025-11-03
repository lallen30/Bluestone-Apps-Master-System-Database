# Mobile API Documentation

## Overview
This API provides endpoints for mobile applications (React Native, Flutter, etc.) to fetch screen configurations and content dynamically.

## Base URL
```
http://localhost:3000/api/v1/mobile
```

## Authentication
All endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints

### 1. Get All Screens for an App

Fetches all active screens assigned to a specific app.

**Endpoint:** `GET /apps/:app_id/screens`

**Parameters:**
- `app_id` (path) - The ID of the app

**Response:**
```json
{
  "success": true,
  "data": {
    "app_id": 2,
    "screens": [
      {
        "id": 1,
        "name": "About Us",
        "screen_key": "about_us",
        "description": "Information about our company",
        "icon": "Users",
        "category": "Information",
        "display_order": 1,
        "assigned_active": 1,
        "element_count": 3
      }
    ],
    "total": 1
  }
}
```

**Usage Example (React Native):**
```javascript
const response = await fetch('http://localhost:3000/api/v1/mobile/apps/2/screens', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

---

### 2. Get Screen Content with Elements

Fetches a specific screen with all its elements and content.

**Endpoint:** `GET /apps/:app_id/screens/:screen_id`

**Parameters:**
- `app_id` (path) - The ID of the app
- `screen_id` (path) - The ID of the screen

**Response:**
```json
{
  "success": true,
  "data": {
    "screen": {
      "id": 1,
      "name": "About Us",
      "screen_key": "about_us",
      "description": "Information about our company",
      "icon": "Users",
      "category": "Information",
      "display_order": 1
    },
    "elements": [
      {
        "id": 1,
        "element_id": 5,
        "type": "heading",
        "field_key": "page_title",
        "label": "Page Title",
        "value": "Welcome to Our Company",
        "placeholder": "",
        "is_required": false,
        "is_readonly": false,
        "is_input": false,
        "display_order": 1,
        "config": {},
        "options": null
      },
      {
        "id": 2,
        "element_id": 7,
        "type": "paragraph",
        "field_key": "company_description",
        "label": "Company Description",
        "value": "We are a leading provider of innovative solutions...",
        "placeholder": "",
        "is_required": false,
        "is_readonly": false,
        "is_input": false,
        "display_order": 2,
        "config": {},
        "options": null
      }
    ],
    "total_elements": 2
  }
}
```

**Usage Example (React Native):**
```javascript
const response = await fetch('http://localhost:3000/api/v1/mobile/apps/2/screens/1', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

---

### 3. Get Screen by Key

Fetches a screen using its unique key instead of ID.

**Endpoint:** `GET /apps/:app_id/screens/key/:screen_key`

**Parameters:**
- `app_id` (path) - The ID of the app
- `screen_key` (path) - The unique key of the screen (e.g., "about_us")

**Response:**
Same as endpoint #2 (Get Screen Content with Elements)

**Usage Example (React Native):**
```javascript
const response = await fetch('http://localhost:3000/api/v1/mobile/apps/2/screens/key/about_us', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

---

## Element Types

The API returns different element types that you can render in your mobile app:

| Type | Description | Render As | Has Options |
|------|-------------|-----------|-------------|
| `heading` | Page/section heading | Text (large, bold) | No |
| `paragraph` | Text content | Text (normal) | No |
| `text_field` | Single-line input | TextInput | No |
| `text_area` | Multi-line input | TextInput (multiline) | No |
| `rich_text_display` | Formatted HTML content | WebView/HTML renderer | No |
| `rich_text_editor` | Rich text input | Rich text editor | No |
| `dropdown` | Select dropdown | Picker/Select | Yes |
| `radio_button` | Radio button group | Radio buttons | Yes |
| `checkbox` | Single checkbox | Checkbox | No |
| `button` | Action button | Button/TouchableOpacity | No |
| `image` | Image display | Image component | No |

---

## React Native Example

Here's a complete example of rendering a screen in React Native:

```javascript
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const DynamicScreen = ({ appId, screenId, token }) => {
  const [screenData, setScreenData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScreen();
  }, []);

  const fetchScreen = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/mobile/apps/${appId}/screens/${screenId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      const data = await response.json();
      setScreenData(data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching screen:', error);
      setLoading(false);
    }
  };

  const renderElement = (element) => {
    switch (element.type) {
      case 'heading':
        return (
          <Text key={element.id} style={styles.heading}>
            {element.value}
          </Text>
        );
      
      case 'paragraph':
        return (
          <Text key={element.id} style={styles.paragraph}>
            {element.value}
          </Text>
        );
      
      case 'text_field':
        return (
          <View key={element.id} style={styles.inputContainer}>
            <Text style={styles.label}>{element.label}</Text>
            <TextInput
              style={styles.input}
              placeholder={element.placeholder}
              defaultValue={element.value}
              editable={!element.is_readonly}
            />
          </View>
        );
      
      case 'text_area':
        return (
          <View key={element.id} style={styles.inputContainer}>
            <Text style={styles.label}>{element.label}</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder={element.placeholder}
              defaultValue={element.value}
              multiline
              numberOfLines={4}
              editable={!element.is_readonly}
            />
          </View>
        );
      
      case 'dropdown':
        return (
          <View key={element.id} style={styles.inputContainer}>
            <Text style={styles.label}>{element.label}</Text>
            <Picker
              selectedValue={element.value}
              onValueChange={(value) => console.log('Selected:', value)}
              enabled={!element.is_readonly}
              style={styles.picker}
            >
              <Picker.Item label={element.placeholder || 'Select...'} value="" />
              {element.config?.options?.map((option, idx) => (
                <Picker.Item 
                  key={idx} 
                  label={option.label} 
                  value={option.value} 
                />
              ))}
            </Picker>
          </View>
        );
      
      case 'radio_button':
        return (
          <View key={element.id} style={styles.inputContainer}>
            <Text style={styles.label}>{element.label}</Text>
            {element.config?.options?.map((option, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.radioOption}
                onPress={() => console.log('Selected:', option.value)}
                disabled={element.is_readonly}
              >
                <View style={styles.radioCircle}>
                  {element.value === option.value && (
                    <View style={styles.radioSelected} />
                  )}
                </View>
                <Text style={styles.radioLabel}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      
      case 'checkbox':
        return (
          <View key={element.id} style={styles.checkboxContainer}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => console.log('Toggled')}
              disabled={element.is_readonly}
            >
              <View style={[styles.checkboxBox, element.value && styles.checkboxChecked]}>
                {element.value && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>{element.label}</Text>
            </TouchableOpacity>
          </View>
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.screenTitle}>{screenData.screen.name}</Text>
      {screenData.screen.description && (
        <Text style={styles.screenDescription}>
          {screenData.screen.description}
        </Text>
      )}
      {screenData.elements.map(renderElement)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  screenDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007AFF',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  radioLabel: {
    fontSize: 16,
  },
  checkboxContainer: {
    marginBottom: 16,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxBox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
  },
});

export default DynamicScreen;
```

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `401` - Unauthorized (invalid or missing token)
- `404` - Screen not found or not assigned to app
- `500` - Server error

---

## Notes

1. **App-Specific Content**: Each app can have different content for the same screen template
2. **Active Screens Only**: The API only returns screens that are active and assigned to the app
3. **Element Order**: Elements are returned in `display_order` for consistent rendering
4. **Content Values**: The `value` field contains app-specific content or falls back to default values
5. **Authentication**: Always include the JWT token in requests

---

## Support

For questions or issues, contact the development team.
