const db = require('../config/database');

/**
 * Get user's favorite listings
 * GET /api/v1/apps/:appId/favorites
 */
exports.getFavorites = async (req, res) => {
  try {
    const { appId } = req.params;
    const userId = req.user?.id;
    const { page = 1, per_page = 20 } = req.query;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const limit = parseInt(per_page);
    const offset = (parseInt(page) - 1) * limit;

    // Get favorites with listing details
    const favoritesResult = await db.query(
      `SELECT 
        f.id as favorite_id,
        f.created_at as favorited_at,
        l.*,
        u.first_name as host_first_name,
        u.last_name as host_last_name,
        (SELECT image_url FROM property_images WHERE listing_id = l.id AND is_primary = 1 LIMIT 1) as primary_image
       FROM user_favorites f
       JOIN property_listings l ON f.listing_id = l.id
       LEFT JOIN app_users u ON l.user_id = u.id
       WHERE f.app_id = ? AND f.user_id = ?
       ORDER BY f.created_at DESC
       LIMIT ? OFFSET ?`,
      [appId, userId, limit, offset]
    );

    const favorites = Array.isArray(favoritesResult) && Array.isArray(favoritesResult[0]) 
      ? favoritesResult[0] 
      : favoritesResult;

    // Get total count
    const countResult = await db.query(
      `SELECT COUNT(*) as total FROM user_favorites WHERE app_id = ? AND user_id = ?`,
      [appId, userId]
    );
    const countData = Array.isArray(countResult) && Array.isArray(countResult[0]) 
      ? countResult[0] 
      : countResult;
    const total = countData[0]?.total || 0;

    res.json({
      success: true,
      data: {
        favorites: favorites || [],
        pagination: {
          page: parseInt(page),
          per_page: limit,
          total,
          total_pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch favorites',
      error: error.message
    });
  }
};

/**
 * Add listing to favorites
 * POST /api/v1/apps/:appId/favorites
 */
exports.addFavorite = async (req, res) => {
  try {
    const { appId } = req.params;
    const userId = req.user?.id;
    const { listing_id } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!listing_id) {
      return res.status(400).json({
        success: false,
        message: 'Listing ID is required'
      });
    }

    // Check if listing exists
    const listingResult = await db.query(
      `SELECT id FROM property_listings WHERE id = ? AND app_id = ?`,
      [listing_id, appId]
    );
    const listings = Array.isArray(listingResult) && Array.isArray(listingResult[0]) 
      ? listingResult[0] 
      : listingResult;

    if (!listings || listings.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Check if already favorited
    const existingResult = await db.query(
      `SELECT id FROM user_favorites WHERE user_id = ? AND listing_id = ?`,
      [userId, listing_id]
    );
    const existing = Array.isArray(existingResult) && Array.isArray(existingResult[0]) 
      ? existingResult[0] 
      : existingResult;

    if (existing && existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Listing already in favorites'
      });
    }

    // Add to favorites
    const result = await db.query(
      `INSERT INTO user_favorites (app_id, user_id, listing_id) VALUES (?, ?, ?)`,
      [appId, userId, listing_id]
    );

    res.status(201).json({
      success: true,
      message: 'Added to favorites',
      data: {
        favorite_id: result.insertId,
        listing_id
      }
    });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add favorite',
      error: error.message
    });
  }
};

/**
 * Remove listing from favorites
 * DELETE /api/v1/apps/:appId/favorites/:listingId
 */
exports.removeFavorite = async (req, res) => {
  try {
    const { appId, listingId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const result = await db.query(
      `DELETE FROM user_favorites WHERE app_id = ? AND user_id = ? AND listing_id = ?`,
      [appId, userId, listingId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Favorite not found'
      });
    }

    res.json({
      success: true,
      message: 'Removed from favorites'
    });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove favorite',
      error: error.message
    });
  }
};

/**
 * Check if listing is favorited
 * GET /api/v1/apps/:appId/favorites/check/:listingId
 */
exports.checkFavorite = async (req, res) => {
  try {
    const { appId, listingId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const result = await db.query(
      `SELECT id FROM user_favorites WHERE app_id = ? AND user_id = ? AND listing_id = ?`,
      [appId, userId, listingId]
    );
    const favorites = Array.isArray(result) && Array.isArray(result[0]) 
      ? result[0] 
      : result;

    res.json({
      success: true,
      data: {
        is_favorited: favorites && favorites.length > 0,
        listing_id: parseInt(listingId)
      }
    });
  } catch (error) {
    console.error('Check favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check favorite',
      error: error.message
    });
  }
};

/**
 * Get favorite IDs for multiple listings (batch check)
 * POST /api/v1/apps/:appId/favorites/batch-check
 */
exports.batchCheckFavorites = async (req, res) => {
  try {
    const { appId } = req.params;
    const userId = req.user?.id;
    const { listing_ids } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!listing_ids || !Array.isArray(listing_ids) || listing_ids.length === 0) {
      return res.json({
        success: true,
        data: { favorited_ids: [] }
      });
    }

    const placeholders = listing_ids.map(() => '?').join(',');
    const result = await db.query(
      `SELECT listing_id FROM user_favorites 
       WHERE app_id = ? AND user_id = ? AND listing_id IN (${placeholders})`,
      [appId, userId, ...listing_ids]
    );
    const favorites = Array.isArray(result) && Array.isArray(result[0]) 
      ? result[0] 
      : result;

    const favoritedIds = (favorites || []).map(f => f.listing_id);

    res.json({
      success: true,
      data: { favorited_ids: favoritedIds }
    });
  } catch (error) {
    console.error('Batch check favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check favorites',
      error: error.message
    });
  }
};
