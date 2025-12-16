require("dotenv").config();
const express = require("express");
const cors = require("cors");
const BodyguardClient = require("./bodyguard");
const stripeKeyManager = require("./config/stripeKeys");

// Import routes
const stripeRoutes = require("./routes/stripe");
const webhookRoutes = require("./routes/webhooks");
const adminRoutes = require("./routes/admin");
const schemaRoutes = require("./routes/schema");

const app = express();

// Configuration
const PORT = process.env.SERVICE_PORT || 4001;
const SERVICE_ID = process.env.SERVICE_ID || "stripe-service-1";
const SERVICE_NAME = process.env.SERVICE_NAME || "stripe-service";
const BODYGUARD_URL = process.env.BODYGUARD_URL || "http://localhost:3032";
const SERVICE_URL = process.env.SERVICE_URL || `http://localhost:${PORT}`;

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);

// Webhook route MUST come before express.json() middleware
// because Stripe webhooks need raw body
app.use("/api/v1/stripe", webhookRoutes);

// Body parsing middleware (after webhook routes)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static("public"));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    service: SERVICE_NAME,
    serviceId: SERVICE_ID,
    status: "healthy",
    timestamp: new Date().toISOString(),
    configuredProjects: stripeKeyManager.listProjects(),
  });
});

// API routes
app.use("/api/v1/stripe", stripeRoutes);
app.use("/api/v1/admin", adminRoutes);

// Schema routes for admin portal integration (generic service interface)
app.use("/service", schemaRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
  });
});

// Initialize Bodyguard client
const bodyguard = new BodyguardClient({
  serviceId: SERVICE_ID,
  serviceName: SERVICE_NAME,
  serviceVersion: 1,
  serviceDescription: "Multi-project Stripe payment processing service",
  bodyguardUrl: BODYGUARD_URL,
  serviceUrl: SERVICE_URL,
});

// Start server
app.listen(PORT, async () => {
  console.log("\n🚀 Stripe Service Starting...");
  console.log("================================");
  console.log(`📍 Service: ${SERVICE_NAME}`);
  console.log(`🆔 Service ID: ${SERVICE_ID}`);
  console.log(`🌐 Port: ${PORT}`);
  console.log(`🔗 URL: ${SERVICE_URL}`);
  console.log(`🛡️  Bodyguard: ${BODYGUARD_URL}`);
  console.log("================================\n");

  // Register with Bluestone Bodyguard
  try {
    await bodyguard.register();
    console.log("✅ Service registered with Bluestone Bodyguard\n");
  } catch (error) {
    console.error(
      "⚠️  Failed to register with Bodyguard, but service will continue running"
    );
    console.error("   Error:", error.message);
    console.error(
      "   Make sure Bluestone Bodyguard is running at",
      BODYGUARD_URL,
      "\n"
    );
  }

  // Log configured projects
  const projects = stripeKeyManager.listProjects();
  if (projects.length > 0) {
    console.log("📦 Configured projects:", projects.join(", "));
  } else {
    console.log("📦 No project-specific keys configured, using default keys");
  }

  console.log("\n✅ Stripe Service is ready!\n");
});
