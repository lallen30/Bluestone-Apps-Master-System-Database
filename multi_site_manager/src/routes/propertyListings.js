const express = require('express');
const router = express.Router();
const propertyListingsController = require('../controllers/propertyListingsController');
const { authenticateMobileUser } = require('../middleware/mobileAuth');

// Public routes (no auth required)

/**
 * GET /api/v1/apps/:appId/listings
 * Get all listings (with filters)
 * Public endpoint for browsing listings
 */
router.get('/apps/:appId/listings', propertyListingsController.getListings);

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
 * Requires authentication and ownership
 */
router.delete(
  '/apps/:appId/listings/:listingId',
  authenticateMobileUser({ required: true }),
  propertyListingsController.deleteListing
);

/**
 * PUT /api/v1/apps/:appId/listings/:listingId/publish
 * Publish or unpublish a listing
 * Requires authentication and ownership
 */
router.put(
  '/apps/:appId/listings/:listingId/publish',
  authenticateMobileUser({ required: true }),
  propertyListingsController.publishListing
);

module.exports = router;
