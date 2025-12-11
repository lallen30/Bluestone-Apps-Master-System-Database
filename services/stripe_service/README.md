# Stripe Service

A multi-project Stripe payment processing service that integrates with Bluestone Bodyguard and supports different Stripe keys per project/app.

## Features

- ✅ **Multi-Project Support**: Each project in admin_portal can use different Stripe keys
- ✅ **Bluestone Bodyguard Integration**: Registers as a service with the Bodyguard gateway
- ✅ **JWT Authentication**: Uses the same authentication system as multi_site_manager
- ✅ **Comprehensive Stripe API**: Checkout sessions, payment intents, subscriptions, customers
- ✅ **Webhook Handling**: Process Stripe webhook events per project
- ✅ **Admin Management**: API endpoints to configure Stripe keys per project

## Architecture

```
┌─────────────────┐
│  Admin Portal   │
│  (Projects)     │
└────────┬────────┘
         │
         │ JWT Auth
         ▼
┌─────────────────┐      ┌──────────────────┐
│ Bluestone       │◄─────┤ Stripe Service   │
│ Bodyguard       │      │ (This Service)   │
└─────────────────┘      └────────┬─────────┘
                                  │
                                  │ Different keys
                                  │ per project
                                  ▼
                         ┌─────────────────┐
                         │  Stripe API     │
                         └─────────────────┘
```

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Service Configuration
SERVICE_ID=stripe-service-1
SERVICE_PORT=4001
BODYGUARD_URL=http://localhost:3032

# JWT Secret (MUST match multi_site_manager)
JWT_SECRET=your-secret-key-change-in-production

# Default Stripe Keys
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Project-Specific Keys (optional)
STRIPE_PROJECT_1_SECRET_KEY=sk_test_...
STRIPE_PROJECT_1_PUBLISHABLE_KEY=pk_test_...
STRIPE_PROJECT_1_WEBHOOK_SECRET=whsec_...
```

### 3. Start the Service

```bash
# Development
npm run dev

# Production
npm start
```

## Multi-Project Configuration

### Method 1: Environment Variables

Add project-specific keys to `.env`:

```env
# For app_id = 1
STRIPE_PROJECT_1_SECRET_KEY=sk_test_...
STRIPE_PROJECT_1_PUBLISHABLE_KEY=pk_test_...
STRIPE_PROJECT_1_WEBHOOK_SECRET=whsec_...

# For app_id = 5
STRIPE_PROJECT_5_SECRET_KEY=sk_test_...
STRIPE_PROJECT_5_PUBLISHABLE_KEY=pk_test_...
STRIPE_PROJECT_5_WEBHOOK_SECRET=whsec_...
```

### Method 2: Admin API (Runtime)

Use the admin endpoints to configure keys at runtime:

```bash
# Add/Update keys for a project
curl -X POST http://localhost:4001/api/v1/admin/projects/1/keys \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "secretKey": "sk_test_...",
    "publishableKey": "pk_test_...",
    "webhookSecret": "whsec_..."
  }'
```

## API Endpoints

### Public Endpoints

#### Get Stripe Configuration

```
GET /api/v1/stripe/config
Authorization: Bearer {token} (optional)
```

Returns the publishable key for the authenticated user's project.

#### Create Checkout Session

```
POST /api/v1/stripe/create-checkout-session
Authorization: Bearer {token}
Content-Type: application/json

{
  "line_items": [
    {
      "price": "price_1234",
      "quantity": 1
    }
  ],
  "mode": "payment",
  "success_url": "https://example.com/success",
  "cancel_url": "https://example.com/cancel"
}
```

#### Create Payment Intent

```
POST /api/v1/stripe/create-payment-intent
Authorization: Bearer {token}
Content-Type: application/json

{
  "amount": 2000,
  "currency": "usd"
}
```

#### Create Customer

```
POST /api/v1/stripe/create-customer
Authorization: Bearer {token}
Content-Type: application/json

