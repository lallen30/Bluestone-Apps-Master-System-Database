const db = require('../config/database');

/**
 * Request a new ride
 * POST /api/v1/apps/:appId/rides
 */
const requestRide = async (req, res) => {
  try {
    const { appId } = req.params;
    const userId = req.user.id;
    const {
      pickup_address,
      pickup_latitude,
      pickup_longitude,
      destination_address,
      destination_latitude,
      destination_longitude,
      ride_type = 'standard',
      promo_code,
      ride_notes
    } = req.body;

    // Validate required fields
    if (!pickup_address || !destination_address) {
      return res.status(400).json({
        success: false,
        message: 'Pickup and destination addresses are required'
      });
    }

    // Calculate estimated fare based on pricing rules
    const pricingResult = await db.query(
      'SELECT * FROM ride_pricing_rules WHERE app_id = ? AND ride_type = ? AND is_active = 1',
      [appId, ride_type]
    );

    let estimatedFare = 10.00; // Default
    if (pricingResult && pricingResult.length > 0) {
      const pricing = pricingResult[0];
      // Simple estimation - in production would use actual distance/time from maps API
      const estimatedDistance = 5; // km
      const estimatedTime = 15; // minutes
      estimatedFare = pricing.base_fare + 
                      (pricing.per_km_rate * estimatedDistance) + 
                      (pricing.per_minute_rate * estimatedTime);
      estimatedFare = Math.max(estimatedFare, pricing.minimum_fare);
    }

    // Apply promo code if provided
    let promoDiscount = 0;
    if (promo_code) {
      const promoResult = await db.query(
        `SELECT * FROM ride_promo_codes 
         WHERE app_id = ? AND code = ? AND is_active = 1 
         AND (valid_from IS NULL OR valid_from <= NOW())
         AND (valid_until IS NULL OR valid_until >= NOW())
         AND (usage_limit IS NULL OR used_count < usage_limit)`,
        [appId, promo_code]
      );

      if (promoResult && promoResult.length > 0) {
        const promo = promoResult[0];
        if (promo.discount_type === 'percentage') {
          promoDiscount = estimatedFare * (promo.discount_value / 100);
          if (promo.max_discount) {
            promoDiscount = Math.min(promoDiscount, promo.max_discount);
          }
        } else {
          promoDiscount = promo.discount_value;
        }
      }
    }

    const finalEstimate = Math.max(0, estimatedFare - promoDiscount);

    // Create the ride
    const result = await db.query(
      `INSERT INTO rides (
        app_id, rider_id, pickup_address, pickup_latitude, pickup_longitude,
        destination_address, destination_latitude, destination_longitude,
        ride_type, estimated_fare, promo_code, ride_notes, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'requested')`,
      [
        appId, userId, pickup_address, pickup_latitude, pickup_longitude,
        destination_address, destination_latitude, destination_longitude,
        ride_type, finalEstimate, promo_code, ride_notes
      ]
    );

    const rideId = result.insertId;

    // Fetch the created ride
    const rides = await db.query(
      'SELECT * FROM rides WHERE id = ?',
      [rideId]
    );

    res.status(201).json({
      success: true,
      message: 'Ride requested successfully',
      data: {
        ride: rides[0],
        estimated_fare: finalEstimate,
        promo_discount: promoDiscount
      }
    });
  } catch (error) {
    console.error('Request ride error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to request ride',
      error: error.message
    });
  }
};

/**
 * Get user's ride history
 * GET /api/v1/apps/:appId/rides
 */
