const express = require('express');
const router = express.Router();
const submissionsController = require('../controllers/submissionsController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

/**
 * GET /api/v1/apps/:appId/submissions
 * Get all submissions for an app
 * Query params: screenId, dateFilter, page, limit
 */
router.get('/apps/:appId/submissions', submissionsController.getAppSubmissions);

/**
 * GET /api/v1/apps/:appId/submissions/stats
 * Get submission statistics
 */
router.get('/apps/:appId/submissions/stats', submissionsController.getSubmissionStats);

/**
 * GET /api/v1/apps/:appId/submissions/export
 * Export submissions as CSV
 * Query params: screenId, dateFilter
 */
router.get('/apps/:appId/submissions/export', submissionsController.exportSubmissions);

/**
 * DELETE /api/v1/submissions/:submissionId
 * Delete a submission
 */
router.delete('/submissions/:submissionId', submissionsController.deleteSubmission);

module.exports = router;
