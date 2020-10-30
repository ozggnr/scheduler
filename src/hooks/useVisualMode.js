import React, { useState } from 'react';

const useVisualMode = function (initialMode) {
  const [mode, setMode] = useState(initialMode);
  const [history, setHistory] = useState([initialMode]); 
  
  function transition(newMode, replace=false) {
    setHistory([...history, mode]);
    setMode(newMode);
    if (replace) {
      let hist = [...history.slice(0,history.length - 1)]
      setHistory(hist)
    }
  }

  function back ( ) {
    if (history.length >= 1) {
      const newHistory = [...history]
      const previousVal = newHistory.pop()
      setMode(previousVal)
      setHistory(newHistory) 
    
    }
  }
  return { mode, transition , back}
}

export default useVisualMode 