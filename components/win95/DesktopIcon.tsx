"use client";

import React from "react";
import { FolderIcon, UserIcon, InboxIcon, ProgramsIcon, MyComputerIcon } from "./icons";

interface DesktopIconProps {
    id: string;
    label: string;
    iconType: "folder" | "about" | "contact" | "projects" | "drive";
    onOpen: (id: string) => void;
    x?: number;
    y?: number;
}

export function DesktopIcon({ id, label, iconType, onOpen, x, y }: DesktopIconProps) {
    const renderIcon = () => {
        const size = 64;
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
            className="flex flex-col items-center justify-center p-2 w-28 h-36 cursor-pointer group select-none active:bg-blue-800/30 touch-manipulation"
            onClick={() => onOpen(id)}
            style={x !== undefined && y !== undefined ? { position: 'absolute', left: x, top: y } : {}}
            data-testid={`desktop-icon-${label.toLowerCase().replace(/\s+/g, '-')}`}
        >
            <div className="mb-2 p-1 group-hover:bg-blue-800/20 rounded-sm">
                {renderIcon()}
            </div>
            <span className="text-white text-[12px] text-center px-1 font-medium leading-tight drop-shadow-[1px_1px_1px_rgba(0,0,0,0.8)] group-hover:bg-[#000080] group-hover:text-white">
                {label}
            </span>
        </div>
    );
}
