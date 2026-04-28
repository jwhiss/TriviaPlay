import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createGame, getCategories, getQuestions } from '../api'

export default function GameConfig() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState([])
  const [allQuestions, setAllQuestions] = useState([])
  
  const [isCustomGame, setIsCustomGame] = useState(false)
  const [showIntermediateScoreboard, setShowIntermediateScoreboard] = useState(false)
  
  const [formData, setFormData] = useState({
    name: 'Trivia Night Special',
    questionResponseTimeLimit: 30,
    maxTeams: 50,
    category: 'Any',
    difficulty: 'Any',
    type: 'Any',
    numQuestions: 10
  })

  const [selectedQuestionIds, setSelectedQuestionIds] = useState([])
  const [showSelectedModal, setShowSelectedModal] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
        const qs = await getQuestions();
        setAllQuestions(qs);
      } catch (err) {
        console.error('Failed to fetch data', err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'name' || name === 'category' || name === 'difficulty' || name === 'type') ? value : Number(value)
    }))
  }

  const toggleQuestionSelection = (id) => {
    setSelectedQuestionIds(prev => 
      prev.includes(id) ? prev.filter(qId => qId !== id) : [...prev, id]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payload = {
        ...formData,
        isCustomGame,
        showIntermediateScoreboard,
        questionIds: selectedQuestionIds
      }
      const data = await createGame(payload)
      navigate(`/game/${data.session.gameCode}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate game session')
    } finally {
      setLoading(false)
    }
  }

  // filter custom questions if we want
  const filteredQuestions = allQuestions.filter(q => {
    if (formData.category !== 'Any' && q.category !== formData.category) return false;
    if (formData.difficulty !== 'Any' && q.difficulty !== formData.difficulty) return false;
    if (formData.type !== 'Any' && q.type !== formData.type) return false;
    return true;
  });

  return (
    <div className="glass-card" style={{ alignSelf: 'center', width: '100%', maxWidth: '800px', marginBottom: '80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0 }}>Configure Game</h2>
        <button onClick={() => navigate('/')} className="btn-secondary" style={{ padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
      </div>

      {error && <div style={{ color: 'var(--danger-color)', marginBottom: '1rem', padding: '0.5rem', background: 'rgba(255, 51, 102, 0.1)', borderRadius: '4px' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: '1 1 45%' }}>
            <label>Display Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group" style={{ flex: '1 1 45%' }}>
            <label>Time Limit for Speed Bonus (seconds)</label>
            <select name="questionResponseTimeLimit" value={formData.questionResponseTimeLimit} onChange={handleChange}>
              <option value="15">15 Seconds</option>
              <option value="30">30 Seconds</option>
              <option value="45">45 Seconds</option>
              <option value="60">60 Seconds</option>
            </select>
          </div>

          <div className="form-group" style={{ flex: '1 1 45%' }}>
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
          
          <div className="form-group" style={{ flex: '1 1 45%', display: 'flex', alignItems: 'center' }}>
             <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '10px', marginTop: '1.5rem' }}>
               <input 
                 type="checkbox" 
                 checked={showIntermediateScoreboard} 
                 onChange={(e) => setShowIntermediateScoreboard(e.target.checked)}
                 style={{ width: 'auto', height: '1.2rem' }}
               />
               Enable Intermediate Scoreboard
             </label>
          </div>
        </div>
        
        <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '2rem 0' }} />

        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
           <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '1.1rem' }}>
             <input type="radio" name="gameType" checked={!isCustomGame} onChange={() => setIsCustomGame(false)} />
             Random Selection
           </label>
           <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '1.1rem' }}>
             <input type="radio" name="gameType" checked={isCustomGame} onChange={() => setIsCustomGame(true)} />
             Custom Selection
           </label>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <div className="form-group" style={{ flex: '1 1 20%' }}>
              <label>Category Filter</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                <option value="Any">Any / All</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ flex: '1 1 20%' }}>
              <label>Difficulty Filter</label>
              <select name="difficulty" value={formData.difficulty} onChange={handleChange}>
                <option value="Any">Any / All</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div className="form-group" style={{ flex: '1 1 20%' }}>
              <label>Type Filter</label>
              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="Any">Any / All</option>
                <option value="multiple">Multiple Choice</option>
                <option value="boolean">True / False</option>
              </select>
            </div>
            
            {!isCustomGame && (
              <div className="form-group" style={{ flex: '1 1 20%' }}>
                <label># of Questions</label>
                <input
                  type="number"
                  name="numQuestions"
                  value={formData.numQuestions}
                  onChange={handleChange}
                  min="1"
                  max="50"
                  required={!isCustomGame}
                />
              </div>
            )}
        </div>

        {isCustomGame && (
           <div style={{ maxHeight: '400px', overflowY: 'auto', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
              {filteredQuestions.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No questions match filters.</p>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {filteredQuestions.map(q => (
                    <li key={q._id} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                       <input 
                         type="checkbox" 
                         checked={selectedQuestionIds.includes(q._id)} 
                         onChange={() => toggleQuestionSelection(q._id)} 
                         style={{ marginTop: '0.3rem' }}
                       />
                       <div>
                         <p style={{ margin: '0 0 0.3rem 0', fontWeight: 'bold' }}>{q.question}</p>
                         <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                           <span>Cat: {q.category}</span>
                           <span>Diff: {q.difficulty}</span>
                           <span>Type: {q.type}</span>
                         </div>
                       </div>
                    </li>
                  ))}
                </ul>
              )}
           </div>
        )}

        <button type="submit" className="btn" disabled={loading || (isCustomGame && selectedQuestionIds.length === 0)} style={{ marginTop: '1rem', width: '100%' }}>
          {loading ? 'Generating...' : 'CREATE GAME'}
        </button>
      </form>
      
      {/* Footer for selected questions */}
      {isCustomGame && (
        <div 
          style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'var(--glass-bg)', borderTop: '1px solid var(--glass-border)', padding: '1rem', display: 'flex', justifyContent: 'center', backdropFilter: 'blur(10px)', zIndex: 100, cursor: 'pointer' }}
          onClick={() => setShowSelectedModal(true)}
        >
           <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{selectedQuestionIds.length} Questions Selected (Click to view)</span>
        </div>
      )}

      {/* Selected Questions Modal */}
      {showSelectedModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '2rem' }}>
           <div className="glass-card" style={{ width: '100%', maxWidth: '600px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0 }}>Selected Questions</h3>
                <button onClick={() => setShowSelectedModal(false)} className="btn-secondary" style={{ padding: '0.3rem 0.8rem' }}>Close</button>
              </div>
              <div style={{ overflowY: 'auto', flex: 1, paddingRight: '1rem' }}>
                {selectedQuestionIds.length === 0 ? <p>No questions selected.</p> : (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {allQuestions.filter(q => selectedQuestionIds.includes(q._id)).map(q => (
                      <li key={q._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                         <span style={{ flex: 1, marginRight: '1rem' }}>{q.question}</span>
                         <button onClick={() => toggleQuestionSelection(q._id)} className="btn-danger" style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}>Remove</button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
           </div>
        </div>
      )}
    </div>
  )
}
