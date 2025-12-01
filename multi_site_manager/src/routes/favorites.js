const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favoritesController');
const { authenticateMobileUser } = require('../middleware/mobileAuth');

// All routes require authentication

/**
 * GET /api/v1/apps/:appId/favorites
 * Get user's favorite listings
 */
router.get(
  '/apps/:appId/favorites',
  authenticateMobileUser({ required: true }),
  favoritesController.getFavorites
);

/**
 * POST /api/v1/apps/:appId/favorites
 * Add listing to favorites
 */
router.post(
  '/apps/:appId/favorites',
  authenticateMobileUser({ required: true }),
  favoritesController.addFavorite
);

/**
 * DELETE /api/v1/apps/:appId/favorites/:listingId
 * Remove listing from favorites
 */
router.delete(
  '/apps/:appId/favorites/:listingId',
  authenticateMobileUser({ required: true }),
  favoritesController.removeFavorite
);

/**
 * GET /api/v1/apps/:appId/favorites/check/:listingId
 * Check if listing is favorited
 */
router.get(
  '/apps/:appId/favorites/check/:listingId',
  authenticateMobileUser({ required: true }),
  favoritesController.checkFavorite
);

/**
 * POST /api/v1/apps/:appId/favorites/batch-check
 * Batch check if listings are favorited
 */
router.post(
  '/apps/:appId/favorites/batch-check',
  authenticateMobileUser({ required: true }),
  favoritesController.batchCheckFavorites
);

module.exports = router;
