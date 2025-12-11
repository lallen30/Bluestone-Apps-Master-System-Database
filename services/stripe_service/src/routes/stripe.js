const express = require("express");
const router = express.Router();
const stripeKeyManager = require("../config/stripeKeys");
const { authenticate, optionalAuth } = require("../middleware/auth");

/**
 * Get publishable key for the client
 * This endpoint can be called with or without authentication
 * If authenticated, returns the key for the user's project
 */
router.get("/config", optionalAuth, (req, res) => {
  try {
    const appId = req.auth?.appId;
    const publishableKey = stripeKeyManager.getPublishableKey(appId);

    res.json({
      success: true,
      publishableKey,
      appId: appId || "default",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get Stripe configuration",
      error: error.message,
    });
  }
});

/**
 * Create a checkout session
 * Requires authentication to determine which Stripe account to use
 */
router.post("/checkout-session", optionalAuth, async (req, res) => {
  try {
    const appId = req.body.app_id || req.auth?.appId;
    const stripe = await stripeKeyManager.getStripeInstance(appId);

    const {
      price_id,
      line_items,
      mode,
      success_url,
      cancel_url,
      metadata,
      quantity,
    } = req.body;

    // Validate required fields
    if ((!price_id && !line_items) || !success_url || !cancel_url) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: (price_id or line_items), success_url, cancel_url",
      });
    }

    // Build line items from price_id if provided
    const sessionLineItems = line_items || [
      {
        price: price_id,
        quantity: quantity || 1,
      },
    ];

    // Add user context to metadata
    const sessionMetadata = {
      ...metadata,
      app_id: appId,
      user_id: req.auth?.userId,
      user_email: req.auth?.email,
    };

    // Support optional Stripe Connect parameters
    const { connected_account, application_fee_amount } = req.body;

    const sessionOptions = {
      line_items: sessionLineItems,
      mode: mode || "payment",
      success_url,
      cancel_url,
      metadata: sessionMetadata,
      customer_email: req.auth?.email,
    };

    // If a connected_account is provided and we are using the platform default
    // keys (i.e. no per-project key configured), attach transfer_data so
    // funds are routed to the connected account. If this project has its own
    // Stripe secret key configured, we assume the key is for the connected
    // account and do not add transfer_data.
    const hasProjectKey = stripeKeyManager
      .listProjects()
      .includes(String(appId));

    if (connected_account && !hasProjectKey) {
      sessionOptions.payment_intent_data = {
        transfer_data: { destination: connected_account },
      };

      if (application_fee_amount) {
        // application_fee_amount should be provided in cents
        sessionOptions.payment_intent_data.application_fee_amount = parseInt(
          application_fee_amount,
          10
        );
      }
    }

    const session = await stripe.checkout.sessions.create(sessionOptions);

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create checkout session",
      error: error.message,
    });
  }
});

/**
 * Create a payment intent
 */
router.post("/payment-intent", optionalAuth, async (req, res) => {
  try {
    const appId = req.body.app_id || req.auth?.appId;
    const stripe = await stripeKeyManager.getStripeInstance(appId);

    const { amount, currency, metadata } = req.body;

    if (!amount || !currency) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: amount, currency",
      });
    }

    const paymentIntentMetadata = {
      ...metadata,
      app_id: appId,
      user_id: req.auth?.userId,
      user_email: req.auth?.email,
    };

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: paymentIntentMetadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create payment intent",
      error: error.message,
    });
  }
});

/**
 * Create a customer
 */
router.post("/customer", optionalAuth, async (req, res) => {
  try {
    const appId = req.body.app_id || req.auth?.appId;
    const stripe = await stripeKeyManager.getStripeInstance(appId);

    const { email, name, metadata } = req.body;

    const customerMetadata = {
      ...metadata,
      app_id: appId,
      user_id: req.auth?.userId,
    };

    const customer = await stripe.customers.create({
      email: email || req.auth?.email,
      name,
      metadata: customerMetadata,
    });

    res.json({
      success: true,
      customerId: customer.id,
      customer,
    });
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create customer",
      error: error.message,
    });
  }
});

