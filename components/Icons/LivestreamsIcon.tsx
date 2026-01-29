import React from "react";
import { IconProps } from "./IconProps";

export const LivestreamsIcon = ({ size = 32, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        {/* TV/Monitor Frame */}
        <rect x="3" y="5" width="26" height="20" rx="1" fill="#C0C0C0" stroke="black" strokeWidth="1" />
        <rect x="5" y="7" width="22" height="14" fill="black" />

        {/* Antenna */}
        <line x1="16" y1="5" x2="10" y2="1" stroke="black" strokeWidth="1" />
        <line x1="16" y1="5" x2="22" y2="1" stroke="black" strokeWidth="1" />

        {/* "LIVE" text simulation */}
        <rect x="7" y="9" width="6" height="3" fill="#FF0000" />
        <path d="M8 11L9 10L10 11M11 11L12 10L13 11" stroke="white" strokeWidth="0.5" />

        {/* Knobs */}
        <circle cx="25" cy="22" r="1.5" fill="#404040" stroke="black" strokeWidth="0.5" />
        <circle cx="22" cy="22" r="1.5" fill="#404040" stroke="black" strokeWidth="0.5" />

        {/* Stand */}
        <rect x="12" y="25" width="8" height="2" fill="#808080" stroke="black" strokeWidth="1" />
    </svg>
);
