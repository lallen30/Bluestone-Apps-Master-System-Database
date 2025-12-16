# Stripe Service Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
cd services/stripe_service
npm install
```

### 2. Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your actual values
nano .env
```

**Required Configuration:**

```env
# IMPORTANT: This MUST match your multi_site_manager JWT_SECRET
JWT_SECRET=your-secret-key-change-in-production

# Default Stripe keys (get from Stripe Dashboard)
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_PUBLISHABLE_KEY=pk_test_51...
STRIPE_WEBHOOK_SECRET=whsec_...

# Bluestone Bodyguard URL (default is usually fine)
BODYGUARD_URL=http://localhost:3032
```

### 3. Start Bluestone Bodyguard

Make sure Bluestone Bodyguard is running first:

```bash
cd ../../bluestone_bodyguard
cargo run
```

You should see it running on port 3032.

### 4. Start the Stripe Service

```bash
cd ../services/stripe_service
npm run dev
```

You should see:

```
🚀 Stripe Service Starting...
✅ Service registered with Bluestone Bodyguard
✅ Stripe Service is ready!
```

## Adding Project-Specific Stripe Keys

You have two options to configure different Stripe keys for different projects in your admin_portal:

### Option 1: Environment Variables (Static Configuration)

Add to your `.env` file:

```env
# For project/app with ID = 1
STRIPE_PROJECT_1_SECRET_KEY=sk_test_project1_key
STRIPE_PROJECT_1_PUBLISHABLE_KEY=pk_test_project1_key
STRIPE_PROJECT_1_WEBHOOK_SECRET=whsec_project1_secret

# For project/app with ID = 5
STRIPE_PROJECT_5_SECRET_KEY=sk_test_project5_key
STRIPE_PROJECT_5_PUBLISHABLE_KEY=pk_test_project5_key
STRIPE_PROJECT_5_WEBHOOK_SECRET=whsec_project5_secret
```

Restart the service after adding keys.

### Option 2: Admin API (Dynamic Configuration)

Use the admin API to add keys at runtime (no restart needed):

```bash
# Get an admin JWT token from your multi_site_manager
# Then call the admin endpoint:

curl -X POST http://localhost:4001/api/v1/admin/projects/1/keys \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "secretKey": "sk_test_...",
    "publishableKey": "pk_test_...",
    "webhookSecret": "whsec_..."
  }'
```

## Testing the Service

### 1. Health Check

```bash
curl http://localhost:4001/health
```

### 2. Get Stripe Config (with authentication)

First, get a JWT token from your multi_site_manager by logging in. Then:

```bash
curl http://localhost:4001/api/v1/stripe/config \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. Create a Checkout Session

```bash
curl -X POST http://localhost:4001/api/v1/stripe/create-checkout-session \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "line_items": [
      {
        "price": "price_1Sc6vaLVfXpo4tLSn5PureKO",
        "quantity": 1
      }
    ],
    "mode": "payment",
    "success_url": "http://localhost:3000/success",
    "cancel_url": "http://localhost:3000/cancel"
  }'
```

## How It Works

### Multi-Project Architecture

```
User logs in to Project 1 → Gets JWT with app_id: 1
                          ↓
User makes payment request → Stripe Service reads app_id from JWT
                          ↓
Stripe Service uses Project 1's Stripe keys
                          ↓
Payment processed in Project 1's Stripe account
```

### JWT Token Structure

The JWT token from multi_site_manager should include:

```json
{
  "userId": 123,
  "appId": 1, // ← This determines which Stripe keys to use
  "email": "user@example.com",
  "roles": ["user"]
}
```

### Webhook Routing

When configuring webhooks in Stripe Dashboard, use:

```
http://your-domain:4001/api/v1/stripe/webhook?app_id=1
```

The `app_id` parameter tells the service which project's webhook secret to use for verification.

## Integration with Admin Portal

### From Next.js Admin Portal

Create a Stripe settings page in your admin portal:

```typescript
// app/app/[id]/stripe-settings/page.tsx

const configureStripe = async (appId: number, keys: StripeKeys) => {
  const token = localStorage.getItem("auth_token");

  const response = await fetch(
    `http://localhost:4001/api/v1/admin/projects/${appId}/keys`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(keys),
    }
  );

  return response.json();
};
```

### From Mobile Apps

Your mobile apps can call the Stripe service directly:

```javascript
// Create a payment
const createPayment = async (amount, currency) => {
  const token = await getAuthToken(); // From your auth system

  const response = await fetch(
    "http://localhost:4001/api/v1/stripe/create-payment-intent",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount, currency }),
    }
  );

  const { clientSecret } = await response.json();
  // Use clientSecret with Stripe SDK
};
```

## Common Issues

### "Failed to register with Bodyguard"

**Solution**: Make sure Bluestone Bodyguard is running on port 3032:

```bash
cd bluestone_bodyguard
cargo run
```

### "Invalid token"

**Solution**: Ensure `JWT_SECRET` in stripe_service/.env matches multi_site_manager/.env

### "No Stripe keys found for project X"

**Solution**: Either:

1. Add keys to `.env` file: `STRIPE_PROJECT_X_SECRET_KEY=...`
2. Use admin API to add keys at runtime
3. Service will fall back to default keys if no project-specific keys found

### Webhook signature verification fails

**Solution**:

1. Make sure you're using the correct webhook secret for the project
2. Verify the webhook URL includes the correct `app_id` parameter
3. Check that the webhook secret in `.env` matches Stripe Dashboard

## Production Deployment

### Environment Variables

Set these in your production environment:

```env
NODE_ENV=production
SERVICE_PORT=4001
SERVICE_URL=https://stripe-service.yourdomain.com
BODYGUARD_URL=https://bodyguard.yourdomain.com
JWT_SECRET=your-production-secret
CORS_ORIGIN=https://yourdomain.com

# Production Stripe keys
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Security Checklist

- ✅ Use HTTPS in production
- ✅ Set strong JWT_SECRET
- ✅ Configure CORS_ORIGIN to your domain
- ✅ Use live Stripe keys (sk*live*... and pk*live*...)
- ✅ Set up proper webhook endpoints in Stripe Dashboard
- ✅ Implement rate limiting (add express-rate-limit)
- ✅ Set up monitoring and logging
- ✅ Use environment variables, never commit secrets

## Next Steps

1. ✅ Configure your first project's Stripe keys
2. ✅ Test creating a checkout session
3. ✅ Set up webhooks in Stripe Dashboard
4. ✅ Integrate with your admin portal
5. ✅ Test with different projects/apps

## Support

For issues or questions:

- Check the main README.md for API documentation
- Review the code in src/ directory
- Check Bluestone Bodyguard is running
- Verify JWT tokens are valid
