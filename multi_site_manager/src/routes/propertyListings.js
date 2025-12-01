const express = require('express');
const router = express.Router();
const propertyListingsController = require('../controllers/propertyListingsController');
const { authenticateMobileUser } = require('../middleware/mobileAuth');
const { authenticateDual } = require('../middleware/dualAuth');

// Public routes (no auth required)

/**
 * GET /api/v1/apps/:appId/listings
 * Get all listings (with filters)
 * Public endpoint for browsing listings
 */
router.get('/apps/:appId/listings', propertyListingsController.getListings);

/**
 * GET /api/v1/apps/:appId/hosts
 * Get all hosts (users with listings)
 * Public endpoint for admin filtering
 */
router.get('/apps/:appId/hosts', propertyListingsController.getHosts);

/**
 * GET /api/v1/apps/:appId/listings/:listingId
 * Get single listing details
 * Public endpoint for viewing a listing
 */
router.get('/apps/:appId/listings/:listingId', propertyListingsController.getListingById);

/**
 * GET /api/v1/amenities
 * Get all available amenities
 * Public endpoint
 */
router.get('/amenities', propertyListingsController.getAmenities);

// Protected routes (authentication required)

/**
 * GET /api/v1/apps/:appId/host/dashboard
 * Get host dashboard stats
 * Requires authentication
 */
router.get(
  '/apps/:appId/host/dashboard',
  authenticateMobileUser({ required: true }),
  propertyListingsController.getHostDashboard
);

/**
 * GET /api/v1/apps/:appId/listings/my
 * Get current user's listings (for hosts)
 * Requires authentication
 */
router.get(
  '/apps/:appId/listings/my',
  authenticateMobileUser({ required: true }),
  propertyListingsController.getMyListings
);

/**
 * GET /api/v1/apps/:appId/listings/:listingId/availability
 * Get availability for a listing
 * Requires authentication (owner only)
 */
router.get(
  '/apps/:appId/listings/:listingId/availability',
  authenticateMobileUser({ required: true }),
  propertyListingsController.getAvailability
);

/**
 * POST /api/v1/apps/:appId/listings/:listingId/availability
 * Update availability for a listing
 * Requires authentication (owner only)
 */
router.post(
  '/apps/:appId/listings/:listingId/availability',
  authenticateMobileUser({ required: true }),
  propertyListingsController.updateAvailability
);

/**
 * POST /api/v1/apps/:appId/listings
 * Create a new listing
 * Requires authentication - user becomes the host
 */
router.post(
  '/apps/:appId/listings',
  authenticateMobileUser({ required: true }),
  propertyListingsController.createListing
);

/**
 * PUT /api/v1/apps/:appId/listings/:listingId
 * Update a listing
 * Requires authentication and ownership
 */
router.put(
  '/apps/:appId/listings/:listingId',
  authenticateMobileUser({ required: true }),
  propertyListingsController.updateListing
);

/**
 * DELETE /api/v1/apps/:appId/listings/:listingId
 * Delete a listing
 * Requires authentication (admin or mobile user with ownership)
 */
router.delete(
  '/apps/:appId/listings/:listingId',
  authenticateDual,
  propertyListingsController.deleteListing
);

/**
 * PUT /api/v1/apps/:appId/listings/:listingId/status
 * Update listing status (draft, active, inactive, suspended, etc.)
 * Requires authentication (admin or mobile user with ownership)
 */
router.put(
  '/apps/:appId/listings/:listingId/status',
  authenticateDual,
  propertyListingsController.updateListingStatus
);

/**
 * PUT /api/v1/apps/:appId/listings/:listingId/publish
 * Publish or unpublish a listing (backward compatibility)
 * Requires authentication (admin or mobile user with ownership)
 */
router.put(
  '/apps/:appId/listings/:listingId/publish',
  authenticateDual,
  propertyListingsController.publishListing
);

// Dynamic Pricing Routes

/**
 * GET /api/v1/apps/:appId/listings/:listingId/pricing-rules
 * Get pricing rules for a listing
 */
router.get(
  '/apps/:appId/listings/:listingId/pricing-rules',
  authenticateMobileUser({ required: true }),
  propertyListingsController.getPricingRules
);

/**
 * POST /api/v1/apps/:appId/listings/:listingId/pricing-rules
 * Create a pricing rule
 */
router.post(
  '/apps/:appId/listings/:listingId/pricing-rules',
  authenticateMobileUser({ required: true }),
  propertyListingsController.createPricingRule
);

/**
 * PUT /api/v1/apps/:appId/listings/:listingId/pricing-rules/:ruleId
 * Update a pricing rule
 */
router.put(
  '/apps/:appId/listings/:listingId/pricing-rules/:ruleId',
  authenticateMobileUser({ required: true }),
  propertyListingsController.updatePricingRule
);

/**
 * DELETE /api/v1/apps/:appId/listings/:listingId/pricing-rules/:ruleId
 * Delete a pricing rule
 */
router.delete(
  '/apps/:appId/listings/:listingId/pricing-rules/:ruleId',
  authenticateMobileUser({ required: true }),
  propertyListingsController.deletePricingRule
);

/**
 * POST /api/v1/apps/:appId/listings/:listingId/calculate-price
 * Calculate price for a booking (applies dynamic pricing)
 */
router.post(
  '/apps/:appId/listings/:listingId/calculate-price',
  propertyListingsController.calculatePrice
);

module.exports = router;
