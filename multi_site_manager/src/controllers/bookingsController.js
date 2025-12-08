const db = require('../config/database');
const { createNotification } = require('./notificationsController');

/**
 * Create a new booking
 * POST /api/v1/apps/:appId/bookings
 */
exports.createBooking = async (req, res) => {
  try {
    const { appId } = req.params;
    const guestUserId = req.user?.id;

    if (!guestUserId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
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
      special_requests
    } = req.body;

    // Validation
    if (!listing_id || !check_in_date || !check_out_date || !guests_count) {
      return res.status(400).json({
        success: false,
        message: 'Listing ID, check-in date, check-out date, and guest count are required'
      });
    }

    // Get listing details
    const listingResult = await db.query(
      `SELECT id, user_id, title, price_per_night, cleaning_fee, service_fee_percentage, 
              min_nights, max_nights, guests_max, is_instant_book, status
       FROM property_listings 
       WHERE id = ? AND app_id = ? AND status = 'active' AND is_published = 1`,
      [listing_id, appId]
    );

    const listings = Array.isArray(listingResult) && Array.isArray(listingResult[0]) 
      ? listingResult[0] 
      : listingResult;

    if (!listings || listings.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found or not available'
      });
    }

    const listing = listings[0];
    const hostUserId = listing.user_id;

    // Check if user is trying to book their own listing
    if (hostUserId === guestUserId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot book your own listing'
      });
    }

    // Calculate nights
    const checkIn = new Date(check_in_date);
    const checkOut = new Date(check_out_date);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    if (nights < 1) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date'
      });
    }

    // Validate min/max nights
    if (nights < listing.min_nights) {
      return res.status(400).json({
        success: false,
        message: `Minimum stay is ${listing.min_nights} nights`
      });
    }

    if (nights > listing.max_nights) {
      return res.status(400).json({
        success: false,
        message: `Maximum stay is ${listing.max_nights} nights`
      });
    }

    // Validate guest count
    if (guests_count > listing.guests_max) {
      return res.status(400).json({
        success: false,
        message: `Maximum ${listing.guests_max} guests allowed`
      });
    }

    // Check availability (no overlapping bookings)
    const conflictResult = await db.query(
      `SELECT id FROM property_bookings 
       WHERE listing_id = ? 
         AND status IN ('confirmed', 'pending')
         AND (
           (check_in_date <= ? AND check_out_date > ?) OR
           (check_in_date < ? AND check_out_date >= ?) OR
           (check_in_date >= ? AND check_out_date <= ?)
         )`,
      [listing_id, check_in_date, check_in_date, check_out_date, check_out_date, check_in_date, check_out_date]
    );

    const conflicts = Array.isArray(conflictResult) && Array.isArray(conflictResult[0]) 
      ? conflictResult[0] 
      : conflictResult;

    if (conflicts && conflicts.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Property is not available for selected dates'
      });
    }

    // Calculate pricing
    const pricePerNight = parseFloat(listing.price_per_night);
    const cleaningFee = parseFloat(listing.cleaning_fee) || 0;
    const serviceFeePercentage = parseFloat(listing.service_fee_percentage) || 0;
    
    const subtotal = pricePerNight * nights;
    const serviceFee = (subtotal * serviceFeePercentage) / 100;
    const totalPrice = subtotal + cleaningFee + serviceFee;

    // Determine initial status
    const initialStatus = listing.is_instant_book ? 'confirmed' : 'pending';

    // Create booking
    const result = await db.query(
      `INSERT INTO property_bookings 
       (app_id, listing_id, guest_user_id, host_user_id,
        check_in_date, check_out_date, guests_count, nights,
        price_per_night, cleaning_fee, service_fee, total_price,
        status, guest_first_name, guest_last_name, guest_email, guest_phone, special_requests,
        confirmed_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        appId, listing_id, guestUserId, hostUserId,
        check_in_date, check_out_date, guests_count, nights,
        pricePerNight, cleaningFee, serviceFee, totalPrice,
        initialStatus, guest_first_name, guest_last_name, guest_email, guest_phone, special_requests,
        initialStatus === 'confirmed' ? new Date() : null
      ]
    );

    const bookingId = result.insertId;

    // Log status history
    await db.query(
      `INSERT INTO booking_status_history (booking_id, new_status, changed_by)
       VALUES (?, ?, ?)`,
      [bookingId, initialStatus, guestUserId]
    );

    // If instant book, update availability
    if (initialStatus === 'confirmed') {
      await blockDatesForBooking(listing_id, check_in_date, check_out_date);
    }

    // Send notification to host
    try {
      const checkInFormatted = new Date(check_in_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const checkOutFormatted = new Date(check_out_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      await createNotification(
        appId,
        hostUserId,
        'booking_request',
        initialStatus === 'confirmed' ? 'New Booking Confirmed' : 'New Booking Request',
        `${guest_first_name} ${guest_last_name} ${initialStatus === 'confirmed' ? 'booked' : 'requested to book'} ${listing.title} for ${checkInFormatted} - ${checkOutFormatted}`,
        { booking_id: bookingId, listing_id, guest_user_id: guestUserId }
      );
    } catch (notifError) {
      console.error('Error sending booking notification:', notifError);
      // Don't fail the booking if notification fails
    }

    res.status(201).json({
      success: true,
      message: initialStatus === 'confirmed' 
        ? 'Booking confirmed!' 
        : 'Booking request sent to host',
      data: {
        booking_id: bookingId,
        status: initialStatus,
        check_in_date,
        check_out_date,
        nights,
        total_price: totalPrice
      }
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
    });
  }
};

/**
 * Get all bookings for an app (admin only)
 * GET /api/v1/apps/:appId/bookings/all
 */
exports.getAllBookings = async (req, res) => {
  try {
    const appId = parseInt(req.params.appId);
    const { 
      status, 
      host_id,
      guest_id,
      listing_id,
      date_from,
      date_to,
      page = 1, 
      per_page = 20 
    } = req.query;

    let query = `
      SELECT 
        b.id, b.listing_id, b.check_in_date, b.check_out_date,
        b.guests_count, b.nights, b.price_per_night, b.cleaning_fee, 
        b.service_fee, b.total_price, b.status,
        b.guest_first_name, b.guest_last_name, b.guest_email, b.guest_phone,
        b.special_requests, b.created_at, b.confirmed_at, b.cancelled_at,
        b.cancellation_reason,
        l.title as listing_title, l.city, l.state, l.country,
        guest.first_name as guest_user_first_name, guest.last_name as guest_user_last_name,
        guest.email as guest_user_email,
        host.first_name as host_first_name, host.last_name as host_last_name,
        host.email as host_email
      FROM property_bookings b
      JOIN property_listings l ON b.listing_id = l.id
      LEFT JOIN app_users guest ON b.guest_user_id = guest.id
      LEFT JOIN app_users host ON b.host_user_id = host.id
      WHERE b.app_id = ?
    `;

    const params = [appId];

    if (status) {
      query += ` AND b.status = ?`;
      params.push(status);
    }

    if (host_id) {
      query += ` AND b.host_user_id = ?`;
      params.push(host_id);
    }

    if (guest_id) {
      query += ` AND b.guest_user_id = ?`;
      params.push(guest_id);
    }

    if (listing_id) {
      query += ` AND b.listing_id = ?`;
      params.push(listing_id);
    }

    if (date_from) {
      query += ` AND b.check_in_date >= ?`;
      params.push(date_from);
    }

    if (date_to) {
      query += ` AND b.check_out_date <= ?`;
      params.push(date_to);
    }

    // Build count query separately
    let countQuery = `
      SELECT COUNT(*) as total 
      FROM property_bookings b
      WHERE b.app_id = ?
    `;
    const countParams = [appId];

    if (status) {
      countQuery += ` AND b.status = ?`;
      countParams.push(status);
    }
    if (host_id) {
      countQuery += ` AND b.host_user_id = ?`;
      countParams.push(host_id);
    }
    if (guest_id) {
      countQuery += ` AND b.guest_user_id = ?`;
      countParams.push(guest_id);
    }
    if (listing_id) {
      countQuery += ` AND b.listing_id = ?`;
      countParams.push(listing_id);
    }
    if (date_from) {
      countQuery += ` AND b.check_in_date >= ?`;
      countParams.push(date_from);
    }
    if (date_to) {
      countQuery += ` AND b.check_out_date <= ?`;
      countParams.push(date_to);
    }

    const countResult = await db.query(countQuery, countParams);
    const countData = Array.isArray(countResult) && Array.isArray(countResult[0]) 
      ? countResult[0] 
      : countResult;
    const total = countData[0]?.total || 0;

    // Add pagination
    query += ` ORDER BY b.created_at DESC LIMIT ? OFFSET ?`;
    const limit = parseInt(per_page);
    const offset = (parseInt(page) - 1) * limit;
    params.push(limit, offset);

    const bookingsResult = await db.query(query, params);
    const bookings = Array.isArray(bookingsResult) && Array.isArray(bookingsResult[0]) 
      ? bookingsResult[0] 
      : bookingsResult;

    // Get stats
    const statsResult = await db.query(
      `SELECT 
        COUNT(*) as total_bookings,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected,
        SUM(CASE WHEN status IN ('confirmed', 'completed') THEN total_price ELSE 0 END) as total_revenue,
        SUM(CASE WHEN status IN ('confirmed', 'completed') THEN nights ELSE 0 END) as total_nights
       FROM property_bookings 
       WHERE app_id = ?`,
      [appId]
    );
    const statsData = Array.isArray(statsResult) && Array.isArray(statsResult[0]) 
      ? statsResult[0] 
      : statsResult;
    const stats = statsData[0] || {};

    res.json({
      success: true,
      data: {
        bookings: bookings || [],
        stats: {
          total_bookings: parseInt(stats.total_bookings) || 0,
          pending: parseInt(stats.pending) || 0,
          confirmed: parseInt(stats.confirmed) || 0,
          completed: parseInt(stats.completed) || 0,
          cancelled: parseInt(stats.cancelled) || 0,
          rejected: parseInt(stats.rejected) || 0,
          total_revenue: parseFloat(stats.total_revenue) || 0,
          total_nights: parseInt(stats.total_nights) || 0
        },
        pagination: {
          page: parseInt(page),
          per_page: limit,
          total,
          total_pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
};

/**
 * Get user's bookings (as guest)
 * GET /api/v1/apps/:appId/bookings
 */
exports.getMyBookings = async (req, res) => {
  try {
    const { appId } = req.params;
    const userId = req.user?.id;
    const { status, page = 1, per_page = 20 } = req.query;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    let query = `
      SELECT 
        b.id, b.listing_id, b.check_in_date, b.check_out_date,
        b.guests_count, b.nights, b.total_price, b.status,
        b.created_at, b.confirmed_at, b.cancelled_at,
        l.title as listing_title, l.city, l.country,
        u.first_name as host_first_name, u.last_name as host_last_name
      FROM property_bookings b
      JOIN property_listings l ON b.listing_id = l.id
      JOIN app_users u ON b.host_user_id = u.id
      WHERE b.app_id = ? AND b.guest_user_id = ?
    `;

    const params = [appId, userId];

    if (status) {
      query += ` AND b.status = ?`;
      params.push(status);
    }

    query += ` ORDER BY b.created_at DESC LIMIT ? OFFSET ?`;
    const limit = parseInt(per_page);
    const offset = (parseInt(page) - 1) * limit;
    params.push(limit, offset);

    const bookingsResult = await db.query(query, params);
    const bookings = Array.isArray(bookingsResult) && Array.isArray(bookingsResult[0]) 
      ? bookingsResult[0] 
      : bookingsResult;

    // Get total count
    let countQuery = `
      SELECT COUNT(*) as total 
      FROM property_bookings 
      WHERE app_id = ? AND guest_user_id = ?
    `;
    const countParams = [appId, userId];
    if (status) {
      countQuery += ` AND status = ?`;
      countParams.push(status);
    }

    const countResult = await db.query(countQuery, countParams);
    const countData = Array.isArray(countResult) && Array.isArray(countResult[0]) 
      ? countResult[0] 
      : countResult;
    const total = countData[0]?.total || 0;

    res.json({
      success: true,
      data: {
        bookings: bookings || [],
        pagination: {
          page: parseInt(page),
          per_page: limit,
          total,
          total_pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
};

/**
 * Get host's reservations (bookings for their listings)
 * GET /api/v1/apps/:appId/reservations
 */
exports.getMyReservations = async (req, res) => {
  try {
    const { appId } = req.params;
    const userId = req.user?.id;
    const { status, page = 1, per_page = 20 } = req.query;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    let query = `
      SELECT 
        b.id, b.listing_id, b.check_in_date, b.check_out_date,
        b.guests_count, b.nights, b.total_price, b.status,
        b.guest_first_name, b.guest_last_name, b.guest_email, b.guest_phone,
        b.special_requests, b.created_at, b.confirmed_at,
        l.title as listing_title
      FROM property_bookings b
      JOIN property_listings l ON b.listing_id = l.id
      WHERE b.app_id = ? AND b.host_user_id = ?
    `;

    const params = [appId, userId];

    if (status) {
      query += ` AND b.status = ?`;
      params.push(status);
    }

    query += ` ORDER BY b.created_at DESC LIMIT ? OFFSET ?`;
    const limit = parseInt(per_page);
    const offset = (parseInt(page) - 1) * limit;
    params.push(limit, offset);

    const reservationsResult = await db.query(query, params);
    const reservations = Array.isArray(reservationsResult) && Array.isArray(reservationsResult[0]) 
      ? reservationsResult[0] 
      : reservationsResult;

    // Get total count
    let countQuery = `
      SELECT COUNT(*) as total 
      FROM property_bookings 
      WHERE app_id = ? AND host_user_id = ?
    `;
    const countParams = [appId, userId];
    if (status) {
      countQuery += ` AND status = ?`;
      countParams.push(status);
    }

    const countResult = await db.query(countQuery, countParams);
    const total = countResult[0]?.total || 0;

    res.json({
      success: true,
      data: {
        reservations: reservations || [],
        pagination: {
          page: parseInt(page),
          per_page: limit,
          total,
          total_pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reservations',
      error: error.message
    });
  }
};

/**
 * Get single booking details
 * GET /api/v1/apps/:appId/bookings/:bookingId
 */
exports.getBookingById = async (req, res) => {
  try {
    const { appId, bookingId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const bookingResult = await db.query(
      `SELECT 
        b.*,
        l.title as listing_title, l.address_line1, l.city, l.state, l.country,
        l.property_type, l.bedrooms, l.bathrooms, l.guests_max,
        guest.first_name as guest_first_name, guest.last_name as guest_last_name,
        guest.email as guest_email,
        host.first_name as host_first_name, host.last_name as host_last_name,
        host.email as host_email
       FROM property_bookings b
       JOIN property_listings l ON b.listing_id = l.id
       JOIN app_users guest ON b.guest_user_id = guest.id
       JOIN app_users host ON b.host_user_id = host.id
       WHERE b.id = ? AND b.app_id = ?`,
      [bookingId, appId]
    );

    const bookings = Array.isArray(bookingResult) && Array.isArray(bookingResult[0]) 
      ? bookingResult[0] 
      : bookingResult;

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const booking = bookings[0];

    // Check authorization (must be guest or host)
    if (booking.guest_user_id !== userId && booking.host_user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this booking'
      });
    }

    res.json({
      success: true,
      data: { booking }
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: error.message
    });
  }
};

/**
 * Cancel a booking
 * PUT /api/v1/apps/:appId/bookings/:bookingId/cancel
 */
exports.cancelBooking = async (req, res) => {
  try {
    const { appId, bookingId } = req.params;
    const userId = req.user?.id;
    const { cancellation_reason } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Get booking
    const bookingResult = await db.query(
      `SELECT * FROM property_bookings WHERE id = ? AND app_id = ?`,
      [bookingId, appId]
    );

    const bookings = Array.isArray(bookingResult) && Array.isArray(bookingResult[0]) 
      ? bookingResult[0] 
      : bookingResult;

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const booking = bookings[0];

    // Check authorization (must be guest or host)
    if (booking.guest_user_id !== userId && booking.host_user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to cancel this booking'
      });
    }

    // Check if already cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }

    // Check if already completed
    if (booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel completed booking'
      });
    }

    // Update booking
    await db.query(
      `UPDATE property_bookings 
       SET status = 'cancelled', cancelled_at = NOW(), cancelled_by = ?, cancellation_reason = ?
       WHERE id = ?`,
      [userId, cancellation_reason, bookingId]
    );

    // Log status change
    await db.query(
      `INSERT INTO booking_status_history (booking_id, old_status, new_status, changed_by, notes)
       VALUES (?, ?, 'cancelled', ?, ?)`,
      [bookingId, booking.status, userId, cancellation_reason]
    );

    // Unblock dates if was confirmed
    if (booking.status === 'confirmed') {
      await unblockDatesForBooking(booking.listing_id, booking.check_in_date, booking.check_out_date);
    }

    res.json({
      success: true,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling booking',
      error: error.message
    });
  }
};

/**
 * Confirm a booking (host only)
 * PUT /api/v1/apps/:appId/bookings/:bookingId/confirm
 */
exports.confirmBooking = async (req, res) => {
  try {
    const { appId, bookingId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Get booking
    const bookingResult = await db.query(
      `SELECT * FROM property_bookings WHERE id = ? AND app_id = ?`,
      [bookingId, appId]
    );

    const bookings = Array.isArray(bookingResult) && Array.isArray(bookingResult[0]) 
      ? bookingResult[0] 
      : bookingResult;

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const booking = bookings[0];

    // Check authorization (must be host)
    if (booking.host_user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only the host can confirm bookings'
      });
    }

    // Check if already confirmed
    if (booking.status === 'confirmed') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already confirmed'
      });
    }

    // Check if pending
    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending bookings can be confirmed'
      });
    }

    // Update booking
    await db.query(
      `UPDATE property_bookings 
       SET status = 'confirmed', confirmed_at = NOW()
       WHERE id = ?`,
      [bookingId]
    );

    // Log status change
    await db.query(
      `INSERT INTO booking_status_history (booking_id, old_status, new_status, changed_by)
       VALUES (?, 'pending', 'confirmed', ?)`,
      [bookingId, userId]
    );

    // Block dates
    await blockDatesForBooking(booking.listing_id, booking.check_in_date, booking.check_out_date);

    // Send notification to guest
    try {
      const checkInFormatted = new Date(booking.check_in_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const checkOutFormatted = new Date(booking.check_out_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      // Get listing title
      const listingResult = await db.query(
        `SELECT title FROM property_listings WHERE id = ?`,
        [booking.listing_id]
      );
      const listingData = Array.isArray(listingResult) && Array.isArray(listingResult[0]) 
        ? listingResult[0] 
        : listingResult;
      const listingTitle = listingData[0]?.title || 'your booking';
      
      await createNotification(
        appId,
        booking.guest_user_id,
        'booking_confirmed',
        'Booking Confirmed!',
        `Your booking for ${listingTitle} (${checkInFormatted} - ${checkOutFormatted}) has been confirmed.`,
        { booking_id: parseInt(bookingId), listing_id: booking.listing_id }
      );
    } catch (notifError) {
      console.error('Error sending confirmation notification:', notifError);
    }

    res.json({
      success: true,
      message: 'Booking confirmed successfully'
    });
  } catch (error) {
    console.error('Error confirming booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error confirming booking',
      error: error.message
    });
  }
};

/**
 * Reject a booking (host only)
 * PUT /api/v1/apps/:appId/bookings/:bookingId/reject
 */
exports.rejectBooking = async (req, res) => {
  try {
    const { appId, bookingId } = req.params;
    const userId = req.user?.id;
    const { rejection_reason } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Get booking
    const bookingResult = await db.query(
      `SELECT * FROM property_bookings WHERE id = ? AND app_id = ?`,
      [bookingId, appId]
    );

    const bookings = Array.isArray(bookingResult) && Array.isArray(bookingResult[0]) 
      ? bookingResult[0] 
      : bookingResult;

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const booking = bookings[0];

    // Check authorization (must be host)
    if (booking.host_user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only the host can reject bookings'
      });
    }

    // Check if pending
    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending bookings can be rejected'
      });
    }

    // Update booking
    await db.query(
      `UPDATE property_bookings 
       SET status = 'rejected', cancellation_reason = ?
       WHERE id = ?`,
      [rejection_reason, bookingId]
    );

    // Log status change
    await db.query(
      `INSERT INTO booking_status_history (booking_id, old_status, new_status, changed_by, notes)
       VALUES (?, 'pending', 'rejected', ?, ?)`,
      [bookingId, userId, rejection_reason]
    );

    // Send notification to guest
    try {
      // Get listing title
      const listingResult = await db.query(
        `SELECT title FROM property_listings WHERE id = ?`,
        [booking.listing_id]
      );
      const listingData = Array.isArray(listingResult) && Array.isArray(listingResult[0]) 
        ? listingResult[0] 
        : listingResult;
      const listingTitle = listingData[0]?.title || 'your booking';
      
      await createNotification(
        appId,
        booking.guest_user_id,
        'booking_rejected',
        'Booking Request Declined',
        `Your booking request for ${listingTitle} was not approved.${rejection_reason ? ' Reason: ' + rejection_reason : ''}`,
        { booking_id: parseInt(bookingId), listing_id: booking.listing_id }
      );
    } catch (notifError) {
      console.error('Error sending rejection notification:', notifError);
    }

    res.json({
      success: true,
      message: 'Booking rejected'
    });
  } catch (error) {
    console.error('Error rejecting booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error rejecting booking',
      error: error.message
    });
  }
};

/**
 * Complete past bookings
 * POST /api/v1/apps/:appId/bookings/complete-past
 * Marks all confirmed bookings with check_out_date in the past as completed
 */
exports.completePastBookings = async (req, res) => {
  try {
    const { appId } = req.params;
    const today = new Date().toISOString().split('T')[0];

    // Find all confirmed bookings where check_out_date has passed
    const result = await db.query(
      `UPDATE property_bookings 
       SET status = 'completed', updated_at = NOW()
       WHERE app_id = ? 
         AND status = 'confirmed' 
         AND check_out_date < ?`,
      [appId, today]
    );

    const affectedRows = result.affectedRows || 0;

    console.log(`[App ${appId}] Completed ${affectedRows} past bookings`);

    res.json({
      success: true,
      message: `Marked ${affectedRows} booking(s) as completed`,
      data: {
        completed_count: affectedRows
      }
    });
  } catch (error) {
    console.error('Error completing past bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Error completing past bookings',
      error: error.message
    });
  }
};

/**
 * Complete past bookings for ALL apps (used by cron job)
 * This is not an API endpoint, called internally
 */
exports.completePastBookingsAllApps = async () => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const result = await db.query(
      `UPDATE property_bookings 
       SET status = 'completed', updated_at = NOW()
       WHERE status = 'confirmed' 
         AND check_out_date < ?`,
      [today]
    );

    const affectedRows = result.affectedRows || 0;
    console.log(`[Cron] Completed ${affectedRows} past bookings across all apps`);
    return affectedRows;
  } catch (error) {
    console.error('[Cron] Error completing past bookings:', error);
    throw error;
  }
};

// Helper functions
async function blockDatesForBooking(listingId, checkInDate, checkOutDate) {
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  
  const dates = [];
  for (let d = new Date(checkIn); d < checkOut; d.setDate(d.getDate() + 1)) {
    dates.push(new Date(d).toISOString().split('T')[0]);
  }
  
  for (const date of dates) {
    await db.query(
      `INSERT INTO property_availability (listing_id, date, is_available, notes)
       VALUES (?, ?, 0, 'Blocked by booking')
       ON DUPLICATE KEY UPDATE is_available = 0, notes = 'Blocked by booking'`,
      [listingId, date]
    );
  }
}

async function unblockDatesForBooking(listingId, checkInDate, checkOutDate) {
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  
  const dates = [];
  for (let d = new Date(checkIn); d < checkOut; d.setDate(d.getDate() + 1)) {
    dates.push(new Date(d).toISOString().split('T')[0]);
  }
  
  for (const date of dates) {
    await db.query(
      `UPDATE property_availability 
       SET is_available = 1, notes = NULL
       WHERE listing_id = ? AND date = ?`,
      [listingId, date]
    );
  }
}
