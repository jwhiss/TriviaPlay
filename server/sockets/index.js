const GameSession = require('../models/GameSession');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // Patron joins a game
    socket.on('patron_join', async (data) => {
      try {
        const { gameCode, name } = data;
        const session = await GameSession.findOne({ gameCode, status: { $in: ['lobby', 'active'] } });

        if (!session) {
          return socket.emit('join_error', { message: 'Invalid game code or game is not ready.' });
        }

        const teamId = socket.id; // Using socket ID as simple team identifier
        session.teams.push({
          teamId,
          name,
          score: 0,
          socketId: socket.id
        });

        await session.save();

        // Join socket.io room for this game round
        socket.join(gameCode);

        // Confirm join to patron
        socket.emit('join_confirmation', { message: 'Successfully joined!', teamId, gameCode });

        // Broadcast to display/admin
        io.to(gameCode).emit('scoreboard_broadcast', { teams: session.teams });
      } catch (err) {
        socket.emit('join_error', { message: 'Failed to join game.' });
      }
    });

    // Host manually advances the game (broadcasting to all)
    socket.on('trigger_question', async (data) => {
      // NOTE: Authentication check for Host should be done here in real app via JWT on socket negotiation
      const { gameCode, questionIndex } = data;
      try {
        const session = await GameSession.findOne({ gameCode }).populate('questions');
        if (!session || !session.questions[questionIndex]) return;

        session.currentQuestionIndex = questionIndex;
        session.status = 'active';
        await session.save();

        const questionInfo = session.questions[questionIndex];
        const payload = {
          question: questionInfo.question,
          category: questionInfo.category, // etc
          choices: [questionInfo.correctAnswer, ...questionInfo.incorrectAnswers].sort(() => Math.random() - 0.5)
        };

        // Broadcast to patrons and display client
        io.to(gameCode).emit('question_broadcast', payload);
      } catch (err) {
        console.error('Trigger Question Error:', err);
      }
    });

    // Patron submits answer
    socket.on('answer_submission', async (data) => {
      const { gameCode, teamId, answer } = data;
      // Requirement 4300: acknowledge within 100ms
      socket.emit('answer_acknowledgement', { message: 'Answer received' });

      try {
        const session = await GameSession.findOne({ gameCode }).populate('questions');
        if (!session) return;
        
        const currentQ = session.questions[session.currentQuestionIndex];
        if (currentQ && currentQ.correctAnswer === answer) {
          // Find team and increment score
          const team = session.teams.find(t => t.teamId === teamId);
          if (team) {
            team.score += 10; // example score increment
            await session.save();
            
            // Score update back to admin (Requirement 4302) and display client (Requirement 3005)
            io.to(gameCode).emit('score_update', { teams: session.teams });
            io.to(gameCode).emit('scoreboard_broadcast', { teams: session.teams });
          }
        }
      } catch (err) {
        console.error('Error handling answer:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
      // Clean up/mark inactive if necessary
    });
  });
};
