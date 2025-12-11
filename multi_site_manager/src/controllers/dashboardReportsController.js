const db = require('../config/database');

/**
 * Dashboard Reports Controller
 * Provides analytics and reporting data for app dashboards
 */

// Helper to safely get array from query result
const getRows = (result) => {
  return Array.isArray(result) && Array.isArray(result[0]) ? result[0] : result;
};

// ========================================
// LISTINGS OVERVIEW REPORT
// ========================================
exports.getListingsOverview = async (req, res) => {
  try {
    const { app_id } = req.params;
    
    // Get listing counts by status
    const statusResult = await db.query(`
      SELECT 
        status,
        COUNT(*) as count
      FROM property_listings
      WHERE app_id = ?
      GROUP BY status
    `, [app_id]);
    const statusCounts = getRows(statusResult);
    
    // Get total listings
    const totalResult = await db.query(`
      SELECT COUNT(*) as total FROM property_listings WHERE app_id = ?
    `, [app_id]);
    const total = getRows(totalResult)[0]?.total || 0;
    
    // Get average price
    const priceResult = await db.query(`
      SELECT 
        AVG(price_per_night) as avg_price,
        MIN(price_per_night) as min_price,
        MAX(price_per_night) as max_price
      FROM property_listings
      WHERE app_id = ? AND status = 'active'
    `, [app_id]);
    const priceStats = getRows(priceResult)[0] || {};
    
    // Get listings by property type
    const typeResult = await db.query(`
      SELECT 
        property_type,
        COUNT(*) as count
      FROM property_listings
      WHERE app_id = ?
      GROUP BY property_type
      ORDER BY count DESC
    `, [app_id]);
    const typeCounts = getRows(typeResult);
    
    // Get listings by city
    const cityResult = await db.query(`
      SELECT 
        city,
        COUNT(*) as count
      FROM property_listings
      WHERE app_id = ?
      GROUP BY city
      ORDER BY count DESC
      LIMIT 10
    `, [app_id]);
    const cityCounts = getRows(cityResult);
    
    // Get new listings trend (last 30 days)
    const trendResult = await db.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM property_listings
      WHERE app_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date
    `, [app_id]);
    const trend = getRows(trendResult);
    
    res.json({
      success: true,
      data: {
        summary: {
          total,
          active: statusCounts.find(s => s.status === 'active')?.count || 0,
          pending: statusCounts.find(s => s.status === 'pending')?.count || 0,
          sold: statusCounts.find(s => s.status === 'sold')?.count || 0,
          draft: statusCounts.find(s => s.status === 'draft')?.count || 0
        },
        priceStats: {
          average: parseFloat(priceStats.avg_price) || 0,
          min: parseFloat(priceStats.min_price) || 0,
          max: parseFloat(priceStats.max_price) || 0
        },
        byType: typeCounts,
        byCity: cityCounts,
        trend
      }
    });
  } catch (error) {
    console.error('Error fetching listings overview:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching listings overview',
      error: error.message
    });
  }
};

// ========================================
// USERS OVERVIEW REPORT
// ========================================
exports.getUsersOverview = async (req, res) => {
  try {
    const { app_id } = req.params;
    
    // Get total users
    const totalResult = await db.query(`
      SELECT COUNT(*) as total FROM app_users WHERE app_id = ?
    `, [app_id]);
    const total = getRows(totalResult)[0]?.total || 0;
    
    // Get users by role
    const roleResult = await db.query(`
      SELECT 
        r.name as role_name,
        r.display_name,
        COUNT(ura.user_id) as count
      FROM app_roles r
      LEFT JOIN app_user_role_assignments ura ON r.id = ura.role_id
      WHERE r.app_id = ?
      GROUP BY r.id, r.name, r.display_name
      ORDER BY count DESC
    `, [app_id]);
    const roleCounts = getRows(roleResult);
    
    // Get users by status
    const statusResult = await db.query(`
      SELECT 
        status,
        COUNT(*) as count
      FROM app_users
      WHERE app_id = ?
      GROUP BY status
    `, [app_id]);
    const statusCounts = getRows(statusResult);
    
    // Get registration trend (last 30 days)
    const trendResult = await db.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM app_users
      WHERE app_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date
    `, [app_id]);
    const trend = getRows(trendResult);
    
    // Get recent users
    const recentResult = await db.query(`
      SELECT 
        id, email, first_name, last_name, status, created_at
      FROM app_users
      WHERE app_id = ?
      ORDER BY created_at DESC
      LIMIT 10
    `, [app_id]);
    const recentUsers = getRows(recentResult);
    
    res.json({
      success: true,
      data: {
        summary: {
          total,
          active: statusCounts.find(s => s.status === 'active')?.count || 0,
          pending: statusCounts.find(s => s.status === 'pending')?.count || 0,
          inactive: statusCounts.find(s => s.status === 'inactive')?.count || 0
        },
        byRole: roleCounts,
        byStatus: statusCounts,
        trend,
        recentUsers
      }
    });
  } catch (error) {
    console.error('Error fetching users overview:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users overview',
      error: error.message
    });
  }
};

