"use client";

import { iconRegistry } from "../Icons/registry";
import { IconType } from "../../lib/types";

interface DesktopIconProps {
    id: string;
    label: string;
    iconType: IconType;
    onOpen: (id: string) => void;
    x?: number;
    y?: number;
    textColor?: string;
}

export function DesktopIcon({ id, label, iconType, onOpen, x, y, textColor = "text-white" }: DesktopIconProps) {
    const renderIcon = () => {
        const IconComponent = iconRegistry[iconType] || iconRegistry["folder"];
        return <IconComponent size={64} />;
    };

    return (
        <div
            className="flex flex-col items-center justify-center p-2 w-32 h-36 cursor-pointer group select-none active:bg-blue-800/30 touch-manipulation"
            onClick={() => onOpen(id)}
            style={x !== undefined && y !== undefined ? { position: 'absolute', left: x, top: y } : {}}
            data-testid={`desktop-icon-${label.toLowerCase().replace(/\s+/g, '-')}`}
        >
            <div className="mb-2 p-1 group-hover:bg-blue-800/20">
                {renderIcon()}
            </div>
            {/* Label */}
            <span className={`${textColor} text-[12px] font-win95 mt-1 px-1 bg-transparent group-hover:bg-win95-blue-active group-hover:text-white group-focus:bg-win95-blue-active group-focus:text-white whitespace-normal break-words leading-tight shadow-sm`}>
                {label}
            </span>
        </div>
    );
}
