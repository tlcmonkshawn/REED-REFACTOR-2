const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const auth = require('../middleware/auth');

// @route   GET api/v1/users/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth, usersController.getMe);

// @route   GET api/v1/users/:id
// @desc    Get user profile by ID
// @access  Public
router.get('/:id', usersController.getUserById);

module.exports = router;
