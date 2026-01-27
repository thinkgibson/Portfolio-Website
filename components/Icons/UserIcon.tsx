import React from "react";
import { IconProps } from "./IconProps";

export const UserIcon = ({ size = 32, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        {/* Head */}
        <rect x="12" y="6" width="8" height="8" fill="#FFD700" stroke="black" strokeWidth="1" />
        {/* Body */}
        <path d="M8 26V20C8 18 10 16 12 16H20C22 16 24 18 24 20V26H8Z" fill="#0000FF" stroke="black" strokeWidth="1" />
    </svg>
);
