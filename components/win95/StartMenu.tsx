"use client";

import React from "react";
import { motion } from "framer-motion";
import { FolderIcon, UserIcon, InboxIcon, ProgramsIcon, MyComputerIcon } from "./icons";

interface StartMenuProps {
    items: {
        id: string;
        title: string;
        iconType: "folder" | "about" | "contact" | "projects" | "drive";
    }[];
    onItemClick: (id: string) => void;
    onReboot: () => void;
    onClose: () => void;
}

export function StartMenu({ items, onItemClick, onReboot, onClose }: StartMenuProps) {
    const renderIcon = (iconType: string, size: number = 24) => {
        switch (iconType) {
            case "about": return <UserIcon size={size} />;
            case "contact": return <InboxIcon size={size} />;
            case "projects": return <ProgramsIcon size={size} />;
            case "drive": return <MyComputerIcon size={size} />;
            default: return <FolderIcon size={size} />;
        }
    };

    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="fixed bottom-12 left-0 z-[150] w-64 bg-win95-gray win95-beveled flex overflow-hidden shadow-[2px_2px_10px_rgba(0,0,0,0.5)] win95-start-menu"
            data-testid="start-menu"
        >
            {/* Sidebar */}
            <div className="w-8 bg-win95-gray-dark flex flex-col justify-end p-1 relative">
                <span
                    className="text-win95-gray font-win95 font-bold text-lg origin-center -rotate-90 whitespace-nowrap mb-8"
                    style={{ fontSize: '20px', letterSpacing: '1px' }}
                >
                    <span className="opacity-50">Windows</span>95
                </span>
            </div>

            {/* Menu Items */}
            <div className="flex-grow flex flex-col py-1">
                {items.map((item) => (
                    <button
                        key={item.id}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-win95-blue-active hover:text-white text-left group transition-colors duration-0"
                        onClick={() => {
                            onItemClick(item.id);
                            onClose();
                        }}
                    >
                        <div className="flex-shrink-0">
                            {renderIcon(item.iconType, 28)}
                        </div>
                        <span className="font-win95 text-[13px]">{item.title}</span>
                    </button>
                ))}

                <div className="my-2 border-t border-win95-gray-inactive border-b border-win95-light mx-1" />

                <button
                    className="flex items-center gap-3 px-3 py-2 hover:bg-win95-blue-active hover:text-white text-left group transition-colors duration-0"
                    onClick={() => {
                        onReboot();
                        onClose();
                    }}
                >
                    <div className="w-7 h-7 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-win95-dark flex items-center justify-center font-bold text-[10px]">R</div>
                    </div>
                    <span className="font-win95 text-[13px]">Reboot...</span>
                </button>
            </div>
        </motion.div>
    );
}
