const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, isMasterAdmin, isAdmin } = require('../middleware/auth');
const {
  validateUserRegistration,
  validateUserUpdate,
  validateId
} = require('../middleware/validator');

// All routes require authentication
router.use(authenticate);

// Get all system roles
router.get('/roles', isAdmin, userController.getRoles);

// Get all users (Admin and Master Admin only)
router.get('/', isAdmin, userController.getAllUsers);

// Get user by ID
router.get('/:id', validateId, isAdmin, userController.getUserById);

// Create new user (Master Admin only)
router.post('/', isMasterAdmin, validateUserRegistration, userController.createUser);

// Update user (Master Admin only)
router.put('/:id', validateId, isMasterAdmin, validateUserUpdate, userController.updateUser);

// Delete user (Master Admin only)
router.delete('/:id', validateId, isMasterAdmin, userController.deleteUser);

module.exports = router;
