const express = require("express");
const router = express.Router();
const stripeKeyManager = require("../config/stripeKeys");
const { authenticate } = require("../middleware/auth");

/**
 * Admin routes for managing Stripe keys per project
 * These endpoints should be protected and only accessible by admin users
 */

/**
 * Middleware to check if user is admin
 */
const requireAdmin = (req, res, next) => {
  if (!req.auth || !req.auth.roles || !req.auth.roles.includes("admin")) {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }
  next();
};

/**
 * List all configured projects
 */
router.get("/projects", authenticate, requireAdmin, (req, res) => {
  try {
    const projects = stripeKeyManager.listProjects();

    res.json({
      success: true,
      projects,
      count: projects.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to list projects",
      error: error.message,
    });
  }
});

/**
 * Get publishable key for a specific project
 */
router.get(
  "/projects/:appId/publishable-key",
  authenticate,
  requireAdmin,
  (req, res) => {
    try {
      const { appId } = req.params;
      const publishableKey = stripeKeyManager.getPublishableKey(appId);

      res.json({
        success: true,
        appId,
        publishableKey,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to get publishable key",
        error: error.message,
      });
    }
  }
);

/**
 * Add or update Stripe keys for a project
 */
router.post(
  "/projects/:appId/keys",
  authenticate,
  requireAdmin,
  async (req, res) => {
    try {
      const { appId } = req.params;
      const { secretKey, publishableKey, webhookSecret } = req.body;

      if (!secretKey) {
        return res.status(400).json({
          success: false,
          message: "Secret key is required",
        });
      }

      const result = await stripeKeyManager.updateProjectKeys(appId, {
        secretKey,
        publishableKey,
        webhookSecret,
      });

      if (result.success) {
        res.json({
          success: true,
          message: `Stripe keys configured for project ${appId}`,
          appId,
        });
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to update project keys",
        error: error.message,
      });
    }
  }
);

/**
 * Remove Stripe keys for a project
 */
router.delete(
  "/projects/:appId/keys",
  authenticate,
  requireAdmin,
  (req, res) => {
    try {
      const { appId } = req.params;
      stripeKeyManager.removeProjectKeys(appId);

      res.json({
        success: true,
        message: `Stripe keys removed for project ${appId}`,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to remove project keys",
        error: error.message,
      });
    }
  }
);

/**
 * Test Stripe connection for a project
 */
router.get(
  "/projects/:appId/test",
  authenticate,
  requireAdmin,
  async (req, res) => {
    try {
      const { appId } = req.params;
      const stripe = stripeKeyManager.getStripeInstance(appId);

      // Test the connection by retrieving balance
      const balance = await stripe.balance.retrieve();

      res.json({
        success: true,
        message: "Stripe connection successful",
        appId,
        balance: {
          available: balance.available,
          pending: balance.pending,
          currency: balance.available[0]?.currency,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Stripe connection test failed",
        error: error.message,
      });
    }
  }
);

module.exports = router;
