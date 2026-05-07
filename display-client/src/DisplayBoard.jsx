import React, { useState, useEffect } from 'react';
import { socket } from './socket';
import { QRCodeSVG } from 'qrcode.react';
import { Users, Trophy, CheckCircle, XCircle } from 'lucide-react';

const DisplayBoard = ({ gameCode, onError }) => {
  const [status, setStatus] = useState('connecting'); // connecting, lobby, active, intermediate, finished
  const [teams, setTeams] = useState([]);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [message, setMessage] = useState('');
  
  const [answeredTeams, setAnsweredTeams] = useState(new Set());
  const [roundResults, setRoundResults] = useState([]); // from intermediate_broadcast

  const patronUrl = import.meta.env.VITE_PATRON_URL || 'http://localhost:5173';
  const joinUrl = `${patronUrl}/?game=${gameCode}`;

  useEffect(() => {
    socket.connect();
    socket.emit('display_join', { gameCode });

    socket.on('display_sync', (data) => {
      setStatus(data.status || 'lobby');
      setTeams(data.teams || []);
      setActiveQuestion(data.activeQuestion || null);
      if (data.currentAnswers) {
        setAnsweredTeams(new Set(data.currentAnswers.map(a => a.teamId)));
      }
    });

    socket.on('join_error', (data) => {
      if (onError) onError(data.message || 'Failed to connect to Game Session.');
    });

    socket.on('scoreboard_broadcast', (data) => {
      setTeams(data.teams || []);
    });

    socket.on('score_update', (data) => {
      setTeams(data.teams || []);
    });

    socket.on('question_broadcast', (data) => {
      setActiveQuestion(data);
      setStatus('active');
      setAnsweredTeams(new Set());
      setRoundResults([]);
    });

    socket.on('player_answered', (data) => {
      setAnsweredTeams(prev => new Set(prev).add(data.teamId));
    });

    socket.on('intermediate_broadcast', (data) => {
      setStatus('intermediate');
      setTeams(data.teams || []);
      setRoundResults(data.answers || []);
      if (data.correctAnswer) {
        setActiveQuestion(prev => prev ? { ...prev, correctAnswer: data.correctAnswer } : { correctAnswer: data.correctAnswer });
      }
    });

    socket.on('game_ended', (data) => {
      setStatus('finished');
      setTeams(data.teams || []);
      setMessage(data.message || 'Game Over');
    });

    return () => {
      socket.off('display_sync');
      socket.off('join_error');
      socket.off('scoreboard_broadcast');
      socket.off('score_update');
      socket.off('question_broadcast');
      socket.off('player_answered');
      socket.off('intermediate_broadcast');
      socket.off('game_ended');
    };
  }, [gameCode]);

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
              <QRCodeSVG value={joinUrl} size={400} />
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

  // Full screen post-game leaderboard
  if (status === 'finished') {
    return (
      <div className="display-container" style={{ padding: '40px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div className="glass-panel animate-fade-in" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
           <Trophy size={80} color="#FBBF24" style={{ marginBottom: '20px', marginTop: '20px' }} />
           <h1 className="title" style={{ fontSize: '4rem', marginBottom: '10px' }}>Final Leaderboard</h1>
           <p style={{ fontSize: '1.5rem', color: 'var(--text-muted)', marginBottom: '40px' }}>{message}</p>
           
           <div style={{ 
             display: 'grid', 
             gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
             gap: '20px', 
             width: '100%', 
             maxWidth: '1200px',
             maxHeight: '60vh',
             overflowY: 'auto',
             padding: '20px'
           }}>
             {[...teams].sort((a,b) => b.score - a.score).slice(0, 18).map((team, idx) => (
                <div key={idx} style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px', 
                  background: idx === 0 ? 'rgba(251, 191, 36, 0.2)' : idx === 1 ? 'rgba(156, 163, 175, 0.2)' : idx === 2 ? 'rgba(180, 83, 9, 0.2)' : 'rgba(255,255,255,0.05)',
                  borderRadius: '16px',
                  border: idx === 0 ? '2px solid #FBBF24' : idx === 1 ? '2px solid #9CA3AF' : idx === 2 ? '2px solid #B45309' : '1px solid var(--glass-border)',
                }}>
                  <span style={{ fontSize: '2rem', fontWeight: 'bold', color: idx === 0 ? '#FBBF24' : idx === 1 ? '#9CA3AF' : idx === 2 ? '#B45309' : 'var(--text-muted)', marginBottom: '10px' }}>
                    #{idx + 1}
                  </span>
                  <span style={{ fontSize: '1.8rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '5px' }}>{team.name}</span>
                  <span style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--accent-blue)' }}>{team.score} <span style={{fontSize: '1rem'}}>PTS</span></span>
                </div>
             ))}
           </div>
        </div>
      </div>
    );
  }

  // Active Question or Intermediate
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
          ) : status === 'intermediate' ? (
            <div className="glass-panel animate-fade-in" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              
              {/* Question and Correct Answer (Upper Half) */}
              <div style={{ flex: 'none', display: 'flex', flexDirection: 'column', borderBottom: '1px solid var(--glass-border)', paddingBottom: '30px', marginBottom: '30px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' }}>Question</span>
                <h2 className="title" style={{ fontSize: '3rem', textAlign: 'left', lineHeight: '1.2', marginBottom: '20px' }}>
                  {activeQuestion?.question}
                </h2>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '10px' }}>Answers</span>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    {activeQuestion?.choices?.map((choice, idx) => {
                      const isCorrect = choice === activeQuestion.correctAnswer;
                      return (
                        <div key={idx} style={{ 
                          background: isCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)', 
                          border: isCorrect ? '2px solid #10B981' : '1px solid var(--glass-border)', 
                          padding: '15px 20px', 
                          borderRadius: '16px', 
                          fontSize: '1.8rem', 
                          fontWeight: isCorrect ? 'bold' : 'normal', 
                          color: isCorrect ? 'white' : 'var(--text-muted)',
                          textAlign: 'center'
                        }}>
                          {choice}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Round Results (Lower Half) */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                <h3 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '20px' }}>Round Results</h3>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                  gap: '15px', 
                  overflowY: 'auto',
                  padding: '10px'
                }}>
                  {[...teams]
                    .sort((a, b) => {
                      const resA = roundResults.find(r => r.teamId === a.teamId)?.pointsAwarded || 0;
                      const resB = roundResults.find(r => r.teamId === b.teamId)?.pointsAwarded || 0;
                      return resB - resA;
                    })
                    .map((team) => {
                    const result = roundResults.find(r => r.teamId === team.teamId);
                    let bgColor = 'rgba(255,255,255,0.05)';
                    let icon = null;
                    let pointsStr = '';
                    
                    if (result) {
                      bgColor = result.isCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)';
                      icon = result.isCorrect ? <CheckCircle color="#10B981" /> : <XCircle color="#EF4444" />;
                      pointsStr = result.pointsAwarded > 0 ? `+${result.pointsAwarded}` : '0';
                    }

                    return (
                      <div key={team.teamId} style={{ 
                        background: bgColor, 
                        padding: '20px', 
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '10px',
                        border: '1px solid var(--glass-border)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center' }}>{team.name}</span>
                          {icon}
                        </div>
                        <span style={{ fontSize: '2rem', fontWeight: '900', color: result?.isCorrect ? '#10B981' : 'var(--text-muted)' }}>
                          {pointsStr}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
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
            {[...teams].sort((a,b) => b.score - a.score).map((team, idx) => {
              const hasAnswered = status === 'active' && answeredTeams.has(team.teamId);
              
              return (
                <div key={idx} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '20px 25px', 
                  background: hasAnswered ? 'rgba(59, 130, 246, 0.4)' : idx === 0 ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.05)',
                  borderRadius: '16px',
                  marginBottom: '15px',
                  border: hasAnswered ? '1px solid #3B82F6' : idx === 0 ? '1px solid var(--accent-blue)' : '1px solid transparent',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: idx === 0 ? '#FBBF24' : 'var(--text-muted)' }}>#{idx + 1}</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{team.name}</span>
                  </div>
                  <span style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--accent-blue)' }}>{team.score}</span>
                </div>
              );
            })}
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