const getRideHistory = async (req, res) => {
  try {
    const { appId } = req.params;
    const userId = req.user.id;
    const { status, page = 1, per_page = 20 } = req.query;

    const offset = (page - 1) * per_page;
    let whereClause = 'WHERE r.app_id = ? AND r.rider_id = ?';
    const params = [appId, userId];

    if (status) {
      whereClause += ' AND r.status = ?';
      params.push(status);
    }

    // Get total count
    const countResult = await db.query(
      `SELECT COUNT(*) as total FROM rides r ${whereClause}`,
      params
    );
    const total = countResult[0]?.total || 0;

    // Get rides with driver info
    const rides = await db.query(
      `SELECT r.*, 
        dp.vehicle_make, dp.vehicle_model, dp.vehicle_color, dp.license_plate,
        dp.rating as driver_rating,
        u.first_name as driver_first_name, u.last_name as driver_last_name
       FROM rides r
       LEFT JOIN driver_profiles dp ON r.driver_id = dp.user_id AND dp.app_id = r.app_id
       LEFT JOIN app_users u ON r.driver_id = u.id
       ${whereClause}
       ORDER BY r.requested_at DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(per_page), offset]
    );

    res.json({
      success: true,
      data: {
        rides,
        pagination: {
          page: parseInt(page),
          per_page: parseInt(per_page),
          total,
          total_pages: Math.ceil(total / per_page)
        }
      }
    });
  } catch (error) {
    console.error('Get ride history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get ride history',
      error: error.message
    });
  }
};

/**
 * Get ride details
 * GET /api/v1/apps/:appId/rides/:rideId
 */
const getRideById = async (req, res) => {
  try {
    const { appId, rideId } = req.params;
    const userId = req.user.id;

    const rides = await db.query(
      `SELECT r.*, 
        dp.vehicle_make, dp.vehicle_model, dp.vehicle_color, dp.license_plate,
        dp.rating as driver_rating, dp.total_rides as driver_total_rides,
        dp.profile_photo_url as driver_photo,
        u.first_name as driver_first_name, u.last_name as driver_last_name, u.phone as driver_phone
       FROM rides r
       LEFT JOIN driver_profiles dp ON r.driver_id = dp.user_id AND dp.app_id = r.app_id
       LEFT JOIN app_users u ON r.driver_id = u.id
       WHERE r.id = ? AND r.app_id = ? AND (r.rider_id = ? OR r.driver_id = ?)`,
      [rideId, appId, userId, userId]
    );

    if (!rides || rides.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    // Get payment info if completed
    let payment = null;
    if (rides[0].status === 'completed') {
      const payments = await db.query(
        'SELECT * FROM ride_payments WHERE ride_id = ?',
        [rideId]
      );
      payment = payments[0] || null;
    }

    // Get review if exists
    const reviews = await db.query(
      'SELECT * FROM ride_reviews WHERE ride_id = ? AND reviewer_id = ?',
      [rideId, userId]
    );

    res.json({
      success: true,
      data: {
        ride: rides[0],
        payment,
        my_review: reviews[0] || null
      }
    });
  } catch (error) {
    console.error('Get ride by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get ride details',
      error: error.message
    });
  }
};

/**
 * Get active ride
 * GET /api/v1/apps/:appId/rides/active
 */
const getActiveRide = async (req, res) => {
  try {
    const { appId } = req.params;
    const userId = req.user.id;

    const rides = await db.query(
      `SELECT r.*, 
        dp.vehicle_make, dp.vehicle_model, dp.vehicle_color, dp.license_plate,
        dp.rating as driver_rating, dp.current_latitude as driver_latitude, 
        dp.current_longitude as driver_longitude,
        u.first_name as driver_first_name, u.last_name as driver_last_name, u.phone as driver_phone
       FROM rides r
       LEFT JOIN driver_profiles dp ON r.driver_id = dp.user_id AND dp.app_id = r.app_id
       LEFT JOIN app_users u ON r.driver_id = u.id
       WHERE r.app_id = ? AND (r.rider_id = ? OR r.driver_id = ?)
       AND r.status IN ('requested', 'searching', 'driver_assigned', 'driver_arriving', 'arrived', 'in_progress')
       ORDER BY r.requested_at DESC
       LIMIT 1`,
      [appId, userId, userId]
    );

    res.json({
      success: true,
      data: {
        ride: rides[0] || null
      }
    });
  } catch (error) {
    console.error('Get active ride error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get active ride',
      error: error.message
    });
  }
};

/**
 * Cancel ride
 * PUT /api/v1/apps/:appId/rides/:rideId/cancel
 */
const cancelRide = async (req, res) => {
  try {
    const { appId, rideId } = req.params;
    const userId = req.user.id;
    const { cancellation_reason } = req.body;

    // Get the ride
    const rides = await db.query(
      'SELECT * FROM rides WHERE id = ? AND app_id = ?',
      [rideId, appId]
    );

    if (!rides || rides.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    const ride = rides[0];

    // Check if user is rider or driver
    const isRider = ride.rider_id === userId;
    const isDriver = ride.driver_id === userId;

    if (!isRider && !isDriver) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to cancel this ride'
      });
    }

    // Check if ride can be cancelled
    if (['completed', 'cancelled'].includes(ride.status)) {
      return res.status(400).json({
        success: false,
        message: 'This ride cannot be cancelled'
      });
    }

    // Update ride status
    await db.query(
      `UPDATE rides SET 
        status = 'cancelled',
        cancelled_at = NOW(),
        cancelled_by = ?,
        cancellation_reason = ?
       WHERE id = ?`,
      [isRider ? 'rider' : 'driver', cancellation_reason, rideId]
    );

    res.json({
      success: true,
      message: 'Ride cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel ride error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel ride',
      error: error.message
    });
  }
};

/**
 * Rate ride
 * PUT /api/v1/apps/:appId/rides/:rideId/rate
 */
const rateRide = async (req, res) => {
  try {
    const { appId, rideId } = req.params;
    const userId = req.user.id;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Get the ride
    const rides = await db.query(
      'SELECT * FROM rides WHERE id = ? AND app_id = ? AND status = ?',
      [rideId, appId, 'completed']
    );

    if (!rides || rides.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Completed ride not found'
      });
    }

    const ride = rides[0];

    // Determine review type
    const isRider = ride.rider_id === userId;
    const isDriver = ride.driver_id === userId;

    if (!isRider && !isDriver) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to rate this ride'
      });
    }

    const reviewType = isRider ? 'rider_to_driver' : 'driver_to_rider';
    const revieweeId = isRider ? ride.driver_id : ride.rider_id;

    // Check if already reviewed
    const existingReview = await db.query(
      'SELECT id FROM ride_reviews WHERE ride_id = ? AND reviewer_id = ?',
      [rideId, userId]
    );

    if (existingReview && existingReview.length > 0) {
      // Update existing review
      await db.query(
        'UPDATE ride_reviews SET rating = ?, comment = ? WHERE ride_id = ? AND reviewer_id = ?',
        [rating, comment, rideId, userId]
      );
    } else {
      // Create new review
      await db.query(
        `INSERT INTO ride_reviews (ride_id, reviewer_id, reviewee_id, rating, comment, review_type)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [rideId, userId, revieweeId, rating, comment, reviewType]
      );
    }

    // Update driver rating if this is a rider-to-driver review
    if (isRider && ride.driver_id) {
      const avgRating = await db.query(
        `SELECT AVG(rating) as avg_rating, COUNT(*) as total_ratings
         FROM ride_reviews 
         WHERE reviewee_id = ? AND review_type = 'rider_to_driver'`,
        [ride.driver_id]
      );

      if (avgRating && avgRating[0]) {
        await db.query(
          'UPDATE driver_profiles SET rating = ?, total_ratings = ? WHERE user_id = ? AND app_id = ?',
          [avgRating[0].avg_rating, avgRating[0].total_ratings, ride.driver_id, appId]
        );
      }
    }

    res.json({
      success: true,
      message: 'Rating submitted successfully'
    });
  } catch (error) {
    console.error('Rate ride error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit rating',
      error: error.message
    });
  }
};

