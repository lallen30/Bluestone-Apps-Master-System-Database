const db = require('../config/database');

/**
 * Register as a driver
 * POST /api/v1/apps/:appId/drivers/register
 */
const registerDriver = async (req, res) => {
  try {
    const { appId } = req.params;
    const userId = req.user.id;
    const {
      vehicle_make,
      vehicle_model,
      vehicle_year,
      vehicle_color,
      license_plate,
      vehicle_type = 'sedan',
      drivers_license_url,
      vehicle_registration_url,
      insurance_url
    } = req.body;

    // Check if already registered
    const existing = await db.query(
      'SELECT id FROM driver_profiles WHERE user_id = ? AND app_id = ?',
      [userId, appId]
    );

    if (existing && existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered as a driver'
      });
    }

    // Validate required fields
    if (!vehicle_make || !vehicle_model || !license_plate) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle make, model, and license plate are required'
      });
    }

    // Create driver profile
    const result = await db.query(
      `INSERT INTO driver_profiles (
        app_id, user_id, vehicle_make, vehicle_model, vehicle_year,
        vehicle_color, license_plate, vehicle_type,
        drivers_license_url, vehicle_registration_url, insurance_url,
        is_verified, is_online
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0)`,
      [
        appId, userId, vehicle_make, vehicle_model, vehicle_year,
        vehicle_color, license_plate, vehicle_type,
        drivers_license_url, vehicle_registration_url, insurance_url
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Driver registration submitted. Pending verification.',
      data: {
        driver_profile_id: result.insertId
      }
    });
  } catch (error) {
    console.error('Register driver error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register as driver',
      error: error.message
    });
  }
};

/**
 * Get driver profile
 * GET /api/v1/apps/:appId/drivers/profile
 */
const getDriverProfile = async (req, res) => {
  try {
    const { appId } = req.params;
    const userId = req.user.id;

    const profiles = await db.query(
      `SELECT dp.*, u.first_name, u.last_name, u.email, u.phone, u.avatar_url
       FROM driver_profiles dp
       JOIN app_users u ON dp.user_id = u.id
       WHERE dp.user_id = ? AND dp.app_id = ?`,
      [userId, appId]
    );

    if (!profiles || profiles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Driver profile not found'
      });
    }

    res.json({
      success: true,
      data: {
        profile: profiles[0]
      }
    });
  } catch (error) {
    console.error('Get driver profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get driver profile',
      error: error.message
    });
  }
};

/**
 * Update driver profile
 * PUT /api/v1/apps/:appId/drivers/profile
 */
const updateDriverProfile = async (req, res) => {
  try {
    const { appId } = req.params;
    const userId = req.user.id;
    const {
      vehicle_make,
      vehicle_model,
      vehicle_year,
      vehicle_color,
      license_plate,
      vehicle_type,
      profile_photo_url,
      vehicle_photo_url
    } = req.body;

    // Build update query
    const updates = [];
    const values = [];

    if (vehicle_make) { updates.push('vehicle_make = ?'); values.push(vehicle_make); }
    if (vehicle_model) { updates.push('vehicle_model = ?'); values.push(vehicle_model); }
    if (vehicle_year) { updates.push('vehicle_year = ?'); values.push(vehicle_year); }
    if (vehicle_color) { updates.push('vehicle_color = ?'); values.push(vehicle_color); }
    if (license_plate) { updates.push('license_plate = ?'); values.push(license_plate); }
    if (vehicle_type) { updates.push('vehicle_type = ?'); values.push(vehicle_type); }
    if (profile_photo_url) { updates.push('profile_photo_url = ?'); values.push(profile_photo_url); }
    if (vehicle_photo_url) { updates.push('vehicle_photo_url = ?'); values.push(vehicle_photo_url); }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    values.push(userId, appId);

    await db.query(
      `UPDATE driver_profiles SET ${updates.join(', ')} WHERE user_id = ? AND app_id = ?`,
      values
    );

    res.json({
      success: true,
      message: 'Driver profile updated successfully'
    });
  } catch (error) {
    console.error('Update driver profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update driver profile',
      error: error.message
    });
  }
};

