# Forms System API Specification

## Backend API Endpoints for Forms Management

**Date:** November 21, 2025

---

## 🎯 **Design Principles**

1. **Reuse existing elements** - Never create duplicate screen elements
2. **Element registry** - Query elements by `element_type`, not by ID
3. **Validation** - Prevent duplicate `field_key` within same form
4. **Flexibility** - Support form customization per app

---

## 📋 **API Endpoints**

### **1. Master Forms Management**

#### **GET /api/v1/forms**
List all master forms

**Response:**
```json
{
  "success": true,
  "forms": [
    {
      "id": 1,
      "name": "Property Listing Form",
      "form_key": "property_listing_form",
      "form_type": "create",
      "layout": "single_column",
      "category": "real_estate",
      "element_count": 15,
      "created_at": "2025-11-21T10:00:00Z"
    }
  ]
}
```

#### **GET /api/v1/forms/:formId**
Get form details with elements

**Response:**
```json
{
  "success": true,
  "form": {
    "id": 1,
    "name": "Property Listing Form",
    "form_key": "property_listing_form",
    "description": "Complete form for property listings",
    "form_type": "create",
    "layout": "single_column",
    "submit_button_text": "Create Listing",
    "elements": [
      {
        "id": 1,
        "field_key": "title",
        "label": "Property Title",
        "element_id": 1,
        "element_type": "text_field",
        "element_name": "Text Field",
        "is_required": true,
        "display_order": 1,
        "config": {
          "maxLength": 255,
          "placeholder": "e.g., Cozy Downtown Apartment"
        }
      }
    ]
  }
}
```

#### **POST /api/v1/forms**
Create new form

**Request:**
```json
{
  "name": "Quick Property Form",
  "form_key": "quick_property_form",
  "description": "Simplified property listing form",
  "form_type": "create",
  "layout": "single_column",
  "submit_button_text": "Post Listing",
  "category": "real_estate"
}
```

**Response:**
```json
{
  "success": true,
  "form_id": 2
}
```

#### **PUT /api/v1/forms/:formId**
Update form metadata

**Request:**
```json
{
  "name": "Updated Form Name",
  "description": "New description",
  "submit_button_text": "Submit"
}
```

#### **DELETE /api/v1/forms/:formId**
Delete form (and all its elements)

---

### **2. Form Elements Management**

#### **GET /api/v1/forms/:formId/elements**
Get all elements in a form

**Response:**
```json
{
  "success": true,
  "elements": [
    {
      "id": 1,
      "field_key": "title",
      "label": "Property Title",
      "element_id": 1,
      "element_type": "text_field",
      "is_required": true,
      "display_order": 1
    }
  ]
}
```

#### **POST /api/v1/forms/:formId/elements**
Add element to form (REUSES existing element)

**Request:**
```json
{
  "element_type": "text_field",  // Query existing element by type
  "field_key": "title",
  "label": "Property Title",
  "placeholder": "Enter title",
  "is_required": true,
  "display_order": 1,
  "config": {
    "maxLength": 255
  }
}
```

**Backend Logic:**
```javascript
// 1. Find existing element by type
const element = await db.query(
  'SELECT id FROM screen_elements WHERE element_type = ?',
  [element_type]
);

// 2. Add to form (reusing element)
await db.query(
  'INSERT INTO app_form_elements (form_id, element_id, field_key, ...) VALUES (?, ?, ?, ...)',
  [formId, element[0].id, field_key, ...]
);
```

**Response:**
```json
{
  "success": true,
  "element_id": 1,
  "message": "Element added to form (reused existing text_field element)"
}
```

#### **PUT /api/v1/forms/:formId/elements/:elementId**
Update form element configuration

**Request:**
```json
{
  "label": "Updated Label",
  "is_required": false,
  "display_order": 5
}
```

#### **DELETE /api/v1/forms/:formId/elements/:elementId**
Remove element from form

---

### **3. Available Elements Registry**

#### **GET /api/v1/elements/available-for-forms**
Get list of elements that can be used in forms

**Query Parameters:**
- `category` (optional) - Filter by category (Input, Selection, DateTime, Media)

**Response:**
```json
{
  "success": true,
  "elements": [
    {
      "id": 1,
      "name": "Text Field",
      "element_type": "text_field",
      "category": "Input",
      "icon": "text",
      "description": "Single-line text input"
    },
    {
      "id": 2,
      "name": "Text Area",
      "element_type": "text_area",
      "category": "Input",
      "icon": "align-left",
      "description": "Multi-line text input"
    }
  ],
  "grouped": {
    "Input": [
      { "id": 1, "name": "Text Field", "element_type": "text_field" },
      { "id": 2, "name": "Text Area", "element_type": "text_area" }
    ],
    "Selection": [
      { "id": 10, "name": "Dropdown", "element_type": "dropdown" }
    ]
  }
}
```

---

### **4. App Form Assignments**

#### **GET /api/v1/apps/:appId/forms**
Get forms assigned to an app

**Response:**
```json
{
  "success": true,
  "forms": [
    {
      "id": 1,
      "form_id": 1,
      "form_name": "Property Listing Form",
      "form_key": "property_listing_form",
      "is_active": true,
      "submit_endpoint": "/apps/28/listings",
      "submit_method": "POST",
      "element_count": 15
    }
  ]
}
```

