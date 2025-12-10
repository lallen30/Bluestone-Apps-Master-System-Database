/**
 * Real Estate Controller
 * Handles property inquiries, showings, and offers for real estate apps
 */

const db = require('../config/database');

// Helper to get rows from query result
const getRows = (result) => {
  if (Array.isArray(result)) {
    if (result.length > 0 && Array.isArray(result[0])) {
      return result[0];
    }
    return result;
  }
  return [];
};

// ============================================
// PROPERTY INQUIRIES
// ============================================

/**
 * Get all inquiries for an app
 */
const getInquiries = async (req, res) => {
  try {
    const { app_id } = req.params;
    const { status, listing_id, buyer_id, agent_id, page = 1, per_page = 20 } = req.query;
    const offset = (page - 1) * per_page;

    let whereClause = 'WHERE pi.app_id = ?';
    const params = [app_id];

    if (status) {
      whereClause += ' AND pi.status = ?';
      params.push(status);
    }
    if (listing_id) {
      whereClause += ' AND pi.listing_id = ?';
      params.push(listing_id);
    }
    if (buyer_id) {
      whereClause += ' AND pi.buyer_id = ?';
      params.push(buyer_id);
    }
    if (agent_id) {
      whereClause += ' AND pi.agent_id = ?';
      params.push(agent_id);
    }

    // Get total count
    const countResult = await db.query(
      `SELECT COUNT(*) as total FROM property_inquiries pi ${whereClause}`,
      params
    );
    const total = getRows(countResult)[0]?.total || 0;

    // Get inquiries with related data
    const inquiriesResult = await db.query(`
      SELECT 
        pi.*,
        pl.title as listing_title,
        pl.city as listing_city,
        pl.asking_price,
        buyer.first_name as buyer_first_name,
        buyer.last_name as buyer_last_name,
        buyer.email as buyer_email,
        agent.first_name as agent_first_name,
        agent.last_name as agent_last_name,
        agent.email as agent_email
      FROM property_inquiries pi
      LEFT JOIN property_listings pl ON pi.listing_id = pl.id
      LEFT JOIN app_users buyer ON pi.buyer_id = buyer.id
      LEFT JOIN app_users agent ON pi.agent_id = agent.id
      ${whereClause}
      ORDER BY pi.created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, parseInt(per_page), parseInt(offset)]);

    // Get stats
    const statsResult = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new_count,
        SUM(CASE WHEN status = 'read' THEN 1 ELSE 0 END) as read_count,
        SUM(CASE WHEN status = 'responded' THEN 1 ELSE 0 END) as responded_count,
        SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as closed_count
      FROM property_inquiries
      WHERE app_id = ?
    `, [app_id]);

    res.json({
      success: true,
      data: {
        inquiries: getRows(inquiriesResult),
        stats: getRows(statsResult)[0],
        pagination: {
          total,
          page: parseInt(page),
          per_page: parseInt(per_page),
          total_pages: Math.ceil(total / per_page)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({ success: false, message: 'Error fetching inquiries', error: error.message });
  }
};

/**
 * Get single inquiry
 */
const getInquiry = async (req, res) => {
  try {
    const { app_id, id } = req.params;

    const result = await db.query(`
      SELECT 
        pi.*,
        pl.title as listing_title,
        pl.city as listing_city,
        pl.asking_price,
        buyer.first_name as buyer_first_name,
        buyer.last_name as buyer_last_name,
        buyer.email as buyer_email,
        buyer.phone as buyer_phone,
        agent.first_name as agent_first_name,
        agent.last_name as agent_last_name,
        agent.email as agent_email
      FROM property_inquiries pi
      LEFT JOIN property_listings pl ON pi.listing_id = pl.id
      LEFT JOIN app_users buyer ON pi.buyer_id = buyer.id
      LEFT JOIN app_users agent ON pi.agent_id = agent.id
      WHERE pi.id = ? AND pi.app_id = ?
    `, [id, app_id]);

    const inquiry = getRows(result)[0];
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    res.json({ success: true, data: inquiry });
  } catch (error) {
    console.error('Error fetching inquiry:', error);
    res.status(500).json({ success: false, message: 'Error fetching inquiry', error: error.message });
  }
};

/**
 * Update inquiry status
 */
const updateInquiryStatus = async (req, res) => {
  try {
    const { app_id, id } = req.params;
    const { status, response_message } = req.body;

    const updateFields = ['status = ?'];
    const params = [status];

    if (status === 'responded' && response_message) {
      updateFields.push('response_message = ?', 'responded_at = NOW()', 'responded_by = ?');
      params.push(response_message, req.user?.id || null);
    }

    params.push(id, app_id);

    await db.query(
      `UPDATE property_inquiries SET ${updateFields.join(', ')} WHERE id = ? AND app_id = ?`,
      params
    );

    res.json({ success: true, message: 'Inquiry updated successfully' });
  } catch (error) {
    console.error('Error updating inquiry:', error);
    res.status(500).json({ success: false, message: 'Error updating inquiry', error: error.message });
  }
};

/**
 * Respond to inquiry
 */
const respondToInquiry = async (req, res) => {
  try {
    const { app_id, id } = req.params;
    const { response_message } = req.body;

    if (!response_message) {
      return res.status(400).json({ success: false, message: 'Response message is required' });
    }

    await db.query(`
      UPDATE property_inquiries 
      SET status = 'responded', 
          response_message = ?, 
          responded_at = NOW(), 
          responded_by = ?
      WHERE id = ? AND app_id = ?
    `, [response_message, req.user?.id || null, id, app_id]);

    res.json({ success: true, message: 'Response sent successfully' });
  } catch (error) {
    console.error('Error responding to inquiry:', error);
    res.status(500).json({ success: false, message: 'Error responding to inquiry', error: error.message });
  }
};

// ============================================
// PROPERTY SHOWINGS
// ============================================

/**
 * Get all showings for an app
 */
const getShowings = async (req, res) => {
  try {
    const { app_id } = req.params;
    const { status, listing_id, buyer_id, agent_id, date_from, date_to, page = 1, per_page = 20 } = req.query;
    const offset = (page - 1) * per_page;

    let whereClause = 'WHERE ps.app_id = ?';
    const params = [app_id];

    if (status) {
      whereClause += ' AND ps.status = ?';
      params.push(status);
    }
    if (listing_id) {
      whereClause += ' AND ps.listing_id = ?';
      params.push(listing_id);
    }
    if (buyer_id) {
      whereClause += ' AND ps.buyer_id = ?';
      params.push(buyer_id);
    }
    if (agent_id) {
      whereClause += ' AND ps.agent_id = ?';
      params.push(agent_id);
    }
    if (date_from) {
      whereClause += ' AND (ps.scheduled_date >= ? OR ps.requested_date >= ?)';
      params.push(date_from, date_from);
    }
    if (date_to) {
      whereClause += ' AND (ps.scheduled_date <= ? OR ps.requested_date <= ?)';
      params.push(date_to, date_to);
    }

    // Get total count
    const countResult = await db.query(
      `SELECT COUNT(*) as total FROM property_showings ps ${whereClause}`,
      params
    );
    const total = getRows(countResult)[0]?.total || 0;

    // Get showings with related data
    const showingsResult = await db.query(`
      SELECT 
        ps.*,
        pl.title as listing_title,
        pl.city as listing_city,
        pl.address_line1 as listing_address,
        pl.asking_price,
        buyer.first_name as buyer_first_name,
        buyer.last_name as buyer_last_name,
        buyer.email as buyer_email,
        buyer.phone as buyer_phone,
        agent.first_name as agent_first_name,
        agent.last_name as agent_last_name,
        agent.email as agent_email,
        agent.phone as agent_phone
      FROM property_showings ps
      LEFT JOIN property_listings pl ON ps.listing_id = pl.id
      LEFT JOIN app_users buyer ON ps.buyer_id = buyer.id
      LEFT JOIN app_users agent ON ps.agent_id = agent.id
      ${whereClause}
      ORDER BY COALESCE(ps.scheduled_date, ps.requested_date) ASC, COALESCE(ps.scheduled_time, ps.requested_time) ASC
      LIMIT ? OFFSET ?
    `, [...params, parseInt(per_page), parseInt(offset)]);

    // Get stats
    const statsResult = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'requested' THEN 1 ELSE 0 END) as requested_count,
        SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_count,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_count,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_count,
        SUM(CASE WHEN status = 'no_show' THEN 1 ELSE 0 END) as no_show_count
      FROM property_showings
      WHERE app_id = ?
    `, [app_id]);

    res.json({
      success: true,
      data: {
        showings: getRows(showingsResult),
        stats: getRows(statsResult)[0],
        pagination: {
          total,
          page: parseInt(page),
          per_page: parseInt(per_page),
          total_pages: Math.ceil(total / per_page)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching showings:', error);
    res.status(500).json({ success: false, message: 'Error fetching showings', error: error.message });
  }
};

/**
 * Get single showing
 */
const getShowing = async (req, res) => {
  try {
    const { app_id, id } = req.params;

    const result = await db.query(`
      SELECT 
        ps.*,
        pl.title as listing_title,
        pl.city as listing_city,
        pl.address_line1 as listing_address,
        pl.asking_price,
        buyer.first_name as buyer_first_name,
        buyer.last_name as buyer_last_name,
        buyer.email as buyer_email,
        buyer.phone as buyer_phone,
        agent.first_name as agent_first_name,
        agent.last_name as agent_last_name,
        agent.email as agent_email,
        agent.phone as agent_phone
      FROM property_showings ps
      LEFT JOIN property_listings pl ON ps.listing_id = pl.id
      LEFT JOIN app_users buyer ON ps.buyer_id = buyer.id
      LEFT JOIN app_users agent ON ps.agent_id = agent.id
      WHERE ps.id = ? AND ps.app_id = ?
    `, [id, app_id]);

    const showing = getRows(result)[0];
    if (!showing) {
      return res.status(404).json({ success: false, message: 'Showing not found' });
    }

    res.json({ success: true, data: showing });
  } catch (error) {
    console.error('Error fetching showing:', error);
    res.status(500).json({ success: false, message: 'Error fetching showing', error: error.message });
  }
};

/**
 * Update showing status
 */
const updateShowingStatus = async (req, res) => {
  try {
    const { app_id, id } = req.params;
    const { status, scheduled_date, scheduled_time, agent_notes, cancellation_reason, feedback, buyer_interest_level } = req.body;

    const updateFields = ['status = ?'];
    const params = [status];

    if (status === 'confirmed') {
      if (scheduled_date) {
        updateFields.push('scheduled_date = ?');
        params.push(scheduled_date);
      }
      if (scheduled_time) {
        updateFields.push('scheduled_time = ?');
        params.push(scheduled_time);
      }
      updateFields.push('confirmed_at = NOW()', 'confirmed_by = ?');
      params.push(req.user?.id || null);
    }

    if (status === 'cancelled') {
      updateFields.push('cancelled_at = NOW()', 'cancelled_by = ?');
      params.push(req.user?.id || null);
      if (cancellation_reason) {
        updateFields.push('cancellation_reason = ?');
        params.push(cancellation_reason);
      }
    }

    if (status === 'completed') {
      updateFields.push('completed_at = NOW()');
      if (feedback) {
        updateFields.push('feedback = ?');
        params.push(feedback);
      }
      if (buyer_interest_level) {
        updateFields.push('buyer_interest_level = ?');
        params.push(buyer_interest_level);
      }
    }

    if (agent_notes) {
      updateFields.push('agent_notes = ?');
      params.push(agent_notes);
    }

    params.push(id, app_id);

    await db.query(
      `UPDATE property_showings SET ${updateFields.join(', ')} WHERE id = ? AND app_id = ?`,
      params
    );

    res.json({ success: true, message: 'Showing updated successfully' });
  } catch (error) {
    console.error('Error updating showing:', error);
    res.status(500).json({ success: false, message: 'Error updating showing', error: error.message });
  }
};

/**
 * Confirm a showing
 */
const confirmShowing = async (req, res) => {
  try {
    const { app_id, id } = req.params;
    const { scheduled_date, scheduled_time } = req.body;

    await db.query(`
      UPDATE property_showings 
      SET status = 'confirmed',
          scheduled_date = COALESCE(?, requested_date),
          scheduled_time = COALESCE(?, requested_time),
          confirmed_at = NOW(),
          confirmed_by = ?
      WHERE id = ? AND app_id = ?
    `, [scheduled_date, scheduled_time, req.user?.id || null, id, app_id]);

    res.json({ success: true, message: 'Showing confirmed successfully' });
  } catch (error) {
    console.error('Error confirming showing:', error);
    res.status(500).json({ success: false, message: 'Error confirming showing', error: error.message });
  }
};

/**
 * Cancel a showing
 */
const cancelShowing = async (req, res) => {
  try {
    const { app_id, id } = req.params;
    const { cancellation_reason } = req.body;

    await db.query(`
      UPDATE property_showings 
      SET status = 'cancelled',
          cancelled_at = NOW(),
          cancelled_by = ?,
          cancellation_reason = ?
      WHERE id = ? AND app_id = ?
    `, [req.user?.id || null, cancellation_reason || null, id, app_id]);

    res.json({ success: true, message: 'Showing cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling showing:', error);
    res.status(500).json({ success: false, message: 'Error cancelling showing', error: error.message });
  }
};

/**
 * Complete a showing with feedback
 */
const completeShowing = async (req, res) => {
  try {
    const { app_id, id } = req.params;
    const { feedback, buyer_interest_level, agent_notes } = req.body;

    await db.query(`
      UPDATE property_showings 
      SET status = 'completed',
          completed_at = NOW(),
          feedback = ?,
          buyer_interest_level = ?,
          agent_notes = COALESCE(?, agent_notes)
      WHERE id = ? AND app_id = ?
    `, [feedback || null, buyer_interest_level || null, agent_notes, id, app_id]);

    res.json({ success: true, message: 'Showing completed successfully' });
  } catch (error) {
    console.error('Error completing showing:', error);
    res.status(500).json({ success: false, message: 'Error completing showing', error: error.message });
  }
};

// ============================================
// DASHBOARD / OVERVIEW
// ============================================

/**
 * Get real estate dashboard overview
 */
const getDashboardOverview = async (req, res) => {
  try {
    const { app_id } = req.params;

    // Get inquiry stats
    const inquiryStats = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new_count,
        SUM(CASE WHEN status = 'responded' THEN 1 ELSE 0 END) as responded_count,
        SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as last_7_days
      FROM property_inquiries
      WHERE app_id = ?
    `, [app_id]);

    // Get showing stats
    const showingStats = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'requested' THEN 1 ELSE 0 END) as requested_count,
        SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_count,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_count,
        SUM(CASE WHEN COALESCE(scheduled_date, requested_date) >= CURDATE() AND status IN ('requested', 'confirmed') THEN 1 ELSE 0 END) as upcoming_count
      FROM property_showings
      WHERE app_id = ?
    `, [app_id]);

    // Get listing stats
    const listingStats = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_count,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_count,
        AVG(CASE WHEN asking_price > 0 THEN asking_price ELSE price_per_night END) as avg_price
      FROM property_listings
      WHERE app_id = ?
    `, [app_id]);

    // Get recent inquiries
    const recentInquiries = await db.query(`
      SELECT 
        pi.id, pi.subject, pi.status, pi.created_at,
        pl.title as listing_title,
        buyer.first_name as buyer_first_name,
        buyer.last_name as buyer_last_name
      FROM property_inquiries pi
      LEFT JOIN property_listings pl ON pi.listing_id = pl.id
      LEFT JOIN app_users buyer ON pi.buyer_id = buyer.id
      WHERE pi.app_id = ?
      ORDER BY pi.created_at DESC
      LIMIT 5
    `, [app_id]);

    // Get upcoming showings
    const upcomingShowings = await db.query(`
      SELECT 
        ps.id, ps.status, ps.showing_type,
        COALESCE(ps.scheduled_date, ps.requested_date) as showing_date,
        COALESCE(ps.scheduled_time, ps.requested_time) as showing_time,
        pl.title as listing_title,
        buyer.first_name as buyer_first_name,
        buyer.last_name as buyer_last_name
      FROM property_showings ps
      LEFT JOIN property_listings pl ON ps.listing_id = pl.id
      LEFT JOIN app_users buyer ON ps.buyer_id = buyer.id
      WHERE ps.app_id = ? 
        AND COALESCE(ps.scheduled_date, ps.requested_date) >= CURDATE()
        AND ps.status IN ('requested', 'confirmed')
      ORDER BY COALESCE(ps.scheduled_date, ps.requested_date) ASC, COALESCE(ps.scheduled_time, ps.requested_time) ASC
      LIMIT 5
    `, [app_id]);

    res.json({
      success: true,
      data: {
        inquiries: getRows(inquiryStats)[0],
        showings: getRows(showingStats)[0],
        listings: getRows(listingStats)[0],
        recentInquiries: getRows(recentInquiries),
        upcomingShowings: getRows(upcomingShowings)
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard overview:', error);
    res.status(500).json({ success: false, message: 'Error fetching dashboard overview', error: error.message });
  }
};

// ==================== PROPERTY OFFERS ====================

/**
 * Get all offers for an app with filtering
 */
const getOffers = async (req, res) => {
  try {
    const { app_id } = req.params;
    const { status, listing_id, buyer_id, agent_id, page = 1, per_page = 20 } = req.query;
    const offset = (page - 1) * per_page;

    let whereClause = 'WHERE po.app_id = ?';
    const params = [app_id];

    if (status) {
      whereClause += ' AND po.status = ?';
      params.push(status);
    }
    if (listing_id) {
      whereClause += ' AND po.listing_id = ?';
      params.push(listing_id);
    }
    if (buyer_id) {
      whereClause += ' AND po.buyer_id = ?';
      params.push(buyer_id);
    }
    if (agent_id) {
      whereClause += ' AND po.agent_id = ?';
      params.push(agent_id);
    }

    // Get total count
    const countResult = await db.query(
      `SELECT COUNT(*) as total FROM property_offers po ${whereClause}`,
      params
    );
    const total = getRows(countResult)[0]?.total || 0;

    // Get offers with related data
    const offersResult = await db.query(`
      SELECT 
        po.*,
        pl.title as listing_title,
        pl.city as listing_city,
        pl.address_line1 as listing_address,
        pl.price_per_night as asking_price,
        buyer.first_name as buyer_first_name,
        buyer.last_name as buyer_last_name,
        buyer.email as buyer_email,
        buyer.phone as buyer_phone,
        agent.first_name as agent_first_name,
        agent.last_name as agent_last_name,
        agent.email as agent_email
      FROM property_offers po
      LEFT JOIN property_listings pl ON po.listing_id = pl.id
      LEFT JOIN app_users buyer ON po.buyer_id = buyer.id
      LEFT JOIN app_users agent ON po.agent_id = agent.id
      ${whereClause}
      ORDER BY po.created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, parseInt(per_page), parseInt(offset)]);

    // Get stats
    const statsResult = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'submitted' THEN 1 ELSE 0 END) as submitted_count,
        SUM(CASE WHEN status = 'under_review' THEN 1 ELSE 0 END) as under_review_count,
        SUM(CASE WHEN status = 'countered' THEN 1 ELSE 0 END) as countered_count,
        SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) as accepted_count,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected_count,
        SUM(CASE WHEN status = 'withdrawn' THEN 1 ELSE 0 END) as withdrawn_count,
        AVG(offer_amount) as avg_offer_amount
      FROM property_offers
      WHERE app_id = ?
    `, [app_id]);

    res.json({
      success: true,
      data: {
        offers: getRows(offersResult),
        stats: getRows(statsResult)[0],
        pagination: {
          total,
          page: parseInt(page),
          per_page: parseInt(per_page),
          total_pages: Math.ceil(total / per_page)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).json({ success: false, message: 'Error fetching offers', error: error.message });
  }
};

/**
 * Get a single offer by ID
 */
const getOffer = async (req, res) => {
  try {
    const { app_id, id } = req.params;

    const result = await db.query(`
      SELECT 
        po.*,
        pl.title as listing_title,
        pl.city as listing_city,
        pl.address_line1 as listing_address,
        pl.price_per_night as asking_price,
        pl.bedrooms,
        pl.bathrooms,
        pl.square_feet,
        buyer.first_name as buyer_first_name,
        buyer.last_name as buyer_last_name,
        buyer.email as buyer_email,
        buyer.phone as buyer_phone,
        agent.first_name as agent_first_name,
        agent.last_name as agent_last_name,
        agent.email as agent_email,
        agent.phone as agent_phone
      FROM property_offers po
      LEFT JOIN property_listings pl ON po.listing_id = pl.id
      LEFT JOIN app_users buyer ON po.buyer_id = buyer.id
      LEFT JOIN app_users agent ON po.agent_id = agent.id
      WHERE po.id = ? AND po.app_id = ?
    `, [id, app_id]);

    const offer = getRows(result)[0];
    if (!offer) {
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }

    res.json({ success: true, data: offer });
  } catch (error) {
    console.error('Error fetching offer:', error);
    res.status(500).json({ success: false, message: 'Error fetching offer', error: error.message });
  }
};

/**
 * Create a new offer
 */
const createOffer = async (req, res) => {
  try {
    const { app_id } = req.params;
    const {
      listing_id, buyer_id, agent_id, offer_amount, earnest_money,
      down_payment_percent, financing_type, inspection_contingency,
      financing_contingency, appraisal_contingency, sale_contingency,
      other_contingencies, closing_date, possession_date, offer_expiration
    } = req.body;

    if (!listing_id || !buyer_id || !offer_amount) {
      return res.status(400).json({ success: false, message: 'listing_id, buyer_id, and offer_amount are required' });
    }

    const result = await db.query(`
      INSERT INTO property_offers (
        app_id, listing_id, buyer_id, agent_id, offer_amount, earnest_money,
        down_payment_percent, financing_type, inspection_contingency,
        financing_contingency, appraisal_contingency, sale_contingency,
        other_contingencies, closing_date, possession_date, offer_expiration,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft')
    `, [
      app_id, listing_id, buyer_id, agent_id || null, offer_amount, earnest_money || null,
      down_payment_percent || null, financing_type || 'conventional', 
      inspection_contingency !== false ? 1 : 0,
      financing_contingency !== false ? 1 : 0,
      appraisal_contingency !== false ? 1 : 0,
      sale_contingency ? 1 : 0,
      other_contingencies || null, closing_date || null, possession_date || null, offer_expiration || null
    ]);

    const insertId = result.insertId || result[0]?.insertId;
    res.status(201).json({ success: true, message: 'Offer created', data: { id: insertId } });
  } catch (error) {
    console.error('Error creating offer:', error);
    res.status(500).json({ success: false, message: 'Error creating offer', error: error.message });
  }
};

/**
 * Update offer status
 */
const updateOfferStatus = async (req, res) => {
  try {
    const { app_id, id } = req.params;
    const { status, response_notes } = req.body;

    const validStatuses = ['draft', 'submitted', 'under_review', 'countered', 'accepted', 'rejected', 'withdrawn', 'expired'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    await db.query(`
      UPDATE property_offers 
      SET status = ?, response_notes = ?, responded_at = NOW(), responded_by = ?
      WHERE id = ? AND app_id = ?
    `, [status, response_notes || null, req.user?.id || null, id, app_id]);

    res.json({ success: true, message: 'Offer status updated' });
  } catch (error) {
    console.error('Error updating offer status:', error);
    res.status(500).json({ success: false, message: 'Error updating offer status', error: error.message });
  }
};

/**
 * Submit an offer (change from draft to submitted)
 */
const submitOffer = async (req, res) => {
  try {
    const { app_id, id } = req.params;

    await db.query(`
      UPDATE property_offers 
      SET status = 'submitted', submitted_at = NOW()
      WHERE id = ? AND app_id = ? AND status = 'draft'
    `, [id, app_id]);

    res.json({ success: true, message: 'Offer submitted' });
  } catch (error) {
    console.error('Error submitting offer:', error);
    res.status(500).json({ success: false, message: 'Error submitting offer', error: error.message });
  }
};

/**
 * Counter an offer
 */
const counterOffer = async (req, res) => {
  try {
    const { app_id, id } = req.params;
    const { counter_amount, counter_terms } = req.body;

    if (!counter_amount) {
      return res.status(400).json({ success: false, message: 'counter_amount is required' });
    }

    await db.query(`
      UPDATE property_offers 
      SET status = 'countered', counter_amount = ?, counter_terms = ?, 
          countered_at = NOW(), responded_by = ?
      WHERE id = ? AND app_id = ?
    `, [counter_amount, counter_terms || null, req.user?.id || null, id, app_id]);

    res.json({ success: true, message: 'Counter offer sent' });
  } catch (error) {
    console.error('Error countering offer:', error);
    res.status(500).json({ success: false, message: 'Error countering offer', error: error.message });
  }
};

/**
 * Accept an offer
 */
const acceptOffer = async (req, res) => {
  try {
    const { app_id, id } = req.params;
    const { response_notes } = req.body;

    await db.query(`
      UPDATE property_offers 
      SET status = 'accepted', accepted_at = NOW(), response_notes = ?, responded_by = ?
      WHERE id = ? AND app_id = ?
    `, [response_notes || null, req.user?.id || null, id, app_id]);

    res.json({ success: true, message: 'Offer accepted' });
  } catch (error) {
    console.error('Error accepting offer:', error);
    res.status(500).json({ success: false, message: 'Error accepting offer', error: error.message });
  }
};

/**
 * Reject an offer
 */
const rejectOffer = async (req, res) => {
  try {
    const { app_id, id } = req.params;
    const { response_notes } = req.body;

    await db.query(`
      UPDATE property_offers 
      SET status = 'rejected', rejected_at = NOW(), response_notes = ?, responded_by = ?
      WHERE id = ? AND app_id = ?
    `, [response_notes || null, req.user?.id || null, id, app_id]);

    res.json({ success: true, message: 'Offer rejected' });
  } catch (error) {
    console.error('Error rejecting offer:', error);
    res.status(500).json({ success: false, message: 'Error rejecting offer', error: error.message });
  }
};

/**
 * Withdraw an offer
 */
const withdrawOffer = async (req, res) => {
  try {
    const { app_id, id } = req.params;
    const { reason } = req.body;

    await db.query(`
      UPDATE property_offers 
      SET status = 'withdrawn', withdrawn_at = NOW(), response_notes = ?
      WHERE id = ? AND app_id = ?
    `, [reason || null, id, app_id]);

    res.json({ success: true, message: 'Offer withdrawn' });
  } catch (error) {
    console.error('Error withdrawing offer:', error);
    res.status(500).json({ success: false, message: 'Error withdrawing offer', error: error.message });
  }
};

// ==================== ANALYTICS ====================

/**
 * Get agent performance analytics
 */
const getAgentPerformance = async (req, res) => {
  try {
    const { app_id } = req.params;
    const { agent_id, date_from, date_to } = req.query;

    let dateFilter = '';
    const params = [app_id];
    
    if (date_from) {
      dateFilter += ' AND created_at >= ?';
      params.push(date_from);
    }
    if (date_to) {
      dateFilter += ' AND created_at <= ?';
      params.push(date_to);
    }

    // Get agent listing stats
    const listingStatsResult = await db.query(`
      SELECT 
        u.id as agent_id,
        u.first_name,
        u.last_name,
        u.email,
        COUNT(DISTINCT pl.id) as total_listings,
        SUM(CASE WHEN pl.status = 'active' THEN 1 ELSE 0 END) as active_listings,
        AVG(pl.price_per_night) as avg_listing_price
      FROM app_users u
      LEFT JOIN property_listings pl ON u.id = pl.user_id AND pl.app_id = ?
      WHERE u.app_id = ? 
        AND EXISTS (SELECT 1 FROM app_user_role_assignments aura 
                    JOIN app_roles ar ON aura.app_role_id = ar.id 
                    WHERE aura.user_id = u.id AND ar.name = 'agent')
        ${agent_id ? 'AND u.id = ?' : ''}
      GROUP BY u.id, u.first_name, u.last_name, u.email
    `, agent_id ? [app_id, app_id, agent_id] : [app_id, app_id]);

    // Get inquiry stats per agent
    const inquiryStatsResult = await db.query(`
      SELECT 
        pi.agent_id,
        COUNT(*) as total_inquiries,
        SUM(CASE WHEN pi.status = 'responded' THEN 1 ELSE 0 END) as responded_inquiries,
        AVG(TIMESTAMPDIFF(HOUR, pi.created_at, pi.responded_at)) as avg_response_hours
      FROM property_inquiries pi
      WHERE pi.app_id = ? AND pi.agent_id IS NOT NULL ${dateFilter}
      GROUP BY pi.agent_id
    `, params);

    // Get showing stats per agent
    const showingStatsResult = await db.query(`
      SELECT 
        ps.agent_id,
        COUNT(*) as total_showings,
        SUM(CASE WHEN ps.status = 'completed' THEN 1 ELSE 0 END) as completed_showings,
        SUM(CASE WHEN ps.buyer_interest_level IN ('interested', 'very_interested') THEN 1 ELSE 0 END) as interested_buyers
      FROM property_showings ps
      WHERE ps.app_id = ? AND ps.agent_id IS NOT NULL ${dateFilter}
      GROUP BY ps.agent_id
    `, params);

    // Get offer stats per agent
    const offerStatsResult = await db.query(`
      SELECT 
        po.agent_id,
        COUNT(*) as total_offers,
        SUM(CASE WHEN po.status = 'accepted' THEN 1 ELSE 0 END) as accepted_offers,
        SUM(CASE WHEN po.status = 'accepted' THEN po.offer_amount ELSE 0 END) as total_sales_volume,
        AVG(po.offer_amount) as avg_offer_amount
      FROM property_offers po
      WHERE po.app_id = ? AND po.agent_id IS NOT NULL ${dateFilter}
      GROUP BY po.agent_id
    `, params);

    // Combine stats
    const agents = getRows(listingStatsResult).map(agent => {
      const inquiryStats = getRows(inquiryStatsResult).find(s => s.agent_id === agent.agent_id) || {};
      const showingStats = getRows(showingStatsResult).find(s => s.agent_id === agent.agent_id) || {};
      const offerStats = getRows(offerStatsResult).find(s => s.agent_id === agent.agent_id) || {};

      return {
        ...agent,
        inquiries: {
          total: inquiryStats.total_inquiries || 0,
          responded: inquiryStats.responded_inquiries || 0,
          avg_response_hours: inquiryStats.avg_response_hours || null
        },
        showings: {
          total: showingStats.total_showings || 0,
          completed: showingStats.completed_showings || 0,
          interested_buyers: showingStats.interested_buyers || 0
        },
        offers: {
          total: offerStats.total_offers || 0,
          accepted: offerStats.accepted_offers || 0,
          total_sales_volume: offerStats.total_sales_volume || 0,
          avg_offer_amount: offerStats.avg_offer_amount || null
        }
      };
    });

    res.json({ success: true, data: { agents } });
  } catch (error) {
    console.error('Error fetching agent performance:', error);
    res.status(500).json({ success: false, message: 'Error fetching agent performance', error: error.message });
  }
};

/**
 * Get market analytics
 */
const getMarketAnalytics = async (req, res) => {
  try {
    const { app_id } = req.params;
    const { date_from, date_to } = req.query;

    // Price trends by property type
    const priceByTypeResult = await db.query(`
      SELECT 
        property_type,
        COUNT(*) as count,
        AVG(price_per_night) as avg_price,
        MIN(price_per_night) as min_price,
        MAX(price_per_night) as max_price
      FROM property_listings
      WHERE app_id = ? AND status = 'active'
      GROUP BY property_type
      ORDER BY count DESC
    `, [app_id]);

    // Price trends by city
    const priceByCityResult = await db.query(`
      SELECT 
        city,
        COUNT(*) as count,
        AVG(price_per_night) as avg_price,
        MIN(price_per_night) as min_price,
        MAX(price_per_night) as max_price
      FROM property_listings
      WHERE app_id = ? AND status = 'active'
      GROUP BY city
      ORDER BY count DESC
      LIMIT 10
    `, [app_id]);

    // Listings trend (last 30 days)
    const listingsTrendResult = await db.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as new_listings
      FROM property_listings
      WHERE app_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date
    `, [app_id]);

    // Inquiry trends (last 30 days)
    const inquiryTrendResult = await db.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as inquiries
      FROM property_inquiries
      WHERE app_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date
    `, [app_id]);

    // Offer trends
    const offerTrendResult = await db.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as offers,
        SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) as accepted
      FROM property_offers
      WHERE app_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date
    `, [app_id]);

    // Days on market
    const daysOnMarketResult = await db.query(`
      SELECT 
        property_type,
        AVG(DATEDIFF(COALESCE(updated_at, NOW()), created_at)) as avg_days_on_market
      FROM property_listings
      WHERE app_id = ?
      GROUP BY property_type
    `, [app_id]);

    // Price per sqft by type
    const pricePerSqftResult = await db.query(`
      SELECT 
        property_type,
        AVG(price_per_night / NULLIF(square_feet, 0)) as avg_price_per_sqft
      FROM property_listings
      WHERE app_id = ? AND square_feet > 0 AND status = 'active'
      GROUP BY property_type
    `, [app_id]);

    // Overall market summary
    const summaryResult = await db.query(`
      SELECT 
        COUNT(*) as total_listings,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_listings,
        AVG(price_per_night) as avg_price,
        AVG(square_feet) as avg_sqft,
        AVG(bedrooms) as avg_bedrooms,
        AVG(bathrooms) as avg_bathrooms
      FROM property_listings
      WHERE app_id = ?
    `, [app_id]);

    res.json({
      success: true,
      data: {
        summary: getRows(summaryResult)[0],
        priceByType: getRows(priceByTypeResult),
        priceByCity: getRows(priceByCityResult),
        listingsTrend: getRows(listingsTrendResult),
        inquiryTrend: getRows(inquiryTrendResult),
        offerTrend: getRows(offerTrendResult),
        daysOnMarket: getRows(daysOnMarketResult),
        pricePerSqft: getRows(pricePerSqftResult)
      }
    });
  } catch (error) {
    console.error('Error fetching market analytics:', error);
    res.status(500).json({ success: false, message: 'Error fetching market analytics', error: error.message });
  }
};

module.exports = {
  // Inquiries
  getInquiries,
  getInquiry,
  updateInquiryStatus,
  respondToInquiry,
  // Showings
  getShowings,
  getShowing,
  updateShowingStatus,
  confirmShowing,
  cancelShowing,
  completeShowing,
  // Dashboard
  getDashboardOverview,
  // Offers
  getOffers,
  getOffer,
  createOffer,
  updateOfferStatus,
  submitOffer,
  counterOffer,
  acceptOffer,
  rejectOffer,
  withdrawOffer,
  // Analytics
  getAgentPerformance,
  getMarketAnalytics
}
