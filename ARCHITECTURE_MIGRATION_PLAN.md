# Architecture Migration Plan: Data-Driven Mobile App

## Current State (Problem)

The mobile app has **hardcoded React Native components** for each feature:
- `PropertyDetailElement.tsx`, `PropertySearchElement.tsx`, `BookingFormElement.tsx`, etc.
- Each new feature requires adding code to the mobile app
- Styles and layouts are hardcoded in component files
- The app needs to be rebuilt and redeployed for any UI changes

## Target State (Goal)

A **generic mobile app renderer** that:
- Fetches screen definitions from the API
- Renders UI based on JSON configuration
- Requires **zero code changes** for new screens/features
- All customization happens in the Admin Portal

---

## Phase 1: Define Base Primitive Components

Create a fixed set of **primitive components** that the mobile app will use to render everything:

### Layout Primitives
| Component | Purpose | Config Options |
|-----------|---------|----------------|
| `Container` | Wrapper with padding/margin | padding, margin, backgroundColor, borderRadius |
| `Row` | Horizontal flex container | justifyContent, alignItems, gap, wrap |
| `Column` | Vertical flex container | justifyContent, alignItems, gap |
| `Card` | Elevated container | shadow, borderRadius, backgroundColor |
| `Spacer` | Empty space | height, width |
| `Divider` | Horizontal line | color, thickness, margin |

### Content Primitives
| Component | Purpose | Config Options |
|-----------|---------|----------------|
| `Text` | Display text | fontSize, fontWeight, color, align, numberOfLines |
| `Heading` | Title text | level (h1-h6), color, align |
| `Image` | Display image | source, height, width, resizeMode, borderRadius |
| `Icon` | Material icon | name, size, color |
| `Avatar` | Circular image/icon | source, size, fallbackIcon |

### Interactive Primitives
| Component | Purpose | Config Options |
|-----------|---------|----------------|
| `Button` | Tappable button | label, variant, color, size, action |
| `Link` | Tappable text | label, action, color |
| `Input` | Text input | placeholder, type, validation |
| `Switch` | Toggle | label, value |
| `Picker` | Dropdown select | options, placeholder |

### Data Primitives
| Component | Purpose | Config Options |
|-----------|---------|----------------|
| `List` | Scrollable list | dataSource, itemTemplate, emptyState |
| `Grid` | Grid layout | dataSource, columns, itemTemplate |
| `DataField` | Display data value | field, label, format |
| `ConditionalRender` | Show/hide based on condition | condition, children |

### Composite Primitives (Pre-built combinations)
| Component | Purpose | Config Options |
|-----------|---------|----------------|
| `ImageGallery` | Swipeable images | dataSource, height, showPagination |
| `RatingDisplay` | Stars + count | rating, reviewCount |
| `PriceDisplay` | Formatted price | amount, currency, period |
| `ActionBar` | Fixed bottom bar | children (buttons) |

---

## Phase 2: Define Screen Schema

### Screen Definition Structure
```json
{
  "screen": {
    "id": 97,
    "name": "Property Details",
    "screen_key": "property_details",
    "data_source": {
      "type": "api",
      "endpoint": "/apps/{app_id}/listings/{listing_id}",
      "params_from_route": ["listing_id"]
    },
    "layout": {
      "type": "scroll",
      "backgroundColor": "#F2F2F7"
    }
  },
  "elements": [
    {
      "type": "ImageGallery",
      "config": {
        "height": 300,
        "showPagination": true,
        "showFavoriteButton": true
      },
      "data_binding": {
        "images": "$.images[*].image_url",
        "fallback": "$.primary_image"
      }
    },
    {
      "type": "Container",
      "config": { "padding": 16 },
      "children": [
        {
          "type": "Heading",
          "config": { "level": "h1" },
          "data_binding": { "text": "$.title" }
        },
        {
          "type": "Row",
          "config": { "alignItems": "center", "gap": 4 },
          "children": [
            { "type": "Icon", "config": { "name": "map-marker", "size": 16, "color": "#8E8E93" } },
            { "type": "Text", "data_binding": { "text": "$.city, $.state" } }
          ]
        }
      ]
    }
  ]
}
```

### Data Binding Syntax
- `$.field` - Access field from data source
- `$.nested.field` - Access nested field
- `$.array[*].field` - Map over array
- `{route.param}` - Access route parameter
- `{user.field}` - Access current user data

---

## Phase 3: Update Database Schema

### New Tables

```sql
-- Element templates (reusable element configurations)
CREATE TABLE element_templates (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  element_type VARCHAR(50) NOT NULL,  -- primitive type
  default_config JSON,
  data_bindings JSON,
  children JSON,  -- nested element definitions
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Screen data sources
CREATE TABLE screen_data_sources (
  id INT PRIMARY KEY AUTO_INCREMENT,
  screen_id INT NOT NULL,
  name VARCHAR(50) NOT NULL,  -- e.g., "listing", "reviews"
  endpoint VARCHAR(255) NOT NULL,
  method ENUM('GET', 'POST') DEFAULT 'GET',
  params_from_route JSON,  -- ["listing_id"]
  refresh_on_focus BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (screen_id) REFERENCES app_screens(id)
);

-- Update screen_element_instances
ALTER TABLE screen_element_instances
  ADD COLUMN primitive_type VARCHAR(50),  -- base primitive
  ADD COLUMN data_bindings JSON,
  ADD COLUMN children JSON,
  ADD COLUMN conditions JSON;  -- show/hide conditions
```

