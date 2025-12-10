const express = require('express');
const router = express.Router();
const dashboardReportsController = require('../controllers/dashboardReportsController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Dashboard summary (all stats combined)
router.get('/app/:app_id/dashboard/summary', dashboardReportsController.getDashboardSummary);

// Listings overview report
router.get('/app/:app_id/dashboard/listings', dashboardReportsController.getListingsOverview);

// Users overview report
router.get('/app/:app_id/dashboard/users', dashboardReportsController.getUsersOverview);

// Inquiries overview report
router.get('/app/:app_id/dashboard/inquiries', dashboardReportsController.getInquiriesOverview);

// Popular listings report
router.get('/app/:app_id/dashboard/popular-listings', dashboardReportsController.getPopularListings);

module.exports = router;
