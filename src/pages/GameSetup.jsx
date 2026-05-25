import { useState } from 'react';
import WordCountSelector from '../components/WordCountSelector';
import { Play } from 'lucide-react';

export default function GameSetup({ totalWords, onStartGame }) {
  const [wordCount, setWordCount] = useState(Math.min(10, totalWords));

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 max-w-2xl mx-auto text-center gap-8">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full border-b-8 border-green-200">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-green-600 mb-4 drop-shadow-sm">
          🐝 Spelling Bee!
        </h1>
        <p className="text-xl text-gray-600 mb-8 font-medium">
          Practice your English and Spanish spelling.
        </p>
        
        {totalWords > 0 ? (
          <div className="space-y-8">
            <div className="bg-blue-50 p-6 rounded-2xl">
              <WordCountSelector 
                maxWords={totalWords} 
                wordCount={wordCount} 
                setWordCount={setWordCount} 
              />
            </div>
            
            <button
              onClick={() => {
                if ('speechSynthesis' in window) {
                  const u = new SpeechSynthesisUtterance(' ');
                  u.rate = 10;
                  u.volume = 0;
                  window.speechSynthesis.speak(u);
                }
                onStartGame(wordCount);
              }}
              className="group relative inline-flex items-center justify-center px-8 py-4 text-2xl font-bold text-white bg-green-500 rounded-full overflow-hidden shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-green-600 rounded-full group-hover:w-full group-hover:h-56"></span>
              <span className="relative flex items-center gap-2">
                <Play className="w-8 h-8 fill-current" />
                Start Game
              </span>
            </button>
          </div>
        ) : (
          <div className="text-red-500 font-bold p-4 bg-red-50 rounded-xl border-2 border-red-200">
            No words available. Please check the words.csv file.
          </div>
        )}
      </div>
      
      <div className="text-gray-500 font-medium">
        Load your own words by placing <code className="bg-gray-100 px-2 py-1 rounded">words.csv</code> in the public folder.
      </div>
    </div>
  );
}
