const db = require("../config/database");
const axios = require("axios");
const { createNotification } = require("./notificationsController");

/**
 * Create provisional booking with status 'pending_payment'.
 * POST /api/v1/apps/:appId/checkout
 */
exports.createProvisionalBooking = async (req, res) => {
  try {
    const { appId } = req.params;
    const guestUserId = req.user?.id;

    if (!guestUserId) {
      return res
        .status(401)
        .json({ success: false, message: "Authentication required" });
    }

    const {
      listing_id,
      check_in_date,
      check_out_date,
      guests_count,
      guest_first_name,
      guest_last_name,
      guest_email,
      guest_phone,
      special_requests,
    } = req.body;

    // Validation
    if (!listing_id || !check_in_date || !check_out_date || !guests_count) {
      return res.status(400).json({
        success: false,
        message: "Listing ID, check-in, check-out and guest count are required",
      });
    }

    // Helper to create a provisional booking record. Returns an object with bookingId, totalPrice, nights, listing, hostStripeAccountId
    async function createProvisionalBookingRecord({
      appId,
      guestUserId,
      payload,
    }) {
      const {
        listing_id,
        check_in_date,
        check_out_date,
        guests_count,
        guest_first_name,
        guest_last_name,
        guest_email,
        guest_phone,
        special_requests,
      } = payload;

      // Get listing
      const listingResult = await db.query(
        `SELECT id, user_id, title, price_per_night, cleaning_fee, service_fee_percentage,
                min_nights, max_nights, guests_max, status, currency
         FROM property_listings
         WHERE id = ? AND app_id = ? AND status = 'active' AND is_published = 1`,
        [listing_id, appId]
      );

      const listings =
        Array.isArray(listingResult) && Array.isArray(listingResult[0])
          ? listingResult[0]
          : listingResult;
      if (!listings || listings.length === 0)
        throw new Error("Listing not found");
      const listing = listings[0];

      if (listing.user_id === guestUserId)
        throw new Error("You cannot book your own listing");

      // Compute nights
      const checkIn = new Date(check_in_date);
      const checkOut = new Date(check_out_date);
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      if (nights < 1)
        throw new Error("Check-out date must be after check-in date");

      // Availability check
      const conflictResult = await db.query(
        `SELECT id FROM property_bookings
         WHERE listing_id = ?
           AND status IN ('confirmed', 'pending', 'pending_payment')
           AND (
             (check_in_date <= ? AND check_out_date > ?) OR
             (check_in_date < ? AND check_out_date >= ?) OR
             (check_in_date >= ? AND check_out_date <= ?)
           )`,
        [
          listing_id,
          check_in_date,
          check_in_date,
          check_out_date,
          check_out_date,
          check_in_date,
          check_out_date,
        ]
      );

      const conflicts =
        Array.isArray(conflictResult) && Array.isArray(conflictResult[0])
          ? conflictResult[0]
          : conflictResult;
      if (conflicts && conflicts.length > 0)
        throw new Error("Property is not available for selected dates");

      // Pricing
      const pricePerNight = parseFloat(listing.price_per_night);
      const cleaningFee = parseFloat(listing.cleaning_fee) || 0;
      const serviceFeePercentage =
        parseFloat(listing.service_fee_percentage) || 0;
      const subtotal = pricePerNight * nights;
      const serviceFee = (subtotal * serviceFeePercentage) / 100;
      const totalPrice = subtotal + cleaningFee + serviceFee;

      // Lookup host stripe account id
      const hostResult = await db.query(
        `SELECT stripe_account_id FROM app_users WHERE id = ? AND app_id = ?`,
        [listing.user_id, appId]
      );
      const hostRows =
        Array.isArray(hostResult) && Array.isArray(hostResult[0])
          ? hostResult[0]
          : hostResult;
      const hostStripeAccountId =
        hostRows && hostRows[0] ? hostRows[0].stripe_account_id : null;

      // Insert provisional booking
      const insertResult = await db.query(
        `INSERT INTO property_bookings
         (app_id, listing_id, guest_user_id, host_user_id, check_in_date, check_out_date, guests_count, nights,
          price_per_night, cleaning_fee, service_fee, total_price, status, guest_first_name, guest_last_name, guest_email, guest_phone, special_requests)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          appId,
          listing_id,
          guestUserId,
          listing.user_id,
          check_in_date,
          check_out_date,
          guests_count,
          nights,
          pricePerNight,
          cleaningFee,
          serviceFee,
          totalPrice,
          "pending_payment",
          guest_first_name,
          guest_last_name,
          guest_email,
          guest_phone,
          special_requests,
        ]
      );

      const bookingId = insertResult.insertId;

      // Log status history
      await db.query(
        `INSERT INTO booking_status_history (booking_id, new_status, changed_by)
         VALUES (?, ?, ?)`,
        [bookingId, "pending_payment", guestUserId]
      );

      // Notify host
      try {
        await createNotification(
          appId,
          listing.user_id,
          "booking_request",
          "New Booking Request",
          `${guest_first_name || ""} ${
            guest_last_name || ""
          } requested to book ${
            listing.title
          } for ${check_in_date} - ${check_out_date}`,
          { booking_id: bookingId, listing_id }
        );
      } catch (notifErr) {
        console.error(
          "Error sending booking notification:",
          notifErr.message || notifErr
        );
      }

      return { bookingId, totalPrice, nights, listing, hostStripeAccountId };
    }

    // Get listing
    const listingResult = await db.query(
      `SELECT id, user_id, title, price_per_night, cleaning_fee, service_fee_percentage,
              min_nights, max_nights, guests_max, status
       FROM property_listings
       WHERE id = ? AND app_id = ? AND status = 'active' AND is_published = 1`,
      [listing_id, appId]
    );

    const listings =
      Array.isArray(listingResult) && Array.isArray(listingResult[0])
        ? listingResult[0]
        : listingResult;
    if (!listings || listings.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "Listing not found" });
    const listing = listings[0];

    if (listing.user_id === guestUserId)
      return res
        .status(400)
        .json({ success: false, message: "You cannot book your own listing" });

    // Lookup host stripe account id if any
    const hostResult = await db.query(
      `SELECT stripe_account_id FROM app_users WHERE id = ? AND app_id = ?`,
      [listing.user_id, appId]
    );
    const hostRows =
      Array.isArray(hostResult) && Array.isArray(hostResult[0])
        ? hostResult[0]
        : hostResult;
    const hostStripeAccountId =
      hostRows && hostRows[0] ? hostRows[0].stripe_account_id : null;

    // Compute nights
    const checkIn = new Date(check_in_date);
    const checkOut = new Date(check_out_date);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    if (nights < 1)
      return res.status(400).json({
        success: false,
        message: "Check-out date must be after check-in date",
      });

    // Availability check - block if confirmed/pending/pending_payment exists
    const conflictResult = await db.query(
      `SELECT id FROM property_bookings
       WHERE listing_id = ?
         AND status IN ('confirmed', 'pending', 'pending_payment')
         AND (
           (check_in_date <= ? AND check_out_date > ?) OR
           (check_in_date < ? AND check_out_date >= ?) OR
           (check_in_date >= ? AND check_out_date <= ?)
         )`,
      [
        listing_id,
        check_in_date,
        check_in_date,
        check_out_date,
        check_out_date,
        check_in_date,
        check_out_date,
      ]
    );

    const conflicts =
      Array.isArray(conflictResult) && Array.isArray(conflictResult[0])
        ? conflictResult[0]
        : conflictResult;
    if (conflicts && conflicts.length > 0)
      return res.status(409).json({
        success: false,
        message: "Property is not available for selected dates",
      });

    // Pricing
    const pricePerNight = parseFloat(listing.price_per_night);
    const cleaningFee = parseFloat(listing.cleaning_fee) || 0;
    const serviceFeePercentage =
      parseFloat(listing.service_fee_percentage) || 0;
    const subtotal = pricePerNight * nights;
    const serviceFee = (subtotal * serviceFeePercentage) / 100;
    const totalPrice = subtotal + cleaningFee + serviceFee;

    // Insert provisional booking
    const insertResult = await db.query(
      `INSERT INTO property_bookings
       (app_id, listing_id, guest_user_id, host_user_id, check_in_date, check_out_date, guests_count, nights,
        price_per_night, cleaning_fee, service_fee, total_price, status, guest_first_name, guest_last_name, guest_email, guest_phone, special_requests)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        appId,
        listing_id,
        guestUserId,
        listing.user_id,
        check_in_date,
        check_out_date,
        guests_count,
        nights,
        pricePerNight,
        cleaningFee,
        serviceFee,
        totalPrice,
        "pending_payment",
        guest_first_name,
        guest_last_name,
        guest_email,
        guest_phone,
        special_requests,
      ]
    );

    const bookingId = insertResult.insertId;

    // Log status history
    await db.query(
      `INSERT INTO booking_status_history (booking_id, new_status, changed_by)
       VALUES (?, ?, ?)`,
      [bookingId, "pending_payment", guestUserId]
    );

    // Send notification to host about incoming booking request
    try {
      await createNotification(
        appId,
        listing.user_id,
        "booking_request",
        "New Booking Request",
        `${guest_first_name || ""} ${guest_last_name || ""} requested to book ${
          listing.title
        } for ${check_in_date} - ${check_out_date}`,
        { booking_id: bookingId, listing_id }
      );
    } catch (notifErr) {
      console.error(
        "Error sending booking notification:",
        notifErr.message || notifErr
      );
    }

    res.status(201).json({
      success: true,
      booking_id: bookingId,
      total_price: totalPrice,
      nights,
      host_stripe_account_id: hostStripeAccountId,
      currency: listing.currency || "USD",
      listing_title: listing.title,
    });
  } catch (error) {
    console.error("Error creating provisional booking:", error);
    res.status(500).json({
      success: false,
      message: "Error creating provisional booking",
      error: error.message,
    });
  }
};

