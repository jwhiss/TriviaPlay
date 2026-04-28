const GameSession = require('../models/GameSession');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // Display joins a game
    socket.on('display_join', async (data) => {
      const { gameCode } = data;
      socket.join(gameCode);
      
      try {
        const session = await GameSession.findOne({ gameCode }).populate('questions');
        if (session) {
          socket.emit('display_sync', {
            teams: session.teams,
            status: session.status,
            totalQuestions: session.questions.length,
            currentQuestionIndex: session.currentQuestionIndex,
            activeQuestion: (session.currentQuestionIndex > -1 && session.questions[session.currentQuestionIndex]) ? {
              question: session.questions[session.currentQuestionIndex].question,
              category: session.questions[session.currentQuestionIndex].category,
              choices: [session.questions[session.currentQuestionIndex].correctAnswer, ...session.questions[session.currentQuestionIndex].incorrectAnswers].sort(() => Math.random() - 0.5)
            } : null
          });
        } else {
          socket.emit('join_error', { message: 'Invalid Game Code. Please check and try again.' });
        }
      } catch (err) {
        console.error('Display sync error:', err);
        socket.emit('join_error', { message: 'An error occurred while connecting.' });
      }
    });

    // Admin joins a game room
    socket.on('admin_join', async (data) => {
      const { gameCode } = data;
      socket.join(gameCode);
      
      try {
        const session = await GameSession.findOne({ gameCode }).populate('questions');
        if (session) {
          socket.emit('admin_sync', {
            teams: session.teams,
            status: session.status,
            showIntermediateScoreboard: session.showIntermediateScoreboard,
            currentAnswers: session.currentAnswers,
            currentQuestionIndex: session.currentQuestionIndex,
            totalQuestions: session.questions.length,
            activeQuestion: (session.currentQuestionIndex > -1 && session.questions[session.currentQuestionIndex]) ? {
              question: session.questions[session.currentQuestionIndex].question,
              category: session.questions[session.currentQuestionIndex].category,
              choices: [session.questions[session.currentQuestionIndex].correctAnswer, ...session.questions[session.currentQuestionIndex].incorrectAnswers].sort(() => Math.random() - 0.5)
            } : null
          });
        }
      } catch (err) {
        console.error('Admin sync error:', err);
      }
    });

    // Admin ends game
    socket.on('end_game', async (data) => {
      const { gameCode } = data;
      try {
        const session = await GameSession.findOne({ gameCode });
        if (session) {
          session.status = 'finished';
          await session.save();
          io.to(gameCode).emit('game_ended', { message: 'The game has been ended by the host. Thank you for playing!', teams: session.teams });
        }
      } catch (err) {
        console.error('End game error:', err);
      }
    });

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

        // Apply any pending points if they weren't applied yet
        let pointsApplied = false;
        if (session.currentAnswers && session.currentAnswers.length > 0) {
          session.currentAnswers.forEach(ans => {
            if (ans.pointsAwarded > 0) {
              const team = session.teams.find(t => t.teamId === ans.teamId);
              if (team) {
                team.score += ans.pointsAwarded;
                pointsApplied = true;
              }
            }
          });
        }
        
        // Reset current answers for the new question
        session.currentAnswers = [];
        session.currentQuestionIndex = questionIndex;
        session.status = 'active';
        session.questionStartTime = new Date();
        await session.save();

        if (pointsApplied) {
           io.to(gameCode).emit('score_update', { teams: session.teams });
        }

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
        
        let isCorrect = false;
        let pointsAwarded = 0;
        let timeTakenMs = 0;

        const currentQ = session.questions[session.currentQuestionIndex];
        if (currentQ && currentQ.correctAnswer === answer) {
          isCorrect = true;
          pointsAwarded = 10;
          if (session.questionStartTime) {
            const timeLimitMillis = (session.questionResponseTimeLimit || 30) * 1000;
            timeTakenMs = Date.now() - session.questionStartTime.getTime();
            
            if (timeTakenMs < timeLimitMillis) {
              const speedBonus = 10 * (1 - (timeTakenMs / timeLimitMillis));
              pointsAwarded += Math.max(0, Math.round(speedBonus));
            }
          }
        }

        // Add to current answers buffer
        session.currentAnswers.push({
          teamId,
          answer,
          isCorrect,
          timeTakenMs,
          pointsAwarded
        });
        await session.save();

        // Broadcast player_answered to clients
        io.to(gameCode).emit('player_answered', { teamId, isCorrect });

        // Check if all players have answered
        if (session.currentAnswers.length >= session.teams.length) {
          io.to(gameCode).emit('all_answered');
        }
      } catch (err) {
        console.error('Error handling answer:', err);
      }
    });

    // Admin shows intermediate scoreboard
    socket.on('show_intermediate_scoreboard', async (data) => {
      const { gameCode } = data;
      try {
        const session = await GameSession.findOne({ gameCode });
        if (!session) return;

        // Apply pending points
        if (session.currentAnswers && session.currentAnswers.length > 0) {
          session.currentAnswers.forEach(ans => {
            if (ans.pointsAwarded > 0) {
              const team = session.teams.find(t => t.teamId === ans.teamId);
              if (team) {
                team.score += ans.pointsAwarded;
              }
            }
          });
        }
        
        session.status = 'intermediate';
        await session.save();

        io.to(gameCode).emit('score_update', { teams: session.teams });
        io.to(gameCode).emit('scoreboard_broadcast', { teams: session.teams });
        
        io.to(gameCode).emit('intermediate_broadcast', { 
          teams: session.teams, 
          answers: session.currentAnswers 
        });

        // Clear currentAnswers now that they've been applied and broadcasted
        session.currentAnswers = [];
        await session.save();
      } catch (err) {
        console.error('Error showing intermediate scoreboard:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
      // Clean up/mark inactive if necessary
    });
  });
};
