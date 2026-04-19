import { useState, useEffect } from 'react'
import { socket } from './socket'
import './App.css'
import JoinScreen from './components/JoinScreen'
import WaitingScreen from './components/WaitingScreen'
import QuestionScreen from './components/QuestionScreen'

function App() {
  const [gameState, setGameState] = useState('JOIN') // JOIN, WAITING, PLAYING, SUBMITTED_PENDING, SUBMITTED
  const [teamInfo, setTeamInfo] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)

  useEffect(() => {
    socket.connect()

    socket.on('join_confirmation', (data) => {
      setTeamInfo(data)
      setGameState('WAITING')
      setErrorMsg(null)
    })

    socket.on('join_error', (data) => {
      setErrorMsg(data.message || 'Failed to join game.')
    })

    socket.on('question_broadcast', (data) => {
      setCurrentQuestion(data)
      setGameState('PLAYING')
    })

    socket.on('answer_acknowledgement', () => {
      setGameState('SUBMITTED')
    })

    socket.on('scoreboard_broadcast', () => {
      // Background scoreboard updates shouldn't pull players out of PLAYING or SUBMITTED states.
    })

    socket.on('game_ended', (data) => {
      setGameState('JOIN')
      setTeamInfo(null)
      setCurrentQuestion(null)
      setErrorMsg(data.message || 'The host ended the game.')
    })

    return () => {
      socket.off('join_confirmation')
      socket.off('join_error')
      socket.off('question_broadcast')
      socket.off('answer_acknowledgement')
      socket.off('scoreboard_broadcast')
      socket.off('game_ended')
    }
  }, [])

  const handleJoin = (gameCode, name) => {
    setErrorMsg(null)
    socket.emit('patron_join', { gameCode, name })
  }

  const handleAnswer = (answer) => {
    if (teamInfo) {
      socket.emit('answer_submission', { 
        gameCode: teamInfo.gameCode, 
        teamId: teamInfo.teamId, 
        answer 
      })
    }
    setGameState('SUBMITTED_PENDING')
  }

  return (
    <div className="container">
      {gameState === 'JOIN' && <JoinScreen onJoin={handleJoin} error={errorMsg} />}
      {gameState === 'WAITING' && <WaitingScreen message="Waiting for host to start..." />}
      {gameState === 'PLAYING' && <QuestionScreen question={currentQuestion} onAnswer={handleAnswer} />}
      {gameState === 'SUBMITTED_PENDING' && <WaitingScreen message="Submitting answer..." />}
      {gameState === 'SUBMITTED' && <WaitingScreen message="Answer received! Waiting for next question..." />}
    </div>
  )
}

export default App
