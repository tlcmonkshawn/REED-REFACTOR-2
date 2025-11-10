const express = require('express');
const router = express.Router();
const bootiesController = require('../controllers/bootiesController');
const auth = require('../middleware/auth');

// @route   POST api/v1/booties
// @desc    Create a bootie
// @access  Private
router.post('/', auth, bootiesController.createBootie);

// @route   GET api/v1/booties
// @desc    Get all booties
// @access  Public
router.get('/', bootiesController.getAllBooties);

// @route   GET api/v1/booties/:id
// @desc    Get a bootie by ID
// @access  Public
router.get('/:id', bootiesController.getBootieById);

// @route   PUT api/v1/booties/:id
// @desc    Update a bootie
// @access  Private
router.put('/:id', auth, bootiesController.updateBootie);

// @route   DELETE api/v1/booties/:id
// @desc    Delete a bootie
// @access  Private
router.delete('/:id', auth, bootiesController.deleteBootie);

module.exports = router;
