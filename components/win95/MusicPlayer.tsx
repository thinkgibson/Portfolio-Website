"use client";

import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Square, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { useOS } from "./OSContext";

interface Track {
    title: string;
    file: string;
}

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
        <div className="flex flex-col h-full bg-win95-gray p-4 font-win95">
            <audio
                ref={audioRef}
                src={currentTrack ? `/sfx/${currentTrack.file}` : ""}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={nextTrack}
            />

            {/* Display Area */}
            <div className="win95-beveled bg-black text-[#00FF00] p-8 mb-8 flex flex-col justify-center items-center h-48 font-mono">
                <div className="text-[21px] truncate w-full text-center">
                    {currentTrack ? currentTrack.title : "No Track Selected"}
                </div>
                <div className="text-[36px] mt-4">
                    {formatTime(currentTime)} / {formatTime(duration)}
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col gap-4">
                <div className="flex justify-center gap-2">
                    <button onClick={prevTrack} className="win95-button p-2" title="Previous">
                        <SkipBack size={24} />
                    </button>
                    {isPlaying ? (
                        <button onClick={pauseTrack} className="win95-button p-2" title="Pause">
                            <Pause size={24} />
                        </button>
                    ) : (
                        <button onClick={playTrack} className="win95-button p-2" title="Play">
                            <Play size={24} />
                        </button>
                    )}
                    <button onClick={stopTrack} className="win95-button p-2" title="Stop">
                        <Square size={24} />
                    </button>
                    <button onClick={nextTrack} className="win95-button p-2" title="Next">
                        <SkipForward size={24} />
                    </button>
                </div>

                {/* Volume Slider */}
                <div className="flex items-center gap-2 px-2">
                    <Volume2 size={24} />
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={(e) => setVolume(parseInt(e.target.value))}
                        className="flex-grow accent-win95-blue"
                    />
                </div>
            </div>

            {/* Track List */}
            <div className="mt-4 flex-grow overflow-y-auto win95-beveled bg-white">
                <table className="w-full text-left text-[18px]">
                    <thead className="bg-win95-gray border-b border-black">
                        <tr>
                            <th className="px-2 py-1">#</th>
                            <th className="px-2 py-1">Title</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tracks.map((track, index) => (
                            <tr
                                key={index}
                                className={`cursor-pointer hover:bg-win95-blue-active hover:text-white ${index === currentTrackIndex ? "bg-win95-blue text-white" : ""
                                    }`}
                                onClick={() => {
                                    setCurrentTrackIndex(index);
                                    setIsPlaying(true);
                                    setTimeout(() => playTrack(), 0);
                                }}
                            >
                                <td className="px-2 py-1">{index + 1}</td>
                                <td className="px-2 py-1 truncate">{track.title}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
