// src/components/AudioPlayer.jsx
import { useAudio } from "../context/AudioContext";
import { FaPlay, FaPause, FaVolumeUp, FaStepBackward, FaStepForward } from "react-icons/fa";
import { memo, useState } from "react";

const AudioPlayer = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    showPlayer, // Add showPlayer to destructuring
    togglePlayPause,
    stop,
    skipBackward,
    skipForward,
    setVolume,
    seekTo,
  } = useAudio();
  const [volume, setLocalVolume] = useState(1);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" + secs : secs}`;
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setLocalVolume(newVolume);
  };

  if (!currentTrack || !showPlayer) return null; // Render only if showPlayer is true

  return (
    <div className="fixed bottom-6 right-6 w-96 bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 rounded-xl shadow-2xl border border-purple-700/30 transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(147,51,234,0.5)] z-50">
      <div className="flex items-center mb-3">
        <div className="flex-1">
          <p className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 truncate">
            {currentTrack.title}
          </p>
          <p className="text-xs text-gray-400">Now Playing</p>
        </div>
        <button
          onClick={stop}
          className="text-gray-400 hover:text-red-500 transition-colors duration-200 transform hover:scale-110"
        >
          ✕
        </button>
      </div>

      <div className="relative mb-4">
        <input
          type="range"
          min="0"
          max="100"
          value={duration ? (currentTime / duration) * 100 : 0}
          onChange={(e) => seekTo(e.target.value)}
          className="w-full h-1 bg-gray-700 rounded-full cursor-pointer appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(147,51,234,0.8)] transition-all duration-200"
          style={{
            background: `linear-gradient(to right, #ec4899 ${duration ? (currentTime / duration) * 100 : 0}%, #4b5563 ${duration ? (currentTime / duration) * 100 : 0}%)`,
          }}
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={skipBackward}
            className="text-gray-300 hover:text-purple-400 transition-colors duration-200 transform hover:scale-110"
          >
            <FaStepBackward size={18} />
          </button>
          <button
            onClick={togglePlayPause}
            className="relative bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-full text-white shadow-md hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-110"
          >
            {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 hover:opacity-30 transition-opacity duration-300" />
          </button>
          <button
            onClick={skipForward}
            className="text-gray-300 hover:text-purple-400 transition-colors duration-200 transform hover:scale-110"
          >
            <FaStepForward size={18} />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <FaVolumeUp className="text-gray-300" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-20 h-1 bg-gray-700 rounded-full cursor-pointer appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:rounded-full transition-all duration-200"
            style={{
              background: `linear-gradient(to right, #9333ea ${volume * 100}%, #4b5563 ${volume * 100}%)`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(AudioPlayer, (prevProps, nextProps) => {
  return (
    prevProps.currentTrack?.id === nextProps.currentTrack?.id &&
    prevProps.isPlaying === nextProps.isPlaying &&
    prevProps.duration === nextProps.duration &&
    Math.floor(prevProps.currentTime) === Math.floor(nextProps.currentTime)
  );
});