/**
 * Get customer by ID
 */
router.get("/customer/:customerId", authenticate, async (req, res) => {
  try {
    const appId = req.auth.appId;
    const stripe = await stripeKeyManager.getStripeInstance(appId);
    const { customerId } = req.params;

    const customer = await stripe.customers.retrieve(customerId);

    res.json({
      success: true,
      customer,
    });
  } catch (error) {
    console.error("Error retrieving customer:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve customer",
      error: error.message,
    });
  }
});

/**
 * Create a subscription
 */
router.post("/create-subscription", authenticate, async (req, res) => {
  try {
    const appId = req.auth.appId;
    const stripe = await stripeKeyManager.getStripeInstance(appId);

    const { customerId, priceId, metadata } = req.body;

    if (!customerId || !priceId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: customerId, priceId",
      });
    }

    const subscriptionMetadata = {
      ...metadata,
      app_id: appId,
      user_id: req.auth.userId,
    };

    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      metadata: subscriptionMetadata,
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
    });

    res.json({
      success: true,
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      subscription,
    });
  } catch (error) {
    console.error("Error creating subscription:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create subscription",
      error: error.message,
    });
  }
});

/**
 * Cancel a subscription
 */
router.post(
  "/cancel-subscription/:subscriptionId",
  authenticate,
  async (req, res) => {
    try {
      const appId = req.auth.appId;
      const stripe = await stripeKeyManager.getStripeInstance(appId);
      const { subscriptionId } = req.params;

      const subscription = await stripe.subscriptions.cancel(subscriptionId);

      res.json({
        success: true,
        subscription,
      });
    } catch (error) {
      console.error("Error canceling subscription:", error);
      res.status(500).json({
        success: false,
        message: "Failed to cancel subscription",
        error: error.message,
      });
    }
  }
);

/**
 * Create a product
 */
router.post("/products", optionalAuth, async (req, res) => {
  try {
    const appId = req.body.app_id || req.auth?.appId;
    const stripe = await stripeKeyManager.getStripeInstance(appId);

    const { name, description, metadata } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Missing required field: name",
      });
    }

    const product = await stripe.products.create({
      name,
      description,
      metadata: {
        ...metadata,
        app_id: appId,
      },
    });

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
});

/**
 * List products
 */
router.get("/products", optionalAuth, async (req, res) => {
  try {
    const appId = req.auth?.appId;
    const stripe = await stripeKeyManager.getStripeInstance(appId);

    const products = await stripe.products.list({
      active: true,
      expand: ["data.default_price"],
    });

    res.json({
      success: true,
      products: products.data,
    });
  } catch (error) {
    console.error("Error listing products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to list products",
      error: error.message,
    });
  }
});

/**
 * Create a price
 */
router.post("/prices", optionalAuth, async (req, res) => {
  try {
    const appId = req.body.app_id || req.auth?.appId;
    const stripe = await stripeKeyManager.getStripeInstance(appId);

    const { product_id, unit_amount, currency, recurring, metadata } = req.body;

    if (!product_id || !unit_amount || !currency) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: product_id, unit_amount, currency",
      });
    }

    const priceData = {
      product: product_id,
      unit_amount,
      currency,
      metadata: {
        ...metadata,
        app_id: appId,
      },
    };

    if (recurring) {
      priceData.recurring = recurring;
    }

    const price = await stripe.prices.create(priceData);

    res.json({
      success: true,
      price,
    });
  } catch (error) {
    console.error("Error creating price:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create price",
      error: error.message,
    });
  }
});

/**
 * List prices
 */
router.get("/prices", optionalAuth, async (req, res) => {
  try {
    const appId = req.auth?.appId;
    const stripe = await stripeKeyManager.getStripeInstance(appId);

    const prices = await stripe.prices.list({
      active: true,
      expand: ["data.product"],
    });

    res.json({
      success: true,
      prices: prices.data,
    });
  } catch (error) {
    console.error("Error listing prices:", error);
    res.status(500).json({
      success: false,
      message: "Failed to list prices",
      error: error.message,
    });
  }
});

module.exports = router;
