import React from "react";
import { IconProps } from "./IconProps";

export const VideoEssaysIcon = ({ size = 32, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        {/* Film Strip Frame */}
        <rect x="4" y="2" width="24" height="28" fill="#202020" stroke="black" strokeWidth="1" />

        {/* Perforations Left */}
        <rect x="6" y="4" width="2" height="3" fill="white" />
        <rect x="6" y="9" width="2" height="3" fill="white" />
        <rect x="6" y="14" width="2" height="3" fill="white" />
        <rect x="6" y="19" width="2" height="3" fill="white" />
        <rect x="6" y="24" width="2" height="3" fill="white" />

        {/* Perforations Right */}
        <rect x="24" y="4" width="2" height="3" fill="white" />
        <rect x="24" y="9" width="2" height="3" fill="white" />
        <rect x="24" y="14" width="2" height="3" fill="white" />
        <rect x="24" y="19" width="2" height="3" fill="white" />
        <rect x="24" y="24" width="2" height="3" fill="white" />

        {/* Center Frame Content */}
        <rect x="10" y="4" width="12" height="8" fill="#000080" />
        <rect x="10" y="14" width="12" height="8" fill="#008080" />
        <rect x="10" y="24" width="12" height="4" fill="#800080" />
    </svg>
);