// ========================================
// INQUIRIES OVERVIEW REPORT
// ========================================
exports.getInquiriesOverview = async (req, res) => {
  try {
    const { app_id } = req.params;
    
    // Get total bookings/inquiries
    const totalResult = await db.query(`
      SELECT COUNT(*) as total FROM property_bookings WHERE app_id = ?
    `, [app_id]);
    const total = getRows(totalResult)[0]?.total || 0;
    
    // Get bookings by status
    const statusResult = await db.query(`
      SELECT 
        status,
        COUNT(*) as count
      FROM property_bookings
      WHERE app_id = ?
      GROUP BY status
    `, [app_id]);
    const statusCounts = getRows(statusResult);
    
    // Get bookings trend (last 30 days)
    const trendResult = await db.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM property_bookings
      WHERE app_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date
    `, [app_id]);
    const trend = getRows(trendResult);
    
    // Get recent inquiries with property and user info
    const recentResult = await db.query(`
      SELECT 
        pb.id,
        pb.status,
        pb.check_in_date,
        pb.check_out_date,
        pb.total_price,
        pb.created_at,
        pl.title as property_title,
        au.email as user_email,
        au.first_name,
        au.last_name
      FROM property_bookings pb
      LEFT JOIN property_listings pl ON pb.listing_id = pl.id
      LEFT JOIN app_users au ON pb.guest_user_id = au.id
      WHERE pb.app_id = ?
      ORDER BY pb.created_at DESC
      LIMIT 10
    `, [app_id]);
    const recentInquiries = getRows(recentResult);
    
    // Calculate response metrics (if we have response timestamps)
    const responseResult = await db.query(`
      SELECT 
        COUNT(*) as total_responded,
        AVG(TIMESTAMPDIFF(HOUR, created_at, updated_at)) as avg_response_hours
      FROM property_bookings
      WHERE app_id = ? AND status != 'pending' AND updated_at > created_at
    `, [app_id]);
    const responseMetrics = getRows(responseResult)[0] || {};
    
    res.json({
      success: true,
      data: {
        summary: {
          total,
          pending: statusCounts.find(s => s.status === 'pending')?.count || 0,
          confirmed: statusCounts.find(s => s.status === 'confirmed')?.count || 0,
          completed: statusCounts.find(s => s.status === 'completed')?.count || 0,
          cancelled: statusCounts.find(s => s.status === 'cancelled')?.count || 0
        },
        byStatus: statusCounts,
        trend,
        recentInquiries,
        responseMetrics: {
          totalResponded: responseMetrics.total_responded || 0,
          avgResponseHours: parseFloat(responseMetrics.avg_response_hours) || 0
        }
      }
    });
  } catch (error) {
    console.error('Error fetching inquiries overview:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching inquiries overview',
      error: error.message
    });
  }
};

// ========================================
// POPULAR LISTINGS REPORT
// ========================================
exports.getPopularListings = async (req, res) => {
  try {
    const { app_id } = req.params;
    const { limit = 10 } = req.query;
    
    // Get listings with inquiry/booking counts and favorite counts
    const listingsResult = await db.query(`
      SELECT 
        pl.id,
        pl.title,
        pl.city,
        pl.property_type,
        pl.price_per_night as price,
        pl.status,
        pl.created_at,
        COALESCE(booking_counts.inquiry_count, 0) as inquiry_count,
        COALESCE(favorite_counts.favorite_count, 0) as favorite_count,
        (COALESCE(booking_counts.inquiry_count, 0) + COALESCE(favorite_counts.favorite_count, 0)) as engagement_score
      FROM property_listings pl
      LEFT JOIN (
        SELECT listing_id, COUNT(*) as inquiry_count
        FROM property_bookings
        WHERE app_id = ?
        GROUP BY listing_id
      ) booking_counts ON pl.id = booking_counts.listing_id
      LEFT JOIN (
        SELECT listing_id, COUNT(*) as favorite_count
        FROM user_favorites
        WHERE app_id = ?
        GROUP BY listing_id
      ) favorite_counts ON pl.id = favorite_counts.listing_id
      WHERE pl.app_id = ? AND pl.status = 'active'
      ORDER BY engagement_score DESC, pl.created_at DESC
      LIMIT ?
    `, [app_id, app_id, app_id, parseInt(limit)]);
    const listings = getRows(listingsResult);
    
    // Get primary images for listings
    const listingIds = listings.map(l => l.id);
    let images = [];
    if (listingIds.length > 0) {
      const imagesResult = await db.query(`
        SELECT listing_id, image_url
        FROM property_images
        WHERE listing_id IN (?) AND is_primary = 1
      `, [listingIds]);
      images = getRows(imagesResult);
    }
    
    // Attach images to listings
    const listingsWithImages = listings.map(listing => ({
      ...listing,
      image_url: images.find(img => img.listing_id === listing.id)?.image_url || null
    }));
    
    res.json({
      success: true,
      data: {
        listings: listingsWithImages,
        total: listings.length
      }
    });
  } catch (error) {
    console.error('Error fetching popular listings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching popular listings',
      error: error.message
    });
  }
};

// ========================================
// DASHBOARD SUMMARY (All reports combined)
// ========================================
exports.getDashboardSummary = async (req, res) => {
  try {
    const { app_id } = req.params;
    
    // Get quick stats
    const [listingsTotal, usersTotal, inquiriesTotal, messagesTotal] = await Promise.all([
      db.query('SELECT COUNT(*) as count FROM property_listings WHERE app_id = ?', [app_id]),
      db.query('SELECT COUNT(*) as count FROM app_users WHERE app_id = ?', [app_id]),
      db.query('SELECT COUNT(*) as count FROM property_bookings WHERE app_id = ?', [app_id]),
      db.query('SELECT COUNT(*) as count FROM messages m INNER JOIN conversations c ON m.conversation_id = c.id WHERE c.app_id = ?', [app_id])
    ]);
    
    // Get active counts
    const [activeListings, activeUsers, pendingInquiries] = await Promise.all([
      db.query("SELECT COUNT(*) as count FROM property_listings WHERE app_id = ? AND status = 'active'", [app_id]),
      db.query("SELECT COUNT(*) as count FROM app_users WHERE app_id = ? AND status = 'active'", [app_id]),
      db.query("SELECT COUNT(*) as count FROM property_bookings WHERE app_id = ? AND status = 'pending'", [app_id])
    ]);
    
    // Get recent activity (last 7 days)
    const [newListings7d, newUsers7d, newInquiries7d] = await Promise.all([
      db.query('SELECT COUNT(*) as count FROM property_listings WHERE app_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)', [app_id]),
      db.query('SELECT COUNT(*) as count FROM app_users WHERE app_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)', [app_id]),
      db.query('SELECT COUNT(*) as count FROM property_bookings WHERE app_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)', [app_id])
    ]);
    
    res.json({
      success: true,
      data: {
        totals: {
          listings: getRows(listingsTotal)[0]?.count || 0,
          users: getRows(usersTotal)[0]?.count || 0,
          inquiries: getRows(inquiriesTotal)[0]?.count || 0,
          messages: getRows(messagesTotal)[0]?.count || 0
        },
        active: {
          listings: getRows(activeListings)[0]?.count || 0,
          users: getRows(activeUsers)[0]?.count || 0,
          pendingInquiries: getRows(pendingInquiries)[0]?.count || 0
        },
        last7Days: {
          newListings: getRows(newListings7d)[0]?.count || 0,
          newUsers: getRows(newUsers7d)[0]?.count || 0,
          newInquiries: getRows(newInquiries7d)[0]?.count || 0
        }
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard summary',
      error: error.message
    });
  }
};
