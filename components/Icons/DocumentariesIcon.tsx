import React from "react";
import { IconProps } from "./IconProps";

export const DocumentariesIcon = ({ size = 32, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        {/* Cassette Body */}
        <rect x="2" y="6" width="28" height="18" rx="1" fill="#202020" stroke="black" strokeWidth="1" />
        <rect x="4" y="8" width="24" height="4" fill="#404040" />

        {/* Window */}
        <rect x="8" y="14" width="16" height="6" fill="#C0C0C0" stroke="black" strokeWidth="1" />

        {/* Reels */}
        <circle cx="11" cy="17" r="2" fill="white" />
        <circle cx="21" cy="17" r="2" fill="white" />

        {/* Tape Label area */}
        <rect x="6" y="22" width="20" height="2" fill="white" />
    </svg>
);