/**
 * Create provisional booking and immediately create a Stripe Checkout session
 * by calling the external `stripe_service`. Returns the Stripe session data.
 */
exports.createCheckout = async (req, res) => {
  try {
    const { appId } = req.params;
    const guestUserId = req.user?.id;

    if (!guestUserId) {
      return res
        .status(401)
        .json({ success: false, message: "Authentication required" });
    }

    // Create provisional booking record using the helper defined above
    const record = await (async () => {
      // Reuse the inner helper by calling it with the current payload
      // Note: the helper function createProvisionalBookingRecord is defined inside createProvisionalBooking above.
      // To call it, we reconstruct the same logic here by reusing the exported function flow.
      // Easiest approach: call this controller's createProvisionalBooking logic programmatically.
      // However, since createProvisionalBooking writes response, we'll replicate minimal needed steps here by calling the same SQL logic.
      // For clarity and maintainability this implementation performs the necessary steps inline.

      const payload = req.body;
      // Delegate to the same SQL operations used earlier
      // To avoid duplication complexity, call the public endpoint would be required; instead, replicate compactly here.

      const {
        listing_id,
        check_in_date,
        check_out_date,
        guests_count,
        guest_first_name,
        guest_last_name,
        guest_email,
        guest_phone,
        special_requests,
      } = payload;

      // Fetch listing
      const listingResult = await db.query(
        `SELECT id, user_id, title, price_per_night, cleaning_fee, service_fee_percentage, currency
         FROM property_listings
         WHERE id = ? AND app_id = ? AND status = 'active' AND is_published = 1`,
        [listing_id, appId]
      );
      const listings =
        Array.isArray(listingResult) && Array.isArray(listingResult[0])
          ? listingResult[0]
          : listingResult;
      if (!listings || listings.length === 0)
        throw new Error("Listing not found");
      const listing = listings[0];

      // Compute nights and pricing (same as provisional flow)
      const checkIn = new Date(check_in_date);
      const checkOut = new Date(check_out_date);
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      const pricePerNight = parseFloat(listing.price_per_night);
      const cleaningFee = parseFloat(listing.cleaning_fee) || 0;
      const serviceFeePercentage =
        parseFloat(listing.service_fee_percentage) || 0;
      const subtotal = pricePerNight * nights;
      const serviceFee = (subtotal * serviceFeePercentage) / 100;
      const totalPrice = subtotal + cleaningFee + serviceFee;

      // Insert provisional booking
      const insertResult = await db.query(
        `INSERT INTO property_bookings (app_id, listing_id, guest_user_id, host_user_id, check_in_date, check_out_date, guests_count, nights, price_per_night, cleaning_fee, service_fee, total_price, status, guest_first_name, guest_last_name, guest_email, guest_phone, special_requests) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          appId,
          listing_id,
          guestUserId,
          listing.user_id,
          check_in_date,
          check_out_date,
          guests_count,
          nights,
          pricePerNight,
          cleaningFee,
          serviceFee,
          totalPrice,
          "pending_payment",
          guest_first_name,
          guest_last_name,
          guest_email,
          guest_phone,
          special_requests,
        ]
      );
      const bookingId = insertResult.insertId;

      // Log status history
      await db.query(
        `INSERT INTO booking_status_history (booking_id, new_status, changed_by) VALUES (?, ?, ?)`,
        [bookingId, "pending_payment", guestUserId]
      );

      // Lookup host stripe account
      const hostResult = await db.query(
        `SELECT stripe_account_id FROM app_users WHERE id = ? AND app_id = ?`,
        [listing.user_id, appId]
      );
      const hostRows =
        Array.isArray(hostResult) && Array.isArray(hostResult[0])
          ? hostResult[0]
          : hostResult;
      const hostStripeAccountId =
        hostRows && hostRows[0] ? hostRows[0].stripe_account_id : null;

      // Notify host (best-effort)
      try {
        await createNotification(
          appId,
          listing.user_id,
          "booking_request",
          "New Booking Request",
          `${guest_first_name || ""} ${
            guest_last_name || ""
          } requested to book ${
            listing.title
          } for ${check_in_date} - ${check_out_date}`,
          { booking_id: bookingId, listing_id }
        );
      } catch (e) {
        console.error("Notification error:", e.message || e);
      }

      return {
        bookingId,
        totalPrice,
        nights,
        listing,
        hostStripeAccountId,
        guest_email,
      };
    })();

    const { bookingId, totalPrice, listing, hostStripeAccountId, guest_email } =
      record;

    // Build Stripe request
    const stripeServiceUrl =
      process.env.STRIPE_SERVICE_URL ||
      process.env.STRIPE_SERVICE_HOST ||
      "http://localhost:4001";
    // Build success/cancel URLs - use localhost for mobile app deep linking
    const frontendUrl =
      process.env.FRONTEND_URL ||
      process.env.MOBILE_APP_URL ||
      "http://localhost:3000";
    const successUrl =
      process.env.PAYMENT_SUCCESS_URL ||
      `${frontendUrl}/payment-success?booking_id=${bookingId}`;
    const cancelUrl =
      process.env.PAYMENT_CANCEL_URL ||
      `${frontendUrl}/payment-cancel?booking_id=${bookingId}`;

    const lineItems = [
      {
        price_data: {
          currency: (listing.currency || "USD").toLowerCase(),
          product_data: { name: `Booking: ${listing.title}` },
          unit_amount: Math.round(totalPrice * 100),
        },
        quantity: 1,
      },
    ];

    const usePaymentIntent = req.body.payment_method === "payment_intent";

    let stripeResp;
    if (usePaymentIntent) {
      const paymentIntentReq = {
        app_id: appId,
        amount: Math.round(totalPrice * 100),
        currency: (listing.currency || "USD").toLowerCase(),
        metadata: {
          booking_id: bookingId,
          listing_id: listing.id,
          guest_email: guest_email,
        },
      };

      console.log(
        "[createCheckout] Creating Payment Intent:",
        stripeServiceUrl
      );
      console.log(
        "[createCheckout] Payment Intent request:",
        JSON.stringify(paymentIntentReq, null, 2)
      );

      stripeResp = await axios.post(
        `${stripeServiceUrl}/api/v1/stripe/payment-intent`,
        paymentIntentReq,
        { timeout: 10000 }
      );
    } else {
      const stripeReq = {
        app_id: appId,
        line_items: lineItems,
        mode: "payment",
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: { booking_id: bookingId, listing_id: listing.id },
        connected_account: hostStripeAccountId || undefined,
      };

      console.log("[createCheckout] Calling Stripe service:", stripeServiceUrl);
      console.log(
        "[createCheckout] Stripe request:",
        JSON.stringify(stripeReq, null, 2)
      );

      stripeResp = await axios.post(
        `${stripeServiceUrl}/api/v1/stripe/checkout-session`,
        stripeReq,
        { timeout: 10000 }
      );
    }
    if (!stripeResp?.data) {
      // rollback booking
      await db.query(`DELETE FROM property_bookings WHERE id = ?`, [bookingId]);
      return res.status(500).json({
        success: false,
        message: "Failed to create Stripe checkout session",
      });
    }

    const sessionId = stripeResp.data.sessionId || stripeResp.data.id || null;
    await db.query(
      `UPDATE property_bookings SET payment_session_id = ? WHERE id = ?`,
      [sessionId, bookingId]
    );

    res
      .status(200)
      .json({ success: true, booking_id: bookingId, session: stripeResp.data });
  } catch (error) {
    console.error("Error in createCheckout:", error.message || error);
    console.error("Error response data:", error.response?.data);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Error creating checkout",
      error: error.response?.data?.error || error.message,
    });
  }
};
