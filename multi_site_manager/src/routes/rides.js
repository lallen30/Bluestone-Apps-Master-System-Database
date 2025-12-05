const express = require('express');
const router = express.Router({ mergeParams: true });
const ridesController = require('../controllers/ridesController');
const { authenticateMobileUser } = require('../middleware/mobileAuth');

// All routes require mobile authentication
router.use(authenticateMobileUser);

// Ride routes
router.post('/', ridesController.requestRide);
router.get('/', ridesController.getRideHistory);
router.get('/active', ridesController.getActiveRide);
router.get('/:rideId', ridesController.getRideById);
router.put('/:rideId/cancel', ridesController.cancelRide);
router.put('/:rideId/rate', ridesController.rateRide);
router.put('/:rideId/status', ridesController.updateRideStatus);
router.put('/:rideId/accept', ridesController.acceptRide);

module.exports = router;
