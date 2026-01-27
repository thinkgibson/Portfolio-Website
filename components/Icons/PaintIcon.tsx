import React from "react";
import { IconProps } from "./IconProps";

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
