# Bluestone Bodyguard Architecture

## Overview

The system uses Bluestone Bodyguard as a central gateway for all service communication. **No service knows about any other service** - everything flows through the Bodyguard.

## Architecture Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                      Admin Portal                             │
│                      (Next.js)                                │
│                                                               │
│  • Discovers services dynamically                            │
│  • No hardcoded service names or logic                       │
│  • Renders UI based on service schemas                       │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            │ Gateway Messages
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                  Bluestone Bodyguard                          │
│                  (Rust - Port 3032)                           │
│                                                               │
│  • Service registry                                           │
│  • Message routing                                            │
│  • Request/response handling                                  │
│  • WebSocket events                                           │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            │ Routes to registered services
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Stripe     │    │   Email      │    │   Other      │
│   Service    │    │   Service    │    │   Services   │
│              │    │              │    │              │
│ • Registers  │    │ • Registers  │    │ • Register   │
│ • Provides   │    │ • Provides   │    │ • Provide    │
│   schema     │    │   schema     │    │   schema     │
└──────────────┘    └──────────────┘    └──────────────┘
```

## Key Principles

### 1. **No Direct Service Communication**

- Admin portal NEVER calls services directly
- Services NEVER call each other directly
- All communication goes through Bodyguard

### 2. **Dynamic Service Discovery**

- Admin portal queries Bodyguard for available services
- Services register themselves with Bodyguard on startup
- No hardcoded service names in admin portal

### 3. **Schema-Driven Configuration**

- Each service defines its own configuration schema
- Admin portal dynamically renders UI based on schema
- Services tell admin portal what they need

### 4. **Generic Message Protocol**

- All requests use standardized gateway message format
- Services handle request types they understand
- Extensible without changing admin portal

## Message Flow Example

### Service Registration (On Startup)

```
Stripe Service → Bodyguard
POST /services/register
{
  "name": "stripe-service",
  "id": "stripe-service-1",
  "version": 1,
  "description": "Payment processing",
  "endpoints": [...]
}
```

### Admin Portal Discovers Services

```
Admin Portal → Bodyguard
GET /services

Response:
{
  "count": 3,
  "services": [
    {
      "name": "stripe-service",
      "id": "stripe-service-1",
      "version": 1,
      "description": "Payment processing"
    },
    ...
  ]
}
```

### Admin Portal Gets Service Schema

```
Admin Portal → Bodyguard → Stripe Service
Gateway Message:
{
  "source": { "kind": "App", "name": "admin-portal" },
  "destination": { "kind": "Service", "name": "stripe-service" },
  "type": "service.getSchema",
  "payload": {}
}

Response:
{
  "fields": [
    {
      "name": "secretKey",
      "label": "Secret Key",
      "type": "password",
      "required": true,
      "description": "Your Stripe secret key"
    },
    ...
  ],
  "capabilities": ["Checkout", "Subscriptions", ...]
}
```

### Admin Portal Configures Service

```
Admin Portal → Bodyguard → Stripe Service
Gateway Message:
{
  "source": { "kind": "App", "name": "admin-portal" },
  "destination": { "kind": "Service", "name": "stripe-service" },
  "type": "service.updateConfig",
  "auth": {
    "user_id": "123",
    "tenant_id": "1",
    "roles": ["admin"]
  },
  "payload": {
    "appId": "1",
    "config": {
      "secretKey": "sk_test_...",
      "publishableKey": "pk_test_...",
      "webhookSecret": "whsec_..."
    }
  }
}
```

## Service Contract

Every service that wants to be configurable through admin portal must implement these endpoints:

### 1. `service.getSchema`

Returns the configuration schema:

```json
{
  "fields": [
    {
      "name": "fieldName",
      "label": "Display Label",
      "type": "text|password|number|boolean",
      "required": true|false,
      "description": "Help text",
      "placeholder": "Example value"
    }
  ],
  "capabilities": ["Feature 1", "Feature 2"],
  "documentation": {
    "setup": "Setup instructions",
    "webhook": "Webhook configuration"
  }
}
```

### 2. `service.getConfig`

Returns current configuration for an app (non-sensitive data only):

```json
{
  "appId": "1",
  "configured": true,
  "hasCustomKeys": true,
  "publishableKey": "pk_test_..." // Only safe-to-expose values
}
```

### 3. `service.updateConfig`

Updates configuration for an app:

```json
{
  "appId": "1",
  "config": {
    "field1": "value1",
    "field2": "value2"
  }
}
```

### 4. `service.testConnection`

Tests if configuration is valid:

```json
{
  "appId": "1"
}
```

## Adding a New Service

### Step 1: Create the Service

```javascript
// src/index.js
const BodyguardClient = require("./bodyguard");

