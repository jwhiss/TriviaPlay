const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  teamId: { type: String, required: true }, // generated tracking ID
  name: { type: String, required: true },
  score: { type: Number, default: 0 },
  socketId: { type: String }, // to track the specific device connection
  isActive: { type: Boolean, default: true }
}, { _id: false });

const gameSessionSchema = new mongoose.Schema({
  gameCode: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminUser'
  },
  status: {
    type: String,
    enum: ['setup', 'lobby', 'active', 'finished', 'cancelled'],
    default: 'setup'
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],
  currentQuestionIndex: {
    type: Number,
    default: -1
  },
  questionResponseTimeLimit: {
    type: Number,
    default: 30 // seconds
  },
  teams: [teamSchema],
  maxTeams: {
    type: Number,
    default: 100
  }
}, { timestamps: true });

module.exports = mongoose.model('GameSession', gameSessionSchema);
