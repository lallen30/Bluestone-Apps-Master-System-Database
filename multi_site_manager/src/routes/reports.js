const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Get all report screens for an app
router.get('/app/:app_id/reports', reportsController.getReportScreens);

// Get report config for a specific screen
router.get('/app/:app_id/reports/:screen_id/config', reportsController.getReportConfig);

// Save/update report config
router.post('/app/:app_id/reports/:screen_id/config', reportsController.saveReportConfig);

// Get report data (submissions)
router.get('/app/:app_id/reports/:screen_id/data', reportsController.getReportData);

// Get single submission detail
router.get('/app/:app_id/reports/:screen_id/submissions/:submission_id', reportsController.getSubmissionDetail);

// Update a submission
router.put('/app/:app_id/reports/:screen_id/submissions/:submission_id', reportsController.updateSubmission);

// Delete a submission
router.delete('/app/:app_id/reports/:screen_id/submissions/:submission_id', reportsController.deleteSubmission);

// Export report data as CSV
router.get('/app/:app_id/reports/:screen_id/export', reportsController.exportReportData);

module.exports = router;
