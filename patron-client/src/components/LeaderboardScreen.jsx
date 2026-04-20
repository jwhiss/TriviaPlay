export default function LeaderboardScreen({ teams, message, gameCode }) {
  // Sort teams by score descending
  const sortedTeams = [...(teams || [])].sort((a, b) => b.score - a.score)

  return (
    <div className="screen-container">
      <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Game Ended</h2>
        {message && <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem' }}>{message}</p>}
        
        <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Final Leaderboard</h3>
        
        {sortedTeams.length > 0 ? (
          <ul className="team-list">
            {sortedTeams.map((team, index) => (
              <li key={team.teamId} className="team-card" style={{
                background: index === 0 ? 'rgba(var(--accent-color-rgb, 255,107,107), 0.2)' : 'rgba(255,255,255,0.05)',
                border: index === 0 ? '1px solid var(--accent-color)' : '1px solid rgba(255,255,255,0.1)',
                transform: index === 0 ? 'scale(1.02)' : 'none',
                zIndex: index === 0 ? 1 : 0
              }}>
                <span style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ 
                    display: 'inline-block', 
                    width: '24px', 
                    height: '24px', 
                    borderRadius: '50%', 
                    background: index === 0 ? 'var(--accent-color)' : 'rgba(255,255,255,0.2)',
                    textAlign: 'center',
                    lineHeight: '24px',
                    fontSize: '0.8rem'
                  }}>
                    {index + 1}
                  </span>
                  {team.name}
                  {index === 0 && <span style={{ marginLeft: '0.5rem' }}>🏆</span>}
                </span>
                <span className="team-score" style={{ 
                  color: index === 0 ? 'var(--accent-color)' : 'var(--text-primary)',
                  fontWeight: index === 0 ? 'bold' : 'normal'
                }}>{team.score} PTS</span>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No teams played.</p>
        )}
        
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
           <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Thanks for playing!</p>
        </div>
      </div>
    </div>
  )
}
