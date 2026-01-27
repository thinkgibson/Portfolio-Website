import React from "react";
import { IconProps } from "./IconProps";

export const FolderIcon = ({ size = 32, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M4 8H12L14 10H28V24H4V8Z" fill="#FFFF00" stroke="black" strokeWidth="1" />
        <path d="M4 10V24H28" stroke="white" strokeWidth="1" strokeOpacity="0.5" />
    </svg>
);
