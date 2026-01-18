"use client";

import React from "react";
import { FolderIcon, UserIcon, InboxIcon, ProgramsIcon, MyComputerIcon } from "./icons";

interface StartMenuProps {
    items: {
        id: string;
        title: string;
        iconType: "folder" | "about" | "contact" | "projects" | "drive";
    }[];
    onItemClick: (id: string) => void;
    onReboot: () => void;
    onClose: () => void;
}

export function StartMenu({ items, onItemClick, onReboot, onClose }: StartMenuProps) {
    const renderIcon = (iconType: string, size: number = 24) => {
        switch (iconType) {
            case "about": return <UserIcon size={size} />;
            case "contact": return <InboxIcon size={size} />;
            case "projects": return <ProgramsIcon size={size} />;
            case "drive": return <MyComputerIcon size={size} />;
            default: return <FolderIcon size={size} />;
        }
    };

    return (
        <div
            className="fixed bottom-12 left-0 w-64 bg-win95-gray win95-beveled z-[110] flex flex-col p-1 shadow-2xl"
            onMouseLeave={(e) => {
                // Closer check to avoid flickering when moving between menu and taskbar
                const rect = e.currentTarget.getBoundingClientRect();
                if (e.clientY < rect.top || e.clientX > rect.right || e.clientX < rect.left) {
                    // We don't close on mouse leave from bottom because that's where the taskbar is
                }
            }}
        >
            <div className="flex h-full min-h-[300px]">
                {/* Sidebar */}
                <div className="w-8 bg-win95-gray-inactive flex items-end justify-center pb-4 select-none">
                    <span
                        className="text-win95-gray font-win95 font-bold text-lg origin-center -rotate-90 whitespace-nowrap mb-8"
                        style={{ fontSize: '20px', letterSpacing: '1px' }}
                    >
                        <span className="opacity-50">Windows</span>95
                    </span>
                </div>

                {/* Menu Items */}
                <div className="flex-grow flex flex-col py-1">
                    {items.map((item) => (
                        <button
                            key={item.id}
                            className="flex items-center gap-3 px-3 py-2 hover:bg-win95-blue-active hover:text-white text-left group transition-colors duration-0"
                            onClick={() => {
                                onItemClick(item.id);
                                onClose();
                            }}
                        >
                            <div className="flex-shrink-0">
                                {renderIcon(item.iconType, 28)}
                            </div>
                            <span className="font-win95 text-[13px]">{item.title}</span>
                        </button>
                    ))}

                    <div className="my-2 border-t border-win95-gray-inactive border-b border-win95-light mx-1" />

                    <button
                        className="flex items-center gap-3 px-3 py-2 hover:bg-win95-blue-active hover:text-white text-left group transition-colors duration-0"
                        onClick={() => {
                            onReboot();
                            onClose();
                        }}
                    >
                        <div className="w-7 h-7 flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-win95-dark flex items-center justify-center font-bold text-[10px]">R</div>
                        </div>
                        <span className="font-win95 text-[13px]">Reboot...</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
