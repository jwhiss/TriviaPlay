import { useState } from 'react';

export default function JoinScreen({ onJoin, error }) {
  const [gameCode, setGameCode] = useState('');
  const [name, setName] = useState('');

  const handleJoin = (e) => {
    e.preventDefault();
    if (gameCode && name) {
      onJoin(gameCode.toUpperCase(), name);
    }
  };

  return (
    <div className="glass-panel animate-fade-in">
      <h1 className="title">Trivia Play</h1>
      <p className="subtitle">Join the game and play from your phone!</p>
      
      {error && (
        <div style={{ color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '8px', marginBottom: '16px', textAlign: 'center', fontSize: '0.9rem', fontWeight: '500' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleJoin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <input 
            type="text" 
            className="glass-input" 
            placeholder="Game Code (e.g. A1B2C3)" 
            value={gameCode}
            onChange={(e) => setGameCode(e.target.value)}
            maxLength={6}
            required
            autoComplete="off"
          />
        </div>
        <div>
          <input 
            type="text" 
            className="glass-input" 
            placeholder="Team Name / Player Name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            required
            autoComplete="off"
          />
        </div>
        <button type="submit" className="glass-button" disabled={!gameCode || !name}>
          Join Game
        </button>
      </form>
    </div>
  );
}