{
  "email": "customer@example.com",
  "name": "John Doe"
}
```

#### Create Subscription

```
POST /api/v1/stripe/create-subscription
Authorization: Bearer {token}
Content-Type: application/json

{
  "customerId": "cus_...",
  "priceId": "price_..."
}
```

#### List Products

```
GET /api/v1/stripe/products
Authorization: Bearer {token} (optional)
```

#### List Prices

```
GET /api/v1/stripe/prices
Authorization: Bearer {token} (optional)
```

### Webhook Endpoint

```
POST /api/v1/stripe/webhook?app_id={app_id}
Content-Type: application/json
Stripe-Signature: {signature}
```

**Note**: Configure this URL in your Stripe Dashboard for each project. Use the `app_id` query parameter to route webhooks to the correct project.

### Admin Endpoints (Requires Admin Role)

#### List Configured Projects

```
GET /api/v1/admin/projects
Authorization: Bearer {admin_token}
```

#### Get Project Publishable Key

```
GET /api/v1/admin/projects/{app_id}/publishable-key
Authorization: Bearer {admin_token}
```

#### Add/Update Project Keys

```
POST /api/v1/admin/projects/{app_id}/keys
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "secretKey": "sk_test_...",
  "publishableKey": "pk_test_...",
  "webhookSecret": "whsec_..."
}
```

#### Remove Project Keys

```
DELETE /api/v1/admin/projects/{app_id}/keys
Authorization: Bearer {admin_token}
```

#### Test Project Connection

```
GET /api/v1/admin/projects/{app_id}/test
Authorization: Bearer {admin_token}
```

## Authentication

This service uses JWT authentication compatible with `multi_site_manager`. The JWT token should include:

```json
{
  "userId": 123,
  "appId": 1,
  "email": "user@example.com",
  "roles": ["user"]
}
```

For admin endpoints, the token must include `"admin"` in the roles array.

## Integration with Admin Portal

From your admin portal, you can:

1. **Configure Stripe keys per project** using the admin API
2. **Make payments** by calling the Stripe service with a JWT token that includes the `app_id`
3. **Handle webhooks** by configuring Stripe webhooks with the `app_id` parameter

Example from a Next.js admin portal:

```typescript
// Configure Stripe keys for a project
const configureStripeKeys = async (appId: number, keys: StripeKeys) => {
  const response = await fetch(
    `http://localhost:4001/api/v1/admin/projects/${appId}/keys`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(keys),
    }
  );
  return response.json();
};

// Create a checkout session for a user
const createCheckout = async (lineItems: any[]) => {
  const response = await fetch(
    "http://localhost:4001/api/v1/stripe/create-checkout-session",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getUserToken()}`, // Token includes app_id
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        line_items: lineItems,
        mode: "payment",
        success_url: "https://yourapp.com/success",
        cancel_url: "https://yourapp.com/cancel",
      }),
    }
  );
  return response.json();
};
```

## Webhook Configuration

For each project, configure webhooks in Stripe Dashboard:

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `http://your-domain:4001/api/v1/stripe/webhook?app_id={APP_ID}`
3. Select events to listen for
4. Copy the webhook signing secret to your `.env` file

## Development

```bash
# Install dependencies
npm install

# Run in development mode with auto-reload
npm run dev

# Build TypeScript (if using TS in future)
npm run build

# Run in production
npm start
```

## Security Notes

- ✅ JWT tokens are verified before processing payments
- ✅ Webhook signatures are validated
- ✅ Admin endpoints require admin role
- ✅ Secret keys are never exposed to clients
- ✅ Each project's Stripe data is isolated

## Troubleshooting

### Service won't register with Bodyguard

Make sure Bluestone Bodyguard is running:

```bash
cd bluestone_bodyguard
cargo run
```

### Authentication fails

Ensure `JWT_SECRET` matches the one in `multi_site_manager/.env`

### Wrong Stripe account used

Check that the JWT token includes the correct `app_id` field

## License

MIT
