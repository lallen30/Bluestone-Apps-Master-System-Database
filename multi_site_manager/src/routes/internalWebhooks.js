const express = require("express");
const router = express.Router();
const { handleEvent } = require("../controllers/internalWebhooksController");

// Generic internal webhook endpoint for forwarded events from services.
// Expects JSON body and header `X-Internal-Signature` with HMAC-SHA256 hex
// and `X-Service-Id` to identify the sender.
router.post("/events", handleEvent);

module.exports = router;
