const crypto = require("crypto");
const bookingsController = require("./bookingsController");
const db = require("../config/database");

/**
 * Determine secret to validate incoming internal webhook signatures.
 * Supports a single shared secret `INTERNAL_WEBHOOK_SHARED_SECRET` or a
 * JSON map `INTERNAL_WEBHOOK_SECRETS` like { "stripe-service-1": "s1", "other": "s2" }
 */
function getSecretFor(serviceId) {
  if (process.env.INTERNAL_WEBHOOK_SHARED_SECRET) {
    return process.env.INTERNAL_WEBHOOK_SHARED_SECRET;
  }

  if (process.env.INTERNAL_WEBHOOK_SECRETS) {
    try {
      const map = JSON.parse(process.env.INTERNAL_WEBHOOK_SECRETS);
      if (map && map[serviceId]) return map[serviceId];
    } catch (err) {
      console.warn("Could not parse INTERNAL_WEBHOOK_SECRETS:", err.message);
    }
  }

  return null;
}

async function handleEvent(req, res) {
  try {
    const signature = req.headers["x-internal-signature"];
    const serviceId = req.headers["x-service-id"] || "unknown";

    const secret = getSecretFor(serviceId);
    if (!secret) {
      console.warn(
        "No secret configured for internal webhook validation; rejecting"
      );
      return res
        .status(401)
        .json({ success: false, message: "No webhook secret configured" });
    }

    const bodyString = JSON.stringify(req.body || {});
    const expected = crypto
      .createHmac("sha256", String(secret))
      .update(bodyString)
      .digest("hex");

    const provided = String(signature || "");
    const matches = crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(provided)
    );
    if (!matches) {
      console.warn("Invalid internal webhook signature for service", serviceId);
      return res
        .status(401)
        .json({ success: false, message: "Invalid signature" });
    }

    const event = req.body;

    // Generic processing: if event contains metadata.booking_id, verify amount (if present) then confirm booking
    const bookingId =
      event?.data?.object?.metadata?.booking_id || event?.metadata?.booking_id;
    if (bookingId) {
      // Attempt to extract an amount (in cents) from common Stripe event shapes
      let amountCents = null;
      try {
        const obj = event?.data?.object || {};
        // checkout.session.completed -> amount_total
        if (obj.amount_total != null)
          amountCents = parseInt(obj.amount_total, 10);
        // payment_intent.succeeded -> amount or amount_received
        else if (obj.amount_received != null)
          amountCents = parseInt(obj.amount_received, 10);
        else if (obj.amount != null) amountCents = parseInt(obj.amount, 10);
      } catch (e) {
        console.warn("Could not parse amount from event:", e.message || e);
      }

      if (amountCents != null) {
        // Lookup booking total_price and compare (allow 1 cent tolerance)
        const bookingResult = await db.query(
          `SELECT id, total_price, currency FROM property_bookings WHERE id = ?`,
          [bookingId]
        );
        const bookingRows =
          Array.isArray(bookingResult) && Array.isArray(bookingResult[0])
            ? bookingResult[0]
            : bookingResult;
        const booking = bookingRows && bookingRows[0] ? bookingRows[0] : null;
        if (!booking) {
          console.warn("Booking not found for id", bookingId);
          return res
            .status(404)
            .json({ success: false, message: "Booking not found" });
        }

        const expectedCents = Math.round(
          parseFloat(booking.total_price || 0) * 100
        );
        if (Math.abs(expectedCents - amountCents) > 1) {
          console.warn("Amount mismatch for booking", bookingId, {
            expectedCents,
            amountCents,
          });
          return res
            .status(400)
            .json({
              success: false,
              message: "Payment amount does not match booking total",
            });
        }
      }

      const result = await bookingsController.confirmBookingBySystem(bookingId);
      if (result.success) {
        return res.json({
          success: true,
          message: "Booking confirmed via internal webhook",
        });
      }
      return res.status(400).json({ success: false, message: result.message });
    }

    // Otherwise just acknowledge
    res.json({ success: true, message: "Event received" });
  } catch (error) {
    console.error("Error handling internal webhook:", error);
    res.status(500).json({ success: false, message: "Internal error" });
  }
}

module.exports = { handleEvent };
