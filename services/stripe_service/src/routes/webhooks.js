const express = require("express");
const router = express.Router();
const stripeKeyManager = require("../config/stripeKeys");

/**
 * Webhook handler for Stripe events
 * This endpoint receives events from Stripe and processes them
 *
 * Note: Webhooks should be configured per project in Stripe dashboard
 * Each project can have different webhook endpoints or use app_id to route
 */
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    // Try to determine which project this webhook is for
    // Option 1: Use different webhook endpoints per project
    // Option 2: Parse the event and check metadata
    // Option 3: Use query parameter ?app_id=123

    const appId = req.query.app_id;

    let event;

    try {
      const webhookSecret = stripeKeyManager.getWebhookSecret(appId);
      const stripe = stripeKeyManager.getStripeInstance(appId);

      // Verify webhook signature
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error("⚠️  Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    console.log(
      `📨 Received webhook event: ${event.type} for app ${appId || "default"}`
    );

    try {
      switch (event.type) {
        case "checkout.session.completed":
          await handleCheckoutSessionCompleted(event.data.object);
          break;

        case "payment_intent.succeeded":
          await handlePaymentIntentSucceeded(event.data.object);
          break;

        case "payment_intent.payment_failed":
          await handlePaymentIntentFailed(event.data.object);
          break;

        case "customer.subscription.created":
          await handleSubscriptionCreated(event.data.object);
          break;

        case "customer.subscription.updated":
          await handleSubscriptionUpdated(event.data.object);
          break;

        case "customer.subscription.deleted":
          await handleSubscriptionDeleted(event.data.object);
          break;

        case "invoice.paid":
          await handleInvoicePaid(event.data.object);
          break;

        case "invoice.payment_failed":
          await handleInvoicePaymentFailed(event.data.object);
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      res.json({ received: true, event: event.type });
    } catch (error) {
      console.error("Error processing webhook:", error);
      res.status(500).json({ error: "Webhook processing failed" });
    }
  }
);

// Webhook event handlers

async function handleCheckoutSessionCompleted(session) {
  console.log("✅ Checkout session completed:", session.id);
  console.log("   Customer:", session.customer);
  console.log("   Amount:", session.amount_total);
  console.log("   Metadata:", session.metadata);

  // TODO: Update your database with the successful payment
  // - Mark order as paid
  // - Grant access to product/service
  // - Send confirmation email
  // - Update user subscription status
}

async function handlePaymentIntentSucceeded(paymentIntent) {
  console.log("✅ Payment succeeded:", paymentIntent.id);
  console.log("   Amount:", paymentIntent.amount);
  console.log("   Metadata:", paymentIntent.metadata);

  // TODO: Fulfill the order
}

async function handlePaymentIntentFailed(paymentIntent) {
  console.log("❌ Payment failed:", paymentIntent.id);
  console.log("   Error:", paymentIntent.last_payment_error?.message);
  console.log("   Metadata:", paymentIntent.metadata);

  // TODO: Notify user of payment failure
}

async function handleSubscriptionCreated(subscription) {
  console.log("🆕 Subscription created:", subscription.id);
  console.log("   Customer:", subscription.customer);
  console.log("   Status:", subscription.status);
  console.log("   Metadata:", subscription.metadata);

  // TODO: Grant access to subscription features
}

async function handleSubscriptionUpdated(subscription) {
  console.log("🔄 Subscription updated:", subscription.id);
  console.log("   Status:", subscription.status);
  console.log("   Metadata:", subscription.metadata);

  // TODO: Update user's subscription status in database
}

async function handleSubscriptionDeleted(subscription) {
  console.log("🗑️  Subscription deleted:", subscription.id);
  console.log("   Metadata:", subscription.metadata);

  // TODO: Revoke access to subscription features
}

async function handleInvoicePaid(invoice) {
  console.log("💰 Invoice paid:", invoice.id);
  console.log("   Subscription:", invoice.subscription);
  console.log("   Amount:", invoice.amount_paid);

  // TODO: Record payment in database
}

async function handleInvoicePaymentFailed(invoice) {
  console.log("❌ Invoice payment failed:", invoice.id);
  console.log("   Subscription:", invoice.subscription);

  // TODO: Notify user and potentially suspend service
}

module.exports = router;
