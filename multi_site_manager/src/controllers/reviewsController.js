const db = require('../config/database');

/**
 * Get reviews for a listing
 * GET /api/v1/apps/:appId/listings/:listingId/reviews
 */
exports.getListingReviews = async (req, res) => {
  try {
    const { appId, listingId } = req.params;
    const { page = 1, per_page = 20 } = req.query;
    const offset = (page - 1) * per_page;

    // Get reviews
    const reviews = await db.query(
      `SELECT r.*, 
              u.first_name as reviewer_first_name, 
              u.last_name as reviewer_last_name
       FROM property_reviews r
       LEFT JOIN app_users u ON r.reviewer_id = u.id
       WHERE r.listing_id = ? AND r.app_id = ? AND r.status = 'approved' AND r.is_public = 1
       ORDER BY r.created_at DESC
       LIMIT ? OFFSET ?`,
      [listingId, appId, parseInt(per_page), offset]
    );

    // Get stats
    const stats = await db.query(
      `SELECT 
         COUNT(*) as total_reviews,
         AVG(rating) as average_rating,
         AVG(cleanliness_rating) as avg_cleanliness,
         AVG(communication_rating) as avg_communication,
         AVG(location_rating) as avg_location,
         AVG(value_rating) as avg_value,
         AVG(accuracy_rating) as avg_accuracy
       FROM property_reviews
       WHERE listing_id = ? AND app_id = ? AND status = 'approved'`,
      [listingId, appId]
    );

    const statsData = stats[0] || {};

    res.json({
      success: true,
      data: {
        reviews: reviews || [],
        average_rating: parseFloat(statsData.average_rating) || 0,
        total_reviews: parseInt(statsData.total_reviews) || 0,
        rating_breakdown: {
          cleanliness: parseFloat(statsData.avg_cleanliness) || 0,
          communication: parseFloat(statsData.avg_communication) || 0,
          location: parseFloat(statsData.avg_location) || 0,
          value: parseFloat(statsData.avg_value) || 0,
          accuracy: parseFloat(statsData.avg_accuracy) || 0,
        },
        pagination: {
          page: parseInt(page),
          per_page: parseInt(per_page),
          total: parseInt(statsData.total_reviews) || 0,
        }
      }
    });
  } catch (error) {
    console.error('Get listing reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
};

/**
 * Create a review
 * POST /api/v1/apps/:appId/reviews
 */
exports.createReview = async (req, res) => {
  try {
    const { appId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const {
      listing_id,
      booking_id,
      rating,
      cleanliness_rating,
      communication_rating,
      location_rating,
      value_rating,
      accuracy_rating,
      review_text
    } = req.body;

    if (!listing_id || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Listing ID and rating are required'
      });
    }

    // Verify booking exists and is completed (if booking_id provided)
    if (booking_id) {
      const booking = await db.query(
        `SELECT id, status, guest_user_id FROM property_bookings 
         WHERE id = ? AND listing_id = ? AND guest_user_id = ?`,
        [booking_id, listing_id, userId]
      );

      if (!booking || booking.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid booking'
        });
      }

      if (booking[0].status !== 'completed') {
        return res.status(400).json({
          success: false,
          message: 'You can only review completed stays'
        });
      }

      // Check if already reviewed
      const existingReview = await db.query(
        `SELECT id FROM property_reviews WHERE booking_id = ?`,
        [booking_id]
      );

      if (existingReview && existingReview.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'You have already reviewed this booking'
        });
      }
    }

    // Insert review
    const result = await db.query(
      `INSERT INTO property_reviews 
       (app_id, listing_id, booking_id, reviewer_id, reviewer_type, rating,
        cleanliness_rating, communication_rating, location_rating, value_rating, accuracy_rating,
        review_text, status)
       VALUES (?, ?, ?, ?, 'guest', ?, ?, ?, ?, ?, ?, ?, 'approved')`,
      [appId, listing_id, booking_id || null, userId, rating,
       cleanliness_rating || null, communication_rating || null, 
       location_rating || null, value_rating || null, accuracy_rating || null,
       review_text || null]
    );

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: {
        review_id: result.insertId
      }
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit review',
      error: error.message
    });
  }
};

/**
 * Get user's reviews
 * GET /api/v1/apps/:appId/reviews/my
 */
exports.getMyReviews = async (req, res) => {
  try {
    const { appId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const reviews = await db.query(
      `SELECT r.*, l.title as listing_title, l.city, l.country
       FROM property_reviews r
       LEFT JOIN property_listings l ON r.listing_id = l.id
       WHERE r.reviewer_id = ? AND r.app_id = ?
       ORDER BY r.created_at DESC`,
      [userId, appId]
    );

    res.json({
      success: true,
      data: {
        reviews: reviews || [],
        total_reviews: reviews?.length || 0
      }
    });
  } catch (error) {
    console.error('Get my reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
};

/**
 * Host responds to a review
 * POST /api/v1/apps/:appId/reviews/:reviewId/respond
 */
exports.respondToReview = async (req, res) => {
  try {
    const { appId, reviewId } = req.params;
    const { response } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Verify the user is the host of the listing
    const review = await db.query(
      `SELECT r.id, l.user_id as host_id
       FROM property_reviews r
       JOIN property_listings l ON r.listing_id = l.id
       WHERE r.id = ? AND r.app_id = ?`,
      [reviewId, appId]
    );

    if (!review || review.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review[0].host_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only the host can respond to reviews'
      });
    }

    await db.query(
      `UPDATE property_reviews SET host_response = ?, host_response_at = NOW() WHERE id = ?`,
      [response, reviewId]
    );

    res.json({
      success: true,
      message: 'Response added successfully'
    });
  } catch (error) {
    console.error('Respond to review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add response',
      error: error.message
    });
  }
};

/**
 * Report content
 * POST /api/v1/apps/:appId/reports
 */
exports.createReport = async (req, res) => {
  try {
    const { appId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { content_type, content_id, reason, description } = req.body;

    if (!content_type || !content_id || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Content type, content ID, and reason are required'
      });
    }

    // Check for duplicate report
    const existing = await db.query(
      `SELECT id FROM content_reports 
       WHERE reporter_id = ? AND content_type = ? AND content_id = ? AND status = 'pending'`,
      [userId, content_type, content_id]
    );

    if (existing && existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'You have already reported this content'
      });
    }

    await db.query(
      `INSERT INTO content_reports (app_id, reporter_id, content_type, content_id, reason, description)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [appId, userId, content_type, content_id, reason, description || null]
    );

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully'
    });
  } catch (error) {
    console.error('Create report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit report',
      error: error.message
    });
  }
};
