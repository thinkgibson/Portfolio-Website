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

// Weather Icon (Sun with cloud)
export const WeatherIcon = ({ size = 16, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <circle cx="10" cy="6" r="3" fill="#FFFF00" stroke="black" strokeWidth="1" />
        <path d="M2 12C2 10.3431 3.34315 9 5 9C5.52423 9 6.01451 9.13451 6.44027 9.37071C7.15132 8.54452 8.21142 8 9.4 8C11.3882 8 13 9.61178 13 11.6C13 11.7358 12.9925 11.8698 12.9778 12.0016C12.9925 12.0664 13 12.1324 13 12.2C13 13.1941 12.1941 14 11.2 14H4.8C3.2536 14 2 12.7464 2 11.2V12Z" fill="white" stroke="black" strokeWidth="1" />
    </svg>
);

// Volume Icon (Speaker)
export const VolumeIcon = ({ size = 16, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M2 6H5L9 3V13L5 10H2V6Z" fill="#000000" />
        <path d="M11 5C12 6 12 10 11 11" stroke="black" strokeWidth="1" strokeLinecap="round" />
        <path d="M13 3C15 5 15 11 13 13" stroke="black" strokeWidth="1" strokeLinecap="round" />
    </svg>
);

// Network Icon (Wifi bars style for Win95 feel)
export const NetworkIcon = ({ size = 16, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect x="2" y="11" width="2" height="2" fill="black" />
        <rect x="5" y="8" width="2" height="5" fill="black" />
        <rect x="8" y="5" width="2" height="8" fill="black" />
        <rect x="11" y="2" width="2" height="11" fill="black" />
    </svg>
);

// Notepad Icon (Notebook + Pencil)
export const NotepadIcon = ({ size = 32, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        {/* Paper stack */}
        <rect x="6" y="4" width="20" height="24" fill="white" stroke="black" strokeWidth="1" />
        <line x1="6" y1="8" x2="26" y2="8" stroke="black" strokeWidth="1" />
        {/* Lines on paper */}
        <line x1="10" y1="12" x2="22" y2="12" stroke="#D0D0D0" strokeWidth="1" />
        <line x1="10" y1="16" x2="22" y2="16" stroke="#D0D0D0" strokeWidth="1" />
        <line x1="10" y1="20" x2="22" y2="20" stroke="#D0D0D0" strokeWidth="1" />
        <line x1="10" y1="24" x2="22" y2="24" stroke="#D0D0D0" strokeWidth="1" />
        {/* Pencil */}
        <rect x="22" y="10" width="4" height="14" fill="#FFFF00" stroke="black" strokeWidth="1" transform="rotate(15 22 10)" />
        <path d="M25.5 24L24 28L22.5 24" fill="#FFDADA" stroke="black" strokeWidth="1" transform="rotate(15 22 10)" />
    </svg>
);

// Floppy Disk Icon (Save)
export const FloppyIcon = ({ size = 32, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        {/* Disk body */}
        <path d="M4 4H26L28 6V28H4V4Z" fill="#000080" stroke="black" strokeWidth="1" />
        {/* Metal shutter area */}
        <rect x="8" y="4" width="14" height="10" fill="#C0C0C0" stroke="black" strokeWidth="1" />
        <rect x="10" y="6" width="3" height="6" fill="#808080" />
        {/* Label area */}
        <rect x="8" y="16" width="16" height="12" fill="white" stroke="black" strokeWidth="1" />
        <line x1="10" y1="20" x2="22" y2="20" stroke="#D0D0D0" strokeWidth="1" />
        <line x1="10" y1="24" x2="22" y2="24" stroke="#D0D0D0" strokeWidth="1" />
    </svg>
);

// Calculator Icon
export const CalculatorIcon = ({ size = 32, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        {/* Body */}
        <rect x="6" y="4" width="20" height="24" fill="#C0C0C0" stroke="black" strokeWidth="1" />
        <rect x="7" y="5" width="18" height="22" stroke="white" strokeWidth="1" strokeOpacity="0.5" />

        {/* Screen */}
        <rect x="9" y="7" width="14" height="6" fill="white" stroke="black" strokeWidth="1" />

        {/* Buttons Grid */}
        <g fill="#808080" stroke="black" strokeWidth="1">
            {/* Row 1 */}
            <rect x="9" y="16" width="3" height="3" />
            <rect x="14" y="16" width="3" height="3" />
            <rect x="19" y="16" width="3" height="3" />

            {/* Row 2 */}
            <rect x="9" y="21" width="3" height="3" />
            <rect x="14" y="21" width="3" height="3" />
            <rect x="19" y="21" width="3" height="3" />
        </g>
    </svg>
);

// Paint Icon
export const PaintIcon = ({ size = 32, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        {/* Paint Bucket / Palette representation */}
        <path d="M6 16C6 10.4772 10.4772 6 16 6C21.5228 6 26 10.4772 26 16V22C26 24.2091 24.2091 26 22 26H20V22H22V16C22 12.6863 19.3137 10 16 10C12.6863 10 10 12.6863 10 16H6Z" fill="#C0C0C0" stroke="black" strokeWidth="1" />
        <circle cx="14" cy="18" r="2" fill="#FF0000" />
        <circle cx="18" cy="18" r="2" fill="#00FF00" />
        <circle cx="16" cy="14" r="2" fill="#0000FF" />

        {/* Brush */}
        <rect x="20" y="20" width="8" height="2" transform="rotate(45 20 20)" fill="#8B4513" stroke="black" strokeWidth="1" />
        <rect x="25" y="25" width="4" height="2" transform="rotate(45 25 25)" fill="black" />
    </svg>
);

// Terminal Icon (DOS Prompt)
export const TerminalIcon = ({ size = 32, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect x="4" y="6" width="24" height="20" fill="black" stroke="#C0C0C0" strokeWidth="1" />
        <path d="M8 12L12 16L8 20" stroke="#00FF00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="14" y1="20" x2="20" y2="20" stroke="#00FF00" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

// Music Player Icon (CD/Audio related)
export const MusicPlayerIcon = ({ size = 32, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        {/* CD Jewel Case */}
        <rect x="4" y="4" width="24" height="24" fill="#C0C0C0" stroke="black" strokeWidth="1" />
        <rect x="5" y="5" width="22" height="22" stroke="white" strokeWidth="1" strokeOpacity="0.5" />

        {/* CD */}
        <circle cx="16" cy="16" r="8" fill="white" stroke="black" strokeWidth="1" />
        <circle cx="16" cy="16" r="7" stroke="#D0D0D0" strokeWidth="1" />
        <circle cx="16" cy="16" r="2" fill="#C0C0C0" stroke="black" strokeWidth="1" />

        {/* Case Details */}
        <rect x="6" y="6" width="4" height="20" fill="#808080" />
    </svg>
);
