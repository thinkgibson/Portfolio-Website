"use client";

import React, { useState } from "react";

export interface Wallpaper {
    id: string;
    name: string;
    value: string;
    type: "color" | "image";
}

export const WALLPAPERS: Wallpaper[] = [
    { id: "teal", name: "Win95 Teal", value: "#008080", type: "color" },
    { id: "clouds", name: "Clouds", value: "/wallpapers/clouds.png", type: "image" },
    { id: "redblocks", name: "Red Blocks", value: "/wallpapers/redblocks.png", type: "image" },
    { id: "bluerivets", name: "Blue Rivets", value: "/wallpapers/bluerivets.png", type: "image" },
    { id: "forest", name: "Forest", value: "/wallpapers/forest.png", type: "image" },
    { id: "sandstone", name: "Sandstone", value: "/wallpapers/sandstone.png", type: "image" },
    { id: "tiles", name: "Tiles", value: "/wallpapers/tiles.png", type: "image" },
    { id: "triangles", name: "Triangles", value: "/wallpapers/triangles.png", type: "image" },
    { id: "waves", name: "Waves", value: "/wallpapers/waves.png", type: "image" },
];

interface WallpaperSelectorProps {
    currentWallpaperId: string;
    onApply: (wallpaper: Wallpaper) => void;
    onCancel: () => void;
}

export function WallpaperSelector({ currentWallpaperId, onApply, onCancel }: WallpaperSelectorProps) {
    const [selectedId, setSelectedId] = useState(currentWallpaperId);

    const selectedWallpaper = WALLPAPERS.find(w => w.id === selectedId) || WALLPAPERS[0];

    return (
        <div className="flex flex-col h-full w-full bg-win95-gray p-4 font-win95">
            <div className="flex-1 flex flex-col gap-4 min-h-0">
                <p className="text-[12px]">Select a wallpaper for your desktop:</p>

                <div className="flex-1 overflow-y-auto win95-beveled-inset bg-white p-2">
                    <div className="grid grid-cols-3 gap-2">
                        {WALLPAPERS.map((wp) => (
                            <div
                                key={wp.id}
                                className={`flex flex-col items-center p-1 border cursor-pointer hover:bg-[#000080] hover:text-white ${selectedId === wp.id ? "bg-[#000080] text-white border-[#808080]" : "border-transparent text-black"
                                    }`}
                                onClick={() => setSelectedId(wp.id)}
                                data-testid={`wallpaper-option-${wp.id}`}
                            >
                                <div
                                    className="w-full aspect-video border border-win95-gray-shadow shadow-inner overflow-hidden"
                                    style={{
                                        backgroundColor: wp.type === 'color' ? wp.value : '#008080',
                                        backgroundImage: wp.type === 'image' ? `url(${wp.value})` : 'none',
                                        backgroundSize: wp.id === 'clouds' ? 'cover' : 'auto',
                                        backgroundRepeat: 'repeat',
                                        backgroundPosition: 'center'
                                    }}
                                />
                                <span className="text-[10px] mt-1 text-center truncate w-full">{wp.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
                <button
                    className="win95-button px-6 h-6 font-bold text-[12px]"
                    onClick={() => onApply(selectedWallpaper)}
                    data-testid="wallpaper-apply"
                >
                    Apply
                </button>
                <button
                    className="win95-button px-6 h-6 text-[12px]"
                    onClick={onCancel}
                    data-testid="wallpaper-cancel"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