### Migrate Existing Elements
Map current `element_type` values to primitives:
- `heading` → `Heading` primitive
- `paragraph` → `Text` primitive  
- `button` → `Button` primitive
- `text_input` → `Input` primitive
- `property_detail` → Composition of primitives (ImageGallery + Container + Heading + Text + ...)

---

## Phase 4: Update Admin Portal

### Screen Builder UI
1. **Visual Editor** - Drag-and-drop primitives onto canvas
2. **Property Panel** - Configure selected element's properties
3. **Data Binding Panel** - Connect elements to data fields
4. **Preview Mode** - See how screen will render

### Element Library
- Show all available primitives with descriptions
- Allow creating custom "templates" (saved combinations)
- Import/export screen definitions as JSON

### Data Source Manager
- Define API endpoints for screens
- Map route parameters to API params
- Test data fetching

---

## Phase 5: Update Mobile App Renderer

### New DynamicScreen Logic
```typescript
const DynamicScreen = ({ route, navigation }) => {
  const [screenDef, setScreenDef] = useState(null);
  const [data, setData] = useState({});

  useEffect(() => {
    // 1. Fetch screen definition
    const def = await fetchScreenDefinition(screenId);
    setScreenDef(def);
    
    // 2. Fetch data from data sources
    for (const source of def.data_sources) {
      const result = await fetchData(source, route.params);
      setData(prev => ({ ...prev, [source.name]: result }));
    }
  }, [screenId]);

  // 3. Render elements recursively
  return (
    <ElementRenderer 
      elements={screenDef.elements} 
      data={data}
      navigation={navigation}
    />
  );
};
```

### ElementRenderer Component
```typescript
const ElementRenderer = ({ elements, data, navigation }) => {
  return elements.map(element => {
    const Component = PRIMITIVES[element.type];
    const props = resolveDataBindings(element.config, element.data_bindings, data);
    
    return (
      <Component key={element.id} {...props}>
        {element.children && (
          <ElementRenderer elements={element.children} data={data} navigation={navigation} />
        )}
      </Component>
    );
  });
};
```

### Primitives Registry
```typescript
const PRIMITIVES = {
  Container: ContainerPrimitive,
  Row: RowPrimitive,
  Column: ColumnPrimitive,
  Text: TextPrimitive,
  Heading: HeadingPrimitive,
  Image: ImagePrimitive,
  Button: ButtonPrimitive,
  // ... all primitives
};
```

---

## Phase 6: Migration Steps

### Step 1: Create Primitives (Week 1)
- [ ] Create all primitive components in `/mobile_apps/core/primitives/`
- [ ] Each primitive accepts config props and renders accordingly
- [ ] Test primitives in isolation

### Step 2: Create ElementRenderer (Week 1)
- [ ] Build recursive renderer that maps element definitions to primitives
- [ ] Implement data binding resolution
- [ ] Handle conditional rendering

### Step 3: Update Database (Week 2)
- [ ] Add new tables for screen definitions
- [ ] Create migration scripts
- [ ] Update API to return new format

### Step 4: Update Admin Portal (Week 2-3)
- [ ] Build screen builder UI
- [ ] Add data source configuration
- [ ] Add element property editors

### Step 5: Migrate Existing Screens (Week 3-4)
- [ ] Convert each hardcoded screen to JSON definition
- [ ] Store in database
- [ ] Test rendering

### Step 6: Remove Old Components (Week 4)
- [ ] Delete hardcoded element components
- [ ] Remove switch statement from DynamicScreen
- [ ] Clean up unused code

---

## Benefits After Migration

1. **No Mobile App Code Changes** - New features via Admin Portal only
2. **Instant Updates** - Screen changes reflect immediately (no app store deploy)
3. **Consistent Theming** - Styles defined centrally
4. **Reusable Templates** - Save and reuse element combinations
5. **A/B Testing** - Easily swap screen versions
6. **Multi-App Support** - Same renderer for all apps, different configurations

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Performance (JSON parsing) | Cache screen definitions, lazy load |
| Complex interactions | Support custom actions/handlers |
| Learning curve | Good documentation, visual builder |
| Migration effort | Phased approach, keep old system working |

---

## Timeline Estimate

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| Phase 1: Primitives | 1 week | None |
| Phase 2: Schema Design | 3 days | Phase 1 |
| Phase 3: Database | 3 days | Phase 2 |
| Phase 4: Admin Portal | 1-2 weeks | Phase 3 |
| Phase 5: Mobile Renderer | 1 week | Phase 1, 3 |
| Phase 6: Migration | 1-2 weeks | All above |

**Total: 5-7 weeks**

---

## Next Steps

1. Review and approve this plan
2. Start with Phase 1 (Primitives) as proof of concept
3. Build one screen (Property Details) using new architecture
4. Iterate based on learnings
