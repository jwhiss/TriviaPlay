const GameSession = require('../models/GameSession');
const Question = require('../models/Question');

// Generate a random 6-character game code
const generateGameCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

exports.createGame = async (req, res) => {
  try {
    const { name, questionResponseTimeLimit, maxTeams, category } = req.body;
    
    // Allow them to filter questions by theme
    const matchStage = category && category !== 'Any' ? { category } : {};
    const questions = await Question.aggregate([{ $match: matchStage }, { $sample: { size: 10 } }]);
    const questionIds = questions.map(q => q._id);

    const gameCode = generateGameCode();

    const session = new GameSession({
      gameCode,
      name: name || 'Custom Trivia Game',
      hostId: req.admin.id, // from decoded JWT
      status: 'lobby',
      questions: questionIds,
      questionResponseTimeLimit: questionResponseTimeLimit || 30,
      maxTeams: maxTeams || 100
    });

    await session.save();

    res.status(201).json({
      message: 'Game session created successfully.',
      session
    });
  } catch (error) {
    console.error('Create Game Error:', error);
    res.status(500).json({ message: 'Failed to create game session.' });
  }
};

exports.getGames = async (req, res) => {
  try {
    const sessions = await GameSession.find().sort({ createdAt: -1 });
    res.status(200).json(sessions);
  } catch (error) {
    console.error('Get Games Error:', error);
    res.status(500).json({ message: 'Failed to fetch games.' });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Question.distinct('category');
    res.status(200).json(categories);
  } catch (error) {
    console.error('Get Categories Error:', error);
    res.status(500).json({ message: 'Failed to fetch categories.' });
  }
};
