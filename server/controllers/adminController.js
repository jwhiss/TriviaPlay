const GameSession = require('../models/GameSession');
const Question = require('../models/Question');

// Generate a random 6-character game code
const generateGameCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

exports.createGame = async (req, res) => {
  try {
    const { 
      name, 
      questionResponseTimeLimit, 
      maxTeams, 
      isCustomGame,
      questionIds,
      numQuestions,
      category,
      difficulty,
      type,
      showIntermediateScoreboard
    } = req.body;
    
    let finalQuestionIds = [];

    if (isCustomGame && questionIds && questionIds.length > 0) {
      finalQuestionIds = questionIds;
    } else {
      // Random draw
      const matchStage = {};
      if (category && category !== 'Any') matchStage.category = category;
      if (difficulty && difficulty !== 'Any') matchStage.difficulty = difficulty;
      if (type && type !== 'Any') matchStage.type = type;

      const limit = numQuestions ? parseInt(numQuestions, 10) : 10;
      const questions = await Question.aggregate([{ $match: matchStage }, { $sample: { size: limit } }]);
      finalQuestionIds = questions.map(q => q._id);
    }

    const gameCode = generateGameCode();

    const session = new GameSession({
      gameCode,
      name: name || 'Custom Trivia Game',
      hostId: req.admin.id, // from decoded JWT
      status: 'lobby',
      questions: finalQuestionIds,
      questionResponseTimeLimit: questionResponseTimeLimit || 30,
      maxTeams: maxTeams || 100,
      isCustomGame: isCustomGame || false,
      showIntermediateScoreboard: showIntermediateScoreboard || false
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

exports.getQuestions = async (req, res) => {
  try {
    const { category, difficulty, type } = req.query;
    const filter = {};
    if (category && category !== 'Any') filter.category = category;
    if (difficulty && difficulty !== 'Any') filter.difficulty = difficulty;
    if (type && type !== 'Any') filter.type = type;

    const questions = await Question.find(filter);
    res.status(200).json(questions);
  } catch (error) {
    console.error('Get Questions Error:', error);
    res.status(500).json({ message: 'Failed to fetch questions.' });
  }
};
