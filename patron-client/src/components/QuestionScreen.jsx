import { useState } from 'react';

export default function QuestionScreen({ question, onAnswer }) {
  const [selected, setSelected] = useState(null);

  if (!question) return null;

  const handleSelect = (choice) => {
    setSelected(choice);
    // Add a tiny delay so the patron sees their choice highlight before it transitions to submitted state
    // Provides tactile visual feedback as required
    setTimeout(() => {
      onAnswer(choice);
    }, 150);
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ display: 'flex', flexDirection: 'column', minHeight: '300px' }}>
      <div style={{ marginBottom: '24px' }}>
        <p style={{ color: 'var(--accent-blue)', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '8px', textTransform: 'uppercase' }}>
          {question.category || 'Trivia'}
        </p>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '700', lineHeight: '1.4' }}>
          {question.question}
        </h2>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'flex-end' }}>
        {question.choices && question.choices.map((choice, index) => (
          <button 
            key={index}
            className={`choice-button ${selected === choice ? 'selected' : ''}`}
            onClick={() => handleSelect(choice)}
            disabled={selected !== null}
          >
            {choice}
          </button>
        ))}
      </div>
    </div>
  );
}
