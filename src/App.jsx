import { useState, useEffect } from 'react';
import GameSetup from './pages/GameSetup';
import SpellingGame from './pages/SpellingGame';
import ResultsPage from './pages/ResultsPage';
import { loadWords } from './utils/csvParser';
import { shuffle } from './utils/letters';

export default function App() {
  const [appState, setAppState] = useState('loading'); // 'loading', 'setup', 'playing', 'results'
  const [allWords, setAllWords] = useState([]);
  const [gameWords, setGameWords] = useState([]);
  const [finalScore, setFinalScore] = useState(0);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    async function init() {
      const { words, error } = await loadWords();
      setAllWords(words);
      if (error) {
        setErrorMsg(error);
      }
      setAppState('setup');
    }
    init();
  }, []);

  const handleStartGame = (wordCount) => {
    // Select random words
    const shuffled = shuffle(allWords);
    const selectedWords = shuffled.slice(0, wordCount);
    setGameWords(selectedWords);
    setAppState('playing');
  };

  const handleGameComplete = (score) => {
    setFinalScore(score);
    setAppState('results');
  };

  const handleRestart = () => {
    setAppState('setup');
  };

  if (appState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold text-gray-500 animate-pulse">
        Loading words...
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans bg-[#f0fdf4]">
      {errorMsg && appState === 'setup' && (
        <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 sticky top-0 z-50">
          <p className="font-bold">Notice</p>
          <p>{errorMsg}</p>
        </div>
      )}

      {appState === 'setup' && (
        <GameSetup 
          totalWords={allWords.length} 
          onStartGame={handleStartGame} 
        />
      )}
      
      {appState === 'playing' && (
        <SpellingGame 
          words={gameWords} 
          onGameComplete={handleGameComplete} 
        />
      )}
      
      {appState === 'results' && (
        <ResultsPage 
          finalScore={finalScore} 
          totalWords={gameWords.length}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
