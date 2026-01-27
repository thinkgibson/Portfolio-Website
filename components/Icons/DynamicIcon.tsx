import React from "react";
import iconsConfig from "../../config/icons.json";
import { iconRegistry } from "./registry";
import { IconType } from "../../lib/types";
import { IconProps } from "./IconProps";

interface DynamicIconProps extends IconProps {
    iconType: IconType;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ iconType, size = 32, ...props }) => {
    // Check if there is a custom override in icons.json
    const customIcon = (iconsConfig as Record<string, string | null>)[iconType];

    if (customIcon) {
        // Render image from public/icons
        return (
            <img
                src={`/icons/${customIcon}`}
                alt={iconType}
                width={size}
                height={size}
                className="select-none"
                style={{ width: size, height: size, objectFit: "contain" }}
                {...props as any}
            />
        );
    }

    // Fallback to registry component
    const IconComponent = iconRegistry[iconType] || iconRegistry["folder"];
    return <IconComponent size={size} {...props} />;
};