const bodyguard = new BodyguardClient({
  serviceId: "my-service-1",
  serviceName: "my-service",
  serviceVersion: 1,
  serviceDescription: "My awesome service",
  bodyguardUrl: "http://localhost:3032",
  serviceUrl: "http://localhost:4002",
});

// Register on startup
app.listen(PORT, async () => {
  await bodyguard.register();
});
```

### Step 2: Implement Schema Endpoints

```javascript
// src/routes/schema.js
router.post("/getSchema", (req, res) => {
  res.json({
    success: true,
    fields: [
      {
        name: "apiKey",
        label: "API Key",
        type: "password",
        required: true,
        description: "Your API key from the service",
      },
    ],
    capabilities: ["Send Email", "Track Events"],
  });
});

router.post("/getConfig", (req, res) => {
  const { appId } = req.body;
  // Return current config for this app
});

router.post("/updateConfig", (req, res) => {
  const { appId, config } = req.body;
  // Save config for this app
});

router.post("/testConnection", (req, res) => {
  const { appId } = req.body;
  // Test if config works
});
```

### Step 3: Mount Routes

```javascript
app.post("/service/getSchema", schemaRoutes);
app.post("/service/getConfig", schemaRoutes);
app.post("/service/updateConfig", schemaRoutes);
app.post("/service/testConnection", schemaRoutes);
```

### Step 4: Start Service

```bash
npm start
```

**That's it!** The service will:

1. Register with Bodyguard
2. Appear in admin portal automatically
3. Admin portal will render UI based on your schema
4. No changes needed to admin portal code

## Benefits

### ✅ **Loose Coupling**

- Services don't know about each other
- Admin portal doesn't know about specific services
- Easy to add/remove services

### ✅ **Scalability**

- Services can be deployed independently
- Multiple instances can register with same name
- Bodyguard handles load balancing

### ✅ **Flexibility**

- Each service defines its own requirements
- No rigid configuration format
- Services can evolve independently

### ✅ **Security**

- All communication through one gateway
- Authentication context passed through Bodyguard
- Services validate permissions

### ✅ **Maintainability**

- Add new services without changing admin portal
- Service changes don't affect other services
- Clear separation of concerns

## File Structure

### Admin Portal

```
admin_portal/
├── lib/
│   ├── bodyguard.ts          # Generic Bodyguard client
│   └── serviceManager.ts     # Generic service operations
└── app/app/[id]/
    └── integrations/
        └── page.tsx           # Dynamic service configuration UI
```

### Services

```
services/stripe_service/
├── src/
│   ├── bodyguard.js          # Bodyguard registration client
│   ├── routes/
│   │   └── schema.js         # Service schema endpoints
│   └── index.js              # Main service with registration
```

## Environment Configuration

### Admin Portal

```env
NEXT_PUBLIC_BODYGUARD_URL=http://localhost:3032
```

### Services

```env
BODYGUARD_URL=http://localhost:3032
SERVICE_ID=my-service-1
SERVICE_NAME=my-service
SERVICE_PORT=4001
SERVICE_URL=http://localhost:4001
```

## Testing

### 1. Start Bodyguard

```bash
cd bluestone_bodyguard
cargo run
```

### 2. Start Services

```bash
cd services/stripe_service
npm run dev
```

### 3. Start Admin Portal

```bash
cd admin_portal
npm run dev
```

### 4. Navigate to Integrations

```
http://localhost:3001/app/1/integrations
```

You should see all registered services automatically!

## Future Services

Following this pattern, you can easily add:

- **Email Service** (SendGrid, Mailgun, etc.)
- **SMS Service** (Twilio, etc.)
- **Analytics Service** (Google Analytics, Mixpanel, etc.)
- **Storage Service** (S3, Cloudinary, etc.)
- **Auth Service** (Auth0, Firebase, etc.)

Each service just needs to:

1. Register with Bodyguard
2. Implement the 4 schema endpoints
3. Define its configuration fields

**No changes to admin portal required!**
