# App Screen Override System

## 🎯 **Problem Solved**

**Before:** All apps shared the same master screens and elements. Modifying an element affected ALL apps using that screen.

**After:** Apps can now customize screen elements independently without affecting other apps!

---

## 🏗️ **Architecture: Shared with Override**

### **How It Works**

```
Master Screens (Templates)
    ↓
App Uses Screen (Shared)
    ↓
App Creates Overrides (App-Specific)
    ↓
Final View = Master + Overrides + Custom Elements
```

### **Three Layers**

1. **Master Elements** - Shared templates from `screen_element_instances`
2. **Overrides** - App-specific customizations in `app_screen_element_overrides`
3. **Custom Elements** - Completely new elements in `app_custom_screen_elements`

---

## 📊 **Database Schema**

### **Table 1: app_screen_element_overrides**

Stores app-specific customizations for master elements.

```sql
CREATE TABLE app_screen_element_overrides (
  id INT PRIMARY KEY AUTO_INCREMENT,
  app_id INT NOT NULL,
  screen_id INT NOT NULL,
  element_instance_id INT NOT NULL,
  
  -- Override flags
  is_hidden BOOLEAN DEFAULT FALSE,
  is_required_override BOOLEAN NULL,
  
  -- Override values
  custom_label VARCHAR(255) NULL,
  custom_placeholder VARCHAR(255) NULL,
  custom_default_value TEXT NULL,
  custom_validation_rules JSON NULL,
  custom_display_order INT NULL,
  custom_config JSON NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
  FOREIGN KEY (screen_id) REFERENCES app_screens(id) ON DELETE CASCADE,
  FOREIGN KEY (element_instance_id) REFERENCES screen_element_instances(id) ON DELETE CASCADE,
  
  UNIQUE KEY unique_app_element_override (app_id, element_instance_id)
);
```

### **Table 2: app_custom_screen_elements**

Stores completely new elements added by apps.

```sql
CREATE TABLE app_custom_screen_elements (
  id INT PRIMARY KEY AUTO_INCREMENT,
  app_id INT NOT NULL,
  screen_id INT NOT NULL,
  element_id INT NOT NULL,
  
  field_key VARCHAR(255) NOT NULL,
  label VARCHAR(255),
  placeholder VARCHAR(255),
  default_value TEXT,
  validation_rules JSON,
  is_required BOOLEAN DEFAULT FALSE,
  is_visible BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 999,
  config JSON,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
  FOREIGN KEY (screen_id) REFERENCES app_screens(id) ON DELETE CASCADE,
  FOREIGN KEY (element_id) REFERENCES screen_elements(id),
  
  UNIQUE KEY unique_app_screen_field (app_id, screen_id, field_key)
);
```

---

## 🔌 **API Endpoints**

### **Base URL:** `http://localhost:3000/api/v1`

All endpoints require Bearer token authentication.

---

### **1. Get App Screen Elements**

Get all elements for an app's screen (master + overrides + custom).

**Endpoint:** `GET /apps/:appId/screens/:screenId/elements`

**Response:**
```json
{
  "success": true,
  "elements": [
    {
      "element_instance_id": 123,
      "element_id": 27,
      "element_name": "Heading",
      "element_type": "text",
      "field_key": "heading_1",
      "label": "Custom Title",  // Overridden
      "placeholder": null,
      "is_required": true,  // Overridden
      "display_order": 1,
      "is_custom": false,
      "has_override": true  // This element has overrides
    },
    {
      "custom_element_id": 456,
      "element_id": 33,
      "element_name": "Button",
      "field_key": "custom_button_1",
      "label": "Remember Me",
      "is_custom": true,  // This is a custom element
      "has_override": false
    }
  ],
  "counts": {
    "master": 6,
    "overridden": 1,
    "custom": 1,
    "total": 7
  }
}
```

---

### **2. Create/Update Override**

Override properties of a master element for a specific app.

**Endpoint:** `PUT /apps/:appId/screens/:screenId/elements/:elementInstanceId/override`

**Request Body:**
```json
{
  "custom_label": "My Custom Label",
  "custom_placeholder": "Enter your custom text",
  "is_required": true,
  "is_hidden": false,
  "custom_display_order": 5,
  "custom_config": {
    "maxLength": 100,
    "customProperty": "value"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Override created successfully"
}
```

