"use client";

import React from "react";

/**
 * Windows 95 style icons as SVG components.
 * These are designed to look pixel-accurate to the original OS.
 */

interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: number;
}

// My Computer (CRT Monitor + Tower)
export const MyComputerIcon = ({ size = 32, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        {/* Monitor Frame */}
        <rect x="4" y="4" width="22" height="16" fill="#C0C0C0" stroke="black" strokeWidth="1" />
        <rect x="6" y="6" width="18" height="12" fill="white" stroke="black" strokeWidth="1" />
        <rect x="7" y="7" width="16" height="10" fill="#008080" /> {/* Screen content */}

        {/* Monitor Stand */}
        <rect x="12" y="20" width="6" height="2" fill="#808080" stroke="black" strokeWidth="1" />
        <rect x="8" y="22" width="14" height="2" fill="#C0C0C0" stroke="black" strokeWidth="1" />

        {/* Computer Tower (next to monitor) */}
        <rect x="22" y="10" width="6" height="14" fill="#C0C0C0" stroke="black" strokeWidth="1" />
        <rect x="24" y="12" width="2" height="1" fill="black" /> {/* Buttons/LEDs */}
        <rect x="24" y="14" width="2" height="1" fill="#00FF00" />
    </svg>
);

// Folder Icon (Open/Closed)
export const FolderIcon = ({ size = 32, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M4 8H12L14 10H28V24H4V8Z" fill="#FFFF00" stroke="black" strokeWidth="1" />
        <path d="M4 10V24H28" stroke="white" strokeWidth="1" strokeOpacity="0.5" />
    </svg>
);

// Inbox/Mail Icon
export const InboxIcon = ({ size = 32, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        {/* Tray */}
        <path d="M4 18H28V26H4V18Z" fill="#C0C0C0" stroke="black" strokeWidth="1" />
        <rect x="8" y="20" width="16" height="2" fill="white" stroke="black" strokeWidth="1" />

        {/* Mail peek */}
        <rect x="10" y="12" width="12" height="8" fill="white" stroke="black" strokeWidth="1" />
        <path d="M10 12L16 16L22 12" stroke="black" strokeWidth="1" />
    </svg>
);

// User Icon (About)
export const UserIcon = ({ size = 32, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        {/* Head */}
        <rect x="12" y="6" width="8" height="8" fill="#FFD700" stroke="black" strokeWidth="1" />
        {/* Body */}
        <path d="M8 26V20C8 18 10 16 12 16H20C22 16 24 18 24 20V26H8Z" fill="#0000FF" stroke="black" strokeWidth="1" />
    </svg>
);

// Projects Icon (Programs)
export const ProgramsIcon = ({ size = 32, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect x="4" y="6" width="24" height="20" fill="#C0C0C0" stroke="black" strokeWidth="1" />
        <rect x="4" y="6" width="24" height="4" fill="#000080" />
        <rect x="8" y="14" width="4" height="4" fill="#FF0000" />
        <rect x="14" y="14" width="4" height="4" fill="#00FF00" />
        <rect x="20" y="14" width="4" height="4" fill="#FFFF00" />
    </svg>
);

// Windows Logo Icon (Start Menu)
export const WindowsLogoIcon = ({ size = 16, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect x="2" y="2" width="5" height="5" fill="#FF4B4B" />
        <rect x="9" y="2" width="5" height="5" fill="#4BFF4B" />
        <rect x="2" y="9" width="5" height="5" fill="#4B4BFF" />
        <rect x="9" y="9" width="5" height="5" fill="#FFFF4B" />
        {/* Add more detail to make it look like the tiled flag if needed */}
    </svg>
);

// Help Icon
export const HelpIcon = ({ size = 32, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <circle cx="16" cy="16" r="12" fill="#C0C0C0" stroke="black" strokeWidth="1" />
        <text x="16" y="22" fontFamily="Arial" fontSize="16" fontWeight="bold" fill="black" textAnchor="middle">?</text>
    </svg>
);