/**
 * Toggle driver online/offline status
 * PUT /api/v1/apps/:appId/drivers/status
 */
const toggleDriverStatus = async (req, res) => {
  try {
    const { appId } = req.params;
    const userId = req.user.id;
    const { is_online, latitude, longitude } = req.body;

    // Check if driver is verified
    const profiles = await db.query(
      'SELECT * FROM driver_profiles WHERE user_id = ? AND app_id = ?',
      [userId, appId]
    );

    if (!profiles || profiles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Driver profile not found'
      });
    }

    if (!profiles[0].is_verified) {
      return res.status(403).json({
        success: false,
        message: 'Your driver profile is not yet verified'
      });
    }

    // Update status
    await db.query(
      `UPDATE driver_profiles SET 
        is_online = ?,
        current_latitude = ?,
        current_longitude = ?,
        last_location_update = NOW()
       WHERE user_id = ? AND app_id = ?`,
      [is_online ? 1 : 0, latitude, longitude, userId, appId]
    );

    res.json({
      success: true,
      message: is_online ? 'You are now online' : 'You are now offline',
      data: {
        is_online: !!is_online
      }
    });
  } catch (error) {
    console.error('Toggle driver status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update status',
      error: error.message
    });
  }
};

/**
 * Update driver location
 * PUT /api/v1/apps/:appId/drivers/location
 */
const updateDriverLocation = async (req, res) => {
  try {
    const { appId } = req.params;
    const userId = req.user.id;
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    await db.query(
      `UPDATE driver_profiles SET 
        current_latitude = ?,
        current_longitude = ?,
        last_location_update = NOW()
       WHERE user_id = ? AND app_id = ?`,
      [latitude, longitude, userId, appId]
    );

    res.json({
      success: true,
      message: 'Location updated'
    });
  } catch (error) {
    console.error('Update driver location error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update location',
      error: error.message
    });
  }
};

/**
 * Get driver earnings
 * GET /api/v1/apps/:appId/drivers/earnings
 */
const getDriverEarnings = async (req, res) => {
  try {
    const { appId } = req.params;
    const userId = req.user.id;
    const { start_date, end_date, status } = req.query;

    let whereClause = 'WHERE de.app_id = ? AND de.driver_id = ?';
    const params = [appId, userId];

    if (start_date) {
      whereClause += ' AND de.created_at >= ?';
      params.push(start_date);
    }
    if (end_date) {
      whereClause += ' AND de.created_at <= ?';
      params.push(end_date);
    }
    if (status) {
      whereClause += ' AND de.status = ?';
      params.push(status);
    }

    // Get earnings summary
    const summary = await db.query(
      `SELECT 
        SUM(gross_amount) as total_gross,
        SUM(net_amount) as total_net,
        SUM(tip_amount) as total_tips,
        SUM(platform_fee) as total_fees,
        COUNT(*) as total_rides
       FROM driver_earnings de
       ${whereClause}`,
      params
    );

    // Get earnings by status
    const byStatus = await db.query(
      `SELECT 
        status,
        SUM(net_amount) as amount,
        COUNT(*) as count
       FROM driver_earnings de
       ${whereClause}
       GROUP BY status`,
      params
    );

    // Get recent earnings
    const recent = await db.query(
      `SELECT de.*, r.pickup_address, r.destination_address, r.ride_type
       FROM driver_earnings de
       JOIN rides r ON de.ride_id = r.id
       ${whereClause}
       ORDER BY de.created_at DESC
       LIMIT 20`,
      params
    );

    res.json({
      success: true,
      data: {
        summary: summary[0] || {
          total_gross: 0,
          total_net: 0,
          total_tips: 0,
          total_fees: 0,
          total_rides: 0
        },
        by_status: byStatus,
        recent_earnings: recent
      }
    });
  } catch (error) {
    console.error('Get driver earnings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get earnings',
      error: error.message
    });
  }
};

