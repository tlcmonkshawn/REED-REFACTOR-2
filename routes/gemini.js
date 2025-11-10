const express = require('express');
const router = express.Router();
const geminiController = require('../controllers/geminiController');
const auth = require('../middleware/auth');

// @route   POST api/v1/gemini/session-token
// @desc    Get a session token for Gemini Live API
// @access  Private
router.post('/session-token', auth, geminiController.getSessionToken);

module.exports = router;
