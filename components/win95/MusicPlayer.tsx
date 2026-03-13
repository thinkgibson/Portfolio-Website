"use client";

import React, { useState, useRef, useEffect } from "react";
import { useOS } from "./OSContext";

interface Track {
    title: string;
    file: string;
}

// Windows 95 Style SVG Icons (Authentic mplayer.exe style)
const Icons = {
    Play: () => (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="black">
            <path d="M4,4 L12,8 L4,12 Z" />
        </svg>
    ),
    Pause: () => (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="black">
            <rect x="4" y="4" width="3" height="8" />
            <rect x="9" y="4" width="3" height="8" />
        </svg>
    ),
    Stop: () => (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="black">
            <rect x="4" y="4" width="8" height="8" />
        </svg>
    ),
    Prev: () => (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="black">
            <rect x="3" y="4" width="2" height="8" />
            <path d="M12,4 L6,8 L12,12 Z" />
        </svg>
    ),
    Next: () => (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="black">
            <path d="M4,4 L10,8 L4,12 Z" />
            <rect x="11" y="4" width="2" height="8" />
        </svg>
    ),
    SkipBack: () => (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="black">
            <path d="M13,4 L8,8 L13,12 Z M8,4 L3,8 L8,12 Z" />
        </svg>
    ),
    SkipForward: () => (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="black">
            <path d="M3,4 L8,8 L3,12 Z M8,4 L13,8 L8,12 Z" />
        </svg>
    ),
    Volume: () => (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="black">
            <path d="M3,6 L3,10 L5,10 L8,13 L8,3 L5,6 Z" />
            <path d="M10,5 Q12,8 10,11" stroke="black" fill="none" />
            <path d="M12,3 Q15,8 12,13" stroke="black" fill="none" />
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
        <div className="flex flex-col h-full bg-win95-gray p-2 gap-2 font-win95 select-none win95-beveled">
            <style jsx>{`
                .win95-slider {
                    -webkit-appearance: none;
                    width: 100%;
                    background: transparent;
                }
                .win95-slider:focus {
                    outline: none;
                }
                /* Track */
                .win95-slider::-webkit-slider-runnable-track {
                    width: 100%;
                    height: 4px;
                    cursor: pointer;
                    background: #808080;
                    border-bottom: 1px solid #ffffff;
                    border-right: 1px solid #ffffff;
                }
                .win95-slider::-moz-range-track {
                    width: 100%;
                    height: 4px;
                    cursor: pointer;
                    background: #808080;
                    border-bottom: 1px solid #ffffff;
                    border-right: 1px solid #ffffff;
                }
                /* Thumb */
                .win95-slider::-webkit-slider-thumb {
                    height: 18px;
                    width: 10px;
                    background: #c0c0c0;
                    cursor: pointer;
                    -webkit-appearance: none;
                    margin-top: -8px;
                    box-shadow: inset 1px 1px 0px #ffffff, inset -1px -1px 0px #000000, 1px 1px 0px #000000;
                    border: 1px solid #808080;
                }
                .win95-slider::-moz-range-thumb {
                    height: 18px;
                    width: 10px;
                    background: #c0c0c0;
                    cursor: pointer;
                    box-shadow: inset 1px 1px 0px #ffffff, inset -1px -1px 0px #000000, 1px 1px 0px #000000;
                    border: 1px solid #808080;
                }
            `}</style>

            <audio
                ref={audioRef}
                src={currentTrack ? `/sfx/${currentTrack.file}` : ""}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={nextTrack}
            />

            {/* Display Area (Authentic Black Display) */}
            <div className="win95-beveled-inset bg-black text-[#00FF00] p-2 flex flex-col justify-center items-start h-20 font-mono relative overflow-hidden mx-1">
                <div className="text-[12px] uppercase opacity-70 mb-1">
                    {isPlaying ? "Playing" : currentTime > 0 ? "Paused" : "Stopped"}
                </div>
                <div className="text-[16px] truncate w-full" data-testid="player-display-title">
                    {currentTrack ? currentTrack.title : "No Track Selected"}
                </div>
                <div className="absolute top-2 right-2 text-[14px]">
                    {formatTime(currentTime)}
                </div>
            </div>

            {/* Slider Area */}
            <div className="px-2 py-1">
                <div className="relative h-6 flex items-center">
                    <input
                        type="range"
                        min="0"
                        max={duration || 100}
                        value={currentTime}
                        step="0.1"
                        onChange={(e) => {
                            if (audioRef.current) {
                                audioRef.current.currentTime = parseFloat(e.target.value);
                                setCurrentTime(audioRef.current.currentTime);
                            }
                        }}
                        className="win95-slider w-full"
                    />
                </div>
            </div>

            {/* Controls & Volume section */}
            <div className="flex flex-col gap-2 px-1">
                <div className="flex items-center justify-between">
                    {/* Transport Buttons */}
                    <div className="flex gap-[2px]">
                        <button onClick={prevTrack} className="win95-button p-1 min-w-[28px]" title="Previous">
                            <Icons.Prev />
                        </button>
                        {isPlaying ? (
                            <button onClick={pauseTrack} className="win95-button p-1 min-w-[28px]" title="Pause">
                                <Icons.Pause />
                            </button>
                        ) : (
                            <button onClick={playTrack} className="win95-button p-1 min-w-[28px]" title="Play">
                                <Icons.Play />
                            </button>
                        )}
                        <button onClick={stopTrack} className="win95-button p-1 min-w-[28px]" title="Stop">
                            <Icons.Stop />
                        </button>
                        <button onClick={nextTrack} className="win95-button p-1 min-w-[28px]" title="Next">
                            <Icons.Next />
                        </button>
                        <div className="w-1" /> {/* Spacer */}
                        <button className="win95-button p-1 min-w-[28px]" title="Skip Back">
                            <Icons.SkipBack />
                        </button>
                        <button className="win95-button p-1 min-w-[28px]" title="Skip Forward">
                            <Icons.SkipForward />
                        </button>
                    </div>

                    {/* Volume Slider */}
                    <div className="flex items-center gap-1">
                        <Icons.Volume />
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={volume}
                            onChange={(e) => setVolume(parseInt(e.target.value))}
                            className="w-20 accent-win95-blue h-4"
                        />
                    </div>
                </div>
            </div>

            {/* Playlist (Keep for functionality, but style it more compactly) */}
            <div className="flex-grow overflow-y-auto win95-beveled-inset bg-white mx-1 my-1 scrollbar-win95">
                <table className="w-full text-left text-[12px] border-collapse">
                    <thead className="bg-win95-gray sticky top-0 shadow-sm">
                        <tr>
                            <th className="px-1 py-0 border-b border-r border-gray-400 font-normal w-6 text-center">#</th>
                            <th className="px-1 py-0 border-b border-gray-400 font-normal">Title</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tracks.map((track, index) => (
                            <tr
                                key={index}
                                className={`cursor-pointer ${index === currentTrackIndex ? "bg-win95-blue text-white" : "hover:bg-blue-100"}`}
                                onClick={() => {
                                    setCurrentTrackIndex(index);
                                    setIsPlaying(true);
                                    setTimeout(() => playTrack(), 0);
                                }}
                            >
                                <td className="px-1 py-0.5 text-center">{index + 1}</td>
                                <td className="px-1 py-0.5 truncate">{track.title}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Status Bar */}
            <div className="win95-beveled-inset mx-[-4px] mb-[-4px] mt-2 px-2 py-[2px] text-[11px] flex justify-between items-center bg-win95-gray">
                <div className="flex items-center gap-2">
                    <span className="opacity-80 px-1 border-r border-gray-400">Track {currentTrackIndex + 1} of {tracks.length}</span>
                    <span className="opacity-80 px-1">Stereo</span>
                </div>
                <div className="win95-beveled-inset px-2 py-[1px] bg-win95-gray min-w-[100px] text-center font-mono">
                    {formatTime(currentTime)} / {formatTime(duration)}
                </div>
            </div>
        </div>
    );
};
