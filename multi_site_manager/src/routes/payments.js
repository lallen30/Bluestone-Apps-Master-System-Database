const express = require("express");
const router = express.Router();
const paymentsController = require("../controllers/paymentsController");
const { authenticateMobileUser } = require("../middleware/mobileAuth");

/**
 * POST /api/v1/apps/:appId/checkout
 * Create a provisional booking (status: pending_payment) and return booking_id
 */
router.post(
  "/apps/:appId/checkout",
  authenticateMobileUser({ required: true }),
  paymentsController.createProvisionalBooking
);

// POST /api/v1/apps/:appId/checkout/create
// Creates a provisional booking and immediately creates a Stripe Checkout session
router.post(
  "/apps/:appId/checkout/create",
  authenticateMobileUser({ required: true }),
  paymentsController.createCheckout
);

module.exports = router;
