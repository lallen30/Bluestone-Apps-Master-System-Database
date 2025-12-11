#!/bin/bash

echo "🧪 Testing Stripe Service Endpoints"
echo "===================================="
echo ""

APP_ID="56"
BASE_URL="http://localhost:4001"

echo "1️⃣  Testing Health Check..."
curl -s "$BASE_URL/health" | jq '.'
echo ""

echo "2️⃣  Creating a Product..."
PRODUCT_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/stripe/products" \
  -H "Content-Type: application/json" \
  -d "{
    \"app_id\": \"$APP_ID\",
    \"name\": \"Test Product\",
    \"description\": \"A test product from the API\"
  }")
echo "$PRODUCT_RESPONSE" | jq '.'

PRODUCT_ID=$(echo "$PRODUCT_RESPONSE" | jq -r '.product.id // empty')
echo ""

if [ -z "$PRODUCT_ID" ]; then
  echo "❌ Product creation failed. Make sure you've configured your Stripe keys in the settings page!"
  exit 1
fi

echo "✅ Product created: $PRODUCT_ID"
echo ""

echo "3️⃣  Creating a Price for the Product..."
PRICE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/stripe/prices" \
  -H "Content-Type: application/json" \
  -d "{
    \"app_id\": \"$APP_ID\",
    \"product_id\": \"$PRODUCT_ID\",
    \"unit_amount\": 2999,
    \"currency\": \"usd\"
  }")
echo "$PRICE_RESPONSE" | jq '.'

PRICE_ID=$(echo "$PRICE_RESPONSE" | jq -r '.price.id // empty')
echo ""

if [ -z "$PRICE_ID" ]; then
  echo "❌ Price creation failed!"
  exit 1
fi

echo "✅ Price created: $PRICE_ID ($29.99 USD)"
echo ""

echo "4️⃣  Creating a Customer..."
CUSTOMER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/stripe/customer" \
  -H "Content-Type: application/json" \
  -d "{
    \"app_id\": \"$APP_ID\",
    \"email\": \"test@example.com\",
    \"name\": \"Test Customer\"
  }")
echo "$CUSTOMER_RESPONSE" | jq '.'

CUSTOMER_ID=$(echo "$CUSTOMER_RESPONSE" | jq -r '.customer.id // empty')
echo ""

if [ -z "$CUSTOMER_ID" ]; then
  echo "❌ Customer creation failed!"
  exit 1
fi

echo "✅ Customer created: $CUSTOMER_ID"
echo ""

echo "5️⃣  Creating a Checkout Session..."
CHECKOUT_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/stripe/checkout-session" \
  -H "Content-Type: application/json" \
  -d "{
    \"app_id\": \"$APP_ID\",
    \"price_id\": \"$PRICE_ID\",
    \"success_url\": \"https://example.com/success\",
    \"cancel_url\": \"https://example.com/cancel\"
  }")
echo "$CHECKOUT_RESPONSE" | jq '.'

CHECKOUT_URL=$(echo "$CHECKOUT_RESPONSE" | jq -r '.url // empty')
echo ""

if [ -z "$CHECKOUT_URL" ]; then
  echo "❌ Checkout session creation failed!"
  exit 1
fi

echo "✅ Checkout session created!"
echo "   URL: $CHECKOUT_URL"
echo ""

echo "6️⃣  Creating a Payment Intent..."
PAYMENT_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/stripe/payment-intent" \
  -H "Content-Type: application/json" \
  -d "{
    \"app_id\": \"$APP_ID\",
    \"amount\": 1999,
    \"currency\": \"usd\"
  }")
echo "$PAYMENT_RESPONSE" | jq '.'

PAYMENT_ID=$(echo "$PAYMENT_RESPONSE" | jq -r '.paymentIntentId // empty')
echo ""

if [ -z "$PAYMENT_ID" ]; then
  echo "❌ Payment intent creation failed!"
  exit 1
fi

echo "✅ Payment intent created: $PAYMENT_ID ($19.99 USD)"
echo ""

echo "7️⃣  Testing Connection via Schema Endpoint..."
TEST_RESPONSE=$(curl -s -X POST "$BASE_URL/service/testConnection" \
  -H "Content-Type: application/json" \
  -d "{
    \"appId\": \"$APP_ID\"
  }")
echo "$TEST_RESPONSE" | jq '.'
echo ""

echo "================================"
echo "✅ All Stripe Endpoints Working!"
echo "================================"
echo ""
echo "Summary:"
echo "  • Product: $PRODUCT_ID"
echo "  • Price: $PRICE_ID ($29.99)"
echo "  • Customer: $CUSTOMER_ID"
echo "  • Checkout URL: $CHECKOUT_URL"
echo "  • Payment Intent: $PAYMENT_ID ($19.99)"
echo ""
echo "💡 You can view these in your Stripe Dashboard:"
echo "   https://dashboard.stripe.com/test/products"
echo "   https://dashboard.stripe.com/test/customers"
echo "   https://dashboard.stripe.com/test/payments"
