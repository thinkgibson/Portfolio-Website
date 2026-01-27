import React from "react";
import { IconProps } from "./IconProps";

export const WeatherIcon = ({ size = 16, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <circle cx="10" cy="6" r="3" fill="#FFFF00" stroke="black" strokeWidth="1" />
        <path d="M2 12C2 10.3431 3.34315 9 5 9C5.52423 9 6.01451 9.13451 6.44027 9.37071C7.15132 8.54452 8.21142 8 9.4 8C11.3882 8 13 9.61178 13 11.6C13 11.7358 12.9925 11.8698 12.9778 12.0016C12.9925 12.0664 13 12.1324 13 12.2C13 13.1941 12.1941 14 11.2 14H4.8C3.2536 14 2 12.7464 2 11.2V12Z" fill="white" stroke="black" strokeWidth="1" />
    </svg>
);
