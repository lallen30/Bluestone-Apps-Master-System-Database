const express = require('express');
const router = express.Router();
const screenElementController = require('../controllers/screenElementController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Get all screen elements
router.get('/', screenElementController.getAllElements);

// Get all categories
router.get('/categories', screenElementController.getCategories);

// Get elements by category
router.get('/category/:category', screenElementController.getElementsByCategory);

// Get element by ID
router.get('/:id', screenElementController.getElementById);

module.exports = router;
