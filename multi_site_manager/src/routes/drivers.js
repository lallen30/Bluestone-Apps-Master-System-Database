const express = require('express');
const router = express.Router({ mergeParams: true });
const driversController = require('../controllers/driversController');
const { authenticateMobileUser } = require('../middleware/mobileAuth');

// Public route - view driver profile
router.get('/:driverId', driversController.getDriverById);

// All other routes require mobile authentication
router.use(authenticateMobileUser);

// Driver registration and profile
router.post('/register', driversController.registerDriver);
router.get('/profile', driversController.getDriverProfile);
router.put('/profile', driversController.updateDriverProfile);

// Driver status and location
router.put('/status', driversController.toggleDriverStatus);
router.put('/location', driversController.updateDriverLocation);

// Driver earnings and rides
router.get('/earnings', driversController.getDriverEarnings);
router.get('/rides', driversController.getDriverRides);
router.get('/available-rides', driversController.getAvailableRides);

module.exports = router;
