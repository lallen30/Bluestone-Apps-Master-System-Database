const axios = require("axios");
const crypto = require("crypto");

/**
 * forwardEvent
 * Sends the event payload to a target URL and signs it with HMAC-SHA256
 * using the provided secret (if any). Adds `X-Internal-Signature` and
 * `X-Service-Id` headers for authentication/traceability.
 *
 * target: { url, secret }
 * event: object (the Stripe event)
 */
async function forwardEvent(target, event) {
  if (!target || !target.url) throw new Error("Invalid target");

  const body = JSON.stringify(event);

  const headers = {
    "Content-Type": "application/json",
    "X-Service-Id": process.env.SERVICE_ID || "stripe-service",
  };

  if (target.secret) {
    const sig = crypto
      .createHmac("sha256", String(target.secret))
      .update(body)
      .digest("hex");
    headers["X-Internal-Signature"] = sig;
  }

  // Allow passing additional static headers from config
  if (target.headers && typeof target.headers === "object") {
    Object.assign(headers, target.headers);
  }

  const resp = await axios.post(target.url, body, { headers, timeout: 10000 });
  return { status: resp.status, data: resp.data };
}

module.exports = forwardEvent;
