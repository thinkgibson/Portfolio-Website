import React from "react";
import { IconProps } from "./IconProps";

export const TerminalIcon = ({ size = 32, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect x="4" y="6" width="24" height="20" fill="black" stroke="#C0C0C0" strokeWidth="1" />
        <path d="M8 12L12 16L8 20" stroke="#00FF00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="14" y1="20" x2="20" y2="20" stroke="#00FF00" strokeWidth="2" strokeLinecap="round" />
    </svg>
);