**Available Override Fields:**
- `is_hidden` - Hide element (won't appear in list)
- `is_required` - Override required status
- `custom_label` - Custom label text
- `custom_placeholder` - Custom placeholder text
- `custom_default_value` - Custom default value
- `custom_validation_rules` - Custom validation (JSON)
- `custom_display_order` - Custom position
- `custom_config` - Additional configuration (JSON)

---

### **3. Delete Override (Revert to Master)**

Remove app-specific override and revert to master element.

**Endpoint:** `DELETE /apps/:appId/elements/:elementInstanceId/override`

**Response:**
```json
{
  "success": true,
  "message": "Override deleted successfully (reverted to master)"
}
```

---

### **4. Add Custom Element**

Add a completely new element to an app's screen.

**Endpoint:** `POST /apps/:appId/screens/:screenId/elements/custom`

**Request Body:**
```json
{
  "element_id": 33,  // Button element type
  "field_key": "custom_remember_me",
  "label": "Remember Me",
  "placeholder": null,
  "is_required": false,
  "is_visible": true,
  "display_order": 10,
  "config": {
    "buttonStyle": "primary"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Custom element added successfully",
  "custom_element_id": 789
}
```

---

### **5. Update Custom Element**

Update a custom element's properties.

**Endpoint:** `PUT /apps/:appId/elements/custom/:customElementId`

**Request Body:**
```json
{
  "label": "Updated Label",
  "is_visible": false,
  "display_order": 15
}
```

**Response:**
```json
{
  "success": true,
  "message": "Custom element updated successfully"
}
```

---

### **6. Delete Custom Element**

Remove a custom element from an app's screen.

**Endpoint:** `DELETE /apps/:appId/elements/custom/:customElementId`

**Response:**
```json
{
  "success": true,
  "message": "Custom element deleted successfully"
}
```

---

## 💡 **Use Cases**

### **Use Case 1: Customize Label**

App 1 wants "Email Address" instead of "Email":

```javascript
PUT /apps/1/screens/18/elements/123/override
{
  "custom_label": "Email Address"
}
```

Result: Only App 1 sees "Email Address", other apps still see "Email"

---

### **Use Case 2: Hide Element**

App 2 doesn't need the "Phone Number" field:

```javascript
PUT /apps/2/screens/18/elements/124/override
{
  "is_hidden": true
}
```

Result: Phone field hidden for App 2, visible for all other apps

---

### **Use Case 3: Add Custom Element**

App 3 needs a "Remember Me" checkbox:

```javascript
POST /apps/3/screens/18/elements/custom
{
  "element_id": 35,  // Checkbox
  "field_key": "remember_me",
  "label": "Remember Me",
  "display_order": 10
}
```

Result: App 3 has the checkbox, other apps don't

---

### **Use Case 4: Reorder Elements**

App 4 wants password field before email:

```javascript
PUT /apps/4/screens/18/elements/125/override
{
  "custom_display_order": 1
}
```

Result: Password appears first for App 4, normal order for others

---

## 🎨 **Frontend Integration**

### **React Example: Screen Element Manager**

```jsx
import { useState, useEffect } from 'react';

function ScreenElementManager({ appId, screenId }) {
  const [elements, setElements] = useState([]);
  
  useEffect(() => {
    loadElements();
  }, [appId, screenId]);
  
  const loadElements = async () => {
    const response = await fetch(
      `/api/v1/apps/${appId}/screens/${screenId}/elements`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    const data = await response.json();
    setElements(data.elements);
  };
  
  const updateOverride = async (elementInstanceId, overrideData) => {
    await fetch(
      `/api/v1/apps/${appId}/screens/${screenId}/elements/${elementInstanceId}/override`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(overrideData)
      }
    );
    loadElements(); // Reload
  };
  
  const hideElement = (elementInstanceId) => {
    updateOverride(elementInstanceId, { is_hidden: true });
  };
  
  const addCustomElement = async (elementData) => {
    await fetch(
      `/api/v1/apps/${appId}/screens/${screenId}/elements/custom`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(elementData)
      }
    );
    loadElements();
  };
  
  return (
    <div>
      <h2>Screen Elements</h2>
      {elements.map(element => (
        <div key={element.element_instance_id || element.custom_element_id}>
          <span>{element.label}</span>
          {element.has_override && <span> (Customized)</span>}
          {element.is_custom && <span> (Custom)</span>}
          <button onClick={() => hideElement(element.element_instance_id)}>
            Hide
          </button>
        </div>
      ))}
      <button onClick={() => addCustomElement({
        element_id: 33,
        field_key: 'new_button',
        label: 'New Button'
      })}>
        Add Element
      </button>
    </div>
  );
}
```

---

## ✅ **Benefits**

### **1. App Isolation**
- Each app can customize independently
- Changes don't affect other apps
- Safe multi-tenant environment

### **2. Flexibility**
- Override any property
- Hide unwanted elements
- Add custom elements
- Reorder elements

### **3. Efficiency**
- Master screens remain as templates
- Only store differences (overrides)
- Minimal database overhead
- Fast queries with indexes

### **4. Maintainability**
- Clear separation of concerns
- Easy to revert changes
- Cascading deletes keep data clean
- Simple to understand

---

## 🔒 **Data Integrity**

### **Cascading Deletes**

- Delete app → Deletes all overrides and custom elements
- Delete master screen → Deletes all overrides (custom elements remain)
- Delete master element → Deletes all overrides

### **Unique Constraints**

- One override per app per element
- Unique field keys per app per screen
- No duplicate custom elements

---

## 📈 **Performance**

### **Indexes Created**

```sql
-- Override lookups
CREATE INDEX idx_override_app_screen ON app_screen_element_overrides(app_id, screen_id);
CREATE INDEX idx_override_element ON app_screen_element_overrides(element_instance_id);

-- Custom element lookups
CREATE INDEX idx_custom_element_app_screen ON app_custom_screen_elements(app_id, screen_id);
CREATE INDEX idx_custom_element_display_order ON app_custom_screen_elements(display_order);
```

### **Query Optimization**

The `getAppScreenElements` endpoint uses:
1. Single query for master elements
2. Single query for overrides
3. Single query for custom elements
4. In-memory merge (fast)

**Total: 3 queries** regardless of element count

---

## 🚀 **Next Steps**

### **Immediate**
1. ✅ Database tables created
2. ✅ API endpoints implemented
3. ✅ Backend tested
4. ⏳ Frontend UI (pending)
5. ⏳ Admin portal integration (pending)

### **Future Enhancements**
- Drag-and-drop element reordering
- Visual element editor
- Bulk override operations
- Override templates
- Version history/rollback

---

## 📝 **Summary**

**What You Can Do Now:**
- ✅ Customize element labels per app
- ✅ Hide/show elements per app
- ✅ Change required status per app
- ✅ Reorder elements per app
- ✅ Add custom elements per app
- ✅ Revert to master anytime

**What's Protected:**
- ✅ Master screens unchanged
- ✅ Other apps unaffected
- ✅ Data integrity maintained
- ✅ Performance optimized

**Result:** True multi-tenant app customization! 🎉
