import { useState, useEffect, useCallback } from 'react';
import { DndContext, useSensor, useSensors, PointerSensor, TouchSensor } from '@dnd-kit/core';
import AudioPlayButton from '../components/AudioPlayButton';
import LetterTile from '../components/LetterTile';
import DropZone from '../components/DropZone';
import { useAudioControl } from '../hooks/useAudioControl';
import { getShuffledLettersForWord } from '../utils/letters';
import { calculateWordScore } from '../utils/scoring';
import { checkSpelling } from '../utils/validation';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function SpellingGame({ words, onGameComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentWord = words[currentIndex];
  
  // Audio Hook
  const { playWord, currentSpeed, isPlaying, isSupported, resetSpeed, voicesLoaded } = useAudioControl();
  
  // Game State
  const [phase, setPhase] = useState('english'); // 'english' | 'spanish' | 'transition'
  
  // Answers state: arrays of objects { id, char }
  const [englishAnswer, setEnglishAnswer] = useState([]);
  const [spanishAnswer, setSpanishAnswer] = useState([]);
  
  // Available letters for the current phase
  const [availableTiles, setAvailableTiles] = useState([]);
  
  // Tracking
  const [attempts, setAttempts] = useState(1);
  const [wordStartTime, setWordStartTime] = useState(Date.now());
  const [totalScore, setTotalScore] = useState(0);
  const [isError, setIsError] = useState(false);
  const [initialPlayDone, setInitialPlayDone] = useState(false);
  
  // Initialize word phase
  const initPhase = useCallback((newPhase, wordToPlay = currentWord) => {
    setPhase(newPhase);
    setAttempts(1);
    setIsError(false);
    setInitialPlayDone(false);
    
    if (newPhase === 'english') {
      setEnglishAnswer([]);
      setSpanishAnswer([]);
      setAvailableTiles(getShuffledLettersForWord(wordToPlay.english));
      setWordStartTime(Date.now()); // Start timer when english phase starts
      resetSpeed();
    } else if (newPhase === 'spanish') {
      setAvailableTiles(getShuffledLettersForWord(wordToPlay.spanish));
    }
  }, [currentWord, resetSpeed]);

  // Handle auto-play once voices are loaded and we're in english phase
  useEffect(() => {
    if (phase === 'english' && voicesLoaded && !initialPlayDone) {
      setInitialPlayDone(true);
      // Small delay gives time for the GameSetup unlock utterance to complete
      setTimeout(() => {
        playWord(currentWord.english, false);
      }, 300);
    }
  }, [phase, voicesLoaded, initialPlayDone, currentWord, playWord]);

  // Load next word or finish
  useEffect(() => {
    if (currentIndex < words.length) {
      initPhase('english', words[currentIndex]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, words.length]);

  // DnD Sensors (optimize for mobile touch)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (over && over.id === `${phase}-dropzone`) {
      // Find the dragged tile
      const draggedTile = availableTiles.find(t => t.id === active.id);
      if (draggedTile) {
        // Move from available to answer
        setAvailableTiles(prev => prev.filter(t => t.id !== draggedTile.id));
        
        if (phase === 'english') {
          setEnglishAnswer(prev => [...prev, draggedTile]);
        } else {
          setSpanishAnswer(prev => [...prev, draggedTile]);
        }
        setIsError(false);
      }
    }
  };

  const handleTileClick = (tile) => {
    // Click to add (alternative to drag)
    setAvailableTiles(prev => prev.filter(t => t.id !== tile.id));
    if (phase === 'english') {
      setEnglishAnswer(prev => [...prev, tile]);
    } else {
      setSpanishAnswer(prev => [...prev, tile]);
    }
    setIsError(false);
  };

  const handleRemoveLetter = (indexToRemove) => {
    // Click inside dropzone to remove back to available
    let removedItem;
    if (phase === 'english') {
      removedItem = englishAnswer[indexToRemove];
      setEnglishAnswer(prev => prev.filter((_, i) => i !== indexToRemove));
    } else {
      removedItem = spanishAnswer[indexToRemove];
      setSpanishAnswer(prev => prev.filter((_, i) => i !== indexToRemove));
    }
    setAvailableTiles(prev => [...prev, removedItem]);
    setIsError(false);
  };

  const validateCurrentPhase = () => {
    const currentAnswerArray = phase === 'english' ? englishAnswer : spanishAnswer;
    const currentAnswerStr = currentAnswerArray.map(t => t.char).join('');
    const targetWord = phase === 'english' ? currentWord.english : currentWord.spanish;
    
    if (currentAnswerArray.length === 0) return; // Don't validate if empty

    const isCorrect = checkSpelling(currentAnswerStr, targetWord);
    
    if (isCorrect) {
      // Correct!
      setIsError(false);
      const timeInSeconds = (Date.now() - wordStartTime) / 1000;
      const scoreGained = calculateWordScore(attempts, timeInSeconds);
      setTotalScore(prev => prev + scoreGained);
      
      if (phase === 'english') {
        setPhase('transition');
        setTimeout(() => {
          initPhase('spanish');
        }, 1500);
      } else {
        setPhase('transition');
        setTimeout(() => {
          if (currentIndex + 1 < words.length) {
            setCurrentIndex(prev => prev + 1);
          } else {
            onGameComplete(totalScore + scoreGained);
          }
        }, 1500);
      }
    } else {
      // Incorrect
      setIsError(true);
      setAttempts(prev => prev + 1);
      // Optional: shake effect or sound here
    }
  };

  // Auto-validate when length matches target length (ignoring spaces)
  useEffect(() => {
    const targetWord = phase === 'english' ? currentWord.english : currentWord.spanish;
    const currentAnswerArray = phase === 'english' ? englishAnswer : spanishAnswer;
    
    const targetLengthWithoutSpaces = targetWord.replace(/\s+/g, '').length;

    if (currentAnswerArray.length === targetLengthWithoutSpaces && phase !== 'transition') {
      validateCurrentPhase();
    }
  }, [englishAnswer, spanishAnswer, phase, currentWord]);


  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex flex-col items-center justify-start min-h-screen py-8 px-4 w-full max-w-3xl mx-auto font-sans">
        
        {/* Header */}
        <div className="w-full flex justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-sm border-2 border-gray-100">
          <div className="text-lg font-bold text-gray-500">
            Word {currentIndex + 1} of {words.length}
          </div>
          <div className="text-xl font-black text-green-600 bg-green-50 px-4 py-1 rounded-full border-2 border-green-200">
            Score: {totalScore}
          </div>
        </div>

        {/* Audio Player (English Phase Only) */}
        <div className="mb-8 min-h-[100px] flex items-center justify-center">
          {phase === 'english' ? (
            <AudioPlayButton 
              onPlay={() => playWord(currentWord.english)} 
              currentSpeed={currentSpeed}
              isPlaying={isPlaying}
              isSupported={isSupported}
            />
          ) : (
            <div className="text-gray-400 font-semibold italic flex items-center gap-2 bg-gray-50 px-6 py-3 rounded-xl border border-gray-200">
              🤫 Shhh... no audio for Spanish
            </div>
          )}
        </div>

        {/* Drop Zones */}
        <div className="w-full space-y-6 mb-8">
          <DropZone 
            id="english-dropzone"
            label="Spell in English"
            currentAnswer={englishAnswer}
            onRemoveLetter={handleRemoveLetter}
            isActive={phase === 'english'}
            isSuccess={phase !== 'english'} // Green if passed
            isError={phase === 'english' && isError}
          />
          
          <div className="relative">
            {phase === 'english' && (
              <div className="absolute inset-0 bg-white/50 z-10 rounded-xl" />
            )}
            <DropZone 
              id="spanish-dropzone"
              label="Spell in Spanish"
              currentAnswer={spanishAnswer}
              onRemoveLetter={handleRemoveLetter}
              isActive={phase === 'spanish'}
              isSuccess={phase === 'transition' && englishAnswer.length > 0} // Green if finished
              isError={phase === 'spanish' && isError}
            />
          </div>
        </div>

        {/* Available Letters Pool */}
        <div className="w-full mt-auto bg-white p-6 rounded-3xl shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] border-t-4 border-blue-100">
          <div className="flex flex-wrap justify-center gap-3">
            {availableTiles.map((tile) => (
              <LetterTile 
                key={tile.id} 
                id={tile.id} 
                letter={tile.char} 
                disabled={phase === 'transition'}
                onClick={() => handleTileClick(tile)}
              />
            ))}
            {availableTiles.length === 0 && phase !== 'transition' && (
              <div className="text-gray-400 italic">No more letters</div>
            )}
            {phase === 'transition' && (
              <div className="text-green-500 font-bold flex items-center gap-2 text-2xl animate-bounce">
                <CheckCircle2 className="w-8 h-8" /> Great Job!
              </div>
            )}
          </div>
        </div>
        
        {/* Error Feedback */}
        {isError && (
          <div className="fixed top-10 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 animate-pulse z-50">
            <XCircle className="w-6 h-6" /> Not quite right. Try again!
          </div>
        )}

      </div>
    </DndContext>
  );
}
