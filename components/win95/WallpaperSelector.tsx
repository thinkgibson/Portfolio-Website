"use client";

import React, { useState } from "react";

export interface Wallpaper {
    id: string;
    name: string;
    value: string;
    type: "color" | "image";
}

export const WALLPAPERS: Wallpaper[] = [
    { id: "forest", name: "Forest", value: "/wallpapers/forest.png", type: "image" },
    { id: "mountains", name: "Mountains", value: "/wallpapers/mountains.png", type: "image" },
    { id: "cyberpunk", name: "Cyberpunk", value: "/wallpapers/cyberpunk.png", type: "image" },
    { id: "desert", name: "Desert", value: "/wallpapers/desert.png", type: "image" },
    { id: "ocean", name: "Ocean", value: "/wallpapers/ocean.png", type: "image" },
    { id: "autumn", name: "Autumn", value: "/wallpapers/autumn.png", type: "image" },
    { id: "cabin", name: "Cabin", value: "/wallpapers/cabin.png", type: "image" },
    { id: "space", name: "Space", value: "/wallpapers/space.png", type: "image" },
    { id: "jungle", name: "Jungle", value: "/wallpapers/jungle.png", type: "image" },
    { id: "teal", name: "Win95 Teal", value: "#008080", type: "color" },
];

interface WallpaperSelectorProps {
    currentWallpaperId: string;
    onApply: (wallpaper: Wallpaper) => void;
    onCancel: () => void;
    onPreview?: (wallpaper: Wallpaper) => void;
}

export function WallpaperSelector({ currentWallpaperId, onApply, onCancel, onPreview }: WallpaperSelectorProps) {
    const [selectedId, setSelectedId] = useState(currentWallpaperId);

    const selectedWallpaper = WALLPAPERS.find(w => w.id === selectedId) || WALLPAPERS[0];

    return (
        <div className="flex flex-col h-full w-full bg-win95-gray p-1 font-win95" data-testid="wallpaper-selector">
            <div className="flex-1 flex flex-col gap-2 min-h-0">
                <p className="text-[18px]">Select a wallpaper for your desktop:</p>

                <div className="flex-1 overflow-y-auto win95-beveled-inset bg-white p-2">
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
                        {WALLPAPERS.map((wp) => (
                            <div
                                key={wp.id}
                                className={`flex flex-col items-center p-1 border cursor-pointer hover:bg-[#000080] hover:text-white ${selectedId === wp.id ? "bg-[#000080] text-white border-[#808080]" : "border-transparent text-black"
                                    }`}
                                onClick={() => {
                                    setSelectedId(wp.id);
                                    if (onPreview) onPreview(wp);
                                }}
                                data-testid={`wallpaper-option-${wp.id}`}
                            >
                                <div
                                    className="w-full aspect-video border border-win95-gray-shadow shadow-inner overflow-hidden"
                                    style={{
                                        backgroundColor: wp.type === 'color' ? wp.value : '#008080',
                                        backgroundImage: wp.type === 'image' ? `url(${wp.value})` : 'none',
                                        backgroundSize: wp.type === 'image' ? 'cover' : 'auto',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'center'
                                    }}
                                />
                                <span className="text-[14px] mt-1 text-center truncate w-full">{wp.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-2 mt-2">
                <button
                    className="win95-button px-6 h-9 font-bold text-[18px]"
                    onClick={() => onApply(selectedWallpaper)}
                    data-testid="wallpaper-apply"
                >
                    Apply
                </button>
                <button
                    className="win95-button px-6 h-9 text-[18px]"
                    onClick={onCancel}
                    data-testid="wallpaper-cancel"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
