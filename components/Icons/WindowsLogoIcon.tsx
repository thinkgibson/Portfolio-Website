import React from "react";
import { IconProps } from "./IconProps";

export const WindowsLogoIcon = ({ size = 16, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect x="2" y="2" width="5" height="5" fill="#FF4B4B" />
        <rect x="9" y="2" width="5" height="5" fill="#4BFF4B" />
        <rect x="2" y="9" width="5" height="5" fill="#4B4BFF" />
        <rect x="9" y="9" width="5" height="5" fill="#FFFF4B" />
        {/* Add more detail to make it look like the tiled flag if needed */}
    </svg>
);
