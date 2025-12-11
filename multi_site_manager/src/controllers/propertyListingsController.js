const db = require('../config/database');

/**
 * Create a new property listing
 * POST /api/v1/apps/:appId/listings
 */
exports.createListing = async (req, res) => {
  try {
    const { appId } = req.params;
    const userId = req.user?.id; // From mobile auth middleware

    console.log('[createListing] Received request for app:', appId);
    console.log('[createListing] User:', req.user?.id, req.user?.email);
    console.log('[createListing] Body:', JSON.stringify(req.body, null, 2));

    if (!userId) {
      console.log('[createListing] No user ID - authentication required');
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const {
      title,
      description,
      property_type,
      // Location
      address_line1,
      address_line2,
      city,
      state,
      country,
      postal_code,
      latitude,
      longitude,
      // Details
      bedrooms,
      bathrooms,
      beds,
      guests_max,
      square_feet,
      // Pricing
      price_per_night,
      currency,
      cleaning_fee,
      service_fee_percentage,
      // Booking Rules
      min_nights,
      max_nights,
      check_in_time,
      check_out_time,
      cancellation_policy,
      is_instant_book,
      // Additional
      house_rules,
      additional_info,
      amenities, // Array of amenity IDs
      images // Array of image objects: { image_url, caption, is_primary }
    } = req.body;

    // Validation
    if (!title || !city || !country || !price_per_night) {
      return res.status(400).json({
        success: false,
        message: 'Title, city, country, and price are required'
      });
    }

    // Helper to convert undefined to null (MySQL doesn't accept undefined)
    const toNull = (val) => val === undefined ? null : val;

    // Build values array
    const values = [
      appId, userId, title, toNull(description), property_type || 'apartment',
      toNull(address_line1), toNull(address_line2), city, toNull(state), country, toNull(postal_code), toNull(latitude), toNull(longitude),
      bedrooms || 0, bathrooms || 0, beds || 0, guests_max || 1, toNull(square_feet),
      price_per_night, currency || 'USD', cleaning_fee || 0, service_fee_percentage || 0,
      min_nights || 1, max_nights || 365, check_in_time || '15:00:00', check_out_time || '11:00:00',
      cancellation_policy || 'moderate', is_instant_book ? 1 : 0,
      toNull(house_rules), toNull(additional_info)
    ];
    
    console.log('[createListing] Values array:', values);
    console.log('[createListing] Values count:', values.length);

    // Insert listing
    const result = await db.query(
      `INSERT INTO property_listings 
       (app_id, user_id, title, description, property_type,
        address_line1, address_line2, city, state, country, postal_code, latitude, longitude,
        bedrooms, bathrooms, beds, guests_max, square_feet,
        price_per_night, currency, cleaning_fee, service_fee_percentage,
        min_nights, max_nights, check_in_time, check_out_time, cancellation_policy, is_instant_book,
        house_rules, additional_info, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft')`,
      values
    );

    const listingId = result.insertId;

    // Add amenities if provided
    if (amenities && Array.isArray(amenities) && amenities.length > 0) {
      for (const amenityId of amenities) {
        await db.query(
          `INSERT INTO property_listing_amenities (listing_id, amenity_id) VALUES (?, ?)`,
          [listingId, amenityId]
        );
      }
    }

    // Add images if provided
    if (images && Array.isArray(images) && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        await db.query(
          `INSERT INTO property_images (listing_id, image_url, image_key, caption, display_order, is_primary) VALUES (?, ?, ?, ?, ?, ?)`,
          [listingId, img.image_url, img.image_key || null, img.caption || null, i + 1, img.is_primary ? 1 : 0]
        );
      }
    }

    res.status(201).json({
      success: true,
      message: 'Property listing created successfully',
      data: {
        id: listingId,
        title,
        status: 'draft'
      }
    });
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create listing',
      error: error.message
    });
  }
};

/**
 * Get all hosts (users with listings) for an app
 * GET /api/v1/apps/:appId/hosts
 */
exports.getHosts = async (req, res) => {
  try {
    const { appId } = req.params;

    const hosts = await db.query(
      `SELECT DISTINCT 
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        COUNT(l.id) as listing_count
       FROM app_users u
       INNER JOIN property_listings l ON u.id = l.user_id AND l.app_id = ?
       WHERE u.app_id = ?
       GROUP BY u.id, u.first_name, u.last_name, u.email
       ORDER BY u.first_name, u.last_name`,
      [appId, appId]
    );

    res.json({
      success: true,
      data: hosts || []
    });
  } catch (error) {
    console.error('Get hosts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hosts',
      error: error.message
    });
  }
};

/**
 * Get all listings for an app (with search/filter)
 * GET /api/v1/apps/:appId/listings
 */
