import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createGame, getCategories } from '../api'

export default function GameConfig() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState([])

  const [formData, setFormData] = useState({
    name: 'Trivia Night Special',
    questionResponseTimeLimit: 30,
    maxTeams: 50,
    category: 'Any',
  })

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'name' ? value : Number(value)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const data = await createGame(formData)
      navigate(`/game/${data.session.gameCode}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate game session')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-card" style={{ alignSelf: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0 }}>Configure Game</h2>
        <button onClick={() => navigate('/')} className="btn-secondary" style={{ padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
      </div>

      {error && <div style={{ color: 'var(--danger-color)', marginBottom: '1rem', padding: '0.5rem', background: 'rgba(255, 51, 102, 0.1)', borderRadius: '4px' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Display Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Time Limit for Speed Bonus (seconds)</label>
          <select name="questionResponseTimeLimit" value={formData.questionResponseTimeLimit} onChange={handleChange}>
            <option value="15">15 Seconds</option>
            <option value="30">30 Seconds</option>
            <option value="45">45 Seconds</option>
            <option value="60">60 Seconds</option>
          </select>
        </div>

        <div className="form-group">
          <label>Max Teams Allowed</label>
          <input
            type="number"
            name="maxTeams"
            value={formData.maxTeams}
            onChange={handleChange}
            min="1"
            max="200"
            required
          />
        </div>

        <div className="form-group">
          <label>Question Category</label>
          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="Any">Any Category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn" disabled={loading} style={{ marginTop: '1rem' }}>
          {loading ? 'Generating...' : 'CREATE GAME'}
        </button>
      </form>
    </div>
  )
}
