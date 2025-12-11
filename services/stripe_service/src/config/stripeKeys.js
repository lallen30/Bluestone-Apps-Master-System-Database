/**
 * Multi-project Stripe key management
 * Each project/app can have its own Stripe keys
 */

class StripeKeyManager {
  constructor() {
    // Store Stripe instances per project
    this.stripeInstances = new Map();

    // Load default/master keys from environment
    this.defaultKeys = {
      secretKey: process.env.STRIPE_SECRET_KEY,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    };

    // Load project-specific keys from environment or database
    this.loadProjectKeys();
  }

  /**
   * Load project-specific Stripe keys
   * Format: STRIPE_PROJECT_{APP_ID}_SECRET_KEY, etc.
   */
  loadProjectKeys() {
    // Parse environment variables for project-specific keys
    const envKeys = Object.keys(process.env);

    envKeys.forEach((key) => {
      const match = key.match(/^STRIPE_PROJECT_(\d+)_SECRET_KEY$/);
      if (match) {
        const appId = match[1];
        const projectKeys = {
          secretKey: process.env[`STRIPE_PROJECT_${appId}_SECRET_KEY`],
          publishableKey:
            process.env[`STRIPE_PROJECT_${appId}_PUBLISHABLE_KEY`],
          webhookSecret: process.env[`STRIPE_PROJECT_${appId}_WEBHOOK_SECRET`],
        };

        if (projectKeys.secretKey) {
          this.setProjectKeys(appId, projectKeys);
          console.log(`✅ Loaded Stripe keys for project ${appId}`);
        }
      }
    });
  }

  /**
   * Set Stripe keys for a specific project
   */
  setProjectKeys(appId, keys) {
    const stripe = require("stripe")(keys.secretKey);

    this.stripeInstances.set(appId.toString(), {
      stripe,
      keys: {
        secretKey: keys.secretKey,
        publishableKey: keys.publishableKey,
        webhookSecret: keys.webhookSecret,
      },
    });
  }

  /**
   * Get Stripe instance for a specific project
   */
  async getStripeInstance(appId) {
    if (!appId) {
      // Return default Stripe instance
      if (!this.defaultStripe) {
        this.defaultStripe = require("stripe")(this.defaultKeys.secretKey);
      }
      return this.defaultStripe;
    }

    const projectData = this.stripeInstances.get(appId.toString());

    if (!projectData) {
      // Try to load from database
      console.log(
        `⚠️  No Stripe keys found in memory for project ${appId}, checking database...`
      );
      const { loadStripeKeysFromDB } = require("./loadKeysFromDB");
      const dbKeys = await loadStripeKeysFromDB(appId);

      if (dbKeys && dbKeys.secretKey) {
        console.log(`✅ Loaded Stripe keys from database for project ${appId}`);
        this.setProjectKeys(appId, dbKeys);
        return this.stripeInstances.get(appId.toString()).stripe;
      }

      console.warn(
        `⚠️  No Stripe keys found for project ${appId}, using default keys`
      );
      if (!this.defaultStripe) {
        this.defaultStripe = require("stripe")(this.defaultKeys.secretKey);
      }
      return this.defaultStripe;
    }

    return projectData.stripe;
  }

  /**
   * Get publishable key for a project (safe to expose to client)
   */
  getPublishableKey(appId) {
    if (!appId) {
      return this.defaultKeys.publishableKey;
    }

    const projectData = this.stripeInstances.get(appId.toString());
    return projectData
      ? projectData.keys.publishableKey
      : this.defaultKeys.publishableKey;
  }

  /**
   * Get webhook secret for a project
   */
  getWebhookSecret(appId) {
    if (!appId) {
      return this.defaultKeys.webhookSecret;
    }

    const projectData = this.stripeInstances.get(appId.toString());
    return projectData
      ? projectData.keys.webhookSecret
      : this.defaultKeys.webhookSecret;
  }

  /**
   * Add or update project keys at runtime
   */
  async updateProjectKeys(appId, keys) {
    try {
      // Validate the secret key by creating a Stripe instance
      const stripe = require("stripe")(keys.secretKey);

      // Test the key with a simple API call
      await stripe.balance.retrieve();

      this.setProjectKeys(appId, keys);
      console.log(`✅ Updated Stripe keys for project ${appId}`);

      return { success: true, message: "Stripe keys updated successfully" };
    } catch (error) {
      console.error(
        `❌ Failed to update Stripe keys for project ${appId}:`,
        error.message
      );
      return {
        success: false,
        message: "Invalid Stripe keys",
        error: error.message,
      };
    }
  }

  /**
   * Remove project keys
   */
  removeProjectKeys(appId) {
    this.stripeInstances.delete(appId.toString());
    console.log(`🗑️  Removed Stripe keys for project ${appId}`);
  }

  /**
   * List all configured projects
   */
  listProjects() {
    return Array.from(this.stripeInstances.keys());
  }
}

// Singleton instance
const stripeKeyManager = new StripeKeyManager();

module.exports = stripeKeyManager;
