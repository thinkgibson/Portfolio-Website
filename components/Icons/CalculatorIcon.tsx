import React from "react";
import { IconProps } from "./IconProps";

export const CalculatorIcon = ({ size = 32, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        {/* Body */}
        <rect x="6" y="4" width="20" height="24" fill="#C0C0C0" stroke="black" strokeWidth="1" />
        <rect x="7" y="5" width="18" height="22" stroke="white" strokeWidth="1" strokeOpacity="0.5" />

        {/* Screen */}
        <rect x="9" y="7" width="14" height="6" fill="white" stroke="black" strokeWidth="1" />

        {/* Buttons Grid */}
        <g fill="#808080" stroke="black" strokeWidth="1">
            {/* Row 1 */}
            <rect x="9" y="16" width="3" height="3" />
            <rect x="14" y="16" width="3" height="3" />
            <rect x="19" y="16" width="3" height="3" />

            {/* Row 2 */}
            <rect x="9" y="21" width="3" height="3" />
            <rect x="14" y="21" width="3" height="3" />
            <rect x="19" y="21" width="3" height="3" />
        </g>
    </svg>
);
