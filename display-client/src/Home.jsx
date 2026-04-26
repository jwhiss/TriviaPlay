import React, { useState } from 'react';

const Home = ({ onConnect, error }) => {
  const [code, setCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.trim().length > 0) {
      onConnect(code.trim().toUpperCase());
    }
  };

  return (
    <div className="container">
      <div className="glass-panel" style={{ textAlign: 'center' }}>
        <h1 className="title" style={{ fontSize: '3rem', marginBottom: '20px' }}>TriviaPlay Display</h1>
        <p className="subtitle" style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
          Enter the Game Code to connect this display screen.
        </p>
        
        {error && (
          <div style={{ color: 'var(--danger)', marginBottom: '20px', padding: '10px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '300px', margin: '0 auto' }}>
          <input
            type="text"
            className="glass-input"
            placeholder="Game Code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            style={{ fontSize: '2rem', textAlign: 'center', letterSpacing: '4px', padding: '16px' }}
            maxLength={6}
            autoComplete="off"
            required
          />
          <button 
            type="submit" 
            className="glass-button" 
            disabled={code.trim().length === 0}
            style={{ fontSize: '1.2rem', padding: '15px' }}
          >
            Connect Screen
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
