import { useState, useCallback, useRef, useEffect } from 'react';

const SPEEDS = [1, 0.9, 0.8, 0.7, 0.6, 0.5];

export function useAudioControl() {
  const speedIndexRef = useRef(0);
  const [currentSpeed, setCurrentSpeed] = useState(SPEEDS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported] = useState('speechSynthesis' in window);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  useEffect(() => {
    if (!isSupported) return;
    
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setVoicesLoaded(true);
      }
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [isSupported]);

  const playWord = useCallback((word, autoDecreaseSpeed = true) => {
    if (!isSupported) return;

    let playSpeed = SPEEDS[speedIndexRef.current];
    if (autoDecreaseSpeed) {
      speedIndexRef.current = Math.min(speedIndexRef.current + 1, SPEEDS.length - 1);
      playSpeed = SPEEDS[speedIndexRef.current];
      setCurrentSpeed(playSpeed);
    }

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = playSpeed;

    // Try to select a good English voice
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const bestVoice = voices.find(v => v.name.includes('Google US English')) ||
                        voices.find(v => v.name.includes('Samantha')) ||
                        voices.find(v => v.name.includes('Daniel')) ||
                        voices.find(v => v.name.includes('Karen')) ||
                        voices.find(v => v.lang === 'en-US' && v.localService) ||
                        voices.find(v => v.lang.startsWith('en-US')) ||
                        voices.find(v => v.lang.startsWith('en'));
                        
      if (bestVoice) {
        utterance.voice = bestVoice;
      }
    }
    
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = (e) => {
      console.error("Speech synthesis error", e);
      setIsPlaying(false);
    };

    window._activeUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }, [isSupported]);

  const resetSpeed = useCallback(() => {
    speedIndexRef.current = 0;
    setCurrentSpeed(SPEEDS[0]);
  }, []);

  return {
    playWord,
    currentSpeed,
    resetSpeed,
    isPlaying,
    isSupported,
    voicesLoaded
  };
}
