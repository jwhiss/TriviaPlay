import React, { useState, useEffect } from 'react';
import { socket } from './socket';
import QRCode from 'react-qr-code';
import { Users, Trophy } from 'lucide-react';

const DisplayBoard = ({ gameCode }) => {
  const [status, setStatus] = useState('connecting'); // connecting, lobby, active, scoreboard, finished
  const [teams, setTeams] = useState([]);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [message, setMessage] = useState('');

  const patronUrl = import.meta.env.VITE_PATRON_URL || 'http://localhost:5173';
  const joinUrl = `${patronUrl}/?game=${gameCode}`;

  useEffect(() => {
    socket.connect();
    socket.emit('display_join', { gameCode });

    socket.on('display_sync', (data) => {
      setStatus(data.status || 'lobby');
      setTeams(data.teams || []);
      setActiveQuestion(data.activeQuestion || null);
    });

    socket.on('scoreboard_broadcast', (data) => {
      setTeams(data.teams || []);
      if (!activeQuestion) {
        // If there's no active question but we got a scoreboard broadcast, update list
      }
    });

    socket.on('score_update', (data) => {
      setTeams(data.teams || []);
    });

    socket.on('question_broadcast', (data) => {
      setActiveQuestion(data);
      setStatus('active');
    });

    socket.on('game_ended', (data) => {
      setStatus('finished');
      setTeams(data.teams || []);
      setMessage(data.message || 'Game Over');
    });

    return () => {
      socket.off('display_sync');
      socket.off('scoreboard_broadcast');
      socket.off('score_update');
      socket.off('question_broadcast');
      socket.off('game_ended');
    };
  }, [gameCode, activeQuestion]);

  if (status === 'connecting') {
    return (
      <div className="container" style={{ textAlign: 'center', justifyContent: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <h2 className="title animate-fade-in">Connecting to Game...</h2>
        <div className="spinner"></div>
      </div>
    );
  }

  // Lobby rendering
  if (status === 'lobby') {
    return (
      <div className="display-container animate-fade-in" style={{ padding: '60px', height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div className="glass-panel" style={{ flexGrow: 1, display: 'flex', flexDirection: 'row', gap: '40px', alignItems: 'center', justifyContent: 'center' }}>
          
          <div style={{ flex: 1, textAlign: 'center' }}>
            <h1 className="title" style={{ fontSize: '5rem', marginBottom: '20px' }}>Join the Game!</h1>
            <p className="subtitle" style={{ fontSize: '2rem' }}>Scan the QR code or visit:</p>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-blue)', margin: '20px 0' }}>{patronUrl}</p>
            <p className="subtitle" style={{ fontSize: '1.5rem' }}>And enter code:</p>
            <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '16px', padding: '20px', display: 'inline-block', border: '2px solid var(--glass-border)' }}>
              <span style={{ fontSize: '7rem', fontWeight: '900', letterSpacing: '8px', color: 'white' }}>{gameCode}</span>
            </div>
          </div>
          
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ background: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
              <QRCode value={joinUrl} size={400} />
            </div>
          </div>
          
        </div>

        <div className="glass-panel" style={{ marginTop: '40px', textAlign: 'center', padding: '30px' }}>
          <h2 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
            <Users size={36} color="var(--accent-purple)" /> 
            Waiting for players... ({teams.length} Joined)
          </h2>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '20px' }}>
            {teams.map((t, idx) => (
              <span key={idx} style={{ background: 'var(--glass-bg)', padding: '10px 20px', borderRadius: '30px', fontSize: '1.2rem', fontWeight: '600' }}>
                {t.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Active Question or finished
  return (
    <div className="display-container" style={{ padding: '40px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Bar with Game Code */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }} className="animate-fade-in">
        <div className="glass-panel" style={{ padding: '10px 30px', borderRadius: '30px', display: 'flex', gap: '15px', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-muted)' }}>Join at {patronUrl} with code:</span>
          <strong style={{ fontSize: '1.8rem', letterSpacing: '2px' }}>{gameCode}</strong>
        </div>
      </div>

      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'row', gap: '40px' }}>
        
        {/* Main Content Area */}
        <div style={{ flex: 3, display: 'flex', flexDirection: 'column' }}>
          {status === 'active' && activeQuestion ? (
            <div className="glass-panel animate-fade-in" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: '30px' }}>
                <span style={{ padding: '8px 16px', background: 'var(--accent-purple)', borderRadius: '20px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                  {activeQuestion.category}
                </span>
              </div>
              <h2 className="title" style={{ fontSize: '4rem', textAlign: 'left', lineHeight: '1.2', flexGrow: 1 }}>
                {activeQuestion.question}
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: 'auto' }}>
                {activeQuestion.choices.map((choice, idx) => (
                  <div key={idx} className="choice-button" style={{ fontSize: '2rem', padding: '30px', textAlign: 'center', cursor: 'default' }}>
                    {choice}
                  </div>
                ))}
              </div>
            </div>
          ) : status === 'finished' ? (
            <div className="glass-panel animate-fade-in" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
               <Trophy size={100} color="#FBBF24" style={{ marginBottom: '30px' }} />
               <h1 className="title" style={{ fontSize: '5rem', marginBottom: '20px' }}>Game Over</h1>
               <p style={{ fontSize: '2rem', color: 'var(--text-muted)' }}>{message}</p>
            </div>
          ) : (
             <div className="glass-panel animate-fade-in" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
               <h1 className="title" style={{ fontSize: '4rem' }}>Wait for next question...</h1>
            </div>
          )}
        </div>

        {/* Scoreboard Sidebar */}
        <div className="glass-panel animate-fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <h3 style={{ fontSize: '2rem', marginBottom: '30px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Trophy size={28} color="var(--accent-blue)" /> Leaderboard
          </h3>
          <div style={{ overflowY: 'auto', flexGrow: 1, paddingRight: '10px' }}>
            {[...teams].sort((a,b) => b.score - a.score).map((team, idx) => (
              <div key={idx} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '20px 25px', 
                background: idx === 0 ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.05)',
                borderRadius: '16px',
                marginBottom: '15px',
                border: idx === 0 ? '1px solid var(--accent-blue)' : '1px solid transparent',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: idx === 0 ? '#FBBF24' : 'var(--text-muted)' }}>#{idx + 1}</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{team.name}</span>
                </div>
                <span style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--accent-blue)' }}>{team.score}</span>
              </div>
            ))}
            {teams.length === 0 && (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '20px' }}>No teams joined yet.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DisplayBoard;
