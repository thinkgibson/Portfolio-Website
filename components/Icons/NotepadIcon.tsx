import React from "react";
import { IconProps } from "./IconProps";

export const NotepadIcon = ({ size = 32, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        {/* Paper stack */}
        <rect x="6" y="4" width="20" height="24" fill="white" stroke="black" strokeWidth="1" />
        <line x1="6" y="8" x2="26" y2="8" stroke="black" strokeWidth="1" />
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
