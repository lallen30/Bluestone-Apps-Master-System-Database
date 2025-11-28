const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviewsController');
const { authenticateMobileUser } = require('../middleware/mobileAuth');

/**
 * GET /api/v1/apps/:appId/listings/:listingId/reviews
 * Get reviews for a listing (public)
 */
router.get('/apps/:appId/listings/:listingId/reviews', reviewsController.getListingReviews);

/**
 * GET /api/v1/apps/:appId/reviews/my
 * Get user's reviews
 */
router.get(
  '/apps/:appId/reviews/my',
  authenticateMobileUser({ required: true }),
  reviewsController.getMyReviews
);

/**
 * POST /api/v1/apps/:appId/reviews
 * Create a review
 */
router.post(
  '/apps/:appId/reviews',
  authenticateMobileUser({ required: true }),
  reviewsController.createReview
);

/**
 * POST /api/v1/apps/:appId/reviews/:reviewId/respond
 * Host responds to a review
 */
router.post(
  '/apps/:appId/reviews/:reviewId/respond',
  authenticateMobileUser({ required: true }),
  reviewsController.respondToReview
);

/**
 * POST /api/v1/apps/:appId/reports
 * Report content
 */
router.post(
  '/apps/:appId/reports',
  authenticateMobileUser({ required: true }),
  reviewsController.createReport
);

module.exports = router;
