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

// GET /api/admin/categories
// List all unique question categories
router.get('/categories', adminController.getCategories);

// GET /api/admin/questions
// List questions with optional filters
router.get('/questions', adminController.getQuestions);

module.exports = router;