exports.getListings = async (req, res) => {
  try {
    const { appId } = req.params;
    const {
      search,
      city,
      country,
      property_type,
      min_price,
      max_price,
      bedrooms,
      guests,
      status,
      user_id, // Filter by host
      check_in_date, // NEW: Date availability filter
      check_out_date, // NEW: Date availability filter
      amenities, // NEW: Comma-separated amenity IDs
      instant_book, // NEW: Only instant book properties
      sort_by = 'created_at', // NEW: Sorting
      sort_order = 'DESC', // NEW: Sort direction
      page = 1,
      per_page = 20
    } = req.query;

    let query = `
      SELECT 
        l.*,
        u.first_name as host_first_name,
        u.last_name as host_last_name,
        u.email as host_email,
        (SELECT GROUP_CONCAT(pa.name) 
         FROM property_listing_amenities pla 
         JOIN property_amenities pa ON pla.amenity_id = pa.id 
         WHERE pla.listing_id = l.id) as amenities_list,
        (SELECT image_url 
         FROM property_images 
         WHERE listing_id = l.id AND is_primary = 1 
         LIMIT 1) as primary_image
      FROM property_listings l
      LEFT JOIN app_users u ON l.user_id = u.id
      WHERE l.app_id = ?
    `;
    const params = [appId];

    // Search
    if (search) {
      query += ` AND (l.title LIKE ? OR l.description LIKE ? OR l.city LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Filters
    if (city) {
      query += ` AND l.city = ?`;
      params.push(city);
    }

    if (country) {
      query += ` AND l.country = ?`;
      params.push(country);
    }

    if (property_type) {
      query += ` AND l.property_type = ?`;
      params.push(property_type);
    }

    if (min_price) {
      query += ` AND l.price_per_night >= ?`;
      params.push(min_price);
    }

    if (max_price) {
      query += ` AND l.price_per_night <= ?`;
      params.push(max_price);
    }

    if (bedrooms) {
      query += ` AND l.bedrooms >= ?`;
      params.push(bedrooms);
    }

    if (guests) {
      query += ` AND l.guests_max >= ?`;
      params.push(guests);
    }

    if (status) {
      query += ` AND l.status = ?`;
      params.push(status);
    } else {
      // Default: only show active listings for public browsing (exclude drafts)
      query += ` AND l.status = 'active'`;
    }

    if (user_id) {
      query += ` AND l.user_id = ?`;
      params.push(user_id);
    }

    // NEW: Instant book filter
    if (instant_book === 'true' || instant_book === '1') {
      query += ` AND l.is_instant_book = 1`;
    }

    // NEW: Date availability filter
    if (check_in_date && check_out_date) {
      // Exclude listings with conflicting bookings
      query += ` AND l.id NOT IN (
        SELECT DISTINCT listing_id 
        FROM property_bookings 
        WHERE status IN ('confirmed', 'pending')
          AND (
            (check_in_date <= ? AND check_out_date > ?) OR
            (check_in_date < ? AND check_out_date >= ?) OR
            (check_in_date >= ? AND check_out_date <= ?)
          )
      )`;
      params.push(check_in_date, check_in_date, check_out_date, check_out_date, check_in_date, check_out_date);
    }

    // NEW: Amenities filter
    if (amenities) {
      const amenityIds = amenities.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));
      if (amenityIds.length > 0) {
        const amenityPlaceholders = amenityIds.map(() => '?').join(',');
        query += ` AND l.id IN (
          SELECT listing_id 
          FROM property_listing_amenities 
          WHERE amenity_id IN (${amenityPlaceholders})
          GROUP BY listing_id
          HAVING COUNT(DISTINCT amenity_id) = ?
        )`;
        params.push(...amenityIds, amenityIds.length);
      }
    }

    // NEW: Sorting
    const validSortFields = ['created_at', 'price_per_night', 'bedrooms', 'guests_max', 'title'];
    const sortField = validSortFields.includes(sort_by) ? sort_by : 'created_at';
    const sortDirection = sort_order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Pagination
    const limit = parseInt(per_page) || 20;
    const offset = (parseInt(page) - 1) * limit;
    query += ` ORDER BY l.${sortField} ${sortDirection} LIMIT ${limit} OFFSET ${offset}`;

    const listings = await db.query(query, params);

    // Get total count
    let countQuery = `SELECT COUNT(*) as total FROM property_listings l WHERE l.app_id = ?`;
    const countParams = [appId];
    
    if (search) {
      countQuery += ` AND (l.title LIKE ? OR l.description LIKE ? OR l.city LIKE ?)`;
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }
    
    const countResult = await db.query(countQuery, countParams);
    const total = countResult[0]?.total || 0;

    res.json({
      success: true,
      data: {
        listings: Array.isArray(listings) ? listings : [listings],
        pagination: {
          page: parseInt(page),
          per_page: parseInt(per_page),
          total,
          total_pages: Math.ceil(total / per_page)
        }
      }
    });
  } catch (error) {
    console.error('Get listings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch listings',
      error: error.message
    });
  }
};

/**
 * Get a single listing by ID
 * GET /api/v1/apps/:appId/listings/:listingId
 */
exports.getListingById = async (req, res) => {
  try {
    const { appId, listingId } = req.params;

    const listingResult = await db.query(
      `SELECT 
        l.*,
        u.first_name as host_first_name,
        u.last_name as host_last_name,
        u.email as host_email,
        u.phone as host_phone,
        u.avatar_url as host_avatar
      FROM property_listings l
      LEFT JOIN app_users u ON l.user_id = u.id
      WHERE l.id = ? AND l.app_id = ?`,
      [listingId, appId]
    );

    if (!listingResult || listingResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    const listing = listingResult[0];

    // Get images
    const images = await db.query(
      `SELECT * FROM property_images WHERE listing_id = ? ORDER BY display_order`,
      [listingId]
    );

    // Get videos
    const videos = await db.query(
      `SELECT * FROM property_videos WHERE listing_id = ? ORDER BY display_order`,
      [listingId]
    );

    // Get amenities
    const amenities = await db.query(
      `SELECT pa.* FROM property_amenities pa
       JOIN property_listing_amenities pla ON pa.id = pla.amenity_id
       WHERE pla.listing_id = ?
       ORDER BY pa.category, pa.name`,
      [listingId]
    );

    listing.images = images || [];
    listing.videos = videos || [];
    listing.amenities = amenities || [];
    
    // Add primary_image field for form compatibility
    const primaryImage = (images || []).find(img => img.is_primary === 1);
    listing.primary_image = primaryImage ? primaryImage.image_url : (images && images.length > 0 ? images[0].image_url : null);

    res.json({
      success: true,
      data: listing
    });
  } catch (error) {
    console.error('Get listing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch listing',
      error: error.message
    });
  }
};

/**
 * Update a listing
 * PUT /api/v1/apps/:appId/listings/:listingId
 */
exports.updateListing = async (req, res) => {
  try {
    const { appId, listingId } = req.params;
    const userId = req.user?.id;

    // Check if listing exists and belongs to user
    const existing = await db.query(
      `SELECT * FROM property_listings WHERE id = ? AND app_id = ?`,
      [listingId, appId]
    );

    if (!existing || existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Verify ownership (unless admin)
    if (existing[0].user_id !== userId && req.user?.role_level !== 1) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this listing'
      });
    }

    const updateFields = [];
    const updateValues = [];

    // Build dynamic update query
    const allowedFields = [
      'title', 'description', 'property_type',
      'address_line1', 'address_line2', 'city', 'state', 'country', 'postal_code', 'latitude', 'longitude',
      'bedrooms', 'bathrooms', 'beds', 'guests_max', 'square_feet',
      'price_per_night', 'currency', 'cleaning_fee', 'service_fee_percentage',
      'min_nights', 'max_nights', 'check_in_time', 'check_out_time', 'cancellation_policy', 'is_instant_book',
      'house_rules', 'additional_info', 'status'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateFields.push(`${field} = ?`);
        updateValues.push(req.body[field]);
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    updateValues.push(listingId, appId);

    await db.query(
      `UPDATE property_listings SET ${updateFields.join(', ')} WHERE id = ? AND app_id = ?`,
      updateValues
    );

    // Handle images if provided
    const { images } = req.body;
    if (images && Array.isArray(images) && images.length > 0) {
      // Delete existing images and add new ones
      await db.query(`DELETE FROM property_images WHERE listing_id = ?`, [listingId]);
      
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        await db.query(
          `INSERT INTO property_images (listing_id, image_url, image_key, caption, display_order, is_primary) VALUES (?, ?, ?, ?, ?, ?)`,
          [listingId, img.image_url, img.image_key || null, img.caption || null, i + 1, img.is_primary ? 1 : 0]
        );
      }
    }

    res.json({
      success: true,
      message: 'Listing updated successfully'
    });
  } catch (error) {
    console.error('Update listing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update listing',
      error: error.message
    });
  }
};

/**
 * Delete a listing
 * DELETE /api/v1/apps/:appId/listings/:listingId
 */
exports.deleteListing = async (req, res) => {
  try {
    const { appId, listingId } = req.params;
    const userId = req.user?.id;
    const isAdmin = req.authType === 'admin';

    // Check if listing exists and belongs to user
    const existing = await db.query(
      `SELECT * FROM property_listings WHERE id = ? AND app_id = ?`,
      [listingId, appId]
    );

    if (!existing || existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Verify ownership (admins can delete any listing)
    if (!isAdmin && existing[0].user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this listing'
      });
    }

    await db.query(
      `DELETE FROM property_listings WHERE id = ? AND app_id = ?`,
      [listingId, appId]
    );

    res.json({
      success: true,
      message: 'Listing deleted successfully'
    });
  } catch (error) {
    console.error('Delete listing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete listing',
      error: error.message
    });
  }
};

/**
 * Update listing status (publish/unpublish/suspend)
 * PUT /api/v1/apps/:appId/listings/:listingId/status
 */
exports.updateListingStatus = async (req, res) => {
  try {
    const { appId, listingId } = req.params;
    const { status } = req.body;
    const userId = req.user?.id;
    const isAdmin = req.authType === 'admin';

    // Validate status
    const validStatuses = ['draft', 'pending_review', 'active', 'inactive', 'suspended'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    // Only admins can set 'suspended' status
    if (status === 'suspended' && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can suspend listings'
      });
    }

    // Check ownership (admins can update any listing)
    let query, params;
    if (isAdmin) {
      query = `SELECT * FROM property_listings WHERE id = ? AND app_id = ?`;
      params = [listingId, appId];
    } else {
      query = `SELECT * FROM property_listings WHERE id = ? AND app_id = ? AND user_id = ?`;
      params = [listingId, appId, userId];
    }

    const existing = await db.query(query, params);

    if (!existing || existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Update published_at timestamp when changing to/from active
    const wasActive = existing[0].status === 'active';
    const isNowActive = status === 'active';
    
    let updateQuery = `UPDATE property_listings SET status = ?`;
    let updateParams = [status];
    
    if (!wasActive && isNowActive) {
      // First time publishing
      updateQuery += `, published_at = NOW()`;
    } else if (wasActive && !isNowActive) {
      // Unpublishing
      updateQuery += `, published_at = NULL`;
    }
    
    updateQuery += ` WHERE id = ? AND app_id = ?`;
    updateParams.push(listingId, appId);

    await db.query(updateQuery, updateParams);

    res.json({
      success: true,
      message: `Listing status updated to '${status}' successfully`,
      data: { status }
    });
  } catch (error) {
    console.error('Update listing status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update listing status',
      error: error.message
    });
  }
};

// Keep old publishListing for backward compatibility
exports.publishListing = async (req, res) => {
  try {
    const { is_published } = req.body;
    const newStatus = is_published ? 'active' : 'draft';
    
    // Forward to new status endpoint
    req.body.status = newStatus;
    return exports.updateListingStatus(req, res);
  } catch (error) {
    console.error('Publish listing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update listing status',
      error: error.message
    });
  }
};

/**
 * Get all amenities
 * GET /api/v1/amenities
 */
exports.getAmenities = async (req, res) => {
  try {
    const amenities = await db.query(
      `SELECT * FROM property_amenities WHERE is_active = 1 ORDER BY category, name`
    );

    res.json({
      success: true,
      data: amenities || []
    });
  } catch (error) {
    console.error('Get amenities error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch amenities',
      error: error.message
    });
  }
};

/**
 * Get current user's listings
 * GET /api/v1/apps/:appId/listings/my
 */
exports.getMyListings = async (req, res) => {
  try {
    const { appId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const listings = await db.query(
      `SELECT 
        l.*,
        (SELECT image_url FROM property_images WHERE listing_id = l.id AND is_primary = 1 LIMIT 1) as primary_image
       FROM property_listings l
       WHERE l.app_id = ? AND l.user_id = ?
       ORDER BY l.created_at DESC`,
      [appId, userId]
    );

    res.json({
      success: true,
      data: {
        listings: listings || [],
        pagination: {
          page: 1,
          per_page: 100,
          total: listings?.length || 0,
          total_pages: 1
        }
      }
    });
  } catch (error) {
    console.error('Get my listings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch listings',
      error: error.message
    });
  }
};

/**
 * Get availability for a listing
 * GET /api/v1/apps/:appId/listings/:listingId/availability
 */
exports.getAvailability = async (req, res) => {
  try {
    const { appId, listingId } = req.params;
    const { year, month } = req.query;
    const userId = req.user?.id;

    // Verify ownership
    const listing = await db.query(
      `SELECT id, user_id FROM property_listings WHERE id = ? AND app_id = ?`,
      [listingId, appId]
    );

    if (!listing || listing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    if (listing[0].user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this listing\'s availability'
      });
    }

    // Build date range for the month
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];

    // Get availability data
    const availability = await db.query(
      `SELECT date, is_available, price_override, notes
       FROM property_availability
       WHERE listing_id = ? AND date BETWEEN ? AND ?
       ORDER BY date`,
      [listingId, startDate, endDate]
    );

    // Get bookings for this month
    const bookings = await db.query(
      `SELECT check_in_date, check_out_date
       FROM property_bookings
       WHERE listing_id = ? 
         AND status IN ('confirmed', 'pending')
         AND check_in_date <= ? AND check_out_date >= ?`,
      [listingId, endDate, startDate]
    );

    // Mark dates with bookings
    const bookedDates = new Set();
    (bookings || []).forEach(booking => {
      let current = new Date(booking.check_in_date);
      const end = new Date(booking.check_out_date);
      while (current < end) {
        bookedDates.add(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
      }
    });

    // Merge availability with booking info
    const result = (availability || []).map(a => ({
      ...a,
      has_booking: bookedDates.has(a.date)
    }));

    // Add booked dates that aren't in availability table
    bookedDates.forEach(date => {
      if (!result.find(a => a.date === date)) {
        result.push({
          date,
          is_available: false,
          has_booking: true
        });
      }
    });

    res.json({
      success: true,
      data: {
        availability: result.sort((a, b) => {
          const dateA = typeof a.date === 'string' ? a.date : a.date.toISOString().split('T')[0];
          const dateB = typeof b.date === 'string' ? b.date : b.date.toISOString().split('T')[0];
          return dateA.localeCompare(dateB);
        })
      }
    });
  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch availability',
      error: error.message
    });
  }
};

/**
 * Update availability for a listing
 * POST /api/v1/apps/:appId/listings/:listingId/availability
 */
exports.updateAvailability = async (req, res) => {
  try {
    const { appId, listingId } = req.params;
    const { dates, is_available, price_override, notes } = req.body;
    const userId = req.user?.id;

    if (!dates || !Array.isArray(dates) || dates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Dates array is required'
      });
    }

    // Verify ownership
    const listing = await db.query(
      `SELECT id, user_id FROM property_listings WHERE id = ? AND app_id = ?`,
      [listingId, appId]
    );

    if (!listing || listing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    if (listing[0].user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this listing\'s availability'
      });
    }

    // Check for existing bookings on these dates
    for (const date of dates) {
      const bookingConflict = await db.query(
        `SELECT id FROM property_bookings
         WHERE listing_id = ? 
           AND status IN ('confirmed', 'pending')
           AND ? >= check_in_date AND ? < check_out_date`,
        [listingId, date, date]
      );

      if (bookingConflict && bookingConflict.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Cannot modify availability for ${date} - there is an existing booking`
        });
      }
    }

    // Update or insert availability for each date
    for (const date of dates) {
      await db.query(
        `INSERT INTO property_availability (listing_id, date, is_available, price_override, notes)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE is_available = ?, price_override = ?, notes = ?`,
        [listingId, date, is_available ? 1 : 0, price_override || null, notes || null,
         is_available ? 1 : 0, price_override || null, notes || null]
      );
    }

    res.json({
      success: true,
      message: `Updated availability for ${dates.length} date(s)`
    });
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update availability',
      error: error.message
    });
  }
};

