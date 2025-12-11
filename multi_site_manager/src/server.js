const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const cron = require("node-cron");
require("dotenv").config();

const { testConnection } = require("./config/database");
const bookingsController = require("./controllers/bookingsController");

// Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const appRoutes = require("./routes/appRoutes");
const permissionRoutes = require("./routes/permissionRoutes");
const screenRoutes = require("./routes/screenRoutes");
const screenElementRoutes = require("./routes/screenElementRoutes");
const appScreenRoutes = require("./routes/appScreenRoutes");

const mobileRoutes = require("./routes/mobileRoutes");
const mobileAuthRoutes = require("./routes/mobileAuth");
const mobileProfileRoutes = require("./routes/mobileProfile");
const mobileSettingsRoutes = require("./routes/mobileSettings");
const mobileUploadRoutes = require("./routes/mobileUpload");
const mobileScreenRoutes = require("./routes/mobileScreenRoutes");

const appUsersRoutes = require("./routes/appUsers");
const rolesRoutes = require("./routes/roles");
const templateRoutes = require("./routes/templateRoutes");
const appTemplatesRoutes = require("./routes/appTemplates");
const uploadRoutes = require("./routes/upload");
const appScreenElementsRoutes = require("./routes/appScreenElements");

const submissionsRoutes = require("./routes/submissions");
const screenRolesRoutes = require("./routes/screenRoles");

const propertyListingsRoutes = require("./routes/propertyListings");
const bookingsRoutes = require("./routes/bookings");
const messagesRoutes = require("./routes/messages");
const reviewsRoutes = require("./routes/reviews");

const menuRoutes = require("./routes/menuRoutes");
const modulesRoutes = require("./routes/modulesRoutes");

const appFormsRoutes = require("./routes/appForms");
const appFormElementsRoutes = require("./routes/appFormElements");
const favoritesRoutes = require("./routes/favorites");
const profileRoutes = require("./routes/profile");
const formSubmissionsRoutes = require("./routes/formSubmissions");

const appServicesRoutes = require("./routes/appServices");

const reportsRoutes = require("./routes/reports");
const dashboardReportsRoutes = require("./routes/dashboardReports");

const ridesRoutes = require("./routes/rides");
const driversRoutes = require("./routes/drivers");
const notificationsRoutes = require("./routes/notifications");
const realEstateRoutes = require("./routes/realEstate");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;
const API_VERSION = process.env.API_VERSION || "v1";

// Security middleware with CSP configuration to allow images from API
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "img-src": ["'self'", "data:", "http://localhost:3000", "https:"],
      },
    },
  })
);

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : "*",
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
};
app.use(cors(corsOptions));

