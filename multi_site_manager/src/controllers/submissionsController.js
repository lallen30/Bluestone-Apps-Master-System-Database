const db = require('../config/database');

/**
 * Get all submissions for an app
 * Admin endpoint to view submitted data
 */
exports.getAppSubmissions = async (req, res) => {
  try {
    const { appId } = req.params;
    const { screenId, dateFilter, page = 1, limit = 50 } = req.query;

    // Build query
    let whereConditions = ['ss.app_id = ?'];
    let queryParams = [appId];

    if (screenId && screenId !== 'all') {
      whereConditions.push('ss.screen_id = ?');
      queryParams.push(screenId);
    }

    // Date filters
    if (dateFilter) {
      switch (dateFilter) {
        case 'today':
          whereConditions.push('DATE(ss.created_at) = CURDATE()');
          break;
        case 'week':
          whereConditions.push('ss.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)');
          break;
        case 'month':
          whereConditions.push('ss.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)');
          break;
      }
    }

    const whereClause = whereConditions.join(' AND ');
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Get submissions
    const submissionsResult = await db.query(
      `SELECT 
        ss.id,
        ss.app_id,
        ss.screen_id,
        ss.user_id,
        ss.submission_data,
        ss.device_info,
        ss.ip_address,
        ss.created_at,
        scr.name as screen_name,
        au.email as user_email,
        au.first_name,
        au.last_name
       FROM screen_submissions ss
       LEFT JOIN app_screens scr ON ss.screen_id = scr.id
       LEFT JOIN app_users au ON ss.user_id = au.id
       WHERE ${whereClause}
       ORDER BY ss.created_at DESC
       LIMIT ? OFFSET ?`,
      [...queryParams, parseInt(limit), offset]
    );

    const submissions = Array.isArray(submissionsResult) && Array.isArray(submissionsResult[0]) 
      ? submissionsResult[0] 
      : submissionsResult;

    // Get total count
    const countResult = await db.query(
      `SELECT COUNT(*) as total
       FROM screen_submissions ss
       WHERE ${whereClause}`,
      queryParams
    );

    const count = Array.isArray(countResult) && Array.isArray(countResult[0]) 
      ? countResult[0] 
      : countResult;

    const total = count && count.length > 0 ? count[0].total : 0;

    // Parse JSON submission_data
    const formattedSubmissions = (submissions || []).map(sub => ({
      ...sub,
      submission_data: typeof sub.submission_data === 'string' 
        ? JSON.parse(sub.submission_data) 
        : sub.submission_data
    }));

    res.json({
      success: true,
      data: {
        submissions: formattedSubmissions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: total,
          total_pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching submissions',
      error: error.message
    });
  }
};

/**
 * Get submission statistics
 */
exports.getSubmissionStats = async (req, res) => {
  try {
    const { appId } = req.params;

    // Total submissions
    const totalResult = await db.query(
      'SELECT COUNT(*) as total FROM screen_submissions WHERE app_id = ?',
      [appId]
    );

    const total = Array.isArray(totalResult) && Array.isArray(totalResult[0]) 
      ? totalResult[0] 
      : totalResult;

    // Today's submissions
    const todayResult = await db.query(
      'SELECT COUNT(*) as today FROM screen_submissions WHERE app_id = ? AND DATE(created_at) = CURDATE()',
      [appId]
    );

    const today = Array.isArray(todayResult) && Array.isArray(todayResult[0]) 
      ? todayResult[0] 
      : todayResult;

    // This week's submissions
    const weekResult = await db.query(
      'SELECT COUNT(*) as week FROM screen_submissions WHERE app_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)',
      [appId]
    );

    const week = Array.isArray(weekResult) && Array.isArray(weekResult[0]) 
      ? weekResult[0] 
      : weekResult;

    // This month's submissions
    const monthResult = await db.query(
      'SELECT COUNT(*) as month FROM screen_submissions WHERE app_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)',
      [appId]
    );

    const month = Array.isArray(monthResult) && Array.isArray(monthResult[0]) 
      ? monthResult[0] 
      : monthResult;

    res.json({
      success: true,
      data: {
        total: total && total.length > 0 ? total[0].total : 0,
        today: today && today.length > 0 ? today[0].today : 0,
        week: week && week.length > 0 ? week[0].week : 0,
        month: month && month.length > 0 ? month[0].month : 0
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};

/**
 * Delete a submission
 */
exports.deleteSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;

    await db.query(
      'DELETE FROM screen_submissions WHERE id = ?',
      [submissionId]
    );

    res.json({
      success: true,
      message: 'Submission deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting submission:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting submission',
      error: error.message
    });
  }
};

/**
 * Export submissions as CSV
 */
exports.exportSubmissions = async (req, res) => {
  try {
    const { appId } = req.params;
    const { screenId, dateFilter } = req.query;

    // Build query (same as getAppSubmissions)
    let whereConditions = ['ss.app_id = ?'];
    let queryParams = [appId];

    if (screenId && screenId !== 'all') {
      whereConditions.push('ss.screen_id = ?');
      queryParams.push(screenId);
    }

    if (dateFilter) {
      switch (dateFilter) {
        case 'today':
          whereConditions.push('DATE(ss.created_at) = CURDATE()');
          break;
        case 'week':
          whereConditions.push('ss.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)');
          break;
        case 'month':
          whereConditions.push('ss.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)');
          break;
      }
    }

    const whereClause = whereConditions.join(' AND ');

    const submissionsResult = await db.query(
      `SELECT 
        ss.id,
        ss.screen_id,
        ss.submission_data,
        ss.device_info,
        ss.ip_address,
        ss.created_at,
        scr.name as screen_name,
        au.email as user_email
       FROM screen_submissions ss
       LEFT JOIN app_screens scr ON ss.screen_id = scr.id
       LEFT JOIN app_users au ON ss.user_id = au.id
       WHERE ${whereClause}
       ORDER BY ss.created_at DESC`,
      queryParams
    );

    const submissions = Array.isArray(submissionsResult) && Array.isArray(submissionsResult[0]) 
      ? submissionsResult[0] 
      : submissionsResult;

    // Generate CSV
    if (!submissions || submissions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No submissions found'
      });
    }

    // Get all unique field keys from all submissions
    const allFields = new Set(['id', 'screen_name', 'user_email', 'device_info', 'ip_address', 'created_at']);
    submissions.forEach(sub => {
      const data = typeof sub.submission_data === 'string' 
        ? JSON.parse(sub.submission_data) 
        : sub.submission_data;
      Object.keys(data || {}).forEach(key => allFields.add(key));
    });

    // Create CSV header
    const headers = Array.from(allFields);
    let csv = headers.join(',') + '\n';

    // Add rows
    submissions.forEach(sub => {
      const data = typeof sub.submission_data === 'string' 
        ? JSON.parse(sub.submission_data) 
        : sub.submission_data;

      const row = headers.map(header => {
        let value = '';
        if (header === 'id') value = sub.id;
        else if (header === 'screen_name') value = sub.screen_name || '';
        else if (header === 'user_email') value = sub.user_email || 'Anonymous';
        else if (header === 'device_info') value = sub.device_info || '';
        else if (header === 'ip_address') value = sub.ip_address || '';
        else if (header === 'created_at') value = sub.created_at;
        else value = data?.[header] || '';

        // Escape commas and quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          value = `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      });
      csv += row.join(',') + '\n';
    });

    // Send CSV file
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="submissions_${appId}_${Date.now()}.csv"`);
    res.send(csv);
  } catch (error) {
    console.error('Error exporting submissions:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting data',
      error: error.message
    });
  }
};