/**
 * Get driver's rides
 * GET /api/v1/apps/:appId/drivers/rides
 */
const getDriverRides = async (req, res) => {
  try {
    const { appId } = req.params;
    const userId = req.user.id;
    const { status, page = 1, per_page = 20 } = req.query;

    const offset = (page - 1) * per_page;
    let whereClause = 'WHERE r.app_id = ? AND r.driver_id = ?';
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

    // Get rides with rider info
    const rides = await db.query(
      `SELECT r.*, 
        u.first_name as rider_first_name, u.last_name as rider_last_name
       FROM rides r
       JOIN app_users u ON r.rider_id = u.id
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
    console.error('Get driver rides error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get rides',
      error: error.message
    });
  }
};

/**
 * Get available ride requests (for drivers)
 * GET /api/v1/apps/:appId/drivers/available-rides
 */
const getAvailableRides = async (req, res) => {
  try {
    const { appId } = req.params;
    const userId = req.user.id;
    const { latitude, longitude, radius_km = 10 } = req.query;

    // Check if driver is online and verified
    const profiles = await db.query(
      'SELECT * FROM driver_profiles WHERE user_id = ? AND app_id = ? AND is_verified = 1 AND is_online = 1',
      [userId, appId]
    );

    if (!profiles || profiles.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'You must be online and verified to see available rides'
      });
    }

    // Get available rides
    // In production, would filter by distance using Haversine formula
    const rides = await db.query(
      `SELECT r.*, 
        u.first_name as rider_first_name, u.last_name as rider_last_name
       FROM rides r
       JOIN app_users u ON r.rider_id = u.id
       WHERE r.app_id = ? AND r.status IN ('requested', 'searching')
       ORDER BY r.requested_at ASC
       LIMIT 20`,
      [appId]
    );

    res.json({
      success: true,
      data: {
        rides
      }
    });
  } catch (error) {
    console.error('Get available rides error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get available rides',
      error: error.message
    });
  }
};

/**
 * Get driver by ID (public profile)
 * GET /api/v1/apps/:appId/drivers/:driverId
 */
const getDriverById = async (req, res) => {
  try {
    const { appId, driverId } = req.params;

    const profiles = await db.query(
      `SELECT 
        dp.id, dp.vehicle_make, dp.vehicle_model, dp.vehicle_year, dp.vehicle_color,
        dp.vehicle_type, dp.rating, dp.total_ratings, dp.total_rides,
        dp.profile_photo_url, dp.vehicle_photo_url, dp.is_verified,
        u.first_name, u.last_name
       FROM driver_profiles dp
       JOIN app_users u ON dp.user_id = u.id
       WHERE dp.user_id = ? AND dp.app_id = ?`,
      [driverId, appId]
    );

    if (!profiles || profiles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    // Get recent reviews
    const reviews = await db.query(
      `SELECT rr.rating, rr.comment, rr.created_at,
        u.first_name as reviewer_first_name
       FROM ride_reviews rr
       JOIN app_users u ON rr.reviewer_id = u.id
       WHERE rr.reviewee_id = ? AND rr.review_type = 'rider_to_driver'
       ORDER BY rr.created_at DESC
       LIMIT 10`,
      [driverId]
    );

    res.json({
      success: true,
      data: {
        driver: profiles[0],
        reviews
      }
    });
  } catch (error) {
    console.error('Get driver by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get driver profile',
      error: error.message
    });
  }
};

module.exports = {
  registerDriver,
  getDriverProfile,
  updateDriverProfile,
  toggleDriverStatus,
  updateDriverLocation,
  getDriverEarnings,
  getDriverRides,
  getAvailableRides,
  getDriverById
};
