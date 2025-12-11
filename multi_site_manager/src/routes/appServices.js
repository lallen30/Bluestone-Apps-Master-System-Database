const express = require("express");
const router = express.Router();
const db = require("../config/database");
const { authenticate } = require("../middleware/auth");

/**
 * Get enabled services for an app
 * GET /api/v1/apps/:appId/services/enabled
 * Note: This endpoint does not require authentication as it's used by mobile apps
 * to determine which features are available before user login
 */
router.get("/:appId/services/enabled", async (req, res) => {
  try {
    const { appId } = req.params;

    console.log(`[appServices] Fetching enabled services for app ${appId}`);

    const services = await db.query(
      `SELECT id, app_id, service_name, service_id, enabled, created_at, updated_at
       FROM app_services
       WHERE app_id = ? AND enabled = TRUE
       ORDER BY service_name`,
      [appId]
    );

    const serviceList = Array.isArray(services[0]) ? services[0] : services;
    console.log(
      `[appServices] Found ${serviceList.length} enabled services:`,
      serviceList.map((s) => s.service_name)
    );

    res.json({
      success: true,
      services: serviceList,
    });
  } catch (error) {
    console.error("Error fetching enabled services:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Failed to fetch enabled services",
      error: error.message,
    });
  }
});

/**
 * Get all services for an app (enabled and disabled)
 * GET /api/v1/apps/:appId/services
 */
router.get("/:appId/services", authenticate, async (req, res) => {
  try {
    const { appId } = req.params;

    const services = await db.query(
      `SELECT id, app_id, service_name, service_id, enabled, created_at, updated_at
       FROM app_services
       WHERE app_id = ?
       ORDER BY service_name`,
      [appId]
    );

    res.json({
      success: true,
      services: Array.isArray(services[0]) ? services[0] : services,
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch services",
      error: error.message,
    });
  }
});

/**
 * Enable a service for an app
 * POST /api/v1/apps/:appId/services/enable
 */
router.post("/:appId/services/enable", authenticate, async (req, res) => {
  try {
    const { appId } = req.params;
    const { service_name, service_id } = req.body;

    if (!service_name || !service_id) {
      return res.status(400).json({
        success: false,
        message: "service_name and service_id are required",
      });
    }

    // Check if service already exists for this app
    const existing = await db.query(
      `SELECT id, enabled FROM app_services 
       WHERE app_id = ? AND service_name = ?`,
      [appId, service_name]
    );

    const existingService =
      Array.isArray(existing[0]) && existing[0].length > 0
        ? existing[0][0]
        : Array.isArray(existing) && existing.length > 0
        ? existing[0]
        : null;

    if (existingService) {
      // Update to enabled
      await db.query(
        `UPDATE app_services 
         SET enabled = TRUE, service_id = ?, updated_at = NOW()
         WHERE id = ?`,
        [service_id, existingService.id]
      );
    } else {
      // Insert new
      await db.query(
        `INSERT INTO app_services (app_id, service_name, service_id, enabled, created_by)
         VALUES (?, ?, ?, TRUE, ?)`,
        [appId, service_name, service_id, req.user.id]
      );
    }

    res.json({
      success: true,
      message: `Service ${service_name} enabled for app ${appId}`,
    });
  } catch (error) {
    console.error("Error enabling service:", error);
    res.status(500).json({
      success: false,
      message: "Failed to enable service",
      error: error.message,
    });
  }
});

/**
 * Disable a service for an app
 * POST /api/v1/apps/:appId/services/disable
 */
router.post("/:appId/services/disable", authenticate, async (req, res) => {
  try {
    const { appId } = req.params;
    const { service_name } = req.body;

    if (!service_name) {
      return res.status(400).json({
        success: false,
        message: "service_name is required",
      });
    }

    await db.query(
      `UPDATE app_services 
       SET enabled = FALSE, updated_at = NOW()
       WHERE app_id = ? AND service_name = ?`,
      [appId, service_name]
    );

    res.json({
      success: true,
      message: `Service ${service_name} disabled for app ${appId}`,
    });
  } catch (error) {
    console.error("Error disabling service:", error);
    res.status(500).json({
      success: false,
      message: "Failed to disable service",
      error: error.message,
    });
  }
});

/**
 * Update service configuration
 * PUT /api/v1/apps/:appId/services/:serviceName/config
 */
router.put(
  "/:appId/services/:serviceName/config",
  authenticate,
  async (req, res) => {
    try {
      const { appId, serviceName } = req.params;
      const { config } = req.body;

      console.log(
        `[appServices] Updating config for app ${appId}, service ${serviceName}`
      );
      console.log(
        `[appServices] Config data:`,
        JSON.stringify(config, null, 2)
      );

      if (!config) {
        return res.status(400).json({
          success: false,
          message: "config is required",
        });
      }

      // Store config as JSON
      const result = await db.query(
        `UPDATE app_services 
       SET config = ?, updated_at = NOW()
       WHERE app_id = ? AND service_name = ?`,
        [JSON.stringify(config), appId, serviceName]
      );

      console.log(`[appServices] Update result:`, result);

      res.json({
        success: true,
        message: `Configuration updated for ${serviceName}`,
      });
    } catch (error) {
      console.error("Error updating service config:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update service configuration",
        error: error.message,
      });
    }
  }
);

/**
 * Get service configuration
 * GET /api/v1/apps/:appId/services/:serviceName/config
 * Note: No authentication required for internal service-to-service communication
 */
router.get("/:appId/services/:serviceName/config", async (req, res) => {
  try {
    const { appId, serviceName } = req.params;

    console.log(
      `[appServices] Fetching config for app ${appId}, service ${serviceName}`
    );

    const result = await db.query(
      `SELECT config FROM app_services 
       WHERE app_id = ? AND service_name = ?`,
      [appId, serviceName]
    );

    const service =
      Array.isArray(result[0]) && result[0].length > 0
        ? result[0][0]
        : Array.isArray(result) && result.length > 0
        ? result[0]
        : null;

    if (!service) {
      console.log(
        `[appServices] Service not found: ${serviceName} for app ${appId}`
      );
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    console.log(`[appServices] Raw config from DB:`, service.config);

    let parsedConfig = null;
    if (service.config) {
      try {
        // Config might already be an object (MySQL JSON type) or a string
        parsedConfig =
          typeof service.config === "string"
            ? JSON.parse(service.config)
            : service.config;
      } catch (parseError) {
        console.error(`[appServices] Failed to parse config:`, parseError);
        parsedConfig = null;
      }
    }

    console.log(`[appServices] Parsed config:`, parsedConfig);

    res.json({
      success: true,
      config: parsedConfig,
    });
  } catch (error) {
    console.error("Error fetching service config:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Failed to fetch service configuration",
      error: error.message,
    });
  }
});

module.exports = router;
