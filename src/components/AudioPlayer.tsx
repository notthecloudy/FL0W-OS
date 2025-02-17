import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

const AUDIO_TRACK = {
  title: "Unknown",
  artist: "Unknown",
  url: "https://cdn.pixabay.com/audio/2025/02/03/audio_502e27ab2b.mp3"
};

export function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [metadata, setMetadata] = useState({ title: AUDIO_TRACK.title, artist: AUDIO_TRACK.artist });
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      // Try to get metadata from the audio file
      if (audio.mozId3 || audio.webkitAudioDecodedByteCount) {
        try {
          const title = audio.mozId3?.title || audio.title || AUDIO_TRACK.title;
          const artist = audio.mozId3?.artist || audio.artist || AUDIO_TRACK.artist;
          setMetadata({ title, artist });
        } catch (e) {
          console.warn('Could not read audio metadata');
        }
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-md mx-auto text-gray-300">
      <audio
        ref={audioRef}
        src={AUDIO_TRACK.url}
        autoPlay={isPlaying}
        loop
      />
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{metadata.title}</h3>
        <p className="text-sm text-gray-400">{metadata.artist}</p>
      </div>

      <div className="flex items-center justify-center space-x-4 mb-4">
        <button
          onClick={togglePlay}
          className="p-3 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-full"
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <span className="text-xs">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleTimeChange}
            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-xs">{formatTime(duration)}</span>
        </div>

        <div className="flex items-center space-x-2">
          <Volume2 size={16} />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}