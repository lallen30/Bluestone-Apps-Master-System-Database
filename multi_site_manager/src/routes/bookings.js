const express = require('express');
const router = express.Router();
const bookingsController = require('../controllers/bookingsController');
const { authenticateMobileUser } = require('../middleware/mobileAuth');
const { authenticate, hasAppAccess } = require('../middleware/auth');

// Admin routes (require admin auth)

/**
 * GET /api/v1/apps/:appId/bookings/all
 * Get all bookings for an app (admin only)
 */
router.get(
  '/apps/:appId/bookings/all',
  authenticate,
  hasAppAccess,
  bookingsController.getAllBookings
);

// Mobile user routes (require authentication)

/**
 * POST /api/v1/apps/:appId/bookings
 * Create a new booking
 */
router.post(
  '/apps/:appId/bookings',
  authenticateMobileUser({ required: true }),
  bookingsController.createBooking
);

/**
 * GET /api/v1/apps/:appId/bookings
 * Get user's bookings (as guest)
 */
router.get(
  '/apps/:appId/bookings',
  authenticateMobileUser({ required: true }),
  bookingsController.getMyBookings
);

/**
 * GET /api/v1/apps/:appId/reservations
 * Get host's reservations (bookings for their listings)
 */
router.get(
  '/apps/:appId/reservations',
  authenticateMobileUser({ required: true }),
  bookingsController.getMyReservations
);

/**
 * GET /api/v1/apps/:appId/bookings/:bookingId
 * Get single booking details
 */
router.get(
  '/apps/:appId/bookings/:bookingId',
  authenticateMobileUser({ required: true }),
  bookingsController.getBookingById
);

/**
 * PUT /api/v1/apps/:appId/bookings/:bookingId/cancel
 * Cancel a booking (guest or host)
 */
router.put(
  '/apps/:appId/bookings/:bookingId/cancel',
  authenticateMobileUser({ required: true }),
  bookingsController.cancelBooking
);

/**
 * PUT /api/v1/apps/:appId/bookings/:bookingId/confirm
 * Confirm a booking (host only)
 */
router.put(
  '/apps/:appId/bookings/:bookingId/confirm',
  authenticateMobileUser({ required: true }),
  bookingsController.confirmBooking
);

/**
 * PUT /api/v1/apps/:appId/bookings/:bookingId/reject
 * Reject a booking (host only)
 */
router.put(
  '/apps/:appId/bookings/:bookingId/reject',
  authenticateMobileUser({ required: true }),
  bookingsController.rejectBooking
);

module.exports = router;
