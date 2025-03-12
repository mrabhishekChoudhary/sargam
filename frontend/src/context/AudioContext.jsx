// src/context/AudioContext.js
import { createContext, useContext, useState, useRef, useCallback, useEffect } from "react";

const AudioContext = createContext();

// Throttle utility
const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const AudioProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showPlayer, setShowPlayer] = useState(false); // New state for visibility
  const audioRef = useRef(new Audio());

  const initializePlayer = useCallback((track) => {
    console.log("Initializing player with track:", track);
    if (currentTrack?.id === track.id) return;

    audioRef.current.pause();
    audioRef.current.src = track.fileUrl.replace(/\\/g, "/");
    audioRef.current.load();
    setCurrentTrack(track);
    setIsPlaying(false);
    setCurrentTime(0);
    setShowPlayer(true); // Show player when initializing
  }, [currentTrack]);

  const togglePlayPause = useCallback(() => {
    if (audioRef.current.src) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        console.log("Paused");
      } else {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            console.log("Playing started");
          })
          .catch((err) => console.error("Playback error:", err));
      }
    } else {
      console.log("No track loaded to play");
    }
  }, [isPlaying]);

  const stop = useCallback(() => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setCurrentTrack(null);
    setShowPlayer(false); // Hide player on stop
    audioRef.current.src = "";
    console.log("Stopped");
  }, []);

  const skipBackward = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
    }
  }, []);

  const skipForward = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + 10);
    }
  }, []);

  const setVolume = useCallback((volume) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, []);

  const seekTo = useCallback((percentage) => {
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (percentage / 100) * audioRef.current.duration;
    }
  }, []);

  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      console.log("Duration loaded:", audio.duration);
    };
    const handleTimeUpdate = throttle(() => {
      setCurrentTime(audio.currentTime);
    }, 500);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      console.log("Finished");
    };
    const handleError = (e) => console.error("Audio error:", e);

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, []);

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        showPlayer, // Expose showPlayer state
        initializePlayer,
        togglePlayPause,
        stop,
        skipBackward,
        skipForward,
        setVolume,
        seekTo,
        setShowPlayer, // Expose setter for external control
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);