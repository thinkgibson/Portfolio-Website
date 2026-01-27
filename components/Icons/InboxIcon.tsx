import React from "react";
import { IconProps } from "./IconProps";

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
