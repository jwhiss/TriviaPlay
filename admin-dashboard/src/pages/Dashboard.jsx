import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getGames } from '../api'

export default function Dashboard() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const data = await getGames()
        setGames(data)
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem('adminToken')
          navigate('/login')
        }
        console.error('Failed to fetch games', err)
      } finally {
        setLoading(false)
      }
    }
    fetchGames()
  }, [navigate])

  return (
    <div style={{ width: '100%', maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Host Dashboard</h2>
        <button onClick={() => navigate('/config')} className="btn" style={{ width: 'auto' }}>
          + New Game
        </button>
      </div>

      <div className="glass-card" style={{ maxWidth: '100%' }}>
        <h3 style={{ marginTop: 0 }}>Recent Sessions</h3>
        {loading ? (
          <p style={{ color: 'var(--text-secondary)' }}>Loading games...</p>
        ) : games.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No games found. Create one to get started!</p>
        ) : (
          <div className="game-list">
            {games.map(game => (
              <div key={game._id} className="game-item">
                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0' }}>{game.name}</h4>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Status: <strong style={{ color: game.status === 'active' ? 'var(--accent-color)' : 'inherit' }}>{game.status.toUpperCase()}</strong>
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span className="game-code">{game.gameCode}</span>
                  <button 
                    onClick={() => navigate(`/game/${game.gameCode}`)}
                    className="btn btn-secondary" 
                    style={{ width: 'auto', padding: '0.4rem 1rem' }}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