#### **GET /api/v1/apps/:appId/forms/:formKey**
Get form definition for mobile app (with app-specific overrides)

**Response:**
```json
{
  "success": true,
  "form": {
    "id": 1,
    "name": "Property Listing Form",
    "form_key": "property_listing_form",
    "submit_endpoint": "/apps/28/listings",
    "submit_method": "POST",
    "submit_button_text": "Create Listing",
    "success_message": "Property created successfully!",
    "elements": [
      {
        "field_key": "title",
        "element_type": "text_field",
        "label": "Property Title",
        "placeholder": "e.g., Cozy Apartment",
        "is_required": true,
        "display_order": 1,
        "validation_rules": {
          "minLength": 10,
          "maxLength": 255
        },
        "config": {}
      }
    ]
  }
}
```

#### **POST /api/v1/apps/:appId/forms/:formId/assign**
Assign form to app

**Request:**
```json
{
  "submit_endpoint": "/apps/28/listings",
  "submit_method": "POST",
  "custom_submit_text": "Post Listing"
}
```

#### **PUT /api/v1/apps/:appId/forms/:formId/elements/:elementId/override**
Override form element for specific app

**Request:**
```json
{
  "custom_label": "Listing Title",
  "is_required_override": false,
  "is_hidden": false
}
```

---

### **5. Form Submissions (Analytics)**

#### **POST /api/v1/apps/:appId/forms/:formKey/submit**
Submit form data (tracked for analytics)

**Request:**
```json
{
  "form_data": {
    "title": "Beautiful Apartment",
    "description": "Spacious 2BR apartment...",
    "price_per_night": 150
  }
}
```

**Response:**
```json
{
  "success": true,
  "submission_id": 123,
  "redirect_url": "/listings/456"
}
```

#### **GET /api/v1/apps/:appId/forms/:formId/submissions**
Get form submissions (admin only)

**Query Parameters:**
- `status` - Filter by status (pending, completed, failed)
- `page` - Page number
- `per_page` - Results per page

---

## 🔒 **Authentication & Authorization**

### **Master Forms (Admin Only)**
- `GET /api/v1/forms` - Requires admin auth
- `POST /api/v1/forms` - Requires admin auth
- `PUT /api/v1/forms/:formId` - Requires admin auth
- `DELETE /api/v1/forms/:formId` - Requires admin auth

### **App Forms (Dual Auth)**
- `GET /api/v1/apps/:appId/forms` - Admin or mobile user
- `GET /api/v1/apps/:appId/forms/:formKey` - Admin or mobile user
- `POST /api/v1/apps/:appId/forms/:formKey/submit` - Mobile user

### **Form Assignments (Admin Only)**
- `POST /api/v1/apps/:appId/forms/:formId/assign` - Admin only
- `PUT /api/v1/apps/:appId/forms/:formId/override` - Admin only

---

## ✅ **Validation Rules**

### **Creating Form:**
- `name` - Required, 3-100 characters
- `form_key` - Required, unique, lowercase, underscores only
- `form_type` - Must be valid enum value
- `created_by` - Must be valid user ID

### **Adding Element to Form:**
- `element_type` - Must exist in `screen_elements` table
- `field_key` - Required, unique within form, lowercase, underscores only
- `display_order` - Must be positive integer
- **Prevents:** Duplicate `field_key` in same form

### **Form Submission:**
- All required fields must be present
- Field values must match validation rules
- Element types must support data input

---

## 🚀 **Implementation Priority**

### **Phase 1: Core CRUD**
1. ✅ Database schema
2. 🔄 Master forms CRUD
3. 🔄 Form elements management
4. 🔄 Element registry endpoint

### **Phase 2: App Integration**
5. ⏳ App form assignments
6. ⏳ Form retrieval for mobile app
7. ⏳ Element overrides

### **Phase 3: Submissions**
8. ⏳ Form submission tracking
9. ⏳ Submission analytics

---

## 📝 **Example Flow**

### **Admin Creates Property Form:**

```bash
# 1. Create form
POST /api/v1/forms
{
  "name": "Property Listing Form",
  "form_key": "property_listing_form"
}
# Returns: form_id = 1

# 2. Add title field (reuses text_field element)
POST /api/v1/forms/1/elements
{
  "element_type": "text_field",
  "field_key": "title",
  "label": "Property Title",
  "is_required": true
}

# 3. Add description field (reuses text_area element)
POST /api/v1/forms/1/elements
{
  "element_type": "text_area",
  "field_key": "description",
  "label": "Description"
}

# 4. Assign to app
POST /api/v1/apps/28/forms/1/assign
{
  "submit_endpoint": "/apps/28/listings",
  "submit_method": "POST"
}
```

### **Mobile App Uses Form:**

```bash
# 1. Fetch form definition
GET /api/v1/apps/28/forms/property_listing_form

# 2. Render form dynamically
<FormRenderer formData={...} />

# 3. Submit form
POST /api/v1/apps/28/listings
{
  "title": "Beautiful Apartment",
  "description": "Spacious 2BR..."
}
```

---

**Key Principle:** Forms reference existing elements. We never create duplicate elements!
