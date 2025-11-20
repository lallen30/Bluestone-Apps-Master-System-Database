const db = require('../config/database');

/**
 * Create a new property listing
 * POST /api/v1/apps/:appId/listings
 */
exports.createListing = async (req, res) => {
  try {
    const { appId } = req.params;
    const userId = req.user?.id; // From mobile auth middleware

    if (!userId) {
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
      [
        appId, userId, title, description, property_type || 'apartment',
        address_line1, address_line2, city, state, country, postal_code, latitude, longitude,
        bedrooms || 0, bathrooms || 0, beds || 0, guests_max || 1, square_feet,
        price_per_night, currency || 'USD', cleaning_fee || 0, service_fee_percentage || 0,
        min_nights || 1, max_nights || 365, check_in_time || '15:00:00', check_out_time || '11:00:00',
        cancellation_policy || 'moderate', is_instant_book || false,
        house_rules, additional_info
      ]
    );

    const listingId = result.insertId;

    // Add amenities if provided
    if (amenities && Array.isArray(amenities) && amenities.length > 0) {
      const amenityValues = amenities.map(amenityId => [listingId, amenityId]);
      await db.query(
        `INSERT INTO property_listing_amenities (listing_id, amenity_id) VALUES ?`,
        [amenityValues]
      );
    }

    // Add images if provided
    if (images && Array.isArray(images) && images.length > 0) {
      const imageValues = images.map((img, index) => [
        listingId,
        img.image_url,
        img.image_key || null,
        img.caption || null,
        index + 1,
        img.is_primary || false
      ]);
      await db.query(
        `INSERT INTO property_images (listing_id, image_url, image_key, caption, display_order, is_primary) VALUES ?`,
        [imageValues]
      );
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
         WHERE pla.listing_id = l.id) as amenities_list
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

    // Get amenities
    const amenities = await db.query(
      `SELECT pa.* FROM property_amenities pa
       JOIN property_listing_amenities pla ON pa.id = pla.amenity_id
       WHERE pla.listing_id = ?
       ORDER BY pa.category, pa.name`,
      [listingId]
    );

    listing.images = images || [];
    listing.amenities = amenities || [];

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
 * Publish/unpublish a listing
 * PUT /api/v1/apps/:appId/listings/:listingId/publish
 */
exports.publishListing = async (req, res) => {
  try {
    const { appId, listingId } = req.params;
    const { is_published } = req.body;
    const userId = req.user?.id;

    // Check ownership
    const existing = await db.query(
      `SELECT * FROM property_listings WHERE id = ? AND app_id = ? AND user_id = ?`,
      [listingId, appId, userId]
    );

    if (!existing || existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    const newStatus = is_published ? 'active' : 'draft';

    await db.query(
      `UPDATE property_listings 
       SET is_published = ?, status = ?, published_at = ${is_published ? 'NOW()' : 'NULL'}
       WHERE id = ? AND app_id = ?`,
      [is_published, newStatus, listingId, appId]
    );

    res.json({
      success: true,
      message: `Listing ${is_published ? 'published' : 'unpublished'} successfully`
    });
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
