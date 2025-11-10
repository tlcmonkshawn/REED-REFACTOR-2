const express = require('express');
const router = express.Router();
const locationsController = require('../controllers/locationsController');
const auth = require('../middleware/auth');

// @route   POST api/v1/locations
// @desc    Create a location
// @access  Private (agent or bootie_boss)
router.post('/', auth, locationsController.createLocation);

// @route   GET api/v1/locations
// @desc    Get all locations
// @access  Public
router.get('/', locationsController.getAllLocations);

module.exports = router;
