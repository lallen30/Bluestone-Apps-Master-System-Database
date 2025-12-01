const express = require('express');
const router = express.Router();
const formSubmissionsController = require('../controllers/formSubmissionsController');
const { authenticate, hasAppAccess } = require('../middleware/auth');

/**
 * GET /api/v1/apps/:appId/form-submissions
 * Get all form submissions for an app (admin only)
 */
router.get(
  '/apps/:appId/form-submissions',
  authenticate,
  hasAppAccess,
  formSubmissionsController.getAllSubmissions
);

/**
 * GET /api/v1/apps/:appId/forms-list
 * Get forms list for filter dropdown
 */
router.get(
  '/apps/:appId/forms-list',
  authenticate,
  hasAppAccess,
  formSubmissionsController.getFormsList
);

/**
 * GET /api/v1/apps/:appId/form-submissions/:submissionId
 * Get a single form submission
 */
router.get(
  '/apps/:appId/form-submissions/:submissionId',
  authenticate,
  hasAppAccess,
  formSubmissionsController.getSubmissionById
);

/**
 * PUT /api/v1/apps/:appId/form-submissions/:submissionId/status
 * Update submission status
 */
router.put(
  '/apps/:appId/form-submissions/:submissionId/status',
  authenticate,
  hasAppAccess,
  formSubmissionsController.updateSubmissionStatus
);

/**
 * DELETE /api/v1/apps/:appId/form-submissions/:submissionId
 * Delete a submission
 */
router.delete(
  '/apps/:appId/form-submissions/:submissionId',
  authenticate,
  hasAppAccess,
  formSubmissionsController.deleteSubmission
);

module.exports = router;
