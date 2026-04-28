import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { connectSocket, disconnectSocket, getSocket } from '../socket'

export default function ActiveGame() {
  const { gameCode } = useParams()
  const navigate = useNavigate()
  
  const [teams, setTeams] = useState([])
  const [questionIndex, setQuestionIndex] = useState(-1)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [activeQuestion, setActiveQuestion] = useState(null)
  const [isConfirmingStop, setIsConfirmingStop] = useState(false)
  
  const [status, setStatus] = useState('lobby')
  const [showIntermediateScoreboard, setShowIntermediateScoreboard] = useState(false)
  const [currentAnswers, setCurrentAnswers] = useState([])
  
  useEffect(() => {
    const socket = connectSocket()

    socket.emit('admin_join', { gameCode })

    socket.on('admin_sync', (data) => {
      if (data) {
        if (data.teams) setTeams(data.teams)
        if (data.currentQuestionIndex !== undefined) setQuestionIndex(data.currentQuestionIndex)
        if (data.totalQuestions !== undefined) setTotalQuestions(data.totalQuestions)
        if (data.activeQuestion) setActiveQuestion(data.activeQuestion)
        if (data.status) setStatus(data.status)
        if (data.showIntermediateScoreboard !== undefined) setShowIntermediateScoreboard(data.showIntermediateScoreboard)
        if (data.currentAnswers) setCurrentAnswers(data.currentAnswers)
      }
    })

    socket.on('scoreboard_broadcast', (data) => {
      if (data && data.teams) setTeams(data.teams)
    })

    socket.on('score_update', (data) => {
      if (data && data.teams) setTeams(data.teams)
    })

    socket.on('question_broadcast', (data) => {
      setActiveQuestion(data)
      setStatus('active')
      setCurrentAnswers([])
    })

    socket.on('player_answered', (data) => {
      setCurrentAnswers(prev => {
        // Update or add the answer
        const existingIdx = prev.findIndex(a => a.teamId === data.teamId);
        if (existingIdx >= 0) {
          const newArr = [...prev];
          newArr[existingIdx] = { ...newArr[existingIdx], ...data };
          return newArr;
        }
        return [...prev, data];
      });
    })
    
    socket.on('all_answered', () => {
       // Could be used for specific animation if needed
    })
    
    socket.on('intermediate_broadcast', () => {
       setStatus('intermediate')
       setCurrentAnswers([]) // They've been applied
    })

    return () => {
      socket.off('admin_sync')
      socket.off('scoreboard_broadcast')
      socket.off('score_update')
      socket.off('question_broadcast')
      socket.off('player_answered')
      socket.off('all_answered')
      socket.off('intermediate_broadcast')
    }
  }, [gameCode])

  const handleNextAction = () => {
    const socket = getSocket()
    if (!socket) return

    if (showIntermediateScoreboard && status === 'active') {
      socket.emit('show_intermediate_scoreboard', { gameCode })
    } else {
      const nextIdx = questionIndex + 1
      socket.emit('trigger_question', { gameCode, questionIndex: nextIdx })
      setQuestionIndex(nextIdx)
    }
  }

  const handleEndGame = () => {
    const socket = getSocket()
    if (socket) {
      socket.emit('end_game', { gameCode })
    }
    navigate('/')
  }

  const allAnswered = teams.length > 0 && currentAnswers.length >= teams.length;
  
  let nextButtonText = 'NEXT QUESTION';
  if (questionIndex === -1) nextButtonText = 'START GAME';
  else if (showIntermediateScoreboard && status === 'active') nextButtonText = 'SHOW RESULTS';
  
  let nextButtonClass = 'btn';
  if (status === 'active' && allAnswered) {
    nextButtonClass = 'btn btn-success'; // turns green
  }

  return (
    <div style={{ width: '100%', maxWidth: '900px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ margin: 0 }}>Live Game Monitor</h2>
          <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-secondary)' }}>
            Join Code: <span className="game-code" style={{ fontSize: '1.5rem', marginLeft: '0.5rem' }}>{gameCode}</span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {totalQuestions > 0 && questionIndex >= totalQuestions - 1 && (!showIntermediateScoreboard || status === 'intermediate') ? (
            <button onClick={handleEndGame} className="btn" style={{ width: 'auto', background: 'var(--accent-color)', color: 'white' }}>
              FINISH GAME
            </button>
          ) : (
            <>
              <button onClick={handleNextAction} className={nextButtonClass} style={{ width: 'auto' }}>
                {nextButtonText}
              </button>
              {isConfirmingStop ? (
                <button onClick={handleEndGame} className="btn btn-danger" style={{ width: 'auto', animation: 'fadeIn 0.2s ease-in' }}>
                  AGREE & STOP
                </button>
              ) : (
                <button onClick={() => setIsConfirmingStop(true)} className="btn btn-danger" style={{ width: 'auto', opacity: 0.9 }}>
                  STOP
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexDirection: 'column' }}>
        {/* Active Question Panel */}
        <div className="glass-card" style={{ maxWidth: '100%' }}>
          <h3 style={{ marginTop: 0 }}>Current Question</h3>
          {totalQuestions > 0 && questionIndex >= totalQuestions ? (
             <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', textAlign: 'center', margin: '2rem 0' }}>Game Completed - All Questions Answered. Please finish the game.</p>
          ) : activeQuestion ? (
            <div>
              <span style={{ fontSize: '0.9rem', color: 'var(--accent-color)', fontWeight: 'bold' }}>{activeQuestion.category}</span>
              <p style={{ fontSize: '1.25rem', marginTop: '0.5rem' }}>{activeQuestion.question}</p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                {activeQuestion.choices.map((choice, i) => (
                  <div key={i} style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>
                    {choice}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>Waiting to start...</p>
          )}
        </div>

        {/* Participants Panel */}
        <div className="glass-card" style={{ maxWidth: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0 }}>Participants ({teams.length})</h3>
            {status === 'active' && (
               <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                 Answers: {currentAnswers.length} / {teams.length}
               </span>
            )}
          </div>
          
          {teams.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', marginTop: '2rem', textAlign: 'center' }}>No teams have joined yet. Tell them to enter code {gameCode}!</p>
          ) : (
            <ul className="team-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              {teams.sort((a,b) => b.score - a.score).map((team) => {
                const answerRecord = currentAnswers.find(a => a.teamId === team.teamId);
                let bgColor = 'var(--glass-bg)';
                
                if (status === 'active' && answerRecord) {
                  // Turn green if correct, red if incorrect
                  bgColor = answerRecord.isCorrect ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)';
                }

                return (
                  <li key={team.teamId} className="team-card" style={{ background: bgColor, border: '1px solid var(--glass-border)', transition: 'all 0.3s ease' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 'bold' }}>{team.name}</span>
                      <span className="team-score" style={{ color: 'var(--accent-color)' }}>{team.score} PTS</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
