# Complete Service Integration Flow

## Overview

This document explains the complete flow from enabling a service to configuring it in the admin portal.

## Architecture Flow

```
1. Services Register → Bluestone Bodyguard
2. Admin Portal → Services Page → Enable/Disable Services
3. Enabled Services Saved → Database (app_services table)
4. Admin Portal → Integrations Page → Configure Enabled Services
5. Configuration Saved → Service via Bodyguard
```

## Step-by-Step Flow

### 1. Service Registration

When a service starts (e.g., Stripe Service):

```javascript
// Service registers with Bodyguard
await bodyguard.register({
  serviceName: "stripe-service",
  serviceId: "stripe-service-1",
  version: 1,
  description: "Payment processing",
});
```

**Result**: Service appears in Bodyguard's registry

### 2. Admin Portal Discovers Services

Admin portal queries Bodyguard:

```typescript
// lib/serviceManager.ts
const services = await serviceManager.discoverServices();
// Returns: [{ name: 'stripe-service', id: 'stripe-service-1', ... }]
```

**Result**: All registered services are listed

### 3. Enable Service for Project

User goes to **Services** page (`/app/[id]/services`):

1. Sees list of all registered services
2. Checks checkbox to enable a service
3. Frontend calls API:

```typescript
POST /api/v1/apps/1/services/enable
{
  "service_name": "stripe-service",
  "service_id": "stripe-service-1"
}
```

4. Backend saves to database:

```sql
INSERT INTO app_services (app_id, service_name, service_id, enabled)
VALUES (1, 'stripe-service', 'stripe-service-1', TRUE);
```

**Result**: Service is now enabled for this project

### 4. Configure Service

User goes to **Integrations** page (`/app/[id]/integrations`):

1. Page loads enabled services:

```typescript
GET / api / v1 / apps / 1 / services / enabled;
// Returns: [{ service_name: 'stripe-service', ... }]
```

2. Only enabled services are shown
3. User selects a service
4. Admin portal requests service schema:

```typescript
// Through Bodyguard
Gateway Message:
{
  destination: { name: 'stripe-service' },
  type: 'service.getSchema'
}

// Service responds with:
{
  fields: [
    { name: 'secretKey', label: 'Secret Key', type: 'password', required: true },
    { name: 'publishableKey', label: 'Publishable Key', type: 'text', required: true },
    ...
  ]
}
```

5. Admin portal dynamically renders form based on schema
6. User fills in configuration and saves
7. Configuration sent to service:

```typescript
Gateway Message:
{
  destination: { name: 'stripe-service' },
  type: 'service.updateConfig',
  payload: {
    appId: '1',
    config: {
      secretKey: 'sk_test_...',
      publishableKey: 'pk_test_...'
    }
  }
}
```

8. Service validates and stores configuration

**Result**: Service is configured for this project

## Database Schema

### app_services Table

```sql
CREATE TABLE app_services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  app_id INT NOT NULL,                    -- Which project
  service_name VARCHAR(255) NOT NULL,     -- Service identifier
  service_id VARCHAR(255) NOT NULL,       -- Service instance ID
  enabled BOOLEAN DEFAULT TRUE,           -- Is it enabled?
  config JSON NULL,                       -- Service configuration (optional)
  created_at TIMESTAMP,
  updated_at TIMESTAMP,

  UNIQUE KEY (app_id, service_name)
);
```

## API Endpoints

### Multi-Site Manager (Backend)

```
GET    /api/v1/apps/:appId/services/enabled     # Get enabled services
GET    /api/v1/apps/:appId/services             # Get all services
POST   /api/v1/apps/:appId/services/enable      # Enable a service
POST   /api/v1/apps/:appId/services/disable     # Disable a service
PUT    /api/v1/apps/:appId/services/:name/config  # Update config
GET    /api/v1/apps/:appId/services/:name/config  # Get config
```

### Service (via Bodyguard)

```
POST   /service/getSchema          # Get configuration schema
POST   /service/getConfig          # Get current config
POST   /service/updateConfig       # Update config
POST   /service/testConnection     # Test if config works
```

## Setup Instructions

### 1. Run Database Migration

```bash
cd multi_site_manager
mysql -u root -p your_database < migrations/create_app_services.sql
```

### 2. Start Services

```bash
# Terminal 1: Bluestone Bodyguard
cd bluestone_bodyguard
cargo run

# Terminal 2: Multi-Site Manager
cd multi_site_manager
npm start

# Terminal 3: Stripe Service
cd services/stripe_service
npm run dev

# Terminal 4: Admin Portal
cd admin_portal
npm run dev
```

### 3. Test the Flow

1. **Open Admin Portal**: http://localhost:3001
2. **Login** with admin credentials
3. **Go to Services page**: `/app/1/services`
   - You should see `stripe-service` listed
   - Check the checkbox to enable it
4. **Go to Integrations page**: `/app/1/integrations`
   - You should see `stripe-service` in the list
   - Click on it
   - Fill in Stripe keys
   - Save configuration
5. **Test connection** to verify it works

## Key Features

### ✅ **Dynamic Service Discovery**

- Admin portal discovers services automatically
- No hardcoded service names
- Services can be added/removed without changing admin portal

### ✅ **Per-Project Configuration**

- Each project can enable different services
- Each project has its own configuration
- Complete isolation between projects

### ✅ **Schema-Driven UI**

- Services define what they need
- Admin portal renders UI dynamically
- No UI changes needed for new services

### ✅ **Centralized Gateway**

- All communication through Bodyguard
- No direct service-to-service communication
- Message tracing and monitoring

## Adding a New Service

To add a new service (e.g., email service):

1. **Create the service**
2. **Register with Bodyguard** on startup
3. **Implement 4 schema endpoints**:
   - `service.getSchema`
   - `service.getConfig`
   - `service.updateConfig`
   - `service.testConnection`
4. **Start the service**

**That's it!** The service will:

- Appear in Services page automatically
- Can be enabled per project
- Configuration UI renders automatically
- No admin portal changes needed

## Troubleshooting

### Service doesn't appear in Services page

- Check if service registered with Bodyguard: `GET http://localhost:3032/services`
- Check if Bodyguard is running
- Check service logs for registration errors

### Can't enable service

- Check database connection
- Check if `app_services` table exists
- Check browser console for API errors
- Check multi_site_manager logs

### Configuration doesn't save

- Check if service is enabled first
- Check Bodyguard is routing messages
- Check service schema endpoint is working
- Check service logs for errors

## Files Created/Modified

### Admin Portal

- ✅ `lib/bodyguard.ts` - Generic Bodyguard client
- ✅ `lib/serviceManager.ts` - Service operations
- ✅ `app/app/[id]/services/page.tsx` - Enable/disable services (modified)
- ✅ `app/app/[id]/integrations/page.tsx` - Configure services
- ✅ `.env.example` - Environment template

### Multi-Site Manager

- ✅ `migrations/create_app_services.sql` - Database schema
- ✅ `src/routes/appServices.js` - API endpoints
- ✅ `src/server.js` - Route registration (modified)

### Stripe Service

- ✅ `src/routes/schema.js` - Schema endpoints
- ✅ `src/index.js` - Schema routes (modified)

### Documentation

- ✅ `BODYGUARD_ARCHITECTURE.md` - Architecture overview
- ✅ `SETUP_COMPLETE_FLOW.md` - This document

## Next Steps

1. Run the database migration
2. Test the complete flow
3. Add more services following the same pattern
4. Implement service-specific features through Bodyguard
