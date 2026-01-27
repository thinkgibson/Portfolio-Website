import React from "react";
import { IconProps } from "./IconProps";

export const ProgramsIcon = ({ size = 32, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect x="4" y="6" width="24" height="20" fill="#C0C0C0" stroke="black" strokeWidth="1" />
        <rect x="4" y="6" width="24" height="4" fill="#000080" />
        <rect x="8" y="14" width="4" height="4" fill="#FF0000" />
        <rect x="14" y="14" width="4" height="4" fill="#00FF00" />
        <rect x="20" y="14" width="4" height="4" fill="#FFFF00" />
    </svg>
);