/**
 * Get host dashboard stats
 * GET /api/v1/apps/:appId/host/dashboard
 */
exports.getHostDashboard = async (req, res) => {
  try {
    const { appId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Get listings stats
    const listingsStats = await db.query(
      `SELECT 
         COUNT(*) as total,
         SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
         SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft
       FROM property_listings
       WHERE app_id = ? AND user_id = ?`,
      [appId, userId]
    );

    // Get bookings stats
    const bookingsStats = await db.query(
      `SELECT 
         COUNT(*) as total,
         SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
         SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
         SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
       FROM property_bookings
       WHERE app_id = ? AND host_user_id = ?`,
      [appId, userId]
    );

    // Get earnings
    const earningsStats = await db.query(
      `SELECT 
         COALESCE(SUM(CASE WHEN status = 'completed' THEN total_price ELSE 0 END), 0) as total,
         COALESCE(SUM(CASE WHEN status = 'completed' AND MONTH(completed_at) = MONTH(NOW()) AND YEAR(completed_at) = YEAR(NOW()) THEN total_price ELSE 0 END), 0) as this_month,
         COALESCE(SUM(CASE WHEN status = 'confirmed' THEN total_price ELSE 0 END), 0) as pending
       FROM property_bookings
       WHERE app_id = ? AND host_user_id = ?`,
      [appId, userId]
    );

    // Get reviews stats
    const reviewsStats = await db.query(
      `SELECT 
         COUNT(*) as total,
         COALESCE(AVG(r.rating), 0) as average
       FROM property_reviews r
       JOIN property_listings l ON r.listing_id = l.id
       WHERE l.user_id = ? AND l.app_id = ? AND r.status = 'approved'`,
      [userId, appId]
    );

    // Get recent bookings
    const recentBookings = await db.query(
      `SELECT 
         b.id, b.check_in_date, b.check_out_date, b.total_price, b.status,
         b.guest_first_name, b.guest_last_name,
         l.title as listing_title
       FROM property_bookings b
       JOIN property_listings l ON b.listing_id = l.id
       WHERE b.app_id = ? AND b.host_user_id = ?
       ORDER BY b.created_at DESC
       LIMIT 5`,
      [appId, userId]
    );

    const listings = listingsStats[0] || {};
    const bookings = bookingsStats[0] || {};
    const earnings = earningsStats[0] || {};
    const reviews = reviewsStats[0] || {};

    res.json({
      success: true,
      data: {
        stats: {
          listings: {
            total: parseInt(listings.total) || 0,
            active: parseInt(listings.active) || 0,
            draft: parseInt(listings.draft) || 0,
          },
          bookings: {
            total: parseInt(bookings.total) || 0,
            pending: parseInt(bookings.pending) || 0,
            confirmed: parseInt(bookings.confirmed) || 0,
            completed: parseInt(bookings.completed) || 0,
          },
          earnings: {
            total: parseFloat(earnings.total) || 0,
            thisMonth: parseFloat(earnings.this_month) || 0,
            pending: parseFloat(earnings.pending) || 0,
          },
          reviews: {
            total: parseInt(reviews.total) || 0,
            average: parseFloat(reviews.average) || 0,
          },
        },
        recent_bookings: recentBookings || [],
      }
    });
  } catch (error) {
    console.error('Get host dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: error.message
    });
  }
};

