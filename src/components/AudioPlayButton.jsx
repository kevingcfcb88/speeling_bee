import { Volume2, Volume1, VolumeX } from 'lucide-react';

export default function AudioPlayButton({ onPlay, currentSpeed, isPlaying, isSupported }) {
  if (!isSupported) {
    return (
      <div className="flex items-center text-red-500 bg-red-50 px-4 py-2 rounded-lg text-sm">
        <VolumeX className="w-5 h-5 mr-2" />
        Audio not supported
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={onPlay}
        disabled={isPlaying}
        className={`w-16 h-16 flex items-center justify-center rounded-full text-white shadow-lg transition-transform ${
          isPlaying ? 'bg-blue-300 scale-95' : 'bg-blue-500 hover:bg-blue-600 hover:scale-105 active:scale-95'
        }`}
        aria-label="Play word"
      >
        {isPlaying ? (
          <Volume1 className="w-8 h-8 animate-pulse" />
        ) : (
          <Volume2 className="w-8 h-8" />
        )}
      </button>
      <div className="bg-white px-3 py-1 rounded-full text-sm font-bold text-blue-600 shadow-sm border border-blue-100">
        Speed: {currentSpeed}x
      </div>
    </div>
  );
}
