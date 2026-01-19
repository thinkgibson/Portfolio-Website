"use client";

import React, { useState, useEffect } from "react";
import { WindowsLogoIcon, FolderIcon, UserIcon, InboxIcon, ProgramsIcon, MyComputerIcon, WeatherIcon, VolumeIcon, NetworkIcon, NotepadIcon, CalculatorIcon, PaintIcon } from "./icons";
import { ContextMenu } from "./ContextMenu";
import { AnimatePresence } from "framer-motion";

interface TaskbarProps {
    openWindows: { id: string; title: string; isActive: boolean; iconType?: "folder" | "about" | "contact" | "projects" | "drive" | "notepad" | "calculator" | "paint" }[];
    onWindowClick: (id: string) => void;
    onStartClick: () => void;
    onMinimizeWindow: (id: string) => void;
    onCloseWindow: (id: string) => void;
    onMinimizeAllWindows: () => void;
    onCloseAllWindows: () => void;
}

export function Taskbar({ openWindows, onWindowClick, onStartClick, onMinimizeWindow, onCloseWindow, onMinimizeAllWindows, onCloseAllWindows }: TaskbarProps) {
    const [time, setTime] = useState(new Date());
    const [activeTooltip, setActiveTooltip] = useState<"weather" | "network" | "volume" | null>(null);
    const [taskbarContextMenu, setTaskbarContextMenu] = useState<{ type: 'window' | 'taskbar'; windowId?: string; x: number; y: number } | null>(null);
    const [weatherData, setWeatherData] = useState<{ temp: number; city: string; description: string; loading: boolean } | null>(null);
    const [ping, setPing] = useState<{ value: number; loading: boolean } | null>(null);
    const [volume, setVolume] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedVolume = localStorage.getItem("win95-volume");
            if (savedVolume) return parseInt(savedVolume);
        }
        return 50;
    });
    const isFirstRender = React.useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        localStorage.setItem("win95-volume", volume.toString());
    }, [volume]);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getWeatherDescription = (code: number): string => {
        if (code === 0) return "Sunny";
        if (code <= 3) return "Cloudy";
        if (code >= 45 && code <= 48) return "Foggy";
        if (code >= 51 && code <= 67) return "Rainy";
        if (code >= 71 && code <= 77) return "Snowy";
        if (code >= 80 && code <= 82) return "Rainy";
        if (code >= 95) return "Stormy";
        return "Unknown";
    };

    const fetchWeather = async () => {
        if (weatherData && !weatherData.loading) {
            setActiveTooltip(activeTooltip === "weather" ? null : "weather");
            return;
        }

        setActiveTooltip("weather");
        setWeatherData({ temp: 0, city: "Detecting...", description: "", loading: true });

        try {
            // Get location by IP
            const locRes = await fetch("https://ipapi.co/json/");
            const locData = await locRes.json();
            const { latitude, longitude, city } = locData;

            // Get weather in Fahrenheit
            const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&temperature_unit=fahrenheit`);
            const weatherData = await weatherRes.json();

            setWeatherData({
                temp: Math.round(weatherData.current_weather.temperature),
                city: city || "Unknown",
                description: getWeatherDescription(weatherData.current_weather.weathercode),
                loading: false
            });
        } catch (error) {
            console.error("Failed to fetch weather:", error);
            setWeatherData({ temp: 0, city: "Error", description: "", loading: false });
        }
    };

    const measurePing = async () => {
        if (activeTooltip === "network") {
            setActiveTooltip(null);
            return;
        }

        setActiveTooltip("network");
        setPing({ value: 0, loading: true });

        const start = performance.now();
        try {
            // Fetch root with cache busting to measure real latency
            await fetch(`/?_=${Date.now()}`, { method: 'HEAD', mode: 'no-cors' });
            const end = performance.now();
            setPing({ value: Math.round(end - start), loading: false });
        } catch (error) {
            console.error("Failed to measure ping:", error);
            setPing({ value: -1, loading: false });
        }
    };

    return (
        <div
            className="fixed bottom-0 left-0 right-0 h-12 bg-win95-taskbar win95-beveled flex items-center p-1 z-[120] gap-1 select-none"
            onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setTaskbarContextMenu({
                    type: 'taskbar',
                    x: e.clientX,
                    y: e.clientY
                });
            }}
        >
            {/* Start Button */}
            <button
                onClick={onStartClick}
                className="win95-button px-3 font-win95 font-bold flex items-center gap-1.5 h-full mr-2 text-[14px]"
                data-testid="taskbar-start-button"
            >
                <WindowsLogoIcon size={24} className="mr-0.5" />
                Start
            </button>

            {/* Separator */}
            <div className="w-[1px] h-full bg-win95-gray-inactive mx-1 border-r border-win95-light" />

            {/* Open Windows Buttons */}
            <div className="flex-grow flex gap-1 h-full overflow-hidden">
                {openWindows.map((win) => (
                    <button
                        key={win.id}
                        onClick={() => onWindowClick(win.id)}
                        onContextMenu={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setTaskbarContextMenu({
                                type: 'window',
                                windowId: win.id,
                                x: e.clientX,
                                y: e.clientY
                            });
                        }}
                        className={`${win.isActive ? "win95-beveled-inset bg-win95-gray font-bold" : "win95-button"
                            } px-3 text-[13px] font-win95 flex items-center max-w-[200px] truncate h-full touch-manipulation min-w-[50px] leading-none`}
                        data-testid={`taskbar-item-${win.title.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                        <div className="mr-2 flex-shrink-0">
                            {win.iconType === "about" && <UserIcon size={24} />}
                            {win.iconType === "contact" && <InboxIcon size={24} />}
                            {win.iconType === "projects" && <ProgramsIcon size={24} />}
                            {win.iconType === "drive" && <MyComputerIcon size={24} />}
                            {win.iconType === "notepad" && <NotepadIcon size={24} />}
                            {win.iconType === "calculator" && <CalculatorIcon size={24} />}
                            {win.iconType === "paint" && <PaintIcon size={24} />}
                            {(!win.iconType || win.iconType === "folder") && <FolderIcon size={24} />}
                        </div>
                        <span className="truncate">{win.title}</span>
                    </button>
                ))}
            </div>

            {/* System Tray */}
            <div className="win95-beveled-inset bg-win95-taskbar px-2 flex items-center gap-2 h-full ml-auto relative">
                {/* Tooltips */}
                {activeTooltip === "weather" && weatherData && (
                    <div className="absolute bottom-[calc(100%+8px)] right-0 min-w-[120px] bg-[#FFFFE1] border border-black p-2 shadow-[2px_2px_0_rgba(0,0,0,1)] z-[130] font-win95 text-[12px] text-black">
                        {weatherData.loading ? (
                            "Fetching weather..."
                        ) : (
                            <>
                                <div className="font-bold border-b border-black/20 mb-1 pb-1">{weatherData.city}</div>
                                <div className="flex justify-between gap-4">
                                    <span>{weatherData.description}</span>
                                    <span>{weatherData.temp}°F</span>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {activeTooltip === "network" && ping && (
                    <div className="absolute bottom-[calc(100%+8px)] right-0 min-w-[120px] bg-[#FFFFE1] border border-black p-2 shadow-[2px_2px_0_rgba(0,0,0,1)] z-[130] font-win95 text-[12px] text-black">
                        {ping.loading ? (
                            "Measuring ping..."
                        ) : (
                            <>
                                <div className="font-bold border-b border-black/20 mb-1 pb-1">Connection</div>
                                <div>Latency: {ping.value === -1 ? "Error" : `${ping.value}ms`}</div>
                            </>
                        )}
                    </div>
                )}

                {activeTooltip === "volume" && (
                    <div className="absolute bottom-[calc(100%+8px)] right-6 w-16 h-48 bg-win95-taskbar win95-beveled p-2 z-[130] flex flex-col items-center gap-3">
                        <div
                            className="flex-grow w-2 bg-white shadow-win95-inset relative group cursor-pointer mt-2"
                            onClick={(e) => {
                                // Calculate volume from click position for Firefox compatibility
                                const rect = e.currentTarget.getBoundingClientRect();
                                const clickY = e.clientY - rect.top;
                                const trackHeight = rect.height;
                                // Invert because 0% is at bottom, 100% at top
                                const newVolume = Math.round(100 - (clickY / trackHeight) * 100);
                                setVolume(Math.max(0, Math.min(100, newVolume)));
                            }}
                            data-testid="volume-slider-track"
                        >
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={volume}
                                onChange={(e) => setVolume(parseInt(e.target.value))}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                style={{ WebkitAppearance: 'slider-vertical' } as any}
                            />
                            {/* Visual slider track highlight */}
                            <div
                                className="absolute bottom-0 left-0 w-full bg-blue-800"
                                style={{ height: `${volume}%` }}
                            />
                            {/* Visual thumb */}
                            <div
                                className="absolute left-1/2 -translate-x-1/2 w-5 h-3 bg-win95-gray shadow-win95-button border border-black/20"
                                style={{ bottom: `${volume}%`, transform: 'translate(-50%, 50%)' }}
                            />
                        </div>

                        {/* Mute section */}
                        <div className="w-full border-t border-win95-gray-dark/30 pt-2 flex flex-col items-center gap-1">
                            <label className="flex items-center gap-1 cursor-pointer group">
                                <div className="relative w-3 h-3 bg-white shadow-win95-inset border border-black/40 flex items-center justify-center">
                                    <input
                                        type="checkbox"
                                        checked={volume === 0}
                                        onChange={() => setVolume(0)}
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    />
                                    {volume === 0 && (
                                        <div className="w-1.5 h-1.5 bg-black" />
                                    )}
                                </div>
                                <span className="text-[10px] font-win95">Mute</span>
                            </label>
                        </div>
                    </div>
                )}

                {/* System Tray icons */}
                <div className="flex gap-2 items-center mr-1">
                    <button
                        onClick={fetchWeather}
                        className="p-0.5 hover:bg-win95-gray-light active:bg-win95-gray-dark border-none transition-colors"
                        title="Weather"
                        data-testid="sys-tray-weather"
                    >
                        <WeatherIcon size={18} className="text-black" />
                    </button>
                    <button
                        onClick={measurePing}
                        className="p-0.5 hover:bg-win95-gray-light active:bg-win95-gray-dark border-none transition-colors"
                        title="Network"
                        data-testid="sys-tray-network"
                    >
                        <NetworkIcon size={18} className="text-black" />
                    </button>
                    <button
                        onClick={() => setActiveTooltip(activeTooltip === "volume" ? null : "volume")}
                        className={`p-0.5 hover:bg-win95-gray-light active:bg-win95-gray-dark border-none transition-colors ${activeTooltip === "volume" ? "bg-win95-gray-light" : ""}`}
                        title="Volume"
                        data-testid="sys-tray-volume"
                    >
                        <VolumeIcon size={18} className="text-black" />
                    </button>
                </div>
                <span className="text-[14px] font-win95 font-medium leading-none whitespace-nowrap">
                    {formatTime(time)}
                </span>
            </div>
            <AnimatePresence>
                {taskbarContextMenu && (
                    <ContextMenu
                        x={taskbarContextMenu.x}
                        y={taskbarContextMenu.y}
                        onClose={() => setTaskbarContextMenu(null)}
                        testId="taskbar-context-menu"
                        anchorY="bottom"
                        items={taskbarContextMenu.type === 'window' ? [
                            { label: "Restore", action: () => onWindowClick(taskbarContextMenu.windowId!) },
                            { label: "Minimize", action: () => onMinimizeWindow(taskbarContextMenu.windowId!) },
                            { label: "Close", action: () => onCloseWindow(taskbarContextMenu.windowId!) }
                        ] : [
                            { label: "Minimize all windows", action: onMinimizeAllWindows },
                            { label: "Close all windows", action: onCloseAllWindows }
                        ]}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
