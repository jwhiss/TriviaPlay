import React, { useState } from 'react';
import Home from './Home';
import DisplayBoard from './DisplayBoard';
import './index.css';

function App() {
  const [gameCode, setGameCode] = useState(null);

  const handleConnect = (code) => {
    setGameCode(code);
  };

  return (
    <>
      {!gameCode ? (
        <Home onConnect={handleConnect} />
      ) : (
        <DisplayBoard gameCode={gameCode} />
      )}
    </>
  );
}

export default App;
