import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { connectSocket, disconnectSocket, getSocket } from '../socket'

export default function ActiveGame() {
  const { gameCode } = useParams()
  const navigate = useNavigate()
  
  const [teams, setTeams] = useState([])
  const [questionIndex, setQuestionIndex] = useState(-1)
  const [activeQuestion, setActiveQuestion] = useState(null)
  
  useEffect(() => {
    const socket = connectSocket()

    // Emit admin join to get placed in the gameCode room and receive sync payload
    socket.emit('admin_join', { gameCode })

    // Hydrate state from server upon initial join
    socket.on('admin_sync', (data) => {
      if (data) {
        if (data.teams) setTeams(data.teams)
        if (data.currentQuestionIndex !== undefined) setQuestionIndex(data.currentQuestionIndex)
        if (data.activeQuestion) setActiveQuestion(data.activeQuestion)
      }
    })

    // Listen for scoreboard updates
    socket.on('scoreboard_broadcast', (data) => {
      if (data && data.teams) setTeams(data.teams)
    })

    socket.on('score_update', (data) => {
      if (data && data.teams) setTeams(data.teams)
    })

    // Listen for question push (to mirror what display sees)
    socket.on('question_broadcast', (data) => {
      setActiveQuestion(data)
    })

    return () => {
      // Don't disconnect immediately if we want persistent sockets, 
      // but usually clean up listeners here.
      socket.off('admin_sync')
      socket.off('scoreboard_broadcast')
      socket.off('score_update')
      socket.off('question_broadcast')
      // disconnectSocket() // optionally disconnect on unmount
    }
  }, [gameCode])

  const handleNextQuestion = () => {
    const socket = getSocket()
    if (socket) {
      const nextIdx = questionIndex + 1
      socket.emit('trigger_question', { gameCode, questionIndex: nextIdx })
      setQuestionIndex(nextIdx)
    }
  }

  const handleEndGame = () => {
    if (window.confirm('Are you sure you want to end this game session?')) {
      const socket = getSocket()
      if (socket) {
        socket.emit('end_game', { gameCode })
      }
      navigate('/')
    }
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
          <button onClick={handleNextQuestion} className="btn" style={{ width: 'auto' }}>
            {questionIndex === -1 ? 'START GAME' : 'NEXT QUESTION'}
          </button>
          <button onClick={handleEndGame} className="btn btn-danger" style={{ width: 'auto' }}>
            STOP
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexDirection: 'column' }}>
        {/* Active Question Panel */}
        <div className="glass-card" style={{ maxWidth: '100%' }}>
          <h3 style={{ marginTop: 0 }}>Current Question</h3>
          {activeQuestion ? (
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>Participants ({teams.length})</h3>
          </div>
          
          {teams.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', marginTop: '2rem', textAlign: 'center' }}>No teams have joined yet. Tell them to enter code {gameCode}!</p>
          ) : (
            <ul className="team-list">
              {teams.sort((a,b) => b.score - a.score).map((team) => (
                <li key={team.teamId} className="team-card">
                  <span style={{ fontWeight: 'bold' }}>{team.name}</span>
                  <span className="team-score">{team.score} PTS</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
