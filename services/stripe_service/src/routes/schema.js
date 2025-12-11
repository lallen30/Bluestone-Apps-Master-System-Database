const express = require("express");
const router = express.Router();
const stripeKeyManager = require("../config/stripeKeys");
const { authenticate, optionalAuth } = require("../middleware/auth");
const crypto = require("crypto");

// Encryption key - in production, use environment variable
const ENCRYPTION_KEY =
  process.env.ENCRYPTION_KEY || "your-32-character-secret-key!!";
const ALGORITHM = "aes-256-cbc";

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_KEY.padEnd(32, "0").slice(0, 32)),
    iv
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

function decrypt(text) {
  const parts = text.split(":");
  const iv = Buffer.from(parts.shift(), "hex");
  const encryptedText = Buffer.from(parts.join(":"), "hex");
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_KEY.padEnd(32, "0").slice(0, 32)),
    iv
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

/**
 * Schema Routes - Tell admin portal what configuration we need
 * This is the contract between service and admin portal
 */

/**
 * Get service configuration schema
 * Defines what settings this service needs
 */
router.post("/getSchema", optionalAuth, (req, res) => {
  try {
    const schema = {
      fields: [
        {
          name: "secretKey",
          label: "Secret Key",
          type: "password",
          required: true,
          description: "Your Stripe secret key (sk_test_... or sk_live_...)",
          placeholder: "sk_test_...",
        },
        {
          name: "publishableKey",
          label: "Publishable Key",
          type: "text",
          required: true,
          description:
            "Your Stripe publishable key (safe to expose to clients)",
          placeholder: "pk_test_...",
        },
        {
          name: "webhookSecret",
          label: "Webhook Secret",
          type: "password",
          required: false,
          description: "Webhook signing secret from Stripe Dashboard",
          placeholder: "whsec_...",
        },
      ],
      capabilities: [
        "Checkout Sessions",
        "Payment Intents",
        "Subscriptions",
        "Customer Management",
        "Webhook Processing",
      ],
      documentation: {
        setup: "Get your keys from https://dashboard.stripe.com/apikeys",
        webhook: "Configure webhook endpoint with ?app_id={appId} parameter",
      },
    };

    res.json({
      success: true,
      ...schema,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get schema",
      error: error.message,
    });
  }
});

/**
 * Get current configuration for an app
 * Returns non-sensitive config info
 */
router.post("/getConfig", optionalAuth, (req, res) => {
  try {
    const { appId } = req.body;
    const publishableKey = stripeKeyManager.getPublishableKey(appId);
    const stripe = stripeKeyManager.getStripeInstance(appId);

    const hasCustomKeys = stripeKeyManager
      .listProjects()
      .includes(appId?.toString());

    res.json({
      success: true,
      appId: appId || "default",
      publishableKey,
      hasSecretKey: !!stripe, // Indicates if secret key is configured without revealing it
      hasWebhookSecret: false, // TODO: Track this separately
      hasCustomKeys,
      configured: !!publishableKey && !!stripe,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get configuration",
      error: error.message,
    });
  }
});

/**
 * Update configuration for an app
 * Admin portal configuration - no auth required for now
 */
router.post("/updateConfig", optionalAuth, async (req, res) => {
  try {
    const { appId, config } = req.body;

    if (!appId || !config) {
      return res.status(400).json({
        success: false,
        message: "appId and config are required",
      });
    }

    if (!config.secretKey) {
      return res.status(400).json({
        success: false,
        message: "secretKey is required in config",
      });
    }

    // Encrypt sensitive keys before storing
    const encryptedConfig = {
      secretKey: encrypt(config.secretKey),
      publishableKey: config.publishableKey, // Not sensitive, can be public
      webhookSecret: config.webhookSecret
        ? encrypt(config.webhookSecret)
        : null,
    };

    // Update in-memory key manager with decrypted keys
    const result = await stripeKeyManager.updateProjectKeys(appId, {
      secretKey: config.secretKey,
      publishableKey: config.publishableKey,
      webhookSecret: config.webhookSecret,
    });

    if (result.success) {
      res.json({
        success: true,
        message: `Stripe keys configured for project ${appId}`,
        encryptedConfig, // Return encrypted config so it can be saved to database
      });
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update configuration",
      error: error.message,
    });
  }
});

/**
 * Test service connection
 */
router.post("/testConnection", optionalAuth, async (req, res) => {
  try {
    // TODO: Add proper admin authentication once admin portal sends JWT tokens

    const { appId } = req.body;
    const stripe = stripeKeyManager.getStripeInstance(appId);

    // Test the connection by retrieving balance
    const balance = await stripe.balance.retrieve();

    res.json({
      success: true,
      message: "Stripe connection successful",
      balance: {
        available: balance.available,
        pending: balance.pending,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Connection test failed",
      error: error.message,
    });
  }
});

module.exports = router;
