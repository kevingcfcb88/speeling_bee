import { useState, useEffect } from 'react';
import { Trophy, RotateCcw, Medal } from 'lucide-react';

export default function ResultsPage({ finalScore, totalWords, onRestart }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [playerName, setPlayerName] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedScores = JSON.parse(localStorage.getItem('speelingBeeLeaderboard') || '[]');
    setLeaderboard(savedScores);
  }, []);

  const handleSaveScore = (e) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    const newScore = {
      name: playerName.trim(),
      score: finalScore,
      date: new Date().toISOString().split('T')[0]
    };

    const newLeaderboard = [...leaderboard, newScore]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5); // Keep top 5

    localStorage.setItem('speelingBeeLeaderboard', JSON.stringify(newLeaderboard));
    setLeaderboard(newLeaderboard);
    setSaved(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-10 px-4 max-w-2xl mx-auto w-full">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full border-b-8 border-yellow-400 text-center relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-yellow-100 rounded-full mix-blend-multiply opacity-50"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-100 rounded-full mix-blend-multiply opacity-50"></div>
        
        <div className="relative z-10">
          <Trophy className="w-24 h-24 text-yellow-400 mx-auto mb-4 drop-shadow-md" />
          <h1 className="text-5xl font-black text-gray-800 mb-2">Game Over!</h1>
          <p className="text-2xl text-gray-600 mb-8 font-medium">You spelled {totalWords} words!</p>
          
          <div className="bg-gradient-to-r from-orange-400 to-yellow-400 rounded-2xl p-6 mb-8 text-white shadow-inner transform rotate-1">
            <div className="text-lg font-bold opacity-90 uppercase tracking-wider">Final Score</div>
            <div className="text-7xl font-black">{finalScore}</div>
          </div>

          {!saved ? (
            <form onSubmit={handleSaveScore} className="mb-10 max-w-xs mx-auto">
              <label className="block text-sm font-bold text-gray-600 mb-2">Save your score!</label>
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Your Name"
                  maxLength={15}
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full text-center text-xl font-bold p-3 border-4 border-gray-200 rounded-xl focus:border-yellow-400 focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl shadow-md transition-transform hover:-translate-y-1 active:translate-y-0"
                >
                  Save to Leaderboard
                </button>
              </div>
            </form>
          ) : (
            <div className="text-green-500 font-bold mb-10 text-xl bg-green-50 py-2 rounded-xl">
              Score Saved! 🎉
            </div>
          )}

          {leaderboard.length > 0 && (
            <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-100 mb-8">
              <h2 className="text-2xl font-bold text-gray-700 flex items-center justify-center gap-2 mb-4">
                <Medal className="w-6 h-6 text-yellow-500" /> Top Scores
              </h2>
              <ul className="space-y-3">
                {leaderboard.map((entry, i) => (
                  <li key={i} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                    <span className="font-bold text-gray-700 flex items-center gap-3">
                      <span className="w-6 text-gray-400 text-sm">#{i + 1}</span>
                      {entry.name}
                    </span>
                    <span className="font-black text-blue-600">{entry.score} pts</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={onRestart}
            className="flex items-center justify-center gap-2 mx-auto w-full sm:w-auto bg-gray-800 hover:bg-gray-900 text-white font-bold text-xl py-4 px-10 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            <RotateCcw className="w-6 h-6" /> Play Again
          </button>
        </div>
      </div>
    </div>
  );
}
