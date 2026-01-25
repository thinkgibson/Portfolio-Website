"use client";

import React from "react";
import { DesktopIcon } from "./DesktopIcon";

interface FolderProps {
    id: string;
    title: string;
    items: {
        id: string;
        title: string;
        iconType: string;
    }[];
    onItemClick: (id: string) => void;
}

export function Folder({ id, title, items, onItemClick }: FolderProps) {
    return (
        <div className="flex flex-col h-full bg-win95-gray p-1 select-none">
            {/* Content Area */}
            <div className="flex-grow bg-white border-2 border-win95-gray-shadow shadow-[inset_2px_2px_0px_0px_#808080,inset_-2px_-2px_0px_0px_#dfdfdf] p-4 overflow-auto scrollbar-win95">
                <div className="grid grid-cols-[repeat(auto-fill,80px)] gap-4 items-start content-start">
                    {items.map((item) => (
                        <DesktopIcon
                            key={item.id}
                            id={item.id}
                            label={item.title}
                            iconType={item.iconType as any}
                            onOpen={() => onItemClick(item.id)}
                            textColor="text-black"
                        />
                    ))}
                </div>
            </div>

            {/* Status Bar */}
            <div className="mt-1 h-6 border-2 border-win95-gray-shadow shadow-[inset_1px_1px_0px_0px_#808080,inset_-1px_-1px_0px_0px_#dfdfdf] flex items-center px-2 gap-4">
                <div className="flex-grow text-[12px] font-win95">
                    {items.length} object(s)
                </div>
            </div>
        </div>
    );
}