/**
 * Get pricing rules for a listing
 * GET /api/v1/apps/:appId/listings/:listingId/pricing-rules
 */
exports.getPricingRules = async (req, res) => {
  try {
    const { appId, listingId } = req.params;
    const userId = req.user?.id;

    // Verify ownership
    const listing = await db.query(
      `SELECT id, user_id FROM property_listings WHERE id = ? AND app_id = ?`,
      [listingId, appId]
    );

    if (!listing || listing.length === 0) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    if (listing[0].user_id !== userId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const rules = await db.query(
      `SELECT * FROM property_pricing_rules WHERE listing_id = ? ORDER BY priority DESC, created_at DESC`,
      [listingId]
    );

    res.json({
      success: true,
      data: { rules: rules || [] }
    });
  } catch (error) {
    console.error('Get pricing rules error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch pricing rules', error: error.message });
  }
};

/**
 * Create a pricing rule
 * POST /api/v1/apps/:appId/listings/:listingId/pricing-rules
 */
exports.createPricingRule = async (req, res) => {
  try {
    const { appId, listingId } = req.params;
    const userId = req.user?.id;

    // Verify ownership
    const listing = await db.query(
      `SELECT id, user_id FROM property_listings WHERE id = ? AND app_id = ?`,
      [listingId, appId]
    );

    if (!listing || listing.length === 0) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    if (listing[0].user_id !== userId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const {
      rule_type, name, adjustment_type, adjustment_value,
      min_nights, max_nights, days_before_checkin, days_of_week,
      start_date, end_date, priority
    } = req.body;

    const result = await db.query(
      `INSERT INTO property_pricing_rules 
       (listing_id, rule_type, name, adjustment_type, adjustment_value,
        min_nights, max_nights, days_before_checkin, days_of_week,
        start_date, end_date, priority)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [listingId, rule_type, name, adjustment_type || 'percentage', adjustment_value,
       min_nights || null, max_nights || null, days_before_checkin || null,
       days_of_week ? JSON.stringify(days_of_week) : null,
       start_date || null, end_date || null, priority || 0]
    );

    res.status(201).json({
      success: true,
      message: 'Pricing rule created',
      data: { rule_id: result.insertId }
    });
  } catch (error) {
    console.error('Create pricing rule error:', error);
    res.status(500).json({ success: false, message: 'Failed to create pricing rule', error: error.message });
  }
};

/**
 * Update a pricing rule
 * PUT /api/v1/apps/:appId/listings/:listingId/pricing-rules/:ruleId
 */
exports.updatePricingRule = async (req, res) => {
  try {
    const { appId, listingId, ruleId } = req.params;
    const userId = req.user?.id;

    // Verify ownership
    const listing = await db.query(
      `SELECT id, user_id FROM property_listings WHERE id = ? AND app_id = ?`,
      [listingId, appId]
    );

    if (!listing || listing.length === 0) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    if (listing[0].user_id !== userId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const updates = [];
    const values = [];
    const allowedFields = ['name', 'adjustment_type', 'adjustment_value', 'min_nights', 
                          'max_nights', 'days_before_checkin', 'start_date', 'end_date', 
                          'priority', 'is_active'];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(req.body[field]);
      }
    }

    if (req.body.days_of_week !== undefined) {
      updates.push('days_of_week = ?');
      values.push(JSON.stringify(req.body.days_of_week));
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    values.push(ruleId, listingId);
    await db.query(
      `UPDATE property_pricing_rules SET ${updates.join(', ')} WHERE id = ? AND listing_id = ?`,
      values
    );

    res.json({ success: true, message: 'Pricing rule updated' });
  } catch (error) {
    console.error('Update pricing rule error:', error);
    res.status(500).json({ success: false, message: 'Failed to update pricing rule', error: error.message });
  }
};

/**
 * Delete a pricing rule
 * DELETE /api/v1/apps/:appId/listings/:listingId/pricing-rules/:ruleId
 */
exports.deletePricingRule = async (req, res) => {
  try {
    const { appId, listingId, ruleId } = req.params;
    const userId = req.user?.id;

    // Verify ownership
    const listing = await db.query(
      `SELECT id, user_id FROM property_listings WHERE id = ? AND app_id = ?`,
      [listingId, appId]
    );

    if (!listing || listing.length === 0) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    if (listing[0].user_id !== userId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    await db.query(
      `DELETE FROM property_pricing_rules WHERE id = ? AND listing_id = ?`,
      [ruleId, listingId]
    );

    res.json({ success: true, message: 'Pricing rule deleted' });
  } catch (error) {
    console.error('Delete pricing rule error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete pricing rule', error: error.message });
  }
};

/**
 * Calculate price for a booking (applies dynamic pricing rules)
 * POST /api/v1/apps/:appId/listings/:listingId/calculate-price
 */
exports.calculatePrice = async (req, res) => {
  try {
    const { appId, listingId } = req.params;
    const { check_in_date, check_out_date, guests_count } = req.body;

    // Get listing base price
    const listing = await db.query(
      `SELECT price_per_night, cleaning_fee FROM property_listings WHERE id = ? AND app_id = ?`,
      [listingId, appId]
    );

    if (!listing || listing.length === 0) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    const basePrice = parseFloat(listing[0].price_per_night);
    const cleaningFee = parseFloat(listing[0].cleaning_fee) || 0;

    // Get active pricing rules
    const rules = await db.query(
      `SELECT * FROM property_pricing_rules WHERE listing_id = ? AND is_active = 1 ORDER BY priority DESC`,
      [listingId]
    );

    // Calculate nights and dates
    const checkIn = new Date(check_in_date);
    const checkOut = new Date(check_out_date);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const daysUntilCheckin = Math.ceil((checkIn - new Date()) / (1000 * 60 * 60 * 24));

    let totalPrice = 0;
    const priceBreakdown = [];

    // Calculate price for each night
    for (let i = 0; i < nights; i++) {
      const currentDate = new Date(checkIn);
      currentDate.setDate(currentDate.getDate() + i);
      const dayOfWeek = currentDate.getDay();
      const dateStr = currentDate.toISOString().split('T')[0];

      let nightPrice = basePrice;
      const appliedRules = [];

      // Apply rules
      for (const rule of rules || []) {
        let applies = false;

        switch (rule.rule_type) {
          case 'weekend':
            const daysOfWeek = rule.days_of_week ? JSON.parse(rule.days_of_week) : [5, 6];
            applies = daysOfWeek.includes(dayOfWeek);
            break;
          case 'seasonal':
            if (rule.start_date && rule.end_date) {
              applies = dateStr >= rule.start_date && dateStr <= rule.end_date;
            }
            break;
          case 'length_of_stay':
            applies = nights >= (rule.min_nights || 0);
            break;
          case 'last_minute':
            applies = daysUntilCheckin <= (rule.days_before_checkin || 3);
            break;
          case 'early_bird':
            applies = daysUntilCheckin >= (rule.days_before_checkin || 30);
            break;
        }

        if (applies) {
          if (rule.adjustment_type === 'percentage') {
            nightPrice += basePrice * (rule.adjustment_value / 100);
          } else {
            nightPrice += rule.adjustment_value;
          }
          appliedRules.push(rule.name);
        }
      }

      nightPrice = Math.max(0, nightPrice); // Don't allow negative prices
      totalPrice += nightPrice;

      priceBreakdown.push({
        date: dateStr,
        base_price: basePrice,
        final_price: nightPrice,
        applied_rules: appliedRules,
      });
    }

    const serviceFee = totalPrice * 0.12; // 12% service fee
    const grandTotal = totalPrice + cleaningFee + serviceFee;

    res.json({
      success: true,
      data: {
        nights,
        base_price_per_night: basePrice,
        subtotal: totalPrice,
        cleaning_fee: cleaningFee,
        service_fee: serviceFee,
        total: grandTotal,
        price_breakdown: priceBreakdown,
      }
    });
  } catch (error) {
    console.error('Calculate price error:', error);
    res.status(500).json({ success: false, message: 'Failed to calculate price', error: error.message });
  }
};

// ============================================
// IMAGE MANAGEMENT
// ============================================

/**
 * Add image to listing
 * POST /api/v1/apps/:appId/listings/:listingId/images
 */
exports.addImage = async (req, res) => {
  try {
    const { appId, listingId } = req.params;
    const { image_url, image_key, caption, is_primary } = req.body;

    if (!image_url) {
      return res.status(400).json({ success: false, message: 'image_url is required' });
    }

    // Get max display_order
    const orderResult = await db.query(
      'SELECT MAX(display_order) as max_order FROM property_images WHERE listing_id = ?',
      [listingId]
    );
    const nextOrder = (orderResult[0]?.max_order || 0) + 1;

    // If setting as primary, unset other primaries
    if (is_primary) {
      await db.query(
        'UPDATE property_images SET is_primary = 0 WHERE listing_id = ?',
        [listingId]
      );
    }

    const result = await db.query(
      `INSERT INTO property_images (listing_id, image_url, image_key, caption, display_order, is_primary) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [listingId, image_url, image_key || null, caption || null, nextOrder, is_primary ? 1 : 0]
    );

    res.status(201).json({
      success: true,
      message: 'Image added successfully',
      data: { id: result.insertId, image_url, caption, display_order: nextOrder, is_primary: is_primary ? 1 : 0 }
    });
  } catch (error) {
    console.error('Add image error:', error);
    res.status(500).json({ success: false, message: 'Failed to add image', error: error.message });
  }
};

/**
 * Delete image from listing
 * DELETE /api/v1/apps/:appId/listings/:listingId/images/:imageId
 */
exports.deleteImage = async (req, res) => {
  try {
    const { appId, listingId, imageId } = req.params;

    const result = await db.query(
      'DELETE FROM property_images WHERE id = ? AND listing_id = ?',
      [imageId, listingId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete image', error: error.message });
  }
};

/**
 * Update image (caption, is_primary, display_order)
 * PUT /api/v1/apps/:appId/listings/:listingId/images/:imageId
 */
exports.updateImage = async (req, res) => {
  try {
    const { appId, listingId, imageId } = req.params;
    const { caption, is_primary, display_order } = req.body;

    // If setting as primary, unset other primaries
    if (is_primary) {
      await db.query(
        'UPDATE property_images SET is_primary = 0 WHERE listing_id = ?',
        [listingId]
      );
    }

    const updates = [];
    const values = [];

    if (caption !== undefined) {
      updates.push('caption = ?');
      values.push(caption);
    }
    if (is_primary !== undefined) {
      updates.push('is_primary = ?');
      values.push(is_primary ? 1 : 0);
    }
    if (display_order !== undefined) {
      updates.push('display_order = ?');
      values.push(display_order);
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    values.push(imageId, listingId);
    await db.query(
      `UPDATE property_images SET ${updates.join(', ')} WHERE id = ? AND listing_id = ?`,
      values
    );

    res.json({ success: true, message: 'Image updated successfully' });
  } catch (error) {
    console.error('Update image error:', error);
    res.status(500).json({ success: false, message: 'Failed to update image', error: error.message });
  }
};

// ============================================
// VIDEO MANAGEMENT
// ============================================

/**
 * Add video to listing
 * POST /api/v1/apps/:appId/listings/:listingId/videos
 */
exports.addVideo = async (req, res) => {
  try {
    const { appId, listingId } = req.params;
    const { video_url, video_key, thumbnail_url, caption } = req.body;

    if (!video_url) {
      return res.status(400).json({ success: false, message: 'video_url is required' });
    }

    // Get max display_order
    const orderResult = await db.query(
      'SELECT MAX(display_order) as max_order FROM property_videos WHERE listing_id = ?',
      [listingId]
    );
    const nextOrder = (orderResult[0]?.max_order || 0) + 1;

    const result = await db.query(
      `INSERT INTO property_videos (listing_id, video_url, video_key, thumbnail_url, caption, display_order) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [listingId, video_url, video_key || null, thumbnail_url || null, caption || null, nextOrder]
    );

    res.status(201).json({
      success: true,
      message: 'Video added successfully',
      data: { id: result.insertId, video_url, thumbnail_url, caption, display_order: nextOrder }
    });
  } catch (error) {
    console.error('Add video error:', error);
    res.status(500).json({ success: false, message: 'Failed to add video', error: error.message });
  }
};

/**
 * Delete video from listing
 * DELETE /api/v1/apps/:appId/listings/:listingId/videos/:videoId
 */
exports.deleteVideo = async (req, res) => {
  try {
    const { appId, listingId, videoId } = req.params;

    const result = await db.query(
      'DELETE FROM property_videos WHERE id = ? AND listing_id = ?',
      [videoId, listingId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    res.json({ success: true, message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete video', error: error.message });
  }
};

/**
 * Update video (caption, thumbnail_url, display_order)
 * PUT /api/v1/apps/:appId/listings/:listingId/videos/:videoId
 */
exports.updateVideo = async (req, res) => {
  try {
    const { appId, listingId, videoId } = req.params;
    const { caption, thumbnail_url, display_order } = req.body;

    const updates = [];
    const values = [];

    if (caption !== undefined) {
      updates.push('caption = ?');
      values.push(caption);
    }
    if (thumbnail_url !== undefined) {
      updates.push('thumbnail_url = ?');
      values.push(thumbnail_url);
    }
    if (display_order !== undefined) {
      updates.push('display_order = ?');
      values.push(display_order);
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    values.push(videoId, listingId);
    await db.query(
      `UPDATE property_videos SET ${updates.join(', ')} WHERE id = ? AND listing_id = ?`,
      values
    );

    res.json({ success: true, message: 'Video updated successfully' });
  } catch (error) {
    console.error('Update video error:', error);
    res.status(500).json({ success: false, message: 'Failed to update video', error: error.message });
  }
};
