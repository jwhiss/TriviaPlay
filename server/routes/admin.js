const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateAdmin } = require('../utils/auth');

// Apply authentication middleware to all admin routes
router.use(authenticateAdmin);

// POST /api/admin/games
// Create a new trivia game session
router.post('/games', adminController.createGame);

// GET /api/admin/games
// List all games
router.get('/games', adminController.getGames);

module.exports = router;