/**
 * Update ride status (for drivers)
 * PUT /api/v1/apps/:appId/rides/:rideId/status
 */
const updateRideStatus = async (req, res) => {
  try {
    const { appId, rideId } = req.params;
    const userId = req.user.id;
    const { status } = req.body;

    const validStatuses = ['driver_arriving', 'arrived', 'in_progress', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    // Get the ride
    const rides = await db.query(
      'SELECT * FROM rides WHERE id = ? AND app_id = ? AND driver_id = ?',
      [rideId, appId, userId]
    );

    if (!rides || rides.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found or you are not the driver'
      });
    }

    const ride = rides[0];

    // Update based on status
    let updateFields = { status };
    
    if (status === 'arrived') {
      updateFields.driver_arrived_at = new Date();
    } else if (status === 'in_progress') {
      updateFields.pickup_at = new Date();
    } else if (status === 'completed') {
      updateFields.dropoff_at = new Date();
      updateFields.actual_fare = ride.estimated_fare; // In production, calculate actual fare
    }

    const setClause = Object.keys(updateFields)
      .map(key => `${key} = ?`)
      .join(', ');
    const values = Object.values(updateFields);

    await db.query(
      `UPDATE rides SET ${setClause} WHERE id = ?`,
      [...values, rideId]
    );

    // If completed, create payment and earnings records
    if (status === 'completed') {
      // Create payment record
      await db.query(
        `INSERT INTO ride_payments (ride_id, amount, base_fare, status)
         VALUES (?, ?, ?, 'completed')`,
        [rideId, ride.estimated_fare, ride.estimated_fare]
      );

      // Create driver earnings
      const platformFee = ride.estimated_fare * 0.20; // 20% platform fee
      const netAmount = ride.estimated_fare - platformFee;

      await db.query(
        `INSERT INTO driver_earnings (app_id, driver_id, ride_id, gross_amount, platform_fee, net_amount, status)
         VALUES (?, ?, ?, ?, ?, ?, 'available')`,
        [appId, userId, rideId, ride.estimated_fare, platformFee, netAmount]
      );

      // Update driver stats
      await db.query(
        'UPDATE driver_profiles SET total_rides = total_rides + 1 WHERE user_id = ? AND app_id = ?',
        [userId, appId]
      );
    }

    res.json({
      success: true,
      message: 'Ride status updated successfully'
    });
  } catch (error) {
    console.error('Update ride status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update ride status',
      error: error.message
    });
  }
};

