import React from "react";
import { IconProps } from "./IconProps";

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
