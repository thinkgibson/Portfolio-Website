"use client";

import React, { useState, useEffect } from "react";
import { WindowsLogoIcon, FolderIcon, UserIcon, InboxIcon, ProgramsIcon, MyComputerIcon } from "./icons";

interface TaskbarProps {
    openWindows: { id: string; title: string; isActive: boolean; iconType?: "folder" | "about" | "contact" | "projects" | "drive" }[];
    onWindowClick: (id: string) => void;
    onStartClick: () => void;
}

export function Taskbar({ openWindows, onWindowClick, onStartClick }: TaskbarProps) {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 h-12 bg-win95-taskbar win95-beveled flex items-center p-1 z-[120] gap-1 select-none">
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
                        className={`${win.isActive ? "win95-beveled-inset bg-win95-gray font-bold" : "win95-button"
                            } px-3 text-[13px] font-win95 flex items-center max-w-[200px] truncate h-full touch-manipulation min-w-[50px] leading-none`}
                        data-testid={`taskbar-item-${win.title.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                        <div className="mr-2 flex-shrink-0">
                            {win.iconType === "about" && <UserIcon size={24} />}
                            {win.iconType === "contact" && <InboxIcon size={24} />}
                            {win.iconType === "projects" && <ProgramsIcon size={24} />}
                            {win.iconType === "drive" && <MyComputerIcon size={24} />}
                            {(!win.iconType || win.iconType === "folder") && <FolderIcon size={24} />}
                        </div>
                        <span className="truncate">{win.title}</span>
                    </button>
                ))}
            </div>

            {/* System Tray */}
            <div className="win95-beveled-inset bg-win95-taskbar px-2 flex items-center gap-2 h-full ml-auto">
                {/* Placeholder icons for tray */}
                <div className="flex gap-1 opacity-60">
                    <div className="w-4 h-4 bg-win95-gray" />
                    <div className="w-4 h-4 bg-win95-gray" />
                </div>
                <span className="text-[14px] font-win95 font-medium leading-none">
                    {formatTime(time)}
                </span>
            </div>
        </div>
    );
}
