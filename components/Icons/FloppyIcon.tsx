import React from "react";
import { IconProps } from "./IconProps";

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
