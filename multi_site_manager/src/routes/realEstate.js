/**
 * Real Estate Routes
 * Routes for property inquiries, showings, and offers
 */

const express = require('express');
const router = express.Router();
const realEstateController = require('../controllers/realEstateController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Dashboard overview
router.get('/app/:app_id/real-estate/dashboard', realEstateController.getDashboardOverview);

// Property Inquiries
router.get('/app/:app_id/inquiries', realEstateController.getInquiries);
router.get('/app/:app_id/inquiries/:id', realEstateController.getInquiry);
router.put('/app/:app_id/inquiries/:id/status', realEstateController.updateInquiryStatus);
router.post('/app/:app_id/inquiries/:id/respond', realEstateController.respondToInquiry);

// Property Showings
router.get('/app/:app_id/showings', realEstateController.getShowings);
router.get('/app/:app_id/showings/:id', realEstateController.getShowing);
router.put('/app/:app_id/showings/:id/status', realEstateController.updateShowingStatus);
router.post('/app/:app_id/showings/:id/confirm', realEstateController.confirmShowing);
router.post('/app/:app_id/showings/:id/cancel', realEstateController.cancelShowing);
router.post('/app/:app_id/showings/:id/complete', realEstateController.completeShowing);

// Property Offers (Transactions)
router.get('/app/:app_id/offers', realEstateController.getOffers);
router.get('/app/:app_id/offers/:id', realEstateController.getOffer);
router.post('/app/:app_id/offers', realEstateController.createOffer);
router.put('/app/:app_id/offers/:id/status', realEstateController.updateOfferStatus);
router.post('/app/:app_id/offers/:id/submit', realEstateController.submitOffer);
router.post('/app/:app_id/offers/:id/counter', realEstateController.counterOffer);
router.post('/app/:app_id/offers/:id/accept', realEstateController.acceptOffer);
router.post('/app/:app_id/offers/:id/reject', realEstateController.rejectOffer);
router.post('/app/:app_id/offers/:id/withdraw', realEstateController.withdrawOffer);

// Analytics
router.get('/app/:app_id/analytics/agents', realEstateController.getAgentPerformance);
router.get('/app/:app_id/analytics/market', realEstateController.getMarketAnalytics);

module.exports = router;
