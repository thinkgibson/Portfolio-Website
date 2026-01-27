import React from "react";
import { IconProps } from "./IconProps";

export const VolumeIcon = ({ size = 16, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M2 6H5L9 3V13L5 10H2V6Z" fill="#000000" />
        <path d="M11 5C12 6 12 10 11 11" stroke="black" strokeWidth="1" strokeLinecap="round" />
        <path d="M13 3C15 5 15 11 13 13" stroke="black" strokeWidth="1" strokeLinecap="round" />
    </svg>
);