/**
 * Accept ride (for drivers)
 * PUT /api/v1/apps/:appId/rides/:rideId/accept
 */
const acceptRide = async (req, res) => {
  try {
    const { appId, rideId } = req.params;
    const userId = req.user.id;

    // Check if user is a verified driver
    const drivers = await db.query(
      'SELECT * FROM driver_profiles WHERE user_id = ? AND app_id = ? AND is_verified = 1 AND is_online = 1',
      [userId, appId]
    );

    if (!drivers || drivers.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'You must be a verified online driver to accept rides'
      });
    }

    // Get the ride
    const rides = await db.query(
      'SELECT * FROM rides WHERE id = ? AND app_id = ? AND status IN (?, ?)',
      [rideId, appId, 'requested', 'searching']
    );

    if (!rides || rides.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found or already assigned'
      });
    }

    // Assign driver to ride
    await db.query(
      `UPDATE rides SET 
        driver_id = ?,
        status = 'driver_assigned',
        driver_assigned_at = NOW()
       WHERE id = ?`,
      [userId, rideId]
    );

    res.json({
      success: true,
      message: 'Ride accepted successfully'
    });
  } catch (error) {
    console.error('Accept ride error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to accept ride',
      error: error.message
    });
  }
};

module.exports = {
  requestRide,
  getRideHistory,
  getRideById,
  getActiveRide,
  cancelRide,
  rateRide,
  updateRideStatus,
  acceptRide
};
