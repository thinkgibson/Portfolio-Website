"use client";

import React, { useState, useRef, useEffect } from "react";
import { useOS } from "./OSContext";

interface Track {
    title: string;
    file: string;
}

// Windows 95 Style SVG Icons
const Icons = {
    Play: () => (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M2,2 L10,6 L2,10 Z" />
        </svg>
    ),
    Pause: () => (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <rect x="2" y="2" width="3" height="8" />
            <rect x="7" y="2" width="3" height="8" />
        </svg>
    ),
    Stop: () => (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <rect x="2" y="2" width="8" height="8" />
        </svg>
    ),
    SkipBack: () => (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M6,2 L6,6 L2,6 L2,2 Z M6,6 L10,2 L10,10 L6,6 Z M2,6 L2,10 L6,10 L6,6 Z" />
            {/* Improved Skip Back: Line then Triangle? Or double triangle? Win95 is |<< */}
            <rect x="2" y="2" width="2" height="8" />
            <path d="M4,6 L8,2 L8,10 Z" />
            <path d="M8,6 L12,2 L12,10 Z" />
        </svg>
    ),
    // Simpler separate icons for clarity
    Prev: () => (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
            <rect x="1" y="1" width="2" height="8" />
            <path d="M3,5 L9,1 L9,9 Z" />
        </svg>
    ),
    Next: () => (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
            <path d="M1,1 L7,5 L1,9 Z" />
            <rect x="7" y="1" width="2" height="8" />
        </svg>
    ),
    Volume: () => (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4,5 L4,11 L6,11 L10,15 L10,1 L6,5 Z" />
            <path d="M12,4 Q14,8 12,12" stroke="currentColor" fill="none" />
            <path d="M13,2 Q16,8 13,14" stroke="currentColor" fill="none" />
        </svg>
    )
};

export const MusicPlayer: React.FC = () => {
    const { volume, setVolume } = useOS();
    const [tracks, setTracks] = useState<Track[]>([]);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Load tracks from soundConfig.json
        const loadTracks = async () => {
            try {
                const response = await fetch("/sfx/soundConfig.json");
                if (response.ok) {
                    const config = await response.json();
                    if (config.tracks && Array.isArray(config.tracks)) {
                        setTracks(config.tracks);
                    } else {
                        // Fallback logic for simple key-value pairs
                        const trackList: Track[] = [];
                        for (const [key, value] of Object.entries(config)) {
                            if (value && typeof value === 'string' && (value.endsWith(".ogg") || value.endsWith(".mp3"))) {
                                trackList.push({
                                    title: key.charAt(0).toUpperCase() + key.slice(1),
                                    file: value
                                });
                            }
                        }
                        setTracks(trackList);
                    }
                }
            } catch (error) {
                console.error("Failed to load music tracks:", error);
            }
        };
        loadTracks();
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100;
        }
    }, [volume]);

    const playTrack = () => {
        if (audioRef.current) {
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    const pauseTrack = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

    const stopTrack = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsPlaying(false);
        }
    };

    const nextTrack = () => {
        setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    };

    const prevTrack = () => {
        setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const formatTime = (time: number) => {
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const currentTrack = tracks[currentTrackIndex];

    return (
        <div className="flex flex-col h-full bg-win95-gray p-2 gap-2 font-win95 select-none">
            <audio
                ref={audioRef}
                src={currentTrack ? `/sfx/${currentTrack.file}` : ""}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={nextTrack}
            />

            {/* Scale Wrapper to make it look like mplayer.exe small window if needed, 
                but for now we just make the layout compact */}

            {/* Display Area */}
            <div className="win95-beveled bg-black text-[#00FF00] p-2 flex flex-col justify-center items-center h-20 font-mono relative overflow-hidden">
                <div className="text-[14px] truncate w-full text-center mb-1">
                    {currentTrack ? currentTrack.title : "No Track Selected"}
                </div>
                <div className="text-[24px] leading-none">
                    {formatTime(currentTime)} / {formatTime(duration || 0)}
                </div>
            </div>

            {/* Controls & Volume */}
            <div className="flex items-center justify-between gap-2">
                {/* Transport Buttons */}
                <div className="flex gap-1">
                    <button onClick={prevTrack} className="win95-button px-2 py-1 min-w-[30px] flex items-center justify-center" title="Previous">
                        <Icons.Prev />
                    </button>
                    {isPlaying ? (
                        <button onClick={pauseTrack} className="win95-button px-2 py-1 min-w-[30px] flex items-center justify-center" title="Pause">
                            <Icons.Pause />
                        </button>
                    ) : (
                        <button onClick={playTrack} className="win95-button px-2 py-1 min-w-[30px] flex items-center justify-center" title="Play">
                            <Icons.Play />
                        </button>
                    )}
                    <button onClick={stopTrack} className="win95-button px-2 py-1 min-w-[30px] flex items-center justify-center" title="Stop">
                        <Icons.Stop />
                    </button>
                    <button onClick={nextTrack} className="win95-button px-2 py-1 min-w-[30px] flex items-center justify-center" title="Next">
                        <Icons.Next />
                    </button>
                </div>

                {/* Volume Slider */}
                <div className="flex items-center gap-1 flex-grow justify-end">
                    <Icons.Volume />
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={(e) => setVolume(parseInt(e.target.value))}
                        className="w-24 accent-win95-blue h-4"
                    />
                </div>
            </div>

            {/* Playlist */}
            <div className="flex-grow overflow-y-auto win95-beveled bg-white mt-1 border border-gray-500 inset-shadow">
                <table className="w-full text-left text-[14px]">
                    <thead className="bg-win95-gray sticky top-0">
                        <tr>
                            <th className="px-2 py-0 border-b border-r border-gray-400 font-normal w-8 text-center">#</th>
                            <th className="px-2 py-0 border-b border-gray-400 font-normal">Title</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tracks.map((track, index) => (
                            <tr
                                key={index}
                                className={`cursor-pointer ${index === currentTrackIndex ? "bg-win95-blue text-white" : "hover:text-black"}`}
                                onClick={() => {
                                    setCurrentTrackIndex(index);
                                    setIsPlaying(true);
                                    setTimeout(() => playTrack(), 0);
                                }}
                            >
                                <td className="px-2 py-0.5 text-center">{index + 1}</td>
                                <td className="px-2 py-0.5 truncate">{track.title}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Status Bar / Footer (Optional, like '00:00 (Stereo)') */}
            <div className="text-[12px] text-gray-600 border-t border-white pt-1">
                {currentTrack ? "Stereo" : "Ready"}
            </div>
        </div>
    );
};
