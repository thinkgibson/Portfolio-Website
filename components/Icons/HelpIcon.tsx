import React from "react";
import { IconProps } from "./IconProps";

export const HelpIcon = ({ size = 32, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <circle cx="16" cy="16" r="12" fill="#C0C0C0" stroke="black" strokeWidth="1" />
        <text x="16" y="22" fontFamily="Arial" fontSize="16" fontWeight="bold" fill="black" textAnchor="middle">?</text>
    </svg>
);
