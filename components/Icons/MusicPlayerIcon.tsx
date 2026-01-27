import React from "react";
import { IconProps } from "./IconProps";

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
