const axios = require("axios");

const API_URL =
  process.env.API_URL ||
  process.env.BODYGUARD_URL?.replace("/bodyguard", "") ||
  "http://api:3000";

/**
 * Load Stripe keys from the database for a specific app
 */
async function loadStripeKeysFromDB(appId) {
  try {
    console.log(
      `[loadStripeKeysFromDB] Fetching keys for app ${appId} from ${API_URL}`
    );

    const response = await axios.get(
      `${API_URL}/api/v1/apps/${appId}/services/stripe-service/config`,
      {
        timeout: 5000,
        // No auth required since this is internal service-to-service communication
      }
    );

    if (response.data?.success && response.data?.config) {
      const config = response.data.config;
      console.log(
        `[loadStripeKeysFromDB] Found config for app ${appId}:`,
        JSON.stringify(config, null, 2)
      );

      const keys = {
        secretKey:
          config.stripe_secret_key || config.secretKey || config.secret_key,
        publishableKey:
          config.stripe_publishable_key ||
          config.publishableKey ||
          config.publishable_key,
        webhookSecret:
          config.stripe_webhook_secret ||
          config.webhookSecret ||
          config.webhook_secret,
      };

      console.log(`[loadStripeKeysFromDB] Extracted keys:`, {
        hasSecretKey: !!keys.secretKey,
        hasPublishableKey: !!keys.publishableKey,
        hasWebhookSecret: !!keys.webhookSecret,
      });

      return keys;
    }

    console.log(`[loadStripeKeysFromDB] No config found for app ${appId}`);
    return null;
  } catch (error) {
    if (error.response?.status === 404) {
      console.log(
        `[loadStripeKeysFromDB] No Stripe config found for app ${appId}`
      );
    } else if (error.response?.status === 401) {
      console.log(
        `[loadStripeKeysFromDB] Auth required - skipping DB keys for app ${appId}`
      );
    } else {
      console.error(
        `[loadStripeKeysFromDB] Error fetching keys for app ${appId}:`,
        error.message
      );
    }
    return null;
  }
}

module.exports = { loadStripeKeysFromDB };
