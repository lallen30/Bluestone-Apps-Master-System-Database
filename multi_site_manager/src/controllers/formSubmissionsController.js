const db = require('../config/database');

/**
 * Get all form submissions for an app (admin)
 * GET /api/v1/apps/:appId/form-submissions
 */
exports.getAllSubmissions = async (req, res) => {
  try {
    const appId = parseInt(req.params.appId);
    const { 
      form_id,
      status,
      date_from,
      date_to,
      page = 1, 
      per_page = 20 
    } = req.query;

    let query = `
      SELECT 
        s.id, s.form_id, s.user_id, s.form_data, s.submission_ip,
        s.status, s.error_message, s.submitted_at, s.processed_at,
        f.name as form_name, f.form_type,
        u.first_name as user_first_name, u.last_name as user_last_name, u.email as user_email
      FROM app_form_submissions s
      LEFT JOIN app_forms f ON s.form_id = f.id
      LEFT JOIN app_users u ON s.user_id = u.id
      WHERE s.app_id = ?
    `;

    const params = [appId];

    if (form_id) {
      query += ` AND s.form_id = ?`;
      params.push(parseInt(form_id));
    }

    if (status) {
      query += ` AND s.status = ?`;
      params.push(status);
    }

    if (date_from) {
      query += ` AND s.submitted_at >= ?`;
      params.push(date_from);
    }

    if (date_to) {
      query += ` AND s.submitted_at <= ?`;
      params.push(date_to);
    }

    // Count query
    let countQuery = `
      SELECT COUNT(*) as total 
      FROM app_form_submissions s
      WHERE s.app_id = ?
    `;
    const countParams = [appId];

    if (form_id) {
      countQuery += ` AND s.form_id = ?`;
      countParams.push(parseInt(form_id));
    }
    if (status) {
      countQuery += ` AND s.status = ?`;
      countParams.push(status);
    }
    if (date_from) {
      countQuery += ` AND s.submitted_at >= ?`;
      countParams.push(date_from);
    }
    if (date_to) {
      countQuery += ` AND s.submitted_at <= ?`;
      countParams.push(date_to);
    }

    const countResult = await db.query(countQuery, countParams);
    const total = countResult[0]?.total || 0;

    // Add pagination
    query += ` ORDER BY s.submitted_at DESC LIMIT ? OFFSET ?`;
    const limit = parseInt(per_page);
    const offset = (parseInt(page) - 1) * limit;
    params.push(limit, offset);

    const submissions = await db.query(query, params);

    // Get stats
    const statsResult = await db.query(
      `SELECT 
        COUNT(*) as total_submissions,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'processing' THEN 1 ELSE 0 END) as processing,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
       FROM app_form_submissions 
       WHERE app_id = ?`,
      [appId]
    );
    const stats = statsResult[0] || {};

    res.json({
      success: true,
      data: {
        submissions: submissions || [],
        stats: {
          total_submissions: parseInt(stats.total_submissions) || 0,
          pending: parseInt(stats.pending) || 0,
          processing: parseInt(stats.processing) || 0,
          completed: parseInt(stats.completed) || 0,
          failed: parseInt(stats.failed) || 0,
          rejected: parseInt(stats.rejected) || 0
        },
        pagination: {
          page: parseInt(page),
          per_page: limit,
          total,
          total_pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching form submissions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching form submissions',
      error: error.message
    });
  }
};

/**
 * Get a single form submission
 * GET /api/v1/apps/:appId/form-submissions/:submissionId
 */
exports.getSubmissionById = async (req, res) => {
  try {
    const appId = parseInt(req.params.appId);
    const submissionId = parseInt(req.params.submissionId);

    const result = await db.query(
      `SELECT 
        s.id, s.form_id, s.user_id, s.form_data, s.submission_ip, s.user_agent,
        s.status, s.error_message, s.submitted_at, s.processed_at,
        f.name as form_name, f.form_type,
        u.first_name as user_first_name, u.last_name as user_last_name, u.email as user_email
      FROM app_form_submissions s
      LEFT JOIN app_forms f ON s.form_id = f.id
      LEFT JOIN app_users u ON s.user_id = u.id
      WHERE s.id = ? AND s.app_id = ?`,
      [submissionId, appId]
    );

    if (!result || result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    res.json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching submission',
      error: error.message
    });
  }
};

/**
 * Update submission status
 * PUT /api/v1/apps/:appId/form-submissions/:submissionId/status
 */
exports.updateSubmissionStatus = async (req, res) => {
  try {
    const appId = parseInt(req.params.appId);
    const submissionId = parseInt(req.params.submissionId);
    const { status, error_message } = req.body;

    const validStatuses = ['pending', 'processing', 'completed', 'failed', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    let updateQuery = `UPDATE app_form_submissions SET status = ?`;
    const params = [status];

    if (status === 'completed' || status === 'failed' || status === 'rejected') {
      updateQuery += `, processed_at = NOW()`;
    }

    if (error_message) {
      updateQuery += `, error_message = ?`;
      params.push(error_message);
    }

    updateQuery += ` WHERE id = ? AND app_id = ?`;
    params.push(submissionId, appId);

    await db.query(updateQuery, params);

    res.json({
      success: true,
      message: 'Submission status updated'
    });
  } catch (error) {
    console.error('Error updating submission status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating submission status',
      error: error.message
    });
  }
};

/**
 * Delete a submission
 * DELETE /api/v1/apps/:appId/form-submissions/:submissionId
 */
exports.deleteSubmission = async (req, res) => {
  try {
    const appId = parseInt(req.params.appId);
    const submissionId = parseInt(req.params.submissionId);

    await db.query(
      `DELETE FROM app_form_submissions WHERE id = ? AND app_id = ?`,
      [submissionId, appId]
    );

    res.json({
      success: true,
      message: 'Submission deleted'
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
 * Get forms list for filter dropdown
 * GET /api/v1/apps/:appId/forms
 */
exports.getFormsList = async (req, res) => {
  try {
    const appId = parseInt(req.params.appId);

    const forms = await db.query(
      `SELECT id, name, form_type FROM app_forms WHERE app_id = ? ORDER BY name`,
      [appId]
    );

    res.json({
      success: true,
      data: forms || []
    });
  } catch (error) {
    console.error('Error fetching forms:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching forms',
      error: error.message
    });
  }
};