// Rate limiting - disabled for development
// Uncomment and adjust for production use
/*
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api', limiter);
*/

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Multi-App Manager API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// API routes
app.use(`/api/${API_VERSION}/auth`, authRoutes);
app.use(`/api/${API_VERSION}/users`, userRoutes);
app.use(`/api/${API_VERSION}`, propertyListingsRoutes); // Property listings (MUST be before /apps routes)
app.use(`/api/${API_VERSION}`, bookingsRoutes); // Property bookings
app.use(`/api/${API_VERSION}`, messagesRoutes); // Messaging system
app.use(`/api/${API_VERSION}`, reviewsRoutes); // Reviews and reports
app.use(`/api/${API_VERSION}/apps`, appUsersRoutes); // App users management
app.use(`/api/${API_VERSION}/apps`, rolesRoutes); // Roles management
app.use(`/api/${API_VERSION}/apps`, appServicesRoutes); // App services management
app.use(`/api/${API_VERSION}/apps`, appRoutes);
app.use(`/api/${API_VERSION}`, rolesRoutes); // Permissions endpoint
app.use(`/api/${API_VERSION}/permissions`, permissionRoutes);
app.use(`/api/${API_VERSION}/screens`, screenRoutes);
app.use(`/api/${API_VERSION}/screen-elements`, screenElementRoutes);
app.use(`/api/${API_VERSION}/app-screens`, appScreenRoutes);
// Mobile routes - specific routes MUST come before general /mobile route
app.use(`/api/${API_VERSION}/mobile/auth`, mobileAuthRoutes);
app.use(`/api/${API_VERSION}/mobile/profile`, mobileProfileRoutes);
app.use(`/api/${API_VERSION}/mobile/settings`, mobileSettingsRoutes);
app.use(`/api/${API_VERSION}/mobile`, mobileUploadRoutes); // Mobile file uploads
app.use(`/api/${API_VERSION}/mobile`, mobileScreenRoutes); // Screen API for mobile apps
app.use(`/api/${API_VERSION}/mobile`, mobileRoutes);
app.use(`/api/${API_VERSION}/templates`, templateRoutes);
app.use(`/api/${API_VERSION}/app-templates`, appTemplatesRoutes);
app.use(`/api/${API_VERSION}/upload`, uploadRoutes);
app.use(`/api/${API_VERSION}`, appScreenElementsRoutes); // App screen element overrides
app.use(`/api/${API_VERSION}`, submissionsRoutes); // Form submissions
app.use(`/api/${API_VERSION}`, screenRolesRoutes); // Screen access & role management
app.use(`/api/${API_VERSION}`, menuRoutes); // Menu management
app.use(`/api/${API_VERSION}/modules`, modulesRoutes); // Modules management
app.use(`/api/${API_VERSION}`, appFormsRoutes); // Forms management
app.use(`/api/${API_VERSION}`, appFormElementsRoutes); // Form element overrides
app.use(`/api/${API_VERSION}`, favoritesRoutes); // Favorites/wishlist
app.use(`/api/${API_VERSION}`, profileRoutes); // User profile management
app.use(`/api/${API_VERSION}`, formSubmissionsRoutes); // Form submissions (admin)
app.use(`/api/${API_VERSION}`, reportsRoutes); // Reports management
app.use(`/api/${API_VERSION}`, dashboardReportsRoutes); // Dashboard reports
app.use(`/api/${API_VERSION}/apps/:appId/rides`, ridesRoutes); // Rideshare rides
app.use(`/api/${API_VERSION}/apps/:appId/drivers`, driversRoutes); // Rideshare drivers
app.use(`/api/${API_VERSION}`, notificationsRoutes); // Notifications
app.use(`/api/${API_VERSION}`, realEstateRoutes); // Real estate inquiries & showings

// Serve uploaded files statically
app.use("/uploads", express.static("uploads"));

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Multi-App Manager API",
    version: API_VERSION,
    endpoints: {
      health: "/health",
      auth: `/api/${API_VERSION}/auth`,
      users: `/api/${API_VERSION}/users`,
      apps: `/api/${API_VERSION}/apps`,
      permissions: `/api/${API_VERSION}/permissions`,
      screens: `/api/${API_VERSION}/screens`,
      screenElements: `/api/${API_VERSION}/screen-elements`,
      mobile: `/api/${API_VERSION}/mobile`,
      appScreens: `/api/${API_VERSION}/app-screens`,
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Setup scheduled cron jobs
const setupCronJobs = () => {
  // Complete past bookings - runs every day at midnight
  // Cron format: minute hour day-of-month month day-of-week
  // '0 0 * * *' = At 00:00 every day
  cron.schedule("0 0 * * *", async () => {
    console.log("[Cron] Running daily booking completion job...");
    try {
      const count = await bookingsController.completePastBookingsAllApps();
      console.log(
        `[Cron] Daily job completed. Marked ${count} bookings as completed.`
      );
    } catch (error) {
      console.error("[Cron] Daily booking completion job failed:", error);
    }
  });

  console.log("[Cron] Scheduled jobs:");
  console.log("  - Complete past bookings: Daily at midnight");
};

// Start server
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();

    if (!dbConnected) {
      console.error(
        "Failed to connect to database. Please check your configuration."
      );
      process.exit(1);
    }

    // Start listening
    app.listen(PORT, () => {
      console.log("");
      console.log("========================================");
      console.log("  Multi-App Manager API");
      console.log("========================================");
      console.log(`  Environment: ${process.env.NODE_ENV}`);
      console.log(`  Port: ${PORT}`);
      console.log(`  API Version: ${API_VERSION}`);
      console.log(`  URL: http://localhost:${PORT}`);
      console.log(`  Health: http://localhost:${PORT}/health`);
      console.log("========================================");
      console.log("");

      // Schedule cron jobs
      setupCronJobs();
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error);
  process.exit(1);
});

// Start the server
startServer();

module.exports = app;
