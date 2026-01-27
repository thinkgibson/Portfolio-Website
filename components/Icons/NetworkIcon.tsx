import React from "react";
import { IconProps } from "./IconProps";

export const NetworkIcon = ({ size = 16, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect x="2" y="11" width="2" height="2" fill="black" />
        <rect x="5" y="8" width="2" height="5" fill="black" />
        <rect x="8" y="5" width="2" height="8" fill="black" />
        <rect x="11" y="2" width="2" height="11" fill="black" />
    </svg>
);
