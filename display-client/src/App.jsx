import React, { useState } from 'react';
import Home from './Home';
import DisplayBoard from './DisplayBoard';
import './index.css';

function App() {
  const [gameCode, setGameCode] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleConnect = (code) => {
    setErrorMsg('');
    setGameCode(code);
  };

  const handleError = (message) => {
    setErrorMsg(message);
    setGameCode(null);
  };

  return (
    <>
      {!gameCode ? (
        <Home onConnect={handleConnect} error={errorMsg} />
      ) : (
        <DisplayBoard gameCode={gameCode} onError={handleError} />
      )}
    </>
  );
}

export default App;
