/**
 * webhookTargets.js
 *
 * Provides a dynamic, environment-driven list of webhook forwarding targets.
 * This is generic (not Stripe specific) and returns targets filtered by appId
 * and event types.
 *
 * Configure via environment variable `WEBHOOK_TARGETS` containing a JSON
 * array like:
 * [
 *   { "appId": "123", "url": "http://multi_site_manager:3000/internal-webhook", "secret": "shhhh", "events": ["checkout.session.completed"] },
 *   { "appId": null, "url": "http://other-service/webhook", "secret": "s-secret", "events": null }
 * ]
 */

const DEFAULT_ENV = process.env.WEBHOOK_TARGETS || "";

let parsed = [];

try {
  if (DEFAULT_ENV && DEFAULT_ENV.trim() !== "") {
    parsed = JSON.parse(DEFAULT_ENV);
  }
} catch (err) {
  console.warn(
    "⚠️  Could not parse WEBHOOK_TARGETS JSON, ignoring:",
    err.message
  );
  parsed = [];
}

/**
 * Return targets applicable for the given appId and eventType.
 * - appId: string|number|null — when a target has appId null it is considered global
 * - eventType: the Stripe/event type string (e.g. "checkout.session.completed")
 */
function getTargetsFor(appId, eventType) {
  const appIdStr = appId == null ? null : String(appId);

  return parsed.filter((t) => {
    // Must have a URL
    if (!t || !t.url) return false;

    // Match appId if specified on the target (null => global)
    if (t.appId != null && String(t.appId) !== appIdStr) return false;

    // If events array is provided, only forward matching event types
    if (Array.isArray(t.events) && t.events.length > 0) {
      return t.events.includes(eventType);
    }

    // Otherwise forward everything
    return true;
  });
}

module.exports = { getTargetsFor };